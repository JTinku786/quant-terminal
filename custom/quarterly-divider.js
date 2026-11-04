// This adaptation is subject to Mozilla Public License 2.0: https://mozilla.org/MPL/2.0/
// Original © TheClairvoyant_Trader; local JavaScript adaptation, 2026-10-24.
// https://www.tradingview.com/script/XbaQDmrT-Quarterly-Divider/
// Pine uses the symbol's exchange timezone; local default is explicitly New York.
function quarterlyBoundaries(bars,timeZone='America/New_York',startYear=2023){
  const clock=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'numeric'});
  const ordinal=t=>{const p=Object.fromEntries(clock.formatToParts(new Date(t*1000)).filter(x=>x.type!=='literal').map(x=>[x.type,+x.value]));return p.year*4+Math.floor((p.month-1)/3);};
  const events=[];let previous=null;
  for(let i=0;i<bars.length;i++){
    const b=bars[i];if(!Number.isFinite(b.time)||(i&&b.time<=bars[i-1].time))throw Error('Quarterly Divider needs ordered candle times');
    const current=ordinal(b.time);
    if(previous!=null)for(let q=previous+1;q<=current;q++){const year=Math.floor(q/4),quarter=q%4+1;if(year>=startYear)events.push({index:i,time:b.time,year,quarter,label:`Q${quarter} ${year}`});}
    previous=current;
  }
  return events;
}
const quarterlyDivider={
  name:'Quarterly Divider · TheClairvoyant_Trader',overlay:true,
  inputs:[{key:'timeZone',label:'Quarter calendar timezone',type:'select',options:['America/New_York','UTC','Asia/Kolkata','Europe/London'],default:'America/New_York'},
    {key:'width',label:'Divider line thickness',type:'int',default:2,min:1,max:5},
    {key:'labels',label:'Quarter labels',type:'select',options:['On','Off'],default:'On'}],
  outputs:[{key:'boundary',label:'Quarter divider colour',color:'#ef5350'}],
  calc(bars,p){return {boundary:bars.map(()=>null),quarterDivider:{events:quarterlyBoundaries(bars,p.timeZone||'America/New_York'),width:p.width||2,labels:p.labels!=='Off',color:'#ef5350'}};},
};

export default quarterlyDivider;
