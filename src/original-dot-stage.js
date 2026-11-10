/* The supplied HTML files run unchanged inside an iframe.
 * This only swaps the iframe URL when the user selects either original. */
(()=>{'use strict';
 const frame=document.querySelector('#original-dot-frame');
 const buttons=[...document.querySelectorAll('button[data-dot-scene]')];
 if(!frame||buttons.length!==2)return;
 function show(i){
  const path=buttons[i].dataset.dotScene;
  if(frame.getAttribute('src')!==path)frame.setAttribute('src',path);
  buttons.forEach((b,index)=>b.setAttribute('aria-pressed',String(index===i)));
  frame.title=buttons[i].textContent.trim()+' animation';
 }
 buttons.forEach((b,i)=>b.addEventListener('click',()=>show(i)));
 show(0);
})();
