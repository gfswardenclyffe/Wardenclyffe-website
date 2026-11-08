/* Wardenclyffe / Starling murmuration: decorative, original Canvas artwork.
 * Birds flock in one shared living system. No third-party assets or tracking.
 */
(()=>{'use strict';
const canvas=document.querySelector('.starling-canvas');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const shell=canvas.parentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)');
const count=140, birds=[];let w=0,h=0,dpr=1,last=0,frame=0,moving=!reduced.matches,visible=true,request=0;
const pointer={x:-1e4,y:-1e4,active:false};
function rng(i){return((Math.sin(i*97.13+2.6)*43758.5453)%1+1)%1}
function init(){birds.length=0;for(let i=0;i<count;i++){const a=i*2.39996,b=rng(i+60);birds.push({x:w*(.25+.50*rng(i)),y:h*(.26+.45*b),vx:(rng(i+11)-.5)*1.5,vy:(rng(i+71)-.5)*1.2,size:.55+1.0*rng(i+101),phase:rng(i+15)*Math.PI*2,gold:rng(i+222)>.83})}}
function size(){const r=shell.getBoundingClientRect();w=Math.max(100,r.width);h=Math.max(150,r.height);dpr=Math.min(window.devicePixelRatio||1,1.6);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);init();if(!moving)draw()}
function step(t){const cell=46,grid=new Map();for(let i=0;i<birds.length;i++){const b=birds[i],key=((b.x/cell)|0)+','+((b.y/cell)|0);if(!grid.has(key))grid.set(key,[]);grid.get(key).push(i)}
const tm=t*.00015,centerX=w*(.5+.16*Math.sin(tm*.6)),centerY=h*(.46+.09*Math.sin(tm*.42));
for(let i=0;i<birds.length;i++){
const b=birds[i];let ax=0,ay=0,sepX=0,sepY=0,alignX=0,alignY=0,coX=0,coY=0,n=0;
const gx=(b.x/cell)|0,gy=(b.y/cell)|0;
for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const around=grid.get((gx+dx)+','+(gy+dy));if(!around)continue;for(const j of around){if(j===i)continue;const o=birds[j],ddx=o.x-b.x,ddy=o.y-b.y,d2=ddx*ddx+ddy*ddy;if(d2>1800)continue;if(d2<180&&d2>0){sepX-=ddx/d2*9;sepY-=ddy/d2*9}alignX+=o.vx;alignY+=o.vy;coX+=o.x;coY+=o.y;n++}}
if(n){ax+=(alignX/n-b.vx)*.009+(coX/n-b.x)*.00023+sepX*.05;ay+=(alignY/n-b.vy)*.009+(coY/n-b.y)*.00023+sepY*.05}
const targetAngle=tm*2.8+i*.047;const tx=centerX+Math.cos(targetAngle)*Math.min(w*.33,210),ty=centerY+Math.sin(targetAngle*1.23)*h*.21;
ax+=(tx-b.x)*.00036+Math.sin(tm*4.0+i*.041)*.006+ .008;ay+=(ty-b.y)*.00037+Math.cos(tm*4.4+i*.033)*.007;
if(pointer.active){const px=b.x-pointer.x,py=b.y-pointer.y,d=Math.hypot(px,py);if(d<100&&d>0){const f=(100-d)/100;ax+=px/d*f*.13;ay+=py/d*f*.13}}
if(b.x<10)ax+=.09;if(b.x>w-10)ax-=.09;if(b.y<12)ay+=.1;if(b.y>h-25)ay-=.1;
b.vx=Math.max(-2.1,Math.min(2.1,(b.vx+ax)*.988));b.vy=Math.max(-1.8,Math.min(1.8,(b.vy+ay)*.988));b.x+=b.vx;b.y+=b.vy;
}}
function draw(time=0){ctx.clearRect(0,0,w,h);
// Warm reflected light draws the flock closer to the sky rather than making lines of glowing dots.
for(let i=0;i<birds.length;i++){
const b=birds[i],s=b.size,rot=Math.atan2(b.vy,b.vx);const flap=Math.sin(time*.012+b.phase)*2.0;
ctx.save();ctx.translate(b.x,b.y);ctx.rotate(rot);ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=(b.gold?1.55:1.25)*s;
ctx.strokeStyle=b.gold?'rgba(255,224,153,.9)':'rgba(18,69,79,.78)';
ctx.beginPath();ctx.moveTo(-4*s,-1*s);ctx.quadraticCurveTo(-1.7*s,-4*s-flap*s,1*s,-.2*s);ctx.quadraticCurveTo(4*s,-4*s+flap*s,6*s,-1.5*s);ctx.stroke();
if(b.gold&&i%4===0){ctx.fillStyle='rgba(252,220,147,.12)';ctx.beginPath();ctx.arc(0,0,8*s,0,Math.PI*2);ctx.fill()}
ctx.restore();}
}
function loop(time){request=0;if(!moving||!visible)return;if(time-last<28){request=requestAnimationFrame(loop);return;}last=time;step(time);draw(time);request=requestAnimationFrame(loop)}
function restart(){if(request)cancelAnimationFrame(request);request=0;if(moving&&visible)request=requestAnimationFrame(loop);else draw(0)}
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.active=true;pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top},{passive:true});canvas.addEventListener('pointerleave',()=>pointer.active=false);
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;restart()});
reduced.addEventListener('change',e=>{moving=!e.matches;restart()});
if('ResizeObserver'in window)new ResizeObserver(size).observe(shell);else window.addEventListener('resize',size);
size();restart();
})();
