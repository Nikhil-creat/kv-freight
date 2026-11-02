'use strict';
const $=s=>document.querySelector(s),clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const v=$('video'),track=$('.track'),strip=$('.strip'),giant=$('.giant'),scene=$('.scene'),sp=$('#sp'),cards=[...document.querySelectorAll('.card')];
const BASE='https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/';
v.src=BASE+(innerWidth<=900?'b3718419-7a0a-478d-bfb0-0ff8bef7f3f7.mp4':'409763c0-95f4-49d3-a601-dc564d55072b.mp4');
const A=2.4,REC=location.search.includes('rec=1');
let B=1,W=0,H=0,cur=0,seeking=false,lastY=-1,lastT=performance.now(),spd=0,dur=4.04,offs=[],sw=0,gw=0,ready=false,wasPast=false,lastPh=-1,lastSp='';
v.addEventListener('loadedmetadata',()=>{dur=v.duration||4.04;ready=true;seek()});
v.addEventListener('seeked',()=>{seeking=false;seek()});
v.pause();
function layout(){W=innerWidth;H=innerHeight;const n=W<768||W<=H;let cw,ch,cl,ct;
 if(!n){const s=Math.max(W/1920,H/1080);cw=1920*s;ch=1080*s;cl=(W-cw)/2;ct=(H-ch)/2}
 else{cw=1.55*W;ch=cw*9/16;cl=W/2-.4*cw;ct=.36*H-.448*ch}
 v.style.cssText=`width:${cw}px;height:${ch}px;left:${cl}px;top:${ct}px`;
 scene.style.setProperty('--edge-px',(ct+.448*ch)+'px');scene.style.setProperty('--line',(ct+.829*ch)+'px');
 sw=strip.scrollWidth;gw=giant.scrollWidth;offs=cards.map(c=>c.offsetLeft);
 B=(sw+.45*W)/W*1.1;track.style.height=(1+A+B)*H+'px'}
function seek(){if(!ready||seeking||Math.abs(v.currentTime-cur)<=1/60)return;seeking=true;v.currentTime=cur}
function frame(y){const q=clamp(y/(A*H));cur+=(q*(dur-1/48)-cur)*.2;seek();
 const ph=q>=.94?1:0;if(ph!==lastPh){lastPh=ph;scene.style.setProperty('--ph',ph)}
 const r=clamp((y-A*H)/(B*H)),tx=W-r*(sw+.45*W);
 strip.style.transform=`translate3d(${tx}px,0,0)`;giant.style.transform=`translate3d(${W-r*(gw+W)}px,0,0)`;
 for(let i=0;i<cards.length;i++)cards[i].style.setProperty('--s',clamp((.98-(tx+offs[i])/W)/.3,-.4,1.6)*100);return cur}
function loop(now){const y=scrollY,dt=Math.max(1,now-lastT)/1000;
 if(!REC){spd+=(Math.min(99,Math.abs(y-(lastY<0?y:lastY))/dt/32)-spd)*.15;const t=String(Math.round(spd)).padStart(2,'0');if(t!==lastSp){lastSp=t;sp.textContent=t}}
 lastY=y;lastT=now;const past=y>(1+A+B)*H;if(!past||!wasPast)frame(y);wasPast=past;const on=y>(A+B)*H*.98;if(on!==dockOn){dockOn=on;dock.classList.toggle('on',on);topb.classList.toggle('on',on)}hint.classList.toggle('gone',y>30);requestAnimationFrame(loop)}
let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(layout,120)});layout();document.fonts&&document.fonts.ready.then(layout);addEventListener('load',layout);requestAnimationFrame(loop);
if(REC){const prog=t=>{const p=t/11;return p<.04?.04:p>.96?.96:.04+.92*(1-Math.cos(Math.PI*clamp((p-.04)/.92)))/2};
 window.__recTime=(vid,t)=>{const p=prog(t);scrollTo(0,p*(track.offsetHeight-H));
  sp.textContent=String(Math.round(Math.min(99,Math.abs(Math.sin(Math.PI*clamp(t/11)))*60))).padStart(2,'0');return frame(scrollY)}}
/* ---------- RAG knowledge base (fictional) ---------- */
const KB=[
['Air freight','KV air freight offers express, priority and deferred options across global lanes. Chargeable weight is the greater of actual and volumetric weight (L×W×H cm ÷ 6000).'],
['Ocean freight','KV ocean freight covers FCL and LCL sailings on major trade lanes. Choose carriers by cost versus transit time. Typical port-to-port transit is 14–40 days.'],
['Customs brokerage','Licensed brokers handle HS classification, duty and tax calculation, inspections and filings. Accurate commercial invoice, packing list and HS code prevent delays.'],
['Warehousing and 3PL','Bonded and general storage, pick and pack, kitting and distribution integrated with transport and inventory visibility.'],
['Project cargo','Oversized and heavy-lift moves with engineering, route surveys, permits and escorts from factory to foundation.'],
['Incoterms','EXW: buyer collects at seller premises. FOB: seller loads on vessel. CIF: seller pays freight and insurance to port. DDP: seller delivers cleared with duties paid, maximum seller obligation.'],
['Dangerous goods','Dangerous goods need classification, UN number, correct packaging, marking and a shipper declaration. KV declines undeclared or prohibited cargo, including weapons, explosives and narcotics.'],
['Tracking','Shipments carry IDs like KV-482913. Milestones: booked, picked up, departed, in transit, customs, out for delivery, delivered.'],
['Liability and limits','This site is a demonstration. Quotes are indicative estimates only, not binding offers. Real liability follows signed terms and applicable conventions.'],
['Data and security','The demo stores no personal data. Inputs are length-limited, outputs are rendered as plain text, and API keys are never persisted.']];
const tok=s=>s.toLowerCase().match(/[a-z0-9]+/g)||[];
const docs=KB.map(d=>tok(d[0]+' '+d[0]+' '+d[1])),df={};
docs.forEach(t=>new Set(t).forEach(w=>df[w]=(df[w]||0)+1));
const idf=w=>Math.log(1+docs.length/(df[w]||.5));
const vec=t=>{const m={};t.forEach(w=>m[w]=(m[w]||0)+idf(w));return m};
const dv=docs.map(vec),nrm=m=>Math.sqrt(Object.values(m).reduce((a,b)=>a+b*b,0))||1,dn=dv.map(nrm);
function retrieve(q,k=3){const qv=vec(tok(q)),qn=nrm(qv);
 return dv.map((m,i)=>({i,s:Object.keys(qv).reduce((a,w)=>a+qv[w]*(m[w]||0),0)/(qn*dn[i])})).sort((a,b)=>b.s-a.s).slice(0,k).filter(r=>r.s>.05)}
/* ---------- Agent: plan, tools, guardrails ---------- */
const log=$('#log'),hits=[];
const say=(t,c)=>{const d=document.createElement('div');d.className=c;d.textContent=t;log.append(d);log.scrollTop=log.scrollHeight};
const BLOCK=/(weapon|explosive|narcotic|sanction|ignore (all|previous)|system prompt|jailbreak)/i;
const tools={
 quote(q){const kg=+(q.match(/(\d{1,6})\s*kg/i)||[])[1],mode=/air/i.test(q)?'air':/ocean|sea/i.test(q)?'ocean':null;
  if(!kg||!mode)return null;const p=mode==='air'?kg*4.2+85:kg*.09+120;
  return `Indicative ${mode} quote for ${kg} kg: about USD ${p.toFixed(2)} (fictional rates, not an offer).`},
 track(q){const m=q.match(/KV-?(\d{6})/i);if(!m)return null;const st=['Booked','Picked up','Departed','In transit','Customs','Out for delivery','Delivered'];
  return `KV-${m[1]}: ${st[+m[1]%7]} (deterministic demo status).`}};
async function groq(q,ctx){const ac=new AbortController(),t=setTimeout(()=>ac.abort(),12000);try{const r=await fetch('/api/chat',{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({q,ctx})});if(!r.ok)throw new Error('API '+r.status);return await r.json()}finally{clearTimeout(t)}}
async function ask(raw){const q=raw.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,300);if(!q)return;say(q,'u');
 const now=Date.now();while(hits.length&&now-hits[0]>6e4)hits.shift();
 if(hits.length>=6)return say('Rate limit: 6 requests per minute.','');hits.push(now);
 if(BLOCK.test(q))return say('Plan: refuse. That request is outside what KV Copilot can help with.','');
 for(const n of ['quote','track']){const out=tools[n](q);if(out){say(`Plan → tool:${n}`,'t');return say(out,'')}}
 const r=retrieve(q);if(!r.length)return say('Plan → retrieve: no relevant source found. I cannot answer that reliably.','');
 say('Plan → retrieve: '+r.map(x=>KB[x.i][0]+' '+x.s.toFixed(2)).join(', '),'t');
 const ctx=r.map(x=>KB[x.i][1]).join('\n');
 try{const o=await groq(q,ctx);say('via '+o.provider+' · '+o.model,'t');return say(o.answer,'')}catch(e){say('Server LLM offline, using local answer.','t')}
 say(KB[r[0].i][1],'')}
$('#f').addEventListener('submit',e=>{e.preventDefault();const i=$('#q'),b=e.target.querySelector('button');b.disabled=true;ask(i.value).finally(()=>{b.disabled=false});i.value=''});
say('Hi, I am KV Copilot. Try: quote 1200 kg ocean, track KV-482913, or what is DDP?','');
/* ---------- Demo CNN: fixed-kernel conv → ReLU → maxpool → dense ---------- */
const K=[[-1,0,1,-2,0,2,-1,0,1],[-1,-2,-1,0,0,0,1,2,1],[0,1,0,1,-4,1,0,1,0],[1,1,1,1,1,1,1,1,1].map(x=>x/9)],DW=[.9,.9,1.4,-.2];
function cnn(g,n){let score=0;for(let k=0;k<4;k++){const o=[];
 for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){let s=0;for(let j=0;j<9;j++)s+=K[k][j]*g[(y+(j/3|0)-1)*n+x+j%3-1];o.push(Math.max(0,s))}
 const m=n-2;let sum=0,c=0;for(let y=0;y<m-1;y+=2)for(let x=0;x<m-1;x+=2){sum+=Math.max(o[y*m+x],o[y*m+x+1],o[(y+1)*m+x],o[(y+1)*m+x+1]);c++}
 score+=DW[k]*sum/c}return score}
$('#img').addEventListener('change',e=>{const f=e.target.files[0];if(!f||!f.type.startsWith('image/')||f.size>8e6)return $('#cnn').textContent='Choose an image under 8 MB.';
 const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const c=$('#cv'),x=c.getContext('2d');x.drawImage(im,0,0,128,128);URL.revokeObjectURL(u);
  const d=x.getImageData(0,0,128,128).data,g=new Float32Array(16384);for(let i=0;i<16384;i++)g[i]=(.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2])/255;
  const s=cnn(g,128),lvl=s<.25?'Low':s<.6?'Medium':'High';
  $('#cnn').textContent=`Surface irregularity: ${lvl} (score ${s.toFixed(2)}). Demo only: fixed untrained kernels, not a damage or safety inspection.`};
 im.onerror=()=>{$('#cnn').textContent='Could not read that image.'};im.src=u});

$('#cf').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,s=$('#cs'),b=f.querySelector('button');b.disabled=true;s.textContent='Sending...';
 try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});
  if(!r.ok)throw new Error(r.status);s.textContent='Thanks, we will reply soon.';f.reset()}
 catch(_){s.textContent='Could not send from here. Please email sriramojunikhil66@gmail.com directly.'}b.disabled=false});

if('serviceWorker' in navigator&&location.protocol==='https:')addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));

let dockOn=false;const dock=$('.dock'),topb=$('#top'),hint=$('.hint'),menu=$('#menu'),mbs=[...document.querySelectorAll('[data-menu]')];
const setMenu=o=>{menu.hidden=!o;mbs.forEach(b=>b.setAttribute('aria-expanded',String(o)))};
mbs.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setMenu(menu.hidden)}));
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
topb.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
v.addEventListener('canplay',()=>scene.classList.add('rdy'),{once:true});setTimeout(()=>scene.classList.add('rdy'),6000);
document.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.q)));
document.documentElement.classList.add('js');
const rvEls=[...document.querySelectorAll('.who,.pg article,.grid article,.contact form')];rvEls.forEach(e=>e.classList.add('rv'));
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1});rvEls.forEach(e=>io.observe(e))}
setTimeout(()=>rvEls.forEach(e=>e.classList.add('in')),4000);

/* ---------- Project board (localStorage) ---------- */
const LS='kv.board.v1',LANES=['todo','doing','done'],LN={todo:'To do',doing:'In progress',done:'Done'};
let tasks=[];try{tasks=JSON.parse(localStorage.getItem(LS)||'null')||[]}catch(_){tasks=[]}
if(!Array.isArray(tasks)||!tasks.length)tasks=[{id:1,t:'Deploy v5 to Vercel',k:'Project cargo',p:'High',s:'done'},{id:2,t:'Verify Groq and Gemini auto-detect',k:'Customs',p:'High',s:'doing'},{id:3,t:'Share the site on LinkedIn',k:'Air',p:'Medium',s:'todo'}];
const saveB=()=>{try{localStorage.setItem(LS,JSON.stringify(tasks))}catch(_){}};
const mv=(x,s)=>{x.s=s;saveB();drawB()};
function drawB(){const f=$('#bs').value.trim().toLowerCase(),box=$('#cols');box.textContent='';
 for(const s of LANES){const col=document.createElement('div'),h=document.createElement('h3'),list=tasks.filter(x=>x.s===s&&(!f||(x.t+x.k).toLowerCase().includes(f)));col.className='col';h.textContent=LN[s]+' ('+list.length+')';col.append(h);
  for(const x of list){const c=document.createElement('div'),t=document.createElement('b'),m=document.createElement('small'),a=document.createElement('div'),i=LANES.indexOf(s);c.className='task p-'+x.p;t.textContent=x.t;m.textContent=x.k+' · '+x.p;a.className='acts';
   const mk=(l,fn,al)=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.setAttribute('aria-label',al);b.addEventListener('click',fn);return b};
   if(i>0)a.append(mk('←',()=>mv(x,LANES[i-1]),'Move back'));if(i<2)a.append(mk('→',()=>mv(x,LANES[i+1]),'Move forward'));
   a.append(mk('✕',()=>{tasks=tasks.filter(y=>y!==x);saveB();drawB()},'Delete'));c.append(t,m,a);col.append(c)}
  box.append(col)}}
$('#bf').addEventListener('submit',e=>{e.preventDefault();const t=$('#bt').value.replace(/[\u0000-\u001f]/g,' ').trim().slice(0,80);if(!t)return;tasks.push({id:Date.now(),t,k:$('#bk').value,p:$('#bp').value,s:'todo'});$('#bt').value='';saveB();drawB()});
$('#bs').addEventListener('input',drawB);
$('#bc').addEventListener('click',()=>{tasks=tasks.filter(x=>x.s!=='done');saveB();drawB()});
$('#bx').addEventListener('click',()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(tasks,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=u;a.download='kv-board.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)});
drawB();
/* ---------- AI engine status ---------- */
(async()=>{const el=$('#eng');try{const ac=new AbortController();setTimeout(()=>ac.abort(),8000);const r=await fetch('/api/health?deep=1',{signal:ac.signal});if(!r.ok)throw 0;const p=(await r.json()).providers,on=[];
 for(const k of ['groq','gemini'])if(p[k]&&p[k].configured)on.push(k+(p[k].ok?' ✓ '+p[k].models[0]:' ✗'));
 el.textContent='Engine: '+(on.length?on.join(' · ')+' (auto-detected)':'local RAG (no API keys set)')}catch(_){el.textContent='Engine: local RAG (server offline)'}})();
