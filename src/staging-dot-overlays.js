/* Staging-only: display the owner's original dot demos during chapters 04 and 05.
 * Preserve the existing five-chapter runtime, site layers, and page translations.
 * Never load this file on production.
 */
(()=>{'use strict';
window.WARDEN_STAGING_DOT_OVERRIDES=true;
const stage=document.querySelector('.hero');
const primary=document.getElementById('swarm');
if(!stage||!primary||!window.__warden)return;
const source=document.currentScript?.src||location.href;
function makeFrame(name,file,title){
 const frame=document.createElement('iframe');
 frame.className='warden-staging-dots-'+name;
 frame.title=title;
 frame.setAttribute('aria-hidden','true');
 frame.setAttribute('tabindex','-1');
 frame.setAttribute('referrerpolicy','same-origin');
 frame.setAttribute('scrolling','no');
 frame.dataset.source=new URL(file,source).href;
 Object.assign(frame.style,{
   position:'absolute',inset:'0',width:'100%',height:'100%',
   border:'0',background:'transparent',zIndex:'3',
   display:'none',pointerEvents:'none'
 });
 stage.appendChild(frame);
 return frame;
}
const starlings=makeFrame('starlings','staging-dots-starlings.html','Living starling murmuration');
const heart=makeFrame('heart','staging-dots-heart.html','Living anatomical heart');
let last=-1;
function update(){
 const scene=window.__warden.scene;
 if(scene!==last){
   last=scene;
   const showStarlings=scene===3,showHeart=scene===4;
   for(const [frame,active] of [[starlings,showStarlings],[heart,showHeart]]){
     if(active&&!frame.src)frame.src=frame.dataset.source;
     frame.style.display=active?'block':'none';
     frame.style.pointerEvents=active?'auto':'none';
   }
   // Precision controller remains responsible for chapter 02/03.
   if(showStarlings||showHeart){
     primary.style.opacity='0';
     primary.style.pointerEvents='none';
   }else if(scene===0){
     primary.style.opacity='1';
     primary.style.pointerEvents='auto';
   }
 }
 requestAnimationFrame(update);
}
requestAnimationFrame(update);
window.WardenclyffeStagingDots={get activeChapter(){return last},source:'original uploaded dot animations',stagingOnly:true};
})();
