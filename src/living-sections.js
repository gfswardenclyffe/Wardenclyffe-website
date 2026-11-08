/* Wardenclyffe living cells — interactive canvas for interior pages */
(()=>{"use strict";
const canvas=document.getElementById("cells");if(!canvas)return;
const ctx=canvas.getContext("2d");if(!ctx)return;
const stage=document.querySelector(".living-stage"),kind=document.body.dataset.world||"services";
const cards=[...document.querySelectorAll("[data-form]")],title=document.querySelector("#active-label"),desc=document.querySelector("#active-detail");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
const forms={services:["lattice","scales","helix","globe","circuit","shield","flower"],work:["threads","clusters","network","circuit","orbit","globe","bridge"],shop:["documents","documents","scales","globe","shield","flower","circuit","flower"],contact:["connection","connection","network","flower","orbit"]};
const sequence=forms[kind]||forms.services;
const colors=["#ffcb80","#f7df9d","#8ffff0","#b2fff0","#f4ffeb","#ffa9bd","#d2fca0"];
let particles=[],w=1,h=1,dpr=1,active=0,t0=performance.now(),lastManual=0,shock={x:-200,y:-200,strength:0},mouse={x:-1000,y:-1000,on:false};
const rnd=n=>{let v=Math.sin(n*127.11+56.27)*43758.5453;return v-Math.floor(v)};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function point(mode,i,n){
 const u=rnd(i*3+5),v=rnd(i*8+2),k=i%12,angle=k*Math.PI/6,twopi=Math.PI*2;
 let x=.5,y=.5;
 if(mode==="lattice"){const arm=i%6,a=arm*Math.PI/3;const r=.06+u*.34;x=.5+Math.cos(a)*r+Math.sin(v*12)*.014;y=.49+Math.sin(a)*r;}
 else if(mode==="scales"){const j=i%5;if(j===0){x=.5;y=.16+u*.66}else if(j===1){x=.27+u*.46;y=.31+Math.sin(u*Math.PI)*.04}else if(j===2||j===3){const center=j===2?.31:.69;x=center-.12+u*.24;y=.48+Math.sin(u*Math.PI)*.055}else{x=.41+u*.18;y=.79;}}
 else if(mode==="helix"){const side=i%4,phase=u*twopi*2;if(side<2){x=.5+Math.sin(phase+side*Math.PI)*.21;y=.1+u*.8}else{x=.5+(v-.5)*Math.sin(phase)*.42;y=.1+u*.8}}
 else if(mode==="globe"){const j=i%4,ang=u*twopi;if(j===0){x=.5+Math.cos(ang)*.29;y=.5+Math.sin(ang)*.29}else if(j===1){x=.5+Math.sin(ang)*.15;y=.5+Math.cos(ang)*.29}else if(j===2){x=.21+u*.58;y=.5+Math.sin(u*Math.PI)*.12}else{x=.21+u*.58;y=.5-Math.sin(u*Math.PI)*.12}}
 else if(mode==="circuit"){const j=i%7;x=.15+u*.7;y=.22+j*.092+Math.sin(u*twopi+j*.4)*.027}
 else if(mode==="shield"){const a=u*twopi,den=Math.max(Math.abs(Math.cos(a)),Math.abs(Math.sin(a)));x=.5+Math.cos(a)*.28/den;y=.46+Math.sin(a)*.28/den;if(y>.66){x=.5+(x-.5)*(.95-y)*3}}
 else if(mode==="flower"){const petals=9,a=u*twopi,r=.11+.22*Math.abs(Math.sin(a*petals/2));x=.5+Math.cos(a)*r;y=.48+Math.sin(a)*r}
 else if(mode==="threads"||mode==="bridge"||mode==="connection"){x=.1+u*.8;y=.25+(i%7)*.079+Math.sin(u*twopi+i%7)*.04}
 else if(mode==="clusters"||mode==="orbit"){const j=i%5,a=j*twopi/5,b=u*twopi,rad=.065+.04*v;x=.5+Math.cos(a)*.23+Math.cos(b)*rad;y=.5+Math.sin(a)*.2+Math.sin(b)*rad}
 else if(mode==="network"){const j=i%12,a=j*twopi/12,r=u*.34;x=.5+Math.cos(a)*r;y=.5+Math.sin(a)*r}
 else if(mode==="documents"){const j=i%6,x0=.33+(j%2)*.06,y0=.17+(j%2)*.05;if(j<2){x=x0+u*.35;y=y0}else if(j<4){x=x0;y=y0+u*.6}else{x=.39+u*.26;y=.37+(j-4)*.13}}
 else{x=.5+Math.cos(u*twopi)*.27;y=.5+Math.sin(u*twopi)*.27}
 return [x*w,y*h];
}
function resize(){const r=stage.getBoundingClientRect();w=Math.max(200,r.width);h=Math.max(200,r.height);dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);let n=w<480?450:w<700?620:850;if(particles.length!==n)particles=Array.from({length:n},(_,i)=>({x:w*(.2+rnd(i*9)*.6),y:h*(.17+rnd(i*13)*.67),vx:0,vy:0,phase:rnd(i*11)*6.28,radius:.65+rnd(i*4)*1.3,c:colors[i%colors.length]}));for(let i=0;i<particles.length;i++)particles[i].target=point(sequence[active],i,particles.length)}
function select(index,manual=false){active=clamp(index,0,sequence.length-1);particles.forEach((p,i)=>p.target=point(sequence[active],i,particles.length));const card=cards.find(c=>+c.dataset.form===active);if(card){title.textContent=card.dataset.title;desc.textContent=card.dataset.subtitle}cards.forEach(c=>c.setAttribute("aria-pressed",String(+c.dataset.form===active)));if(manual)lastManual=performance.now()}
cards.forEach(card=>{const idx=+card.dataset.form;card.addEventListener("pointerenter",()=>select(idx,true));card.addEventListener("focus",()=>select(idx,true));card.addEventListener("click",()=>{select(idx,true);if(innerWidth<700)stage.scrollIntoView({behavior:reduced.matches?"auto":"smooth",block:"center"})})});
stage.addEventListener("pointermove",e=>{let r=stage.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.on=true});stage.addEventListener("pointerleave",()=>mouse.on=false);stage.addEventListener("pointerdown",e=>{const r=stage.getBoundingClientRect();shock={x:e.clientX-r.left,y:e.clientY-r.top,strength:1}});
function draw(now){const t=(now-t0)/1000;ctx.clearRect(0,0,w,h);
ctx.globalAlpha=.18;ctx.strokeStyle="#bbfff4";ctx.lineWidth=.7;for(let r=1;r<=6;r++){ctx.beginPath();ctx.ellipse(w*.5,h*.49,w*(.11+r*.065),h*(.09+r*.057),0,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;
if(!reduced.matches&&now-lastManual>14000){const next=Math.floor((now-t0)/12500)%sequence.length;if(next!==active)select(next)}
ctx.globalCompositeOperation="lighter";const motion=reduced.matches?0:1;
particles.forEach((p,i)=>{const tar=p.target;let ax=(tar[0]-p.x)*.018,ay=(tar[1]-p.y)*.018;
if(mouse.on){let dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy)||1;if(dist<85){ax+=dx/dist*(85-dist)*.046;ay+=dy/dist*(85-dist)*.046}}
if(shock.strength>.02){let dx=p.x-shock.x,dy=p.y-shock.y,dist=Math.hypot(dx,dy)||1;if(dist<140){ax+=dx/dist*.65*shock.strength;ay+=dy/dist*.65*shock.strength}}
p.vx=clamp((p.vx+ax)*.89,-7,7);p.vy=clamp((p.vy+ay)*.89,-7,7);p.x+=p.vx*motion;p.y+=p.vy*motion;if(!motion){p.x=tar[0];p.y=tar[1]}const flicker=.72+.28*Math.sin(t*2.6+p.phase*10);ctx.globalAlpha=.62+.38*flicker;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x+(motion?Math.sin(t+p.phase)*1.3:0),p.y,p.radius*flicker,0,Math.PI*2);ctx.fill();if(i%18===0){ctx.globalAlpha=.13;ctx.beginPath();ctx.arc(p.x,p.y,p.radius*4.3,0,Math.PI*2);ctx.fill()}});
ctx.globalCompositeOperation="source-over";ctx.globalAlpha=1;shock.strength*=.93;requestAnimationFrame(draw)}
const form=document.getElementById("compose-email");if(form)form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form),topic=String(d.get("topic")||"General inquiry").slice(0,100),name=String(d.get("name")||"").trim().slice(0,100),msg=String(d.get("message")||"").trim().slice(0,1200);const subject=encodeURIComponent("Wardenclyffe inquiry - "+topic),body=encodeURIComponent("Hello Wardenclyffe,\n\n"+(name?"My name is "+name+".\n":"")+(msg||"I would like to discuss a project or service.")+"\n\nThank you.");window.location.href="mailto:info@wardenclyffefirm.com?subject="+subject+"&body="+body});
addEventListener("resize",()=>{resize();select(active)});resize();select(0);requestAnimationFrame(draw);
})();