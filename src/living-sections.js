/* Wardenclyffe living cells for interior pages. Original Canvas2D animation. */
(()=>{'use strict';
const canvas=document.getElementById('cells');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const stage=document.querySelector('.living-stage');const word=document.body.dataset.world||'services';
const cards=[...document.querySelectorAll('[data-form]')];const label=document.getElementById('active-label');const detail=document.getElementById('active-detail');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');const PALETTE=['#ffc66e','#ffdd91','#7bfae4','#8decf0','#e9fff5','#fca2b9','#b4ffd3'];
const modes={services:['lattice','law','globe','shield','circuit'],work:['threads','clusters','network','blueprint','orbit','spectrum','bridge'],shop:['documents','documents','seal','globe','spectrum','circuit','shield'],contact:['connection','connection','network','bloom','orbit']};
const seq=modes[word]||modes.services;let active=0,particles=[],targets=[],width=0,height=0,dpr=1,frame=0,t0=performance.now(),lastActivity=0,raf=0;
let mouse={x:-1000,y:-1000,power:0},shock={x:0,y:0,power:0};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function rng(i){return (Math.sin(i*127.1+17.93)*43758.5453123)%1}
function hash(i){let n=rng(i);return n<0?n+1:n}
function lines(){const routes=[];
const add=(a,b)=>{routes.push([a,b])};const curve=(fn,num=90)=>{for(let i=1;i<=num;i++)add(fn((i-1)/num),fn(i/num))};
const circle=(cx,cy,r,start=0,end=Math.PI*2)=>curve(u=>[cx+Math.cos(start+u*(end-start))*r,cy+Math.sin(start+u*(end-start))*r],90);
const mode=seq[active%seq.length];const P=(x,y)=>[x,y];
if(mode==='lattice'){
for(let arm=0;arm<6;arm++){const a=arm*Math.PI/3-.55,ex=.50+Math.cos(a)*.34,ey=.49+Math.sin(a)*.34;curve(u=>[.5+Math.cos(a)*u*.34,.49+Math.sin(a)*u*.34+Math.sin(u*5+arm)*.009],34);circle(ex,ey,.068);circle(ex,ey,.028)}circle(.5,.49,.13);circle(.5,.49,.032);circle(.5,.49,.26);
}else if(mode==='law'||mode==='scales'){
curve(u=>P(.5,.17+u*.61),65);curve(u=>P(.28+u*.44,.32+Math.sin(u*Math.PI)*.05),65);circle(.5,.17,.035);curve(u=>P(.43+u*.14,.78),30);
for(const x of [.31,.69]){curve(u=>P(x,.34+u*.13),20);curve(u=>P(x-.12+u*.24,.46+Math.sin(u*Math.PI)*.065),60)}
}else if(mode==='helix'){
for(let side=0;side<2;side++){curve(u=>P(.5+Math.sin(u*Math.PI*4+side*Math.PI)*.19,.11+u*.79),140)}for(let j=0;j<16;j++){const u=j/15;const dx=Math.sin(u*Math.PI*4)*.19;curve(v=>P(.5+(-dx+v*dx*2),.11+u*.79),20)}
}else if(mode==='globe'||mode==='spectrum'){
circle(.5,.48,.29);curve(u=>P(.5,.19+u*.58),50);for(const x of [-1,1])curve(u=>P(.5+x*Math.sin(u*Math.PI)*.155,.19+u*.58),85);for(const y of [-.19,0,.19])curve(u=>P(.21+u*.58,.48+y*Math.sqrt(Math.max(0,1-Math.pow((u-.5)*2,2)))),80);
}else if(mode==='circuit'||mode==='blueprint'){
for(let i=0;i<6;i++){let y=.23+i*.105,off=(i%2===0)?.2:-.2;curve(u=>P(.17+u*.66,y+Math.sin(u*Math.PI*2+i)*.033),65);circle(.25+(.5+off)*.5,y,.024)}circle(.5,.49,.15);circle(.5,.49,.078);
}else if(mode==='shield'){
const poly=[[.5,.12],[.79,.24],[.76,.60],[.5,.88],[.24,.60],[.21,.24],[.5,.12]];for(let i=1;i<poly.length;i++)add(poly[i-1],poly[i]);circle(.5,.46,.16);curve(u=>P(.42+u*.16,.47+Math.sin(u*Math.PI)*.06),32);
}else if(mode==='bloom'){
for(let i=0;i<9;i++){let a=i*Math.PI*2/9;curve(u=>P(.5+Math.cos(a)*(.085+u*.22)+Math.sin(u*Math.PI)*Math.cos(a+1.6)*.07,.5+Math.sin(a)*(.085+u*.22)+Math.sin(u*Math.PI)*Math.sin(a+1.6)*.07),52)}circle(.5,.5,.10);circle(.5,.5,.03)
}else if(mode==='threads'||mode==='bridge'||mode==='connection'){
for(let i=0;i<7;i++){curve(u=>P(.12+u*.76,.26+i*.078+Math.sin(u*Math.PI*2+i*.9)*(.035+i*.004)),90)}circle(.26,.49,.12);circle(.74,.49,.12);circle(.5,.49,.05)
}else if(mode==='clusters'||mode==='orbit'){
for(let k=0;k<5;k++){let a=k*Math.PI*2/5,cx=.5+Math.cos(a)*.23,cy=.5+Math.sin(a)*.2;circle(cx,cy,.098);curve(u=>P(.5+(cx-.5)*u,.5+(cy-.5)*u),35)}circle(.5,.5,.18);circle(.5,.5,.04)
}else if(mode==='network'){
for(let i=0;i<12;i++){let a=i*Math.PI*2/12,cx=.5+Math.cos(a)*(.25+hash(i)*.05),cy=.5+Math.sin(a)*(.25+hash(i+5)*.04);circle(cx,cy,.027);curve(u=>P(.5+(cx-.5)*u,.5+(cy-.5)*u),30)}circle(.5,.5,.10)
}else if(mode==='documents'){
const box=(x,y,w,h)=>{add(P(x,y),P(x+w,y));add(P(x+w,y),P(x+w,y+h));add(P(x+w,y+h),P(x,y+h));add(P(x,y+h),P(x,y))};box(.30,.18,.36,.62);box(.36,.13,.36,.62);for(let i=0;i<5;i++)add(P(.41,.31+i*.075),P(.65-(i%2)*.06,.31+i*.075));circle(.72,.2,.065)
}else if(mode==='seal'){
circle(.5,.45,.235);circle(.5,.45,.172);for(let a=0;a<8;a++){let an=a*Math.PI/4;curve(u=>P(.5+Math.cos(an)*(.24+u*.075),.45+Math.sin(an)*(.24+u*.075)),15)}curve(u=>P(.39+u*.22,.45+Math.sin(u*Math.PI*2)*.07),60)
}else{circle(.5,.5,.26);circle(.5,.5,.1)}
return routes}
function sampleTarget(count){const r=lines();const sizes=r.map(([a,b])=>Math.hypot((b[0]-a[0])*width,(b[1]-a[1])*height));const tot=sizes.reduce((a,b)=>a+b,0);let acc=0;const cum=sizes.map(v=>acc+=v);const out=[];for(let i=0;i<count;i++){let v=hash(i*3+4)*tot,lo=0,hi=cum.length-1;while(lo<hi){const m=(lo+hi)>>1;if(cum[m]<v)lo=m+1;else hi=m}const k=lo,s=(v-(cum[k-1]||0))/(sizes[k]||1),a=r[k][0],b=r[k][1];out.push({x:(a[0]+(b[0]-a[0])*s)*width,y:(a[1]+(b[1]-a[1])*s)*height})}return out}
function setup(){const rect=stage.getBoundingClientRect();width=Math.max(rect.width,200);height=Math.max(rect.height,200);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const n=width<480?450:width<700?620:850;
if(particles.length!==n){particles=Array.from({length:n},(_,i)=>({x:width*(.18+.64*hash(i*2+1)),y:height*(.15+.7*hash(i*5+2)),vx:0,vy:0,color:PALETTE[i%PALETTE.length],radius:.6+hash(i*9)*1.35,phase:hash(i+3)*6.28}))}targets=sampleTarget(n)}
function choose(i,manual){active=clamp(i,0,seq.length-1);targets=sampleTarget(particles.length);const card=cards.find(c=>Number(c.dataset.form)===active);if(card){if(label)label.textContent=card.dataset.title||'Living connections';if(detail)detail.textContent=card.dataset.subtitle||'The same cells, another possibility';}cards.forEach(c=>c.setAttribute('aria-pressed',String(Number(c.dataset.form)===active)));if(manual)lastActivity=performance.now()}
cards.forEach(card=>{const i=Number(card.dataset.form);card.addEventListener('pointerenter',()=>choose(i,true));card.addEventListener('focus',()=>choose(i,true));card.addEventListener('click',()=>{choose(i,true);if(card.tagName==='BUTTON'&&window.innerWidth<700)stage.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'})})});
stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.power=1});stage.addEventListener('pointerleave',()=>mouse.power=0);stage.addEventListener('pointerdown',e=>{const r=stage.getBoundingClientRect();shock={x:e.clientX-r.left,y:e.clientY-r.top,power:1}});
function render(now){if(!document.hidden){const time=(now-t0)*.001;const responsive=reduced.matches?0:1;ctx.clearRect(0,0,width,height);
const cg=ctx.createRadialGradient(width*.5,height*.48,16,width*.5,height*.48,width*.57);cg.addColorStop(0,'rgba(195,250,231,.07)');cg.addColorStop(1,'rgba(4,70,93,.0)');ctx.fillStyle=cg;ctx.fillRect(0,0,width,height);
ctx.globalAlpha=.17;ctx.strokeStyle='#abfbea';ctx.lineWidth=.7;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(width*.5,height*.49,(.15+i*.078)*width,(.15+i*.063)*height,0,0,6.283);ctx.stroke()}ctx.globalAlpha=1;
const shouldMove=responsive&&now-lastActivity>12000&&Math.floor((now-t0)/12500)%seq.length!==active;if(shouldMove)choose(Math.floor((now-t0)/12500)%seq.length,false);
const relax=.016;const globalWind=responsive?Math.sin(time*.4)*.02:0;const stride=reduced.matches?0:1;
ctx.globalCompositeOperation='lighter';for(let i=0;i<particles.length;i++){const p=particles[i],tar=targets[i];const dx=tar.x-p.x,dy=tar.y-p.y;const wobble=responsive?Math.sin(time*1.2+p.phase)*2.6:0;
let ax=dx*relax+Math.sin(time*.48+p.phase*8)*.055+globalWind,ay=dy*relax+Math.cos(time*.66+p.phase*7)*.05;
if(mouse.power){let ux=p.x-mouse.x,uy=p.y-mouse.y,dist=Math.hypot(ux,uy)||1;if(dist<80){ax+=ux/dist*(80-dist)*.043;ay+=uy/dist*(80-dist)*.043}}
if(shock.power>.02){let ux=p.x-shock.x,uy=p.y-shock.y,dist=Math.hypot(ux,uy)||1;if(dist<160){ax+=ux/dist*(160-dist)*.014*shock.power;ay+=uy/dist*(160-dist)*.014*shock.power}}
p.vx=clamp((p.vx+ax)*.89,-7.5,7.5);p.vy=clamp((p.vy+ay)*.89,-7.5,7.5);p.x+=p.vx*stride;p.y+=p.vy*stride;
const pulse=.7+.3*Math.sin(time*2.5+p.phase*9);ctx.globalAlpha=.55+.45*pulse;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x+wobble,p.y,Math.max(.45,p.radius*pulse),0,Math.PI*2);ctx.fill();if(i%21===0){ctx.globalAlpha=.12+.15*pulse;ctx.beginPath();ctx.arc(p.x,p.y,p.radius*4.4,0,6.283);ctx.fill()}}
ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;shock.power*=.93;frame++}
raf=requestAnimationFrame(render)}
const compose=document.getElementById('compose-email');if(compose){compose.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(compose),topic=String(form.get('topic')||'General inquiry').trim(),name=String(form.get('name')||'').trim().slice(0,100),message=String(form.get('message')||'').trim().slice(0,1200);const subject=encodeURIComponent('Wardenclyffe inquiry - '+topic);const body=encodeURIComponent('Hello Wardenclyffe,\n\n'+(name?'My name is '+name+'.\n':'')+(message||'I would like to discuss a project or service.')+'\n\nThank you.');window.location.href='mailto:info@wardenclyffefirm.com?subject='+subject+'&body='+body})}
window.addEventListener('resize',()=>{setup();choose(active,false)});setup();choose(0,false);if(reduced.matches){for(let j=0;j<130;j++){for(let i=0;i<particles.length;i++){const p=particles[i],tar=targets[i];p.x+=(tar.x-p.x)*.05;p.y+=(tar.y-p.y)*.05}}}
raf=requestAnimationFrame(render);
})();
