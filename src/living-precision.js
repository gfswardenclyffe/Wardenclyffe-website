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

function createHeart(canvas){
// From the user-provided Living Heart.html: anatomy, palette and motion formulas preserved.
const cv=canvas,ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K0=reduce?0.25:1;
let W,H,PR,SC,CX,CY;
function resize(){PR=Math.min(devicePixelRatio||1,2);const bounds=cv.parentElement.getBoundingClientRect();W=bounds.width;H=bounds.height;cv.width=W*PR;cv.height=H*PR;ctx.setTransform(PR,0,0,PR,0,0);
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

const DOTS=[],hash=new Map(),SP=.118;
function tryAdd(o,d=SP){const p=o.p,ix=Math.floor(p[0]/d),iy=Math.floor(p[1]/d),iz=Math.floor(p[2]/d);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++){const l=hash.get((ix+a+50)*10000+(iy+b+50)*100+iz+c+50);
    if(l)for(const q of l)if((q[0]-p[0])**2+(q[1]-p[1])**2+(q[2]-p[2])**2<d*d)return;}
  const k=(ix+50)*10000+(iy+50)*100+iz+50;if(!hash.has(k))hash.set(k,[]);hash.get(k).push(p);DOTS.push(o);}
const pick=(base,pk=.1)=>{const r=Math.random();return r<pk?2:r<pk+.03?4:base;};

// coronary arteries (golden), placed first so they stay clean lines
function coronary(t0,t1,p0,p1,n){for(let i=0;i<=n;i++){const u=i/n,t=t0+(t1-t0)*u,ph=p0+(p1-p0)*u,p=surf(t,ph,1.035);tryAdd({p,k:0,c:3,t},.075);}}
coronary(-.78,.92,1.2,1.2,70);          // left anterior descending
coronary(-.8,-.82,1.2,-1.8,60);         // circumflex
coronary(-.82,-.8,1.45,3.6,70);          // right coronary
coronary(-.5,.5,.95,.85,20);
// great vessels and veins
function tube(pts,r0,r1,n,base,art,pk=.08){for(let i=0;i<n;i++){const u=Math.random(),c=CR(pts,u),tg=nrm(sub(CR(pts,u+.01),CR(pts,u-.01))),
    ax=Math.abs(tg[1])<.9?[0,1,0]:[1,0,0],N=nrm(cross(tg,ax)),Bn=cross(tg,N),ph=Math.random()*6.283,r=r0+(r1-r0)*u,
    p=add(c,add(mul(N,Math.cos(ph)*r),mul(Bn,Math.sin(ph)*r)));
    if(insideV(p,.9)||CHAMBERS.some(e=>insideE(p,e,.8)))continue;tryAdd({p,k:2,c:pick(base,pk),ctr:c,u,art});}}
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
    if(e!==RA&&e!==LA&&false)continue;tryAdd({p,k:1,c:pick(e.col,.12),ctr:e.c});}}
ell(RA,3500);ell(LA,3500);ell(RAu,900);ell(LAu,900);
// ventricles: right (blue, anterior) and left (red, posterior-left)
const G0=1.2,RVW=3.0;
for(let i=0;i<9000;i++){const t=-.88+1.88*Math.random(),ph=Math.random()*6.283;if(Math.random()>rV(t)*1.1)continue;
  const p=surf(t,ph);if(CHAMBERS.some(e=>insideE(p,e,.85)))continue;
  const rv=(((ph-G0)%6.283)+6.283)%6.283<RVW;tryAdd({p,k:0,c:pick(rv?0:1,.15),t});}
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
const GR=24,CELL=.5,head=new Int32Array(GR*GR*GR),nxt=new Int32Array(N),cell=v=>Math.max(0,Math.min(GR-1,Math.floor(v/CELL+GR/2)));

let mx=-9999,my=-9999,drag=false,lx=0,ly=0,dyaw=0,dyV=0,dpitch=0,bursts=[],burstQ=null;
cv.addEventListener('pointermove',e=>{mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);if(drag){dyV=((e.clientX-cv.getBoundingClientRect().left)-lx)*.01;dyaw+=dyV;dpitch=Math.max(-.8,Math.min(.8,dpitch+((e.clientY-cv.getBoundingClientRect().top)-ly)*.005));lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);}});
cv.addEventListener('pointerdown',e=>{drag=true;lx=(e.clientX-cv.getBoundingClientRect().left);ly=(e.clientY-cv.getBoundingClientRect().top);mx=(e.clientX-cv.getBoundingClientRect().left);my=(e.clientY-cv.getBoundingClientRect().top);cv.setPointerCapture(e.pointerId);burstQ={x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top)};bursts.push({x:(e.clientX-cv.getBoundingClientRect().left),y:(e.clientY-cv.getBoundingClientRect().top),t:0});});
cv.addEventListener('pointerup',()=>drag=false);
cv.addEventListener('pointerleave',()=>{if(!drag){mx=my=-9999;}});

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
        if(q<.25){n++;avx+=VX[j];avy+=VY[j];avz+=VZ[j];if(q<.014){const w=.0009/(q+.004);sx+=dx*w;sy+=dy*w;sz+=dz*w;}}}}
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
  for(let i=0;i<N;i++){
    const s=f/(f-Z[i]),depth=Math.max(0,Math.min(1,(Z[i]+1.3)/2.6)),k=DOTS[i].k,size=SC*(k===3?.026:.033)*s;
    ctx.globalAlpha=.22+.78*depth*depth;ctx.drawImage(spr[DOTS[i].c],SX[i]-size,SY[i]-size,size*2,size*2);
  }
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
const heartCanvas=makeLayer('heart');
const lawModel=createWarrior(lawCanvas);
const dnaModel=createDNA(dnaCanvas);
// Heart is initialized only on chapter 05; no expensive anatomy generation on initial load.
let heartModel=null;
let lastScene=-1;
function syncScene(){
 const scene=window.__warden.scene;
 if(scene===lastScene)return scene;
 lastScene=scene;
 const activeLaw=scene===1,activeDNA=scene===2,activeHeart=scene===4&&!window.WARDEN_STAGING_DOT_OVERRIDES;
 if(activeHeart&&!heartModel)heartModel=createHeart(heartCanvas);
 lawCanvas.style.display=activeLaw?'block':'none';
 dnaCanvas.style.display=activeDNA?'block':'none';
 heartCanvas.style.display=activeHeart?'block':'none';
 lawCanvas.style.pointerEvents=activeLaw?'auto':'none';
 dnaCanvas.style.pointerEvents=activeDNA?'auto':'none';
 heartCanvas.style.pointerEvents=activeHeart?'auto':'none';
 primary.style.pointerEvents=(activeLaw||activeDNA||activeHeart)?'none':'auto';
 primary.style.opacity=(activeLaw||activeDNA||activeHeart)?'0':'1';
 if(activeLaw)lawModel.resize();
 if(activeDNA)dnaModel.resize();
 if(activeHeart)heartModel.resize();
 return scene;
}
window.addEventListener('resize',()=>{
 if(lastScene===1)lawModel.resize();
 else if(lastScene===2)dnaModel.resize();
 else if(lastScene===4&&heartModel)heartModel.resize();
});
function animate(now){
 const scene=syncScene();
 if(scene===1)lawModel.frame(now);
 if(scene===2)dnaModel.frame(now);
 if(scene===4&&heartModel)heartModel.frame(now);
 requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
window.WardenclyffePrecision={get activeScene(){return lastScene},get source(){return 'owner-supplied Law, DNA, and Living Heart particle demos'}};
})();
