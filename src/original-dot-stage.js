/* Only switches between the TWO EXACT user-supplied HTML demos.
 * No particle code from either supplied file is altered or reimplemented. */
(()=>{'use strict';
 const host=document.querySelector('.original-dot-stage');
 if(!host)return;
 const frames=[...host.querySelectorAll('iframe[data-original-dots]')];
 const buttons=[...document.querySelectorAll('button[data-dot-scene]')];
 if(frames.length!==2||buttons.length!==2)return;
 let active=0;
 function show(n){
  active=n;
  frames.forEach((frame,i)=>{frame.hidden=i!==active;frame.setAttribute('aria-hidden',String(i!==active));});
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===active)));
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>show(i)));
 show(0);
})();
