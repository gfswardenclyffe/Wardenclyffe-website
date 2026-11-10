/* Wardenclyffe precise living sculptures | source-faithful adaptation
 * The two engines below are ported directly from the owner-supplied
 * wardenclyffe-dots.html and dna-swarm.html demos. Their original particle
 * coordinates, 3-D model, grid-based boids, physics, drag and burst behavior
 * are preserved. Only canvas sizing/pointer coordinates and frame scheduling
 * are adapted to run inside Wardenclyffe's five-chapter website.
 */
(()=>{'use strict';
function createWarrior(canvas){
// Symbol points traced from the original logo: [x, y, colour] in hundredths of a unit (3 = gold bow and arrow, 0 = blue quill and script)
const P=[-23,-107,0,-26,-131,0,64,28,0,126,-121,3,51,-167,0,9,32,0,-38,-78,3,-52,-149,0,120,-58,3,-65,-92,0,-17,-212,3,-54,-73,0,-93,-151,0,-14,-89,3,-44,-224,3,17,-37,0,10,138,0,9,-102,3,53,27,0,-46,-104,3,96,-154,3,127,-90,3,56,-213,3,-42,-115,3,-58,-175,0,27,-222,3,78,-200,3,-104,-47,0,-35,-9,0,47,107,0,-70,-219,3,134,-163,3,-18,40,0,-99,-48,0,-13,123,0,-10,117,0,40,113,0,-20,-198,3,-102,-120,0,102,-174,3,8,-164,0,60,-165,0,36,-220,3,74,-36,3,-4,-95,3,-27,146,0,96,-184,3,-84,-159,0,-76,-94,0,79,76,0,11,-71,0,44,-164,0,15,-60,0,-103,-133,0,-72,-167,0,-59,225,0,22,30,0,-52,-223,3,123,-136,3,135,-171,3,123,-186,3,15,-106,3,-48,-97,3,29,29,0,-37,-135,3,72,84,0,28,-151,0,-16,-226,3,16,31,0,-52,56,0,-26,-58,3,-113,-44,0,39,-121,3,114,-188,3,85,-33,3,-123,-10,0,-35,19,0,7,-51,3,-25,-125,0,-39,161,0,0,-52,3,83,31,0,-138,-27,0,50,-41,3,75,-143,3,61,-160,0,-9,-54,3,-53,192,0,-30,-225,3,0,-225,3,-58,217,0,-101,-208,3,128,-173,3,8,-77,0,-55,-80,3,-32,-60,3,12,95,0,-5,109,0,-18,-206,3,-3,101,0,-143,-19,0,-26,-177,3,126,-82,3,122,-64,3,-51,-85,3,5,92,0,-63,-43,0,68,-138,3,-102,-25,0,127,-100,3,-20,139,0,5,142,0,-71,-41,0,-129,-9,0,56,-131,3,83,-147,3,104,-26,3,89,1,3,95,57,0,111,-162,3,127,-112,3,-68,66,0,34,118,0,-131,-34,0,52,102,0,115,-44,3,-102,-138,0,-34,153,0,0,34,0,-58,-51,0,100,-31,3,9,-225,3,99,-13,3,41,28,0,-24,-225,3,50,-127,3,-34,-146,3,-20,-85,3,-24,-117,0,20,-53,0,-62,-221,3,36,-44,3,-20,-56,3,-10,153,0,82,-196,3,118,-168,3,-44,-29,0,56,-40,3,14,-42,0,-38,-58,3,-45,-178,0,91,32,0,-26,-102,0,39,-160,0,72,29,0,-21,-193,3,-41,50,0,-48,-74,0,64,-155,0,-6,-157,0,2,-163,0,-48,-158,0,-31,-155,3,1,5,0,127,-106,3,-15,-218,3,10,-155,0,-44,-110,3,-37,-14,0,-35,-225,3,-86,-42,0,-142,-10,0,63,-209,3,112,-38,3,-54,-135,0,-30,-163,3,121,-143,3,-74,-55,0,-48,-57,0,-14,-150,0,79,-161,0,102,38,0,13,-50,3,-57,205,0,49,-215,3,18,132,0,30,-46,3,-56,-39,0,-48,177,0,88,-192,3,-23,-142,0,-50,-91,3,102,-158,3,-17,129,0,10,-150,0,-89,-154,0,66,-38,3,-84,-215,3,-43,-167,0,48,27,0,7,-5,0,-30,-80,3,-10,-226,3,-34,13,0,-33,-95,0,-10,37,0,-55,-142,0,-88,-48,0,-81,-49,0,1,108,0,-77,-216,3,102,-19,3,21,-146,0,0,145,0,-117,-13,0,44,-42,3,-44,171,0,11,-16,0,12,-143,0,-29,44,0,117,-153,3,102,48,0,-40,-21,0,-120,-41,0,33,-117,3,-136,-8,0,91,63,0,71,-157,0,-51,184,0,-64,-172,0,-23,-187,3,28,-114,3,32,-154,0,23,-47,3,-38,-72,3,-14,-55,3,108,-31,3,-90,-213,3,15,-30,0,-41,-121,3,-35,47,0,-52,-53,0,123,-72,3,-67,-63,0,13,-22,0,2,-99,3,-107,-20,0,125,-128,3,-20,147,0,-92,-34,0,-83,-98,0,-61,61,0,140,-180,3,-51,-178,0,118,-51,3,-80,-163,0,-5,149,0,96,34,0,-99,-143,0,66,90,0,-39,-130,3,-60,-70,0,-115,-202,3,21,-223,3,-49,-33,0,-19,153,0,57,98,0,-95,-108,0,-36,-141,3,78,29,0,92,-31,3,8,103,0,-126,-38,0,69,-205,3,92,-4,3,35,28,0,-58,211,0,-38,27,0,-91,-103,0,-33,5,0,-97,-29,0,134,-157,3,41,-218,3,-100,-114,0,-33,0,0,21,-111,3,-55,197,0,-28,-171,3,-108,-205,3,101,-179,3,59,27,0,-46,52,0,27,124,0,83,72,0,16,-224,3,-103,-127,0,-44,-62,0,-2,11,0,13,-65,0,90,-151,3,10,-10,0,-42,-68,0,108,-175,3,61,-134,3,44,-124,3,0,95,0,22,128,0,-42,-173,0,-41,32,0,-93,-48,0,80,-34,3,-71,-92,0,129,-187,3,-20,-146,0,-23,41,0,-95,-211,3,61,93,0];
const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.25:1;
let W,H,PR,SC,CX,CY;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.parentElement.getBoundingClientRect();W=bounds.width;H=bounds.height;cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
  SC=Math.min(H/6.4,W/4.4);CX=W/2;CY=H/2;}
resize();

// flat dots: blue, red, pink, golden, white
const COLS=['#2f6bff','#ff3b3b','#ff7ac8','#f5b82e','#ffffff'];
const spr=COLS.map(c=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');
  x.beginPath();x.arc(32,32,29,0,6.283);x.fillStyle=c;x.fill();x.lineWidth=2;x.strokeStyle='rgba(60,55,45,.22)';x.stroke();return s;});

// ---- dots: three per traced point (one exact, two jittered) + free orbiting dots
const D=[],ACC=[1,2,4];
for(let i=0;i<P.length;i+=3){
  for(let k=0;k<3;k++){
    const j=k?.03:0;
    const c=Math.random()<.1?ACC[Math.floor(Math.random()*3)]:P[i+2];
    D.push({k:0,x0:P[i]/100+(Math.random()-.5)*j*2,y0:P[i+1]/100+(Math.random()-.5)*j*2,z0:(Math.random()-.5)*.14,c});
  }
}
const SYM=D.length;
for(let i=0;i<150;i++)D.push({k:1,c:[0,1,2,3,4][Math.floor(Math.random()*5)],rx:2+Math.random()*.9,ry:3.1+Math.random()*.7,sp:(.12+Math.random()*.2)*(Math.random()<.5?-1:1),r:Math.random()*6.28});
const N=D.length;
const X=new Float32Array(N),Y=new Float32Array(N),Z=new Float32Array(N),VX=new Float32Array(N),VY=new Float32Array(N),VZ=new Float32Array(N),PH=new Float32Array(N),SX=new Float32Array(N),SY=new Float32Array(N);
for(let i=0;i<N;i++){X[i]=(Math.random()-.5)*9;Y[i]=(Math.random()-.5)*9;Z[i]=(Math.random()-.5)*4;PH[i]=Math.random()*6.283;}

// ---- spatial grid: each dot only checks nearby cells (boids optimisation)
const G=20,CELL=.5,head=new Int32Array(G*G*G),nxt=new Int32Array(N);
const cell=v=>Math.max(0,Math.min(G-1,Math.floor(v/CELL+G/2)));

// ---- interaction
let mx=-9999,my=-9999,drag=false,lx=0,ly=0,dyaw=0,dyV=0,dpitch=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){dyV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.01;dyaw+=dyV;dpitch=Math.max(-.8,Math.min(.8,dpitch+((e.clientY-cv.getBoundingClientRect().top)-ly)*.005));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

let last=performance.now(),T=0;
function frame(now){
  const dt=Math.min((now-last)/1000,.033);last=now;T+=dt;
  if(!drag){dyaw+=dyV;dyV*=.95;dyaw-=dyaw*dt*1.4;dpitch-=dpitch*dt*1.4;}
  const yaw=Math.sin(T*.6)*.45*K0+dyaw,pitch=.08+dpitch,cy_=Math.cos(yaw),sy_=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  // every ~13s the symbol loosens into a free swarm, then re-forms
  const cyc=(T%13)/4.2,loose=cyc<1?Math.pow(Math.sin(Math.PI*cyc),2):0;
  const hb=Math.pow(Math.max(0,Math.sin(T*2.2)),8)*.5+Math.pow(Math.max(0,Math.sin(T*2.2-.9)),8)*.3,bs=1+.02*hb*K0;
  const f=9;

  head.fill(-1);
  for(let i=0;i<N;i++){const c=(cell(X[i])*G+cell(Y[i]))*G+cell(Z[i]);nxt[i]=head[c];head[c]=i;}

  if(burstQ){for(let i=0;i<N;i++){const dx=SX[i]-burstQ.x,dy=SY[i]-burstQ.y,d=Math.hypot(dx,dy)+1,q=Math.max(0,1-d/380);
      const p=q*q*16/Math.max(d/SC,.3);VX[i]+=dx/d*p*(.6+Math.random()*.8);VY[i]+=dy/d*p*(.6+Math.random()*.8);VZ[i]+=(Math.random()-.5)*p*.8;}burstQ=null;}

  const Kk=14*(1-.9*loose),Dd=5.2-2.6*loose;
  for(let i=0;i<N;i++){
    const d=D[i];let tx,ty,tz,K=Kk;
    if(d.k===0){const bx=d.x0*bs,by=d.y0*bs,x1=bx*cy_+d.z0*sy_,z1=-bx*sy_+d.z0*cy_;tx=x1;ty=by*cp-z1*sp;tz=by*sp+z1*cp;}
    else{const a=d.r+T*d.sp*K0,x1=Math.cos(a)*d.rx,z1=Math.sin(a*1.3)*.9,y1=Math.sin(a)*d.ry;tx=x1*cy_+z1*sy_;tz=-x1*sy_+z1*cy_;ty=y1*cp-tz*sp;tz=y1*sp+tz*cp;K=Kk*.25;}
    const ox=Math.sin(T*.9+PH[i]*3)*.03,oy=Math.cos(T*1.1+PH[i]*2)*.03,oz=Math.sin(T*.7+PH[i])*.03;
    let ax=(tx+ox-X[i])*K-VX[i]*Dd,ay=(ty+oy-Y[i])*K-VY[i]*Dd,az=(tz+oz-Z[i])*K-VZ[i]*Dd;
    // boids: separation + alignment
    let sx=0,sy=0,sz=0,avx=0,avy=0,avz=0,n=0;
    const cx=cell(X[i]),cy=cell(Y[i]),cz=cell(Z[i]);
    for(let a=Math.max(0,cx-1);a<=Math.min(G-1,cx+1);a++)for(let b=Math.max(0,cy-1);b<=Math.min(G-1,cy+1);b++)for(let c=Math.max(0,cz-1);c<=Math.min(G-1,cz+1);c++){
      for(let j=head[(a*G+b)*G+c];j>=0;j=nxt[j]){if(j===i)continue;
        const dx=X[i]-X[j],dy=Y[i]-Y[j],dz=Z[i]-Z[j],q=dx*dx+dy*dy+dz*dz;
        if(q<.25){n++;avx+=VX[j];avy+=VY[j];avz+=VZ[j];if(q<.02){const w=.0012/(q+.004);sx+=dx*w;sy+=dy*w;sz+=dz*w;}}}}
    if(n){ax+=sx+(avx/n-VX[i])*(1.2+3*loose);ay+=sy+(avy/n-VY[i])*(1.2+3*loose);az+=sz+(avz/n-VZ[i])*(1.2+3*loose);}
    // swirl and wander while loose, light shimmer otherwise
    ax+=-Y[i]*1.1*loose+Math.sin(T*1.7+PH[i]*7)*(.4+2*loose)*K0;
    ay+=X[i]*1.1*loose+Math.cos(T*1.3+PH[i]*5)*(.4+2*loose)*K0;
    az+=Math.sin(T*1.1+PH[i]*3)*.4*K0;
    // cursor parts the swarm
    const mdx=SX[i]-mx,mdy=SY[i]-my,md=Math.hypot(mdx,mdy);
    if(md<170){const q=1-md/170,p=q*q*90/(md+20)*SC/100;ax+=mdx/(md+1)*p*20;ay+=mdy/(md+1)*p*20;az+=(Math.random()-.5)*q*8;}
    VX[i]+=ax*dt;VY[i]+=ay*dt;VZ[i]+=az*dt;
    const sp2=VX[i]*VX[i]+VY[i]*VY[i]+VZ[i]*VZ[i];if(sp2>196){const k=14/Math.sqrt(sp2);VX[i]*=k;VY[i]*=k;VZ[i]*=k;}
    X[i]+=VX[i]*dt;Y[i]+=VY[i]*dt;Z[i]+=VZ[i]*dt;
    const s=f/(f-Z[i]);SX[i]=CX+X[i]*SC*s;SY[i]=CY+Y[i]*SC*s;
  }

  ctx.clearRect(0,0,W,H);
  for(let i=0;i<N;i++){
    const s=f/(f-Z[i]),depth=Math.max(.25,Math.min(1,(Z[i]+2)/4)),size=SC*.03*s*(D[i].k?1.15:1);
    ctx.globalAlpha=.6+.4*depth;ctx.drawImage(spr[D[i].c],SX[i]-size,SY[i]-size,size*2,size*2);
  }
  ctx.globalAlpha=1;
  for(let b=bursts.length-1;b>=0;b--){const o=bursts[b];o.t+=dt;if(o.t>1){bursts.splice(b,1);continue;}
    ctx.strokeStyle=`rgba(90,110,160,${(1-o.t)*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.t*SC*2.2,0,6.283);ctx.stroke();}
  
}

return {frame,resize};
}

function createDNA(canvas){
const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.25:1;
let W,H,PR,SC,CX,CY;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.parentElement.getBoundingClientRect();W=bounds.width;H=bounds.height;cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
  SC=Math.min(H/8.2,W/3.4);CX=W/2;CY=H/2;}
resize();

// ---- colour sprites (glowing dots)
const COLS=['#2f6bff','#ff3b3b','#ff7ac8','#f5b82e','#ffffff'];   // blue, red, pink, golden, white
const spr=COLS.map(c=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d');
  x.beginPath();x.arc(32,32,29,0,6.283);x.fillStyle=c;x.fill();
  x.lineWidth=2;x.strokeStyle='rgba(60,55,45,.22)';x.stroke();return s;});

// ---- dots: two backbone strands + base-pair rungs
const HEIGHT=6.6,RAD=1.1,TWIST=1.35,M=520,RUNGS=34,PER=7;
const D=[];
for(let s=0;s<2;s++)for(let i=0;i<M;i++)D.push({k:s,y:-HEIGHT/2+(i+Math.random()*.6)*HEIGHT/M,u:0,c:s});
for(let r=0;r<RUNGS;r++){const ry=-HEIGHT/2+(r+.5)*HEIGHT/RUNGS,pair=Math.random()<.5?[2,3]:[4,0],flip=Math.random()<.5;
  for(let j=0;j<PER;j++){const u=.1+.8*(j+.5)/PER;D.push({k:2,y:ry,u,c:(u<.5)!==flip?pair[0]:pair[1]});}}
const N=D.length;
const X=new Float32Array(N),Y=new Float32Array(N),Z=new Float32Array(N),VX=new Float32Array(N),VY=new Float32Array(N),VZ=new Float32Array(N),PH=new Float32Array(N),SX=new Float32Array(N),SY=new Float32Array(N);
for(let i=0;i<N;i++){X[i]=(Math.random()-.5)*6;Y[i]=(Math.random()-.5)*6;Z[i]=(Math.random()-.5)*6;PH[i]=Math.random()*6.283;}

// ---- spatial grid (the boids optimisation): cell = neighbour radius
const G=20,CELL=.5,head=new Int32Array(G*G*G),nxt=new Int32Array(N);
const cell=v=>Math.max(0,Math.min(G-1,Math.floor(v/CELL+G/2)));

// ---- interaction
let mx=-9999,my=-9999,rot=0,rotV=0,pitch=.22,drag=false,lx=0,ly=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){rotV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.012;rot+=rotV;pitch=Math.max(-.9,Math.min(.9,pitch+((e.clientY-cv.getBoundingClientRect().top)-ly)*.005));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

const stars=Array.from({length:110},()=>({x:Math.random(),y:Math.random(),p:Math.random()*6.28,s:Math.random()*1.4+.3}));
const sm=(a,b,x)=>{x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x);};

let last=performance.now(),T=0;
function frame(now){
  const dt=Math.min((now-last)/1000,.033);last=now;T+=dt;
  // auto-rotation + inertia
  if(!drag){rot+=dt*.5*K0+rotV;rotV*=.95;}
  // periodic "loose swarm" phase: dots flock freely, then re-form the helix
  const cyc=(T%13)/4.2,loose=cyc<1?Math.pow(Math.sin(Math.PI*cyc),2):0;
  const hb=Math.pow(Math.max(0,Math.sin(T*2.2)),8)*.5+Math.pow(Math.max(0,Math.sin(T*2.2-.9)),8)*.3;
  const R=RAD*(1+.03*hb*K0),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const f=9,perspective=z=>f/(f-z);

  // build grid
  head.fill(-1);
  for(let i=0;i<N;i++){const c=(cell(X[i])*G+cell(Y[i]))*G+cell(Z[i]);nxt[i]=head[c];head[c]=i;}

  // one-shot burst impulse
  if(burstQ){for(let i=0;i<N;i++){const dx=SX[i]-burstQ.x,dy=SY[i]-burstQ.y,d=Math.hypot(dx,dy)+1,q=Math.max(0,1-d/380);
      const p=q*q*16/Math.max(d/SC,.3);VX[i]+=dx/d*p*(.6+Math.random()*.8);VY[i]+=dy/d*p*(.6+Math.random()*.8);VZ[i]+=(Math.random()-.5)*p*.8;}burstQ=null;}

  const Kk=14*(1-.9*loose),Dd=5.2-2.6*loose;
  for(let i=0;i<N;i++){
    const d=D[i];let th=d.y*TWIST+rot+(d.k===1?Math.PI:0),px,pz;
    if(d.k===2){th=d.y*TWIST+rot;const m=1-2*d.u;px=R*Math.cos(th)*m;pz=R*Math.sin(th)*m;}else{px=R*Math.cos(th);pz=R*Math.sin(th);}
    const py=d.y,tx=px,ty=py*cp-pz*sp,tz=py*sp+pz*cp;
    const ox=Math.sin(T*.9+PH[i]*3)*.05,oy=Math.cos(T*1.1+PH[i]*2)*.05,oz=Math.sin(T*.7+PH[i])*.05;
    let ax=(tx+ox-X[i])*Kk-VX[i]*Dd,ay=(ty+oy-Y[i])*Kk-VY[i]*Dd,az=(tz+oz-Z[i])*Kk-VZ[i]*Dd;
    // boids: separation + alignment among neighbours
    let sx=0,sy=0,sz=0,avx=0,avy=0,avz=0,n=0;
    const cx=cell(X[i]),cy=cell(Y[i]),cz=cell(Z[i]);
    for(let a=Math.max(0,cx-1);a<=Math.min(G-1,cx+1);a++)for(let b=Math.max(0,cy-1);b<=Math.min(G-1,cy+1);b++)for(let c=Math.max(0,cz-1);c<=Math.min(G-1,cz+1);c++){
      for(let j=head[(a*G+b)*G+c];j>=0;j=nxt[j]){if(j===i)continue;
        const dx=X[i]-X[j],dy=Y[i]-Y[j],dz=Z[i]-Z[j],q=dx*dx+dy*dy+dz*dz;
        if(q<.25){n++;avx+=VX[j];avy+=VY[j];avz+=VZ[j];if(q<.045){const w=.0016/(q+.004);sx+=dx*w;sy+=dy*w;sz+=dz*w;}}}}
    if(n){ax+=sx+(avx/n-VX[i])*(1.2+3*loose);ay+=sy+(avy/n-VY[i])*(1.2+3*loose);az+=sz+(avz/n-VZ[i])*(1.2+3*loose);}
    // swarm swirl + wander during loose phase, gentle shimmer otherwise
    ax+=-Z[i]*1.1*loose+Math.sin(T*1.7+PH[i]*7)*(.5+2*loose)*K0;
    ay+=Math.cos(T*1.3+PH[i]*5)*(.5+2*loose)*K0;
    az+=X[i]*1.1*loose+Math.sin(T*1.1+PH[i]*3)*.5*K0;
    // cursor parts the swarm
    const mdx=SX[i]-mx,mdy=SY[i]-my,md=Math.hypot(mdx,mdy);
    if(md<170){const q=1-md/170,p=q*q*90/(md+20)*SC/100;ax+=mdx/(md+1)*p*20;ay+=mdy/(md+1)*p*20;az+=(Math.random()-.5)*q*8;}
    VX[i]+=ax*dt;VY[i]+=ay*dt;VZ[i]+=az*dt;
    const sp2=VX[i]*VX[i]+VY[i]*VY[i]+VZ[i]*VZ[i];if(sp2>196){const k=14/Math.sqrt(sp2);VX[i]*=k;VY[i]*=k;VZ[i]*=k;}
    X[i]+=VX[i]*dt;Y[i]+=VY[i]*dt;Z[i]+=VZ[i]*dt;
    const s=perspective(Z[i]);SX[i]=CX+X[i]*SC*s;SY[i]=CY+Y[i]*SC*s;
  }

  // ---- draw (trails via fade)
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<N;i++){
    const d=D[i],s=perspective(Z[i]),depth=Math.max(.25,Math.min(1,(Z[i]+RAD*1.6)/(RAD*3.2)));
    const size=SC*.05*s*(d.k===2?.85:1);
    ctx.globalAlpha=.6+.4*depth;
    ctx.drawImage(spr[d.c],SX[i]-size,SY[i]-size,size*2,size*2);
  }
  // click shockwaves
  ctx.globalAlpha=1;
  for(let b=bursts.length-1;b>=0;b--){const o=bursts[b];o.t+=dt;if(o.t>1){bursts.splice(b,1);continue;}
    ctx.strokeStyle=`rgba(90,110,160,${(1-o.t)*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.t*SC*2.2,0,6.283);ctx.stroke();}
  
}

return {frame,resize};
}

const stage=document.querySelector('.hero');
const primary=document.getElementById('swarm');
if(!stage||!primary||!window.__warden)return;
const makeLayer=(name)=>{
 const cv=document.createElement('canvas');
 cv.className='precision-sculpture precision-'+name;
 cv.setAttribute('aria-hidden','true');
 Object.assign(cv.style,{
  position:'absolute',inset:'0',width:'100%',height:'100%',zIndex:'3',
  display:'none',pointerEvents:'none',cursor:'crosshair',touchAction:'none'
 });
 stage.appendChild(cv);
 return cv;
};
const lawCanvas=makeLayer('law');
const dnaCanvas=makeLayer('dna');
const lawModel=createWarrior(lawCanvas);
const dnaModel=createDNA(dnaCanvas);
let lastScene=-1;
function syncScene(){
 const scene=window.__warden.scene;
 if(scene===lastScene)return scene;
 lastScene=scene;
 const activeLaw=scene===1,activeDNA=scene===2;
 lawCanvas.style.display=activeLaw?'block':'none';
 dnaCanvas.style.display=activeDNA?'block':'none';
 lawCanvas.style.pointerEvents=activeLaw?'auto':'none';
 dnaCanvas.style.pointerEvents=activeDNA?'auto':'none';
 primary.style.pointerEvents=(activeLaw||activeDNA)?'none':'auto';
 primary.style.opacity=(activeLaw||activeDNA)?'0':'1';
 if(activeLaw)lawModel.resize();
 if(activeDNA)dnaModel.resize();
 return scene;
}
window.addEventListener('resize',()=>{
 if(lastScene===1)lawModel.resize();
 else if(lastScene===2)dnaModel.resize();
});
function animate(now){
 const scene=syncScene();
 if(scene===1)lawModel.frame(now);
 if(scene===2)dnaModel.frame(now);
 requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
window.WardenclyffePrecision={get activeScene(){return lastScene},get source(){return 'owner-supplied particle demos'}};
})();
