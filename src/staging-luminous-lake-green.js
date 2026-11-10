/* HostGator staging-only adaptation of user-uploaded luminous-lake-green.html.
 * Preserves the source sky, clouds, forest, water, colours, particle effects and interactions.
 * The original landscape canvas is hidden only while this staging script is loaded.
 * Does not alter the five-chapter particle controllers, any production source page,
 * or the cookie/language systems.
 */
(()=>{'use strict';
/* Wardenclyffe Luminous Lake: the original layout and forest (same size, count and seed), lighter and greener, with natural defined pines and nicer ripples. */
const shell=document.querySelector('.shell');
const original=document.getElementById('landscape');
if(!shell||!original)return;
const cv=document.createElement('canvas');
cv.id='warden-staging-luminous-lake-green';
cv.setAttribute('aria-hidden','true');
Object.assign(cv.style,{
 position:'absolute',inset:'0',width:'100%',height:'100%',display:'block',
 pointerEvents:'none',zIndex:'1'
});
original.insertAdjacentElement('afterend',cv);
original.style.visibility='hidden';
const g=cv.getContext('2d');
const fc=document.createElement('canvas'),f=fc.getContext('2d');      // forest layer: drawn upright and, strip by strip, as the reflection
const sky=document.createElement('canvas'),sg=sky.getContext('2d');    // still sky, halo, ridges and water colour
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let W=0,H=0,HZ=0,dpr=1,LX=0;const mouse={x:-999,y:-999,v:0,last:-999,active:false,rip:0};
const trees=[],ripples=[];

function resize(){
  dpr=Math.min(2,devicePixelRatio||1);const rect=shell.getBoundingClientRect();W=Math.max(1,rect.width);H=Math.max(1,rect.height);HZ=H*.78;LX=W*.66;
  for(const c of [cv,fc,sky]){c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);}
  for(const c of [g,f,sg])c.setTransform(dpr,0,0,dpr,0,0);
  drawSky();makeTrees();
}
function drawSky(){
  const s=sg;s.clearRect(0,0,W,H);
  // original sky gradient, lightened
  let gr=s.createLinearGradient(0,0,0,H);
  gr.addColorStop(0,'#f6fdfb');gr.addColorStop(.44,'#caf0ee');gr.addColorStop(.73,'#dcf7ec');gr.addColorStop(1,'#c0e9df');
  s.fillStyle=gr;s.fillRect(0,0,W,H);
  gr=s.createLinearGradient(0,0,W,H);gr.addColorStop(0,'rgba(231,250,255,.02)');gr.addColorStop(.5,'rgba(72,190,233,.06)');gr.addColorStop(1,'rgba(35,224,178,.06)');
  s.fillStyle=gr;s.fillRect(0,0,W,H);
  gr=s.createRadialGradient(LX,H*.39,6,LX,H*.39,W*.47);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.35,'rgba(150,238,220,.22)');gr.addColorStop(1,'rgba(67,204,218,0)');
  s.fillStyle=gr;s.fillRect(0,0,W,H);
  const ridge=(y,a,col,n,ph)=>{s.beginPath();s.moveTo(0,H);for(let x=0;x<=W+8;x+=7){
    s.lineTo(x,y+Math.sin(x/W*Math.PI*n+ph)*a+Math.sin(x/W*Math.PI*(n*.47)+ph*2)*a*.58)}s.lineTo(W,H);s.closePath();s.fillStyle=col;s.fill();};
  ridge(HZ-H*.1,H*.035,'rgba(96,196,184,.2)',3.8,.73);
  ridge(HZ-H*.068,H*.028,'rgba(72,184,168,.25)',5.2,1.8);
  ridge(HZ-H*.036,H*.018,'rgba(52,174,156,.3)',6.1,.2);
  // lake: the original turquoise, lighter and clearer
  gr=s.createLinearGradient(0,HZ,0,H);gr.addColorStop(0,'#cff4ec');gr.addColorStop(.34,'#a7e6df');gr.addColorStop(1,'#86d8d6');
  s.fillStyle=gr;s.fillRect(0,HZ,W,H-HZ);
  s.fillStyle='rgba(255,255,255,.6)';s.fillRect(0,HZ-1.5,W,3);
  gr=s.createLinearGradient(LX-W*.16,0,LX+W*.16,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.3)');gr.addColorStop(1,'rgba(255,255,255,0)');
  s.fillStyle=gr;s.fillRect(LX-W*.16,HZ,W*.32,H-HZ);
}
// ---------- forest: the ORIGINAL three layers (80 / 56 / 38 pines, same seed, same sizes), drawn as natural, lit and shaded pines
function makeTrees(){
  trees.length=0;let rng=2027;const next=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296};
  let r2=91;const n2=()=>{r2=(r2*1664525+1013904223)>>>0;return r2/4294967296};   // separate stream for shape detail, so positions and heights stay identical to the original
  for(let layer=0;layer<3;layer++){const n=layer===0?80:layer===1?56:38;
    for(let i=0;i<n;i++){const x=next()*W,edge=Math.pow(Math.abs(x-W*.5)/(W*.5),1.43),
      h=(layer===0?14:layer===1?27:46)+edge*(layer===0?27:layer===1?46:62)*(.55+next()*.75),ph=next()*6.28,off=next()*7-3;
      const nt=5+Math.floor(n2()*3),tiers=[];
      for(let k=0;k<nt;k++)tiers.push({jx:(n2()-.5)*.06,wl:.82+n2()*.36,wr:.82+n2()*.36});
      trees.push({x,layer,h,ph,off,edge,tone:Math.floor(n2()*3),tiers,lean:(n2()-.5)*.05});}}
}
// lighter greens, pale in the distance and fuller up close; three small tone variations per layer so the forest looks natural
const GREENS=[['#c6ebdb','#cdeee0','#bfe7d6'],['#9ddcc2','#a6e0c9','#93d6b9'],['#62c3a0','#6ccaa8','#58b996']];
const TRUNK=['rgba(86,150,125,.8)','rgba(66,134,110,.85)','rgba(48,116,94,.9)'],SHADE=[.07,.11,.15];
function drawLayer(li,t){
  const base=[new Path2D(),new Path2D(),new Path2D()],lit=new Path2D(),shade=new Path2D(),trunk=new Path2D();
  for(const tr of trees){if(tr.layer!==li)continue;
    const x=tr.x,y=HZ-6+tr.off-li*2,h=tr.h,nt=tr.tiers.length,s=x<LX?1:-1,P=base[tr.tone],
      sw=Math.sin(t*.00073+tr.ph)*h*(li===2?.042:.025);
    const dxAt=hf=>sw*(.1+hf)+tr.lean*h*hf;
    trunk.moveTo(x-h*.02,y);trunk.lineTo(x+h*.02,y);trunk.lineTo(x+dxAt(.2)+h*.009,y-h*.2);trunk.lineTo(x+dxAt(.2)-h*.009,y-h*.2);trunk.closePath();
    for(let k=0;k<nt;k++){const u=k/(nt-1),T=tr.tiers[k],by=y-h*(.11+.7*u),hf=(y-by)/h,ay=by-h*(.34-.2*u),hw=h*(.215-.15*u),ax=x+dxAt(hf)+T.jx*h,
        L=ax-hw*T.wl,Rr=ax+hw*T.wr,dr=h*.022;
      P.moveTo(ax,ay);P.quadraticCurveTo(ax-hw*T.wl*.3,ay+(by-ay)*.66,L,by+dr);     // concave, drooping left flank
      P.lineTo(ax-hw*T.wl*.42,by-dr*.5);P.lineTo(ax,by+dr*.6);P.lineTo(ax+hw*T.wr*.42,by-dr*.5);   // scalloped hem
      P.lineTo(Rr,by+dr);P.quadraticCurveTo(ax+hw*T.wr*.3,ay+(by-ay)*.66,ax,ay);P.closePath();
      if(li>0||tr.h>22){const c1=s>0?Rr:L,c2=s>0?L:Rr;lit.moveTo(ax,ay);lit.lineTo(c1,by+dr);lit.lineTo(ax,by);lit.closePath();shade.moveTo(ax,ay);shade.lineTo(c2,by+dr);shade.lineTo(ax,by);shade.closePath();}}}
  f.fillStyle=TRUNK[li];f.fill(trunk);
  for(let b=0;b<3;b++){f.fillStyle=GREENS[li][b];f.fill(base[b]);}
  f.fillStyle='rgba(255,255,255,.34)';f.fill(lit);f.fillStyle=`rgba(0,82,60,${SHADE[li]})`;f.fill(shade);
}
function drawForest(t){f.clearRect(0,0,W,H);for(let li=0;li<3;li++)drawLayer(li,t);}
// ---------- sky motion
function drawGlow(t){
  const b=Math.sin(t/17000*Math.PI*2)*.5+.5;
  let gr=g.createRadialGradient(W*(.73-.03*b),H*(.37+.02*b),0,W*(.73-.03*b),H*(.37+.02*b),W*.4);gr.addColorStop(0,'rgba(140,235,215,.3)');gr.addColorStop(1,'rgba(140,235,215,0)');g.fillStyle=gr;g.fillRect(0,0,W,HZ);
  gr=g.createRadialGradient(W*(.28+.03*b),H*(.45-.02*b),0,W*(.28+.03*b),H*(.45-.02*b),W*.45);gr.addColorStop(0,'rgba(90,195,245,.22)');gr.addColorStop(1,'rgba(90,195,245,0)');g.fillStyle=gr;g.fillRect(0,0,W,HZ);
}
function drawClouds(t){
  for(let i=0;i<5;i++){const sp=(i%2?1:-1)*(.0042+i*.0009),x=((W*(i*.25+.1)+t*sp)%(W+600)+W+600)%(W+600)-300,y=H*(.2+.07*(i%3)),s=W*(.11+.015*(i%3));
    g.fillStyle='rgba(255,255,255,.34)';g.beginPath();
    for(const [dx,dy,k] of [[0,0,1],[-.7,.2,.7],[.75,.15,.8],[.2,-.28,.6]]){g.moveTo(x+dx*s+s*k,y+dy*s*.3);g.ellipse(x+dx*s,y+dy*s*.3,s*k,s*.2*k,0,0,6.283);}
    g.fill();}
}
// ---------- the lake
function addRipple(x,y,big){ripples.push({x,y,t:performance.now(),big:!!big});if(ripples.length>26)ripples.shift();}
function drawLake(t,now){
  const wh=H-HZ,m=mouse.active?mouse.x:W*.5,mv=mouse.active?Math.min(6,mouse.v):0;
  g.save();g.beginPath();g.rect(0,HZ,W,wh);g.clip();
  // reflection of the forest, each strip nudged sideways by the waves
  for(let y=HZ;y<H;y+=3){const d=(y-HZ)/wh,sy=HZ-(y-HZ)*.92-3;if(sy<0)break;
    const dx=(Math.sin(y*.12+t*.0022)*2.2+Math.sin(y*.05-t*.0014)*3+Math.sin(y*.31+t*.004)*.7)*(.35+d*1.6);
    g.globalAlpha=.6*(1-d*.8);g.drawImage(fc,0,sy*dpr,W*dpr,3*dpr,dx,y,W,3);}
  g.globalAlpha=1;
  // long, smooth wave lines, with a bright highlight where each crest catches the light
  const N=72,xs=[],ws=[];
  for(let i=0;i<N;i++){const d=(i+.5)/N,y=HZ+d*(wh-2),ph=t*.0016*(1+d*.55)+i*.61,amp=.8+d*3.2+.9+d*.9+1.1+d*1.6;
    xs.length=0;ws.length=0;
    g.lineWidth=.6+d*.6;g.strokeStyle=i%4===0?'rgba(255,255,255,.62)':i%3===0?'rgba(25,160,150,.2)':'rgba(40,180,165,.17)';
    g.beginPath();
    for(let x=0;x<=W+10;x+=6){
      const pr=Math.exp(-(((x-m)/(W*.16))**2)),
        w=Math.sin(x*.012+ph)*(.8+d*3.2)+Math.sin(x*.034-ph*.8)*(.9+d*.9)+Math.cos(x*.0055+ph*1.3)*(1.1+d*1.6)+pr*mv*Math.sin(x*.07-ph*2.6)*4.4;
      xs.push(x);ws.push(w);x===0?g.moveTo(x,y+w):g.lineTo(x,y+w);}
    g.stroke();
    if(i%2===0){const thr=amp*.52;g.lineWidth=1+d*1.3;g.strokeStyle=`rgba(255,255,255,${.5+d*.35})`;g.beginPath();
      for(let k=1;k<xs.length;k++)if(ws[k]>thr&&ws[k-1]>thr){g.moveTo(xs[k-1],y+ws[k-1]);g.lineTo(xs[k],y+ws[k]);}
      g.stroke();}
  }
  // ring ripples: from the pointer, from clicks, and the odd raindrop-like swell
  for(let r=ripples.length-1;r>=0;r--){const o=ripples[r],age=(now-o.t)/1000,life=o.big?3.6:2.6;
    if(age>life){ripples.splice(r,1);continue;}
    const d=Math.max(.05,Math.min(1,(o.y-HZ)/wh)),sp=(o.big?150:95)*(.55+d*.9),al=Math.pow(1-age/life,1.5)*(o.big?.8:.6);
    for(let k=0;k<(o.big?3:2);k++){const a2=age-k*.22;if(a2<=0)continue;const rx=a2*sp,ry=rx*(.14+.24*d);
      g.strokeStyle=`rgba(255,255,255,${al*(1-k*.25)})`;g.lineWidth=1.3+d*1.2-k*.3;g.beginPath();g.ellipse(o.x,o.y,rx,ry,0,0,6.283);g.stroke();
      g.strokeStyle=`rgba(30,170,160,${al*.35*(1-k*.25)})`;g.lineWidth=.8;g.beginPath();g.ellipse(o.x,o.y+1.5,rx*.97,ry*.97,0,0,6.283);g.stroke();}}
  // soft light glints and sparkles
  for(let i=0;i<30;i++){const x=W*(.48+.3*Math.sin(i*2.3))+Math.sin(t*.001+i*7)*26,y=HZ+wh*((i+.5)/31),len=(7+(i%5)*8)*(1+(y-HZ)/wh);
    g.strokeStyle=`rgba(255,255,255,${.28+.22*Math.sin(t*.003+i*1.7)})`;g.lineWidth=.8;g.beginPath();g.moveTo(x-len*.5,y);g.lineTo(x+len*.5,y);g.stroke();}
  for(let k=0;k<60;k++){const d=((k*.6180339)%1)*.95+.03,y=HZ+d*(wh-4),x=((k*.7548776+.17)%1)*W+Math.sin(t*.0008+k)*14,tw=Math.pow(Math.max(0,Math.sin(t*.0033+k*5.1)),6);
    if(tw<.05)continue;const r=2+d*4*tw;g.strokeStyle=`rgba(255,255,255,${Math.min(1,tw*1.1)})`;g.lineWidth=1.2;g.beginPath();g.moveTo(x-r,y);g.lineTo(x+r,y);g.moveTo(x,y-r*.7);g.lineTo(x,y+r*.7);g.stroke();}
  g.restore();
}
let nextDrop=0;
function frame(now){
  const t=reduced.matches?0:now;mouse.v*=.9;
  if(!reduced.matches&&now>nextDrop){addRipple(W*(.08+.84*Math.random()),HZ+(H-HZ)*(.15+.75*Math.random()));nextDrop=now+1100+Math.random()*1500;}
  g.clearRect(0,0,W,H);g.drawImage(sky,0,0,W,H);
  drawGlow(t);drawClouds(t);drawForest(t);g.drawImage(fc,0,0,W,H);
  drawLake(t,now);
  requestAnimationFrame(frame);
}
addEventListener('pointermove',e=>{
  if(mouse.active)mouse.v=Math.max(mouse.v,Math.min(6,Math.abs(e.clientX-mouse.last)*.12));
  mouse.x=e.clientX;mouse.y=e.clientY;mouse.last=e.clientX;mouse.active=true;
  const now=performance.now();if(e.clientY>HZ+6&&now-mouse.rip>140&&mouse.v>.6){addRipple(e.clientX,e.clientY);mouse.rip=now;}
},{passive:true});
addEventListener('pointerdown',e=>{if(e.clientY>HZ+6)addRipple(e.clientX,e.clientY,true);},{passive:true});
document.addEventListener('pointerleave',()=>{mouse.active=false;});
let rt=0;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(resize,120);});
resize();requestAnimationFrame(frame);
})();
