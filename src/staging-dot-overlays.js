/* Wardenclyffe HostGator staging ONLY — exact owner-provided 3D dot engines.
 * Unlike the earlier iframe preview, these canvases render in the same page, so
 * authentication / frame policies cannot silently hide chapters 01, 04 or 05.
 * Original dot anatomy, motion, interaction, colours and formations are retained.
 * Only canvas sizing, pointer coordinates and external frame scheduling adapted.
 */
(()=>{'use strict';
const stage=document.querySelector('.hero');
const primary=document.getElementById('swarm');
if(!stage||!primary||!window.__warden)return;
window.WARDEN_STAGING_DOT_OVERRIDES=true;
function createTree(canvas){

const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.25:1;
let W,H,PR,SC,CX,CY,SPAN=7.4,WID=6,OY=-.95;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.getBoundingClientRect();W=Math.max(1,bounds.width);H=Math.max(1,bounds.height);cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
  SC=Math.min(H/SPAN,W/WID);CX=W/2;CY=H/2;}
resize();

// flat dots: 0 blue (leaves), 1 red (bark), 2 pink (blossom), 3 golden (roots, autumn leaves), 4 white
const COLS=['#2f6bff','#ff3b3b','#ff7ac8','#f5b82e','#ffffff'];
const spr=COLS.map(c=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');
  x.beginPath();x.arc(32,32,29,0,6.283);x.fillStyle=c;x.fill();x.lineWidth=2;x.strokeStyle='rgba(60,55,45,.22)';x.stroke();return s;});

// ---------- helpers
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
function CR(p,u){const n=p.length-1,f=Math.max(0,Math.min(.9999,u))*n,i=Math.floor(f),t=f-i,
  a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],d=p[Math.min(i+2,n)],t2=t*t,t3=t2*t;
  return [0,1,2].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3));}
function mk(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=mk(5);   // fixed seed: the tree always grows the same way
const perp=d=>nrm(cross(d,Math.abs(d[1])<.9?[0,1,0]:[1,0,0]));
const turn=(d,th,phi)=>{const p=perp(d),q=cross(d,p),k=add(mul(p,Math.cos(phi)),mul(q,Math.sin(phi)));return nrm(add(mul(d,Math.cos(th)),mul(cross(k,d),Math.sin(th))));};

const DOTS=[],hash=new Map();
const key=(a,b,c)=>(a+100)*1e6+(b+100)*1e3+(c+100);
function tryAdd(o,d){const p=o.p,ix=Math.floor(p[0]/d),iy=Math.floor(p[1]/d),iz=Math.floor(p[2]/d);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++){const l=hash.get(key(ix+a,iy+b,iz+c));
    if(l)for(const q of l)if((q[0]-p[0])**2+(q[1]-p[1])**2+(q[2]-p[2])**2<d*d)return false;}
  const k=key(ix,iy,iz);if(!hash.has(k))hash.set(k,[]);hash.get(k).push(p);DOTS.push(o);return true;}

// ---------- a leaf: a pointed outline of nine dots with a midrib
const LEAF=[[.1,0],[.32,.5],[.32,-.5],[.58,.88],[.58,-.88],[.82,.5],[.82,-.5],[1,0],[.58,0]];
function leaf(p,dir,fl){
  const ax=nrm(add(mul(dir,.45),[(R()-.5)*1.6,(R()-.5)*1.2-.1,(R()-.5)*1.6])),sd=perp(ax),nv=cross(ax,sd),L=.15+R()*.04,Wd=.085+R()*.025,w=R();
  const c=w<.74?0:w<.86?2:w<.96?3:4;
  for(const [a,b] of LEAF)DOTS.push({p:add(p,add(mul(ax,a*L),mul(sd,b*Wd))),nv,k:1,c,sw:1,fl});
}

// ---------- recursive growth: the same rules grow the crown up and the roots down
const LEN=[1.2,1,.78,.58,.42,.3],RAD=[.22,.15,.1,.07,.05,.035];
let maxFl=0;
function grow(pos,dir,len,rad,depth,maxD,root,fl0){
  const end=add(pos,mul(dir,len)),bend=mul(perp(dir),len*.1*(R()*2-1)),ctrl=add(add(pos,mul(dir,len*.5)),bend),path=[pos,ctrl,end];
  const steps=Math.max(2,Math.ceil(len/.09));
  for(let i=0;i<=steps;i++){const u=i/steps,c=CR(path,u),tg=nrm(sub(CR(path,u+.02),CR(path,u-.02)));
    let r=rad*(1-.3*u);if(depth===0&&!root)r*=1+.7*Math.pow(1-u,3);
    const m=Math.max(1,Math.round(6.283*r/.15)),N0=perp(tg),B0=cross(tg,N0),off=R()*6.283;
    for(let k=0;k<m;k++){const ph=off+k/m*6.283,nv=add(mul(N0,Math.cos(ph)),mul(B0,Math.sin(ph))),p=m===1?c:add(c,mul(nv,r));
      const st=((ph/6.283*3+u*.6)%1+1)%1<.5,q=R();
      const col=root?(q<.62?3:q<.9?4:1):(st?(q<.9?1:3):(q<.45?3:1));
      if(tryAdd({p,nv:m===1?[0,1,0]:nv,k:0,c:col,sw:root?0:Math.max(0,c[1])/4.4*(depth+1)/6,fl:(root?-1:1)*(fl0+u*len)},.07))maxFl=Math.max(maxFl,fl0+u*len);}}
  const fl1=fl0+len;
  if(!root&&depth>=3){ // leaves hang along and at the end of the thin branches
    if(depth<maxD&&R()<.7)leaf(CR(path,.65),dir,fl0+len*.65);
    if(depth===maxD||R()<.2)for(let k=0;k<(depth===maxD?3:1);k++)leaf(end,dir,fl1);
    if(depth===maxD)return;}
  if(depth>=maxD)return;
  const n=root?(depth===0?5:2+(R()<.35?1:0)):(depth===0?3:depth===1?3:2),ph0=R()*6.283;
  for(let k=0;k<n;k++){
    let d2;
    if(root&&depth===0){const a=ph0+k/n*6.283;d2=nrm([Math.cos(a)*.95,-.55,Math.sin(a)*.95]);}
    else{d2=turn(dir,(root?.62:.66+.04*depth)+R()*.22,ph0+k/n*6.283+(R()-.5)*.6);
      d2=root?nrm(add(d2,[0,-.2,0])):nrm(add(d2,[0,depth<3?.14:.08,0]));}
    if(root){const e=add(end,mul(d2,len*.7));if(e[1]>-.1)d2=nrm([d2[0],d2[1]-.5,d2[2]]);}
    grow(end,d2,(root?LEN[depth+1]*1.1:LEN[depth+1])*(.9+R()*.2),root?RAD[depth+1]*.9:RAD[depth+1],depth+1,maxD,root,fl1);}
}
grow([0,0,0],nrm([.05,1,0]),LEN[0],RAD[0],0,5,false,0);   // the crown
grow([0,.05,0],nrm([0,-1,0]),.0001,.2,0,4,true,0);       // the roots (the first step has no length, it only fans out the primary roots)
// ground: a few rings of pale dots, so the roots clearly sit below it
for(const rr of [1,1.7,2.4]){const n=Math.round(6.283*rr/.15);
  for(let i=0;i<n;i++){const a=i/n*6.283+rr,w=R();DOTS.push({p:[Math.cos(a)*rr,0,Math.sin(a)*rr],nv:[0,1,0],k:2,c:rr>2.5?3:w<.5?4:3,sw:0,fl:-99});}}
// falling leaves and blossom
for(let i=0;i<80;i++)DOTS.push({k:3,c:R()<.45?3:R()<.6?2:0,px:(R()-.5)*7,py:R()*6.4,pz:(R()-.5)*5,sp:.25+R()*.35,ph:R()*6.283,fl:-99});
for(const d of DOTS)if(d.k!==3&&d.p){d.x0=d.p[0];d.y0=d.p[1];d.z0=d.p[2];}
const N=DOTS.length;
// fit the whole tree, crown and roots, into the window
let yTop=-9,yBot=9,rMax=0;for(const d of DOTS){if(d.k===3)continue;yTop=Math.max(yTop,d.y0);yBot=Math.min(yBot,d.y0);rMax=Math.max(rMax,Math.hypot(d.x0,d.z0));}
OY=-(yTop+yBot)/2;SPAN=yTop-yBot+.9;WID=rMax*2+.9;resize();

// ---------- dynamics (springs + the boids grid)
const X=new Float32Array(N),Y=new Float32Array(N),Z=new Float32Array(N),VX=new Float32Array(N),VY=new Float32Array(N),VZ=new Float32Array(N),PH=new Float32Array(N),SX=new Float32Array(N),SY=new Float32Array(N),AL=new Float32Array(N);
for(let i=0;i<N;i++){X[i]=(Math.random()-.5)*9;Y[i]=(Math.random()-.5)*9;Z[i]=(Math.random()-.5)*5;PH[i]=Math.random()*6.283;}
const GR=34,CELL=.3,head=new Int32Array(GR*GR*GR),nxt=new Int32Array(N),cell=v=>Math.max(0,Math.min(GR-1,Math.floor(v/CELL+GR/2)));

let mx=-9999,my=-9999,drag=false,lx=0,ly=0,dyaw=0,dyV=0,dpitch=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){dyV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.01;dyaw+=dyV;dpitch=Math.max(-.5,Math.min(.9,dpitch+((e.clientY-cv.getBoundingClientRect().top)-ly)*.004));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

let last=performance.now(),T=0;
function frame(now){
  const dt=Math.min((now-last)/1000,.033);last=now;T+=dt;
  if(!drag){dyaw+=dyV;dyV*=.95;}
  const yaw=Math.sin(T*.25)*.7*K0+dyaw,pitch=.14+dpitch,cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const gust=Math.pow(Math.max(0,Math.sin(T*.27)),4),wind=(Math.sin(T*.7)+.5*Math.sin(T*1.9+1)+.3+gust*1.6)*K0;
  const cyc=(T%22)/3.4,loose=cyc<1?Math.pow(Math.sin(Math.PI*cyc),2):0;
  // sap: a pulse of life climbs from the root tips, up the trunk, and out to the leaves
  const span=maxFl*2+1,wv=((T*1.3*K0)%span)-maxFl-.3;
  const f=9;
  head.fill(-1);
  for(let i=0;i<N;i++){const c=(cell(X[i])*GR+cell(Y[i]))*GR+cell(Z[i]);nxt[i]=head[c];head[c]=i;}
  if(burstQ){for(let i=0;i<N;i++){const dx=SX[i]-burstQ.x,dy=SY[i]-burstQ.y,d=Math.hypot(dx,dy)+1,q=Math.max(0,1-d/380);
      const p=q*q*16/Math.max(d/SC,.3);VX[i]+=dx/d*p*(.6+Math.random()*.8);VY[i]-=dy/d*p*(.6+Math.random()*.8);VZ[i]+=(Math.random()-.5)*p*.8;}burstQ=null;}
  const Kk=24*(1-.93*loose),Dd=6.4-3.2*loose;
  for(let i=0;i<N;i++){
    const d=DOTS[i];let px,py,pz;
    if(d.k===3){px=((d.px+Math.sin(T*.6+d.ph)*.5+wind*.3+3.5)%7+7)%7-3.5;py=((d.py-T*d.sp*K0)%6.4+6.4)%6.4-2.4;pz=d.pz+Math.sin(T*.5+d.ph)*.3;}
    else{const s=d.sw,fl=d.k===1?Math.sin(T*2.6+PH[i]*4)*.02:0;
      px=d.x0+(wind*.09+fl)*s;py=d.y0+Math.sin(T*1.5+PH[i])*.008*s;pz=d.z0+(wind*.03+fl*.6)*s;}
    const tx=px*cy_+pz*sy_,z1=-px*sy_+pz*cy_,yy=py+OY,ty=yy*cp-z1*sp,tz=yy*sp+z1*cp;
    let ax=(tx-X[i])*Kk-VX[i]*Dd,ay=(ty-Y[i])*Kk-VY[i]*Dd,az=(tz-Z[i])*Kk-VZ[i]*Dd;
    let sx=0,sy=0,sz=0,avx=0,avy=0,avz=0,n=0;
    const cx=cell(X[i]),cy=cell(Y[i]),cz=cell(Z[i]);
    for(let a=Math.max(0,cx-1);a<=Math.min(GR-1,cx+1);a++)for(let b=Math.max(0,cy-1);b<=Math.min(GR-1,cy+1);b++)for(let c=Math.max(0,cz-1);c<=Math.min(GR-1,cz+1);c++){
      for(let j=head[(a*GR+b)*GR+c];j>=0;j=nxt[j]){if(j===i)continue;
        const dx=X[i]-X[j],dy=Y[i]-Y[j],dz=Z[i]-Z[j],q=dx*dx+dy*dy+dz*dz;
        if(q<.09){n++;avx+=VX[j];avy+=VY[j];avz+=VZ[j];if(q<.006){const w=.0005/(q+.004);sx+=dx*w;sy+=dy*w;sz+=dz*w;}}}}
    if(n){ax+=sx+(avx/n-VX[i])*(.8+3*loose);ay+=sy+(avy/n-VY[i])*(.8+3*loose);az+=sz+(avz/n-VZ[i])*(.8+3*loose);}
    ax+=-Z[i]*1.2*loose+Math.sin(T*1.7+PH[i]*7)*(.2+2*loose)*K0;
    ay+=Math.cos(T*1.3+PH[i]*5)*(.2+2*loose)*K0+.8*loose;
    az+=X[i]*1.2*loose+Math.sin(T*1.1+PH[i]*3)*.2*K0;
    const mdx=SX[i]-mx,mdy=SY[i]-my,md=Math.hypot(mdx,mdy);
    if(md<140){const q=1-md/140,p=q*q*90/(md+20)*SC/100;ax+=mdx/(md+1)*p*20;ay+=-mdy/(md+1)*p*20;az+=(Math.random()-.5)*q*8;}
    VX[i]+=ax*dt;VY[i]+=ay*dt;VZ[i]+=az*dt;
    const s2=VX[i]*VX[i]+VY[i]*VY[i]+VZ[i]*VZ[i];if(s2>196){const k=14/Math.sqrt(s2);VX[i]*=k;VY[i]*=k;VZ[i]*=k;}
    X[i]+=VX[i]*dt;Y[i]+=VY[i]*dt;Z[i]+=VZ[i]*dt;
    const s=f/(f-Z[i]);SX[i]=CX+X[i]*SC*s;SY[i]=CY-Y[i]*SC*s;
  }
  for(let i=0;i<N;i++){const nv=DOTS[i].nv;
    if(!nv){AL[i]=.4+.6*Math.max(0,Math.min(1,(Z[i]+2.4)/4.8));continue;}
    const n1=nv[0]*cy_+nv[2]*sy_,z1=-nv[0]*sy_+nv[2]*cy_,n2=nv[1]*cp-z1*sp,n3=nv[1]*sp+z1*cp,
      lit=Math.max(0,-.35*n1+.45*n2+.82*n3),fa=Math.max(.2,Math.min(1,Math.abs(n3)*2.2+.45));
    AL[i]=fa*(.55+.45*lit);}
  ctx.clearRect(0,0,W,H);
  for(let pass=0;pass<2;pass++)for(let i=0;i<N;i++){const a=AL[i];if((a>.42)!==(pass===1))continue;
    const d=DOTS[i],s=f/(f-Z[i]),q=(d.fl-wv)/.5,pulse=1+.75*Math.exp(-q*q),
      size=SC*(d.k===3?.016:d.k===1?.0165:d.k===2?.02:.02)*s*pulse;
    ctx.globalAlpha=Math.min(1,a*(.9+.1*pulse));ctx.drawImage(spr[d.c],SX[i]-size,SY[i]-size,size*2,size*2);}
  ctx.globalAlpha=1;
  for(let b=bursts.length-1;b>=0;b--){const o=bursts[b];o.t+=dt;if(o.t>1){bursts.splice(b,1);continue;}
    ctx.strokeStyle=`rgba(90,110,160,${(1-o.t)*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.t*SC*2.2,0,6.283);ctx.stroke();}
}
return {frame,resize};

}

function createStarlings(canvas){

const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.3:1;
let W,H,PR,SC,CX,CY;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.getBoundingClientRect();W=Math.max(1,bounds.width);H=Math.max(1,bounds.height);cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
  SC=Math.min(H/8.5,W/7);CX=W/2;CY=H/2;}
resize();

// flat dots: 0 blue, 1 red, 2 pink, 3 golden, 4 white
const COLS=['#2f6bff','#ff3b3b','#ff7ac8','#f5b82e','#ffffff'];
const spr=COLS.map(c=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');
  x.beginPath();x.arc(32,32,29,0,6.283);x.fillStyle=c;x.fill();x.lineWidth=2;x.strokeStyle='rgba(60,55,45,.22)';x.stroke();return s;});

const N=2400;
const bx=new Float32Array(N),by=new Float32Array(N),bz=new Float32Array(N),vx=new Float32Array(N),vy=new Float32Array(N),vz=new Float32Array(N),
      SX=new Float32Array(N),SY=new Float32Array(N),SS=new Float32Array(N),AL=new Float32Array(N),PHs=new Float32Array(N),col=new Uint8Array(N);
for(let i=0;i<N;i++){
  const r=Math.cbrt(Math.random())*3.2,a=Math.random()*6.283,b=Math.acos(2*Math.random()-1);
  bx[i]=r*Math.sin(b)*Math.cos(a);by[i]=r*Math.cos(b)*.6;bz[i]=r*Math.sin(b)*Math.sin(a);
  vx[i]=3+(Math.random()-.5);vy[i]=(Math.random()-.5);vz[i]=(Math.random()-.5);PHs[i]=Math.random()*6.283;
  const w=Math.random();col[i]=w<.42?0:w<.58?1:w<.74?2:w<.92?3:4;
}
// spatial grid: each bird only looks at its own and the 26 neighbouring cells
const GR=24,CELL=1.3,head=new Int32Array(GR*GR*GR),nxt=new Int32Array(N);
const cell=v=>Math.max(0,Math.min(GR-1,Math.floor(v/CELL+GR/2)));

// interaction
let mx=-9999,my=-9999,drag=false,lx=0,ly=0,yawD=0,yawV=0,pitchD=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){yawV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.008;yawD+=yawV;pitchD=Math.max(-.9,Math.min(.9,pitchD+((e.clientY-cv.getBoundingClientRect().top)-ly)*.005));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

let ccx=0,ccy=0,ccz=0,last=performance.now(),T=0,hx=0,hy=0,hz=0,hsx=-999,hsy=-999;
function frame(now){
  const dt=Math.min((now-last)/1000,.033)*K0;last=now;T+=dt;
  if(!drag){yawD+=yawV;yawV*=.95;}
  const yaw=T*.07+yawD,pitch=.18+.1*Math.sin(T*.11)+pitchD,cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  // where the flock wants to go, and a hawk that sweeps through it now and then
  const tx=6.5*Math.sin(T*.21),ty=2.2*Math.sin(T*.33+1),tz=5.5*Math.cos(T*.17);
  const R=5.5+5.5*Math.cos(T*.37),a=T*.45;
  hx=ccx+R*Math.cos(a);hy=ccy+1.6*Math.sin(T*.6);hz=ccz+R*Math.sin(a);
  const f=26;

  head.fill(-1);
  for(let i=0;i<N;i++){const c=(cell(bx[i])*GR+cell(by[i]))*GR+cell(bz[i]);nxt[i]=head[c];head[c]=i;}
  if(burstQ){for(let i=0;i<N;i++){const dx=SX[i]-burstQ.x,dy=SY[i]-burstQ.y,d=Math.hypot(dx,dy)+1,q=Math.max(0,1-d/360);
      const p=q*q*9;const fx=dx/d*p,fy=dy/d*p,fz=(Math.random()-.5)*p*.6,y0=fy*cp+fz*sp,z1=-fy*sp+fz*cp;
      vx[i]+=fx*cy_-z1*sy_;vy[i]+=y0;vz[i]+=fx*sy_+z1*cy_;}burstQ=null;}

  let sx_=0,sy_s=0,sz_=0;
  for(let i=0;i<N;i++){
    let ax=0,ay=0,az=0,n=0,avx=0,avy=0,avz=0,cxs=0,cys=0,czs=0,sx=0,sy=0,sz=0;
    const cx=cell(bx[i]),cy=cell(by[i]),cz=cell(bz[i]);
    outer:for(let a2=Math.max(0,cx-1);a2<=Math.min(GR-1,cx+1);a2++)for(let b2=Math.max(0,cy-1);b2<=Math.min(GR-1,cy+1);b2++)for(let c2=Math.max(0,cz-1);c2<=Math.min(GR-1,cz+1);c2++){
      for(let j=head[(a2*GR+b2)*GR+c2];j>=0;j=nxt[j]){if(j===i)continue;
        const dx=bx[i]-bx[j],dy=by[i]-by[j],dz=bz[i]-bz[j],q=dx*dx+dy*dy+dz*dz;
        if(q<1.69){n++;avx+=vx[j];avy+=vy[j];avz+=vz[j];cxs+=bx[j];cys+=by[j];czs+=bz[j];
          if(q<.3){const w=1/(q+.02);sx+=dx*w;sy+=dy*w;sz+=dz*w;}
          if(n>=12)break outer;}}}
    if(n){ax+=(avx/n-vx[i])*1.5+(cxs/n-bx[i])*.3+sx*.07;ay+=(avy/n-vy[i])*1.5+(cys/n-by[i])*.3+sy*.07;az+=(avz/n-vz[i])*1.5+(czs/n-bz[i])*.3+sz*.07;}
    // the flock is drawn toward a roaming point, and softly held inside a sphere
    let dx=tx-bx[i],dy=ty-by[i],dz=tz-bz[i],d=Math.hypot(dx,dy,dz)+.001;const tk=Math.min(4,.6+d*.35);ax+=dx/d*tk;ay+=dy/d*tk;az+=dz/d*tk;
    const r=Math.hypot(bx[i],by[i],bz[i]);if(r>8){const k=(r-8)*4/r;ax-=bx[i]*k;ay-=by[i]*k;az-=bz[i]*k;}
    ay-=by[i]*.12;
    ax+=Math.sin(T*1.3+PHs[i]*5)*.5;ay+=Math.cos(T*1.1+PHs[i]*3)*.35;az+=Math.sin(T*.9+PHs[i])*.5;
    // hawk: birds flee when it gets close
    dx=bx[i]-hx;dy=by[i]-hy;dz=bz[i]-hz;d=Math.hypot(dx,dy,dz)+.001;
    if(d<3.2){const k=(3.2-d)*(3.2-d)*2.2/d;ax+=dx*k;ay+=dy*k;az+=dz*k;}
    // cursor: scare in screen space
    const mdx=SX[i]-mx,mdy=SY[i]-my,md=Math.hypot(mdx,mdy);
    if(md<170){const q=1-md/170,p=q*q*34,fx=mdx/(md+1)*p,fy=mdy/(md+1)*p,fz=(Math.random()-.5)*q*10,y0=fy*cp+fz*sp,z1=-fy*sp+fz*cp;
      ax+=fx*cy_-z1*sy_;ay+=y0;az+=fx*sy_+z1*cy_;}
    vx[i]+=ax*dt;vy[i]+=ay*dt;vz[i]+=az*dt;
    const s2=vx[i]*vx[i]+vy[i]*vy[i]+vz[i]*vz[i],sp2=Math.sqrt(s2)+1e-6,tgt=Math.max(3,Math.min(4.8,sp2));
    vx[i]*=tgt/sp2;vy[i]*=tgt/sp2;vz[i]*=tgt/sp2;
    bx[i]+=vx[i]*dt;by[i]+=vy[i]*dt;bz[i]+=vz[i]*dt;
    sx_+=bx[i];sy_s+=by[i];sz_+=bz[i];
  }
  // camera follows the flock's centre
  const ck=Math.min(1,dt*9);ccx+=(sx_/N-ccx)*ck;ccy+=(sy_s/N-ccy)*ck;ccz+=(sz_/N-ccz)*ck;

  for(let i=0;i<N;i++){
    const rx=bx[i]-ccx,ry=by[i]-ccy,rz=bz[i]-ccz,x1=rx*cy_+rz*sy_,z1=-rx*sy_+rz*cy_,t1=ry*cp-z1*sp,t2=ry*sp+z1*cp,s=f/(f-t2);
    SX[i]=CX+x1*SC*s;SY[i]=CY+t1*SC*s;SS[i]=s;AL[i]=.3+.7*Math.max(0,Math.min(1,(t2+9)/18));
  }
  ctx.clearRect(0,0,W,H);
  for(let pass=0;pass<2;pass++)for(let i=0;i<N;i++){if((AL[i]>.62)!==(pass===1))continue;
    const size=SC*.034*SS[i]*SS[i];ctx.globalAlpha=AL[i];ctx.drawImage(spr[col[i]],SX[i]-size,SY[i]-size,size*2,size*2);}
  ctx.globalAlpha=1;
  for(let b=bursts.length-1;b>=0;b--){const o=bursts[b];o.t+=dt;if(o.t>1){bursts.splice(b,1);continue;}
    ctx.strokeStyle=`rgba(90,110,160,${(1-o.t)*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.t*SC*2.6,0,6.283);ctx.stroke();}
}
return {frame,resize};

}

function createHeart(canvas){

const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.25:1;
let W,H,PR,SC,CX,CY;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.getBoundingClientRect();W=Math.max(1,bounds.width);H=Math.max(1,bounds.height);cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
  SC=Math.min(H/6.2,W/4.4);CX=W/2;CY=H/2;}
resize();

// flat dots: 0 blue, 1 red, 2 pink, 3 golden, 4 white
const COLS=['#2f6bff','#ff3b3b','#ff7ac8','#f5b82e','#ffffff'];
const spr=COLS.map(c=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');
  x.beginPath();x.arc(32,32,29,0,6.283);x.fillStyle=c;x.fill();x.lineWidth=2;x.strokeStyle='rgba(60,55,45,.22)';x.stroke();return s;});

// ---------- vector helpers
const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];};
function CR(p,u){const n=p.length-1,f=Math.max(0,Math.min(.9999,u))*n,i=Math.floor(f),t=f-i,
  a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],d=p[Math.min(i+2,n)],t2=t*t,t3=t2*t;
  return [0,1,2].map(k=>.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3));}

// ---------- anatomy: ventricular mass (tilted cone-ellipsoid), atria, great vessels, coronaries
const Bc=[-.1,-.5,0],AP=[.8,2.1,.2],M=mul(add(Bc,AP),.5),LH=Math.hypot(...sub(AP,Bc))/2,A=nrm(sub(AP,Bc));
const E1=nrm(sub([1,0,0],mul(A,A[0]))),E2=cross(E1,A),RA_=1.15,RB_=.95;
const rV=t=>Math.pow(Math.max(0,(1-t)/2),.6)*(1+.15*Math.sin(Math.PI*(t+1)/2));
const surf=(t,ph,s=1)=>{const r=rV(t)*s;return add(add(M,mul(A,LH*t)),add(mul(E1,Math.cos(ph)*RA_*r),mul(E2,Math.sin(ph)*RB_*r)));};
const insideV=(p,k=.97)=>{const q=sub(p,M),t=dot(q,A)/LH;if(Math.abs(t)>1)return false;const r=rV(t),l1=dot(q,E1)/RA_,l2=dot(q,E2)/RB_;return l1*l1+l2*l2<(r*k)**2;};
const insideE=(p,e,k=.9)=>{const x=(p[0]-e.c[0])/e.r[0],y=(p[1]-e.c[1])/e.r[1],z=(p[2]-e.c[2])/e.r[2];return x*x+y*y+z*z<k;};
const RA={c:[-1,-.2,.15],r:[.6,.75,.55],col:0},RAu={c:[-.55,-.75,.55],r:[.32,.3,.25],col:0},
      LA={c:[.55,-.8,-.55],r:[.7,.42,.5],col:1},LAu={c:[1,-.55,.1],r:[.3,.25,.22],col:1};
const CHAMBERS=[RA,RAu,LA,LAu];

const DOTS=[],hash=new Map(),SP=.092;
function tryAdd(o,d=SP){const p=o.p,ix=Math.floor(p[0]/d),iy=Math.floor(p[1]/d),iz=Math.floor(p[2]/d);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++){const l=hash.get((ix+a+50)*10000+(iy+b+50)*100+iz+c+50);
    if(l)for(const q of l)if((q[0]-p[0])**2+(q[1]-p[1])**2+(q[2]-p[2])**2<d*d)return;}
  const k=(ix+50)*10000+(iy+50)*100+iz+50;if(!hash.has(k))hash.set(k,[]);hash.get(k).push(p);DOTS.push(o);}
const pick=(base,pk=.06)=>{const r=Math.random();return r<pk?2:r<pk+.03?4:base;};

// coronary arteries (golden), placed first so they stay clean lines
function coronary(t0,t1,p0,p1,n){for(let i=0;i<=n;i++){const u=i/n,t=t0+(t1-t0)*u,ph=p0+(p1-p0)*u,p=surf(t,ph,1.035);tryAdd({p,k:0,c:3,t,big:1,nv:nrm(sub(p,add(M,mul(A,dot(sub(p,M),A)))))},.06);}}
coronary(-.78,.92,1.2,1.2,120);          // left anterior descending
coronary(-.8,-.82,1.2,-1.8,100);         // circumflex
coronary(-.82,-.8,1.45,3.6,110);          // right coronary
coronary(-.5,.5,.95,.85,20);
// great vessels and veins
function tube(pts,r0,r1,n,base,art,pk=.06){n*=1.8;for(let i=0;i<n;i++){const u=Math.random(),c=CR(pts,u),tg=nrm(sub(CR(pts,u+.01),CR(pts,u-.01))),
    ax=Math.abs(tg[1])<.9?[0,1,0]:[1,0,0],N=nrm(cross(tg,ax)),Bn=cross(tg,N),ph=Math.random()*6.283,r=r0+(r1-r0)*u,
    p=add(c,add(mul(N,Math.cos(ph)*r),mul(Bn,Math.sin(ph)*r)));
    if(insideV(p,.9)||CHAMBERS.some(e=>insideE(p,e,.8)))continue;tryAdd({p,k:2,c:pick(base,pk),ctr:c,u,art,nv:add(mul(N,Math.cos(ph)),mul(Bn,Math.sin(ph)))});}}
tube([[.05,-.55,0],[.03,-1.2,-.05],[.15,-1.85,-.15],[.55,-2.15,-.3],[.98,-1.8,-.4],[1.05,-1.2,-.5],[1.05,-.5,-.55]],.27,.22,2200,1,true);  // aorta
tube([[.1,-1.9,-.12],[-.05,-2.7,-.1]],.1,.1,300,1,true);tube([[.35,-2.1,-.25],[.3,-2.8,-.25]],.08,.08,250,1,true);tube([[.7,-2.1,-.35],[.95,-2.65,-.3]],.09,.09,250,1,true);
tube([[.25,-.5,.5],[.3,-1,.5],[.15,-1.55,.3],[-.05,-1.85,0]],.26,.26,1300,0,true);                     // pulmonary trunk
tube([[-.05,-1.85,0],[-.5,-1.75,-.2],[-.8,-1.55,-.45]],.13,.13,350,0,true);tube([[-.05,-1.85,0],[.5,-1.55,-.5],[1.3,-1.45,-.7]],.13,.13,500,0,true);
tube([[-1,-.85,.1],[-1,-1.6,.08],[-.98,-2.5,.05]],.2,.2,800,0,false);                                  // superior vena cava
tube([[-.95,.5,.05],[-.95,1.2,0],[-.95,1.65,-.05]],.22,.22,600,0,false);                               // inferior vena cava
[[[.2,-.8,-.6],[-.4,-.9,-1],[-.9,-.9,-1.2]],[[.2,-.6,-.6],[-.4,-.45,-1],[-.9,-.4,-1.2]],[[.9,-.9,-.6],[1.4,-.95,-.8],[1.9,-1,-.9]],[[.9,-.65,-.55],[1.4,-.6,-.7],[1.9,-.55,-.8]]]
 .forEach(p=>tube(p,.11,.11,350,1,false));                                                              // pulmonary veins
// atria
function ell(e,n){for(let i=0;i<n;i++){const d=nrm([Math.random()*2-1,Math.random()*2-1,Math.random()*2-1]);if(dot(d,d)<.5)continue;
    const p=[e.c[0]+d[0]*e.r[0],e.c[1]+d[1]*e.r[1],e.c[2]+d[2]*e.r[2]];
    if(insideV(p,.98)||(e===RAu&&insideE(p,RA,.85))||(e===LAu&&insideE(p,LA,.85)))continue;
    if(e!==RA&&e!==LA&&false)continue;tryAdd({p,k:1,c:pick(e.col,.07),ctr:e.c,nv:nrm([d[0]/e.r[0],d[1]/e.r[1],d[2]/e.r[2]])});}}
ell(RA,8000);ell(LA,8000);ell(RAu,2000);ell(LAu,2000);
// ventricles: right (blue, anterior) and left (red, posterior-left)
const G0=1.2,RVW=3.0;
for(let i=0;i<20000;i++){const t=-.88+1.88*Math.random(),ph=Math.random()*6.283;if(Math.random()>rV(t)*1.1)continue;
  const p=surf(t,ph);if(CHAMBERS.some(e=>insideE(p,e,.85)))continue;
  const rv=(((ph-G0)%6.283)+6.283)%6.283<RVW;tryAdd({p,k:0,c:pick(rv?0:1,.08),t,nv:nrm(sub(p,add(M,mul(A,dot(sub(p,M),A)))))});}
// precompute rest state
for(const d of DOTS){d.x0=d.p[0];d.y0=d.p[1];d.z0=d.p[2];
  if(d.k===0){const rel=sub(d.p,M),al=dot(rel,A),lat=sub(rel,mul(A,al));d.al=al;d.lat=lat;d.cr=cross(A,lat);}}
// blood cells flowing through the chambers (white and pink)
const FR=[[-1,-2.2,.05],[-1,-1.2,.1],[-1,-.3,.15],[-.6,.3,.3],[-.3,.9,.45],[.05,-.2,.5],[.28,-.9,.5],[.1,-1.6,.3],[-.05,-1.85,0],[.5,-1.55,-.5],[1.2,-1.45,-.7]],
      PL=[[1.8,-1,-.8],[1,-.9,-.65],[.55,-.8,-.5],[.6,-.1,-.2],[.75,.8,-.25],[.2,-.2,-.05],[.05,-1,0],[.2,-1.9,-.15],[.6,-2.1,-.3],[1,-1.7,-.42],[1.05,-.6,-.55]];
for(let i=0;i<170;i++)DOTS.push({k:3,c:Math.random()<.7?4:2,path:i%2?PL:FR,u:Math.random(),sp:.08+Math.random()*.05,off:[(Math.random()-.5)*.16,(Math.random()-.5)*.16,(Math.random()-.5)*.16],x0:0,y0:0,z0:0});
const N=DOTS.length;

// ---------- dynamics state
const X=new Float32Array(N),Y=new Float32Array(N),Z=new Float32Array(N),VX=new Float32Array(N),VY=new Float32Array(N),VZ=new Float32Array(N),PH=new Float32Array(N),SX=new Float32Array(N),SY=new Float32Array(N);
for(let i=0;i<N;i++){X[i]=(Math.random()-.5)*9;Y[i]=(Math.random()-.5)*9;Z[i]=(Math.random()-.5)*4;PH[i]=Math.random()*6.283;}
const GR=34,CELL=.3,head=new Int32Array(GR*GR*GR),nxt=new Int32Array(N),cell=v=>Math.max(0,Math.min(GR-1,Math.floor(v/CELL+GR/2)));

let mx=-9999,my=-9999,drag=false,lx=0,ly=0,dyaw=0,dyV=0,dpitch=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){dyV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.01;dyaw+=dyV;dpitch=Math.max(-.8,Math.min(.8,dpitch+((e.clientY-cv.getBoundingClientRect().top)-ly)*.005));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

const AL=new Float32Array(N);
const bump=(x,a,b)=>x<=a||x>=b?0:Math.pow(Math.sin(Math.PI*(x-a)/(b-a)),2);
const TP=.95,OY=.35;let last=performance.now(),T=0;
function frame(now){
  const dt=Math.min((now-last)/1000,.033);last=now;T+=dt;
  if(!drag){dyaw+=dyV;dyV*=.95;dyaw-=dyaw*dt*1.4;dpitch-=dpitch*dt*1.4;}
  const yaw=Math.sin(T*.5)*.6*K0+dyaw,pitch=.05+dpitch,cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  // cardiac cycle: atria contract, then ventricles, then the pulse travels up the arteries
  const ph=(T%TP)/TP,as=bump(ph,0,.16)*K0,vs=bump(ph,.17,.5)*K0,inWave=ph>.2&&ph<.62,uw=(ph-.2)/.42*1.3-.15;
  // every ~16 s the heart loosens into a free swarm, then re-forms
  const cyc=(T%16)/3.2,loose=cyc<1?Math.pow(Math.sin(Math.PI*cyc),2):0;
  const f=9;
  head.fill(-1);
  for(let i=0;i<N;i++){const c=(cell(X[i])*GR+cell(Y[i]))*GR+cell(Z[i]);nxt[i]=head[c];head[c]=i;}
  if(burstQ){for(let i=0;i<N;i++){const dx=SX[i]-burstQ.x,dy=SY[i]-burstQ.y,d=Math.hypot(dx,dy)+1,q=Math.max(0,1-d/380);
      const p=q*q*16/Math.max(d/SC,.3);VX[i]+=dx/d*p*(.6+Math.random()*.8);VY[i]+=dy/d*p*(.6+Math.random()*.8);VZ[i]+=(Math.random()-.5)*p*.8;}burstQ=null;}
  const Kk=24*(1-.92*loose),Dd=6.2-3*loose;
  for(let i=0;i<N;i++){
    const d=DOTS[i];let px,py,pz;
    if(d.k===0){ // ventricle: squeeze toward the axis and twist slightly
      const th=.14*vs*d.al/LH,c=Math.cos(th),s=Math.sin(th),sq=1-.1*vs,al=d.al*(1-.05*vs);
      px=M[0]+A[0]*al+(d.lat[0]*c+d.cr[0]*s)*sq;py=M[1]+A[1]*al+(d.lat[1]*c+d.cr[1]*s)*sq;pz=M[2]+A[2]*al+(d.lat[2]*c+d.cr[2]*s)*sq;
    }else if(d.k===1){const sc=1-.12*as;px=d.ctr[0]+(d.x0-d.ctr[0])*sc;py=d.ctr[1]+(d.y0-d.ctr[1])*sc;pz=d.ctr[2]+(d.z0-d.ctr[2])*sc;}
    else if(d.k===2){let sc=1;if(d.art&&inWave){const q=(d.u-uw)/.2;sc=1+.17*Math.exp(-q*q);}else sc=1-.04*as;
      px=d.ctr[0]+(d.x0-d.ctr[0])*sc;py=d.ctr[1]+(d.y0-d.ctr[1])*sc;pz=d.ctr[2]+(d.z0-d.ctr[2])*sc;}
    else{d.u=(d.u+dt*d.sp*(1+1.5*vs)*K0)%1;const c=CR(d.path,d.u);px=c[0]+d.off[0];py=c[1]+d.off[1];pz=c[2]+d.off[2];}
    py+=OY;
    const tx=px*cy_+pz*sy_,z1=-px*sy_+pz*cy_,ty=py*cp-z1*sp,tz=py*sp+z1*cp;
    const ox=Math.sin(T*.9+PH[i]*3)*.02,oy=Math.cos(T*1.1+PH[i]*2)*.02,oz=Math.sin(T*.7+PH[i])*.02;
    let ax=(tx+ox-X[i])*Kk-VX[i]*Dd,ay=(ty+oy-Y[i])*Kk-VY[i]*Dd,az=(tz+oz-Z[i])*Kk-VZ[i]*Dd;
    // boids: separation + alignment
    let sx=0,sy=0,sz=0,avx=0,avy=0,avz=0,n=0;
    const cx=cell(X[i]),cy=cell(Y[i]),cz=cell(Z[i]);
    for(let a=Math.max(0,cx-1);a<=Math.min(GR-1,cx+1);a++)for(let b=Math.max(0,cy-1);b<=Math.min(GR-1,cy+1);b++)for(let c=Math.max(0,cz-1);c<=Math.min(GR-1,cz+1);c++){
      for(let j=head[(a*GR+b)*GR+c];j>=0;j=nxt[j]){if(j===i)continue;
        const dx=X[i]-X[j],dy=Y[i]-Y[j],dz=Z[i]-Z[j],q=dx*dx+dy*dy+dz*dz;
        if(q<.09){n++;avx+=VX[j];avy+=VY[j];avz+=VZ[j];if(q<.014){const w=.0009/(q+.004);sx+=dx*w;sy+=dy*w;sz+=dz*w;}}}}
    if(n){ax+=sx+(avx/n-VX[i])*(1+3*loose);ay+=sy+(avy/n-VY[i])*(1+3*loose);az+=sz+(avz/n-VZ[i])*(1+3*loose);}
    ax+=-Y[i]*1.1*loose+Math.sin(T*1.7+PH[i]*7)*(.3+2*loose)*K0;
    ay+=X[i]*1.1*loose+Math.cos(T*1.3+PH[i]*5)*(.3+2*loose)*K0;
    az+=Math.sin(T*1.1+PH[i]*3)*.3*K0;
    const mdx=SX[i]-mx,mdy=SY[i]-my,md=Math.hypot(mdx,mdy);
    if(md<150){const q=1-md/150,p=q*q*90/(md+20)*SC/100;ax+=mdx/(md+1)*p*20;ay+=mdy/(md+1)*p*20;az+=(Math.random()-.5)*q*8;}
    VX[i]+=ax*dt;VY[i]+=ay*dt;VZ[i]+=az*dt;
    const s2=VX[i]*VX[i]+VY[i]*VY[i]+VZ[i]*VZ[i];if(s2>196){const k=14/Math.sqrt(s2);VX[i]*=k;VY[i]*=k;VZ[i]*=k;}
    X[i]+=VX[i]*dt;Y[i]+=VY[i]*dt;Z[i]+=VZ[i]*dt;
    const s=f/(f-Z[i]);SX[i]=CX+X[i]*SC*s;SY[i]=CY+Y[i]*SC*s;
  }
  ctx.clearRect(0,0,W,H);
  // shading: far-side dots fade out, dots facing the viewer are lit from the upper left
  for(let i=0;i<N;i++){const nv=DOTS[i].nv;if(!nv){AL[i]=.85;continue;}
    const n1=nv[0]*cy_+nv[2]*sy_,z1=-nv[0]*sy_+nv[2]*cy_,n2=nv[1]*cp-z1*sp,n3=nv[1]*sp+z1*cp,
      lit=Math.max(0,-.35*n1-.45*n2+.82*n3),fa=Math.max(.07,Math.min(1,n3*2.5+.4));
    AL[i]=fa*(.5+.5*lit);}
  for(let pass=0;pass<2;pass++)for(let i=0;i<N;i++){const a=AL[i];if((a>.25)!==(pass===1))continue;
    const s=f/(f-Z[i]),d=DOTS[i],size=SC*(d.k===3?.022:d.big?.03:.025)*s;
    ctx.globalAlpha=a;ctx.drawImage(spr[d.c],SX[i]-size,SY[i]-size,size*2,size*2);}
  ctx.globalAlpha=1;
  for(let b=bursts.length-1;b>=0;b--){const o=bursts[b];o.t+=dt;if(o.t>1){bursts.splice(b,1);continue;}
    ctx.strokeStyle=`rgba(90,110,160,${(1-o.t)*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.t*SC*2.2,0,6.283);ctx.stroke();}
}
return {frame,resize};

}
const options={
  0:{key:'tree',title:'Tree of Life — living dots',factory:createTree},
  3:{key:'starlings',title:'Starling murmuration — living dots',factory:createStarlings},
  4:{key:'heart',title:'Anatomical heart — living dots',factory:createHeart}
};
const models=new Map();
let activeScene=-1;
function createLayer(opt){
  const canvas=document.createElement('canvas');
  canvas.className='warden-original-dots warden-original-dots-'+opt.key;
  canvas.setAttribute('aria-label',opt.title);
  canvas.setAttribute('role','img');
  Object.assign(canvas.style,{
    position:'absolute',inset:'0',width:'100%',height:'100%',
    zIndex:'3',display:'none',background:'transparent',
    pointerEvents:'none',touchAction:'none',cursor:'crosshair'
  });
  stage.appendChild(canvas);
  return canvas;
}
function enter(scene){
  for(const obj of models.values()){
    obj.canvas.style.display='none';
    obj.canvas.style.pointerEvents='none';
  }
  activeScene=scene;
  const opt=options[scene];
  if(!opt){
    // Law and Business remain controlled by living-precision.js.
    return null;
  }
  try{
    let obj=models.get(scene);
    if(!obj){
      const canvas=createLayer(opt);
      // Instantiate only when a chapter is first shown — not all at startup.
      const model=opt.factory(canvas);
      obj={canvas,model};models.set(scene,obj);
    }
    obj.canvas.style.display='block';
    obj.canvas.style.pointerEvents='auto';
    obj.model.resize();
    primary.style.opacity='0';
    primary.style.pointerEvents='none';
    return obj;
  }catch(err){
    console.error('Wardenclyffe staging dot chapter failed',scene,err);
    primary.style.opacity='1';
    primary.style.pointerEvents='auto';
    return null;
  }
}
let lastFrameScene=-1;
function animate(now){
  const scene=window.__warden.scene;
  if(scene!==lastFrameScene){lastFrameScene=scene;enter(scene);}
  const obj=models.get(scene);
  // Coordinate with the precision engine. The old canvas must not cover or
  // overwrite Origin/Technology/Beyond; it returns for the normal chapters.
  if(options[scene]&&obj&&obj.canvas.style.display==='block'){
    if(primary.style.opacity!=='0')primary.style.opacity='0';
    if(primary.style.pointerEvents!=='none')primary.style.pointerEvents='none';
    obj.model.frame(now);
  }
  requestAnimationFrame(animate);
}
window.addEventListener('resize',()=>{
  const obj=models.get(activeScene);
  if(obj)obj.model.resize();
});
window.WardenclyffeStagingDots={
 get activeChapter(){return activeScene},
 get loadedChapters(){return Array.from(models.keys())},
 source:'original owner-uploaded Tree of Life, starling murmuration and anatomical heart demos',
 stagingOnly:true
};
requestAnimationFrame(animate);
})();
