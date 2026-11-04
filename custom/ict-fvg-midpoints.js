// Independent chart studies, LOCAL_ADAPTATION. No strategy entry rules are changed.
const NY_CLOCK = new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function nyClock(time) {
  const p=Object.fromEntries(NY_CLOCK.formatToParts(new Date(time*1000)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
  return {day:`${p.year}-${p.month}-${p.day}`,minute:Number(p.hour)*60+Number(p.minute)};
}
const completeLimit=(bars,p)=>p.lastBar==='All supplied bars completed'?bars.length:Math.max(0,bars.length-1);
const modeInput={key:'lastBar',label:'Candle availability',type:'select',options:['Exclude latest (safe live)','All supplied bars completed'],default:'Exclude latest (safe live)'};
const switchInput=(key,label,value='On')=>({key,label,type:'select',options:['On','Off'],default:value});

function makeIctContext(references={daily:[],weekly:[]}) {
  return {name:`ICT ${references.symbol||''} · Liquidity & confirmed structure`,overlay:true,
    inputs:[{key:'swingBars',label:'Swing confirmation bars each side',type:'int',default:2,min:1,max:10},
      {key:'reference',label:'Completed reference levels',type:'select',options:['Daily','Weekly','Off'],default:'Daily'},
      switchInput('swings','Show confirmed swings'),switchInput('equilibrium','Show swing-range midpoint'),
      switchInput('marks','Show close-break / wick-raid labels'),modeInput],
    outputs:[{key:'high',label:'Confirmed swing H',color:'#b78ce8'},{key:'low',label:'Confirmed swing L',color:'#70a9e8'},
      {key:'eq',label:'Swing-range EQ',color:'#9ca3af'},{key:'referenceHigh',label:'Prior completed H',color:'#d8a144'},
      {key:'referenceLow',label:'Prior completed L',color:'#d8a144'}],
    calc(bars,p) {
      const out={high:[],low:[],eq:[],referenceHigh:[],referenceLow:[],markers:[],events:[],breaks:[]};
      const k=Math.max(1,Math.min(10,Math.round(Number(p.swingBars)||2))),limit=completeLimit(bars,p);
      let high=null,low=null,ref=null,ri=0;
      const referenceAllowed=!references.symbol || references.symbolIdentifiers?.includes(p.chartSymbol);
      const refs=!referenceAllowed?[]:p.reference==='Weekly'?references.weekly:p.reference==='Off'?[]:references.daily;
      for(let i=0;i<bars.length;i++) {
        const b=bars[i],ready=i<limit;
        out.breaks.push(false);
        if(ready) {
          while(ri<refs.length && refs[ri].knownAt<=b.time) {ref=refs[ri++];out.breaks[i]=true;}
          const j=i-k;
          if(j>=k) {
            const neighbors=bars.slice(j-k,j+k+1).filter((_,n)=>n!==k);
            if(neighbors.every(x=>x.high<bars[j].high)) {high={price:bars[j].high,broken:false,raided:false};out.breaks[i]=true;}
            if(neighbors.every(x=>x.low>bars[j].low)) {low={price:bars[j].low,broken:false,raided:false};out.breaks[i]=true;}
          }
          const mark=(text,up,kind,level)=>{
            out.events.push({kind,time:b.time,confirmation:'bar close',level});
            if(p.marks!=='Off') out.markers.push({time:b.time,position:up?'belowBar':'aboveBar',shape:up?'arrowUp':'arrowDown',color:up?'#26a69a':'#ef5350',text});
          };
          if(high&&!high.broken) {
            if(b.close>high.price) {high.broken=true;mark('Close break ↑',true,'CLOSE_BREAK_UP',high.price);}
            else if(!high.raided && b.high>high.price && b.close<high.price) {high.raided=true;mark('High raid',false,'HIGH_WICK_RAID',high.price);}
          }
          if(low&&!low.broken) {
            if(b.close<low.price) {low.broken=true;mark('Close break ↓',false,'CLOSE_BREAK_DOWN',low.price);}
            else if(!low.raided && b.low<low.price && b.close>low.price) {low.raided=true;mark('Low raid',true,'LOW_WICK_RAID',low.price);}
          }
        }
        out.high.push(p.swings==='Off'?null:high?.price??null);
        out.low.push(p.swings==='Off'?null:low?.price??null);
        out.eq.push(p.equilibrium==='Off'||!high||!low||high.price<=low.price?null:(high.price+low.price)/2);
        out.referenceHigh.push(ref?.high??null);out.referenceLow.push(ref?.low??null);
      }
      let lastLabel=-Infinity;
      const spacing=(bars[1]?.time-bars[0]?.time||300)*8;
      out.markers=out.markers.filter(m=>{if(m.time-lastLabel<spacing)return false;lastLabel=m.time;return true;}).slice(-6);
      return out;
    }};
}

function makeIctFvg(midpoints=false) {
  return {name:midpoints?'ICT · FVG midpoints':'ICT · Fair value gap boundaries',overlay:true,
    inputs:[{key:'seconds',label:'Chart interval in seconds',type:'int',default:300,min:1},
      {key:'minBps',label:'Minimum gap (basis points)',type:'float',default:0,min:0},modeInput],
    outputs:midpoints?[{key:'bullMid',label:'Bull FVG 50%',color:'#26a69a'},{key:'bearMid',label:'Bear FVG 50%',color:'#ef737a'}]:
      [{key:'bullLow',label:'Bull FVG lower',color:'#26a69a'},{key:'bullHigh',label:'Bull FVG upper',color:'#26a69a'},
       {key:'bearLow',label:'Bear FVG lower',color:'#ef737a'},{key:'bearHigh',label:'Bear FVG upper',color:'#ef737a'}],
    calc(bars,p) {
      const out={bullLow:[],bullHigh:[],bearLow:[],bearHigh:[],bullMid:[],bearMid:[],markers:[],events:[],breaks:[]};
      let bull=null,bear=null;const limit=completeLimit(bars,p),step=Number(p.seconds)||300;
      for(let i=0;i<bars.length;i++) {
        const b=bars[i];out.breaks.push(false);
        if(i<limit) {
          if(bull&&b.low<=bull.low) {bull=null;out.breaks[i]=true;}
          if(bear&&b.high>=bear.high) {bear=null;out.breaks[i]=true;}
          if(i>=2 && b.time-bars[i-1].time===step && bars[i-1].time-bars[i-2].time===step) {
            const a=bars[i-2],minGap=b.close*Math.max(0,Number(p.minBps)||0)/10000;
            if(b.low-a.high>minGap) {bull={low:a.high,high:b.low};out.breaks[i]=true;out.events.push({side:1,time:b.time,knownAt:b.time+step,...bull});}
            if(a.low-b.high>minGap) {bear={low:b.high,high:a.low};out.breaks[i]=true;out.events.push({side:-1,time:b.time,knownAt:b.time+step,...bear});}
          }
        }
        for(const [key,val] of Object.entries({bullLow:bull?.low,bullHigh:bull?.high,bearLow:bear?.low,bearHigh:bear?.high,
          bullMid:bull?(bull.low+bull.high)/2:null,bearMid:bear?(bear.low+bear.high)/2:null}))out[key].push(val??null);
      }
      return out;
    }};
}

function makeIctSessions() {
  return {name:'ICT · NY clock & observed Asia range',overlay:true,
    inputs:[switchInput('labels','Show London 02:00 / NY 07:00 labels'),modeInput],
    outputs:[{key:'asiaHigh',label:'Observed Asia H (20–00 NY)',color:'#bd9af7'},
      {key:'asiaLow',label:'Observed Asia L (20–00 NY)',color:'#bd9af7'},
      {key:'midnight',label:'NY midnight open',color:'#f0bc62'}],
    calc(bars,p) {
      const out={asiaHigh:[],asiaLow:[],midnight:[],markers:[]};
      let hi=null,lo=null,midnight=null,lastDay=null,wasAsia=false;const limit=completeLimit(bars,p);
      for(let i=0;i<bars.length;i++) {
        if(i<limit) {
          const b=bars[i],clock=nyClock(b.time),asia=clock.minute>=1200;
          if(clock.day!==lastDay) {midnight=clock.minute===0?b.open:null;lastDay=clock.day;}
          if(asia) {if(!wasAsia){hi=b.high;lo=b.low;}else{hi=Math.max(hi,b.high);lo=Math.min(lo,b.low);}}
          wasAsia=asia;
          if(p.labels!=='Off' && [120,420].includes(clock.minute)) out.markers.push({time:b.time,position:'belowBar',shape:'circle',color:clock.minute===120?'#74a9ed':'#f0bc62',text:clock.minute===120?'London 02 NY':'NY 07 NY'});
        }
        out.asiaHigh.push(hi);out.asiaLow.push(lo);out.midnight.push(midnight);
      }
      out.markers=out.markers.slice(-8);return out;
    }};
}

export default makeIctFvg(true);
