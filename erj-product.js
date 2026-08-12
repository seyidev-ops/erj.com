/* Shared product-page behaviour: scroll reveals, countdown timers, PWA register.
   Path-aware via window.ERJ_NAV.base. */
(function(){
  var base=(window.ERJ_NAV&&typeof window.ERJ_NAV.base==='string')?window.ERJ_NAV.base:'';
  /* reveals */
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var obs=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){
        var sibs=[].slice.call(e.target.parentNode.querySelectorAll(':scope > .reveal'));
        var idx=sibs.indexOf(e.target);
        e.target.style.transitionDelay=(Math.max(0,idx)*0.05)+'s';
        e.target.classList.add('in'); obs.unobserve(e.target);
      }});},{threshold:0.14});
    els.forEach(function(e){obs.observe(e);});
  } else { els.forEach(function(e){e.classList.add('in');}); }
  /* countdown */
  var pad=function(n){return String(n).padStart(2,'0');};
  var panels=[].slice.call(document.querySelectorAll('[data-deadline]')).map(function(p){
    return {el:p,closedLabel:p.dataset.closedLabel||'',done:false,
      deadline:new Date(p.dataset.deadline),nodes:{
      d:p.querySelector('[data-k="d"]'),h:p.querySelector('[data-k="h"]'),
      m:p.querySelector('[data-k="m"]'),s:p.querySelector('[data-k="s"]')}};
  }).filter(function(p){return p.nodes.d;});
  if(panels.length){
    var tick=function(){panels.forEach(function(p){
      var diff=p.deadline-new Date();
      if(diff<=0){
        diff=0;
        if(!p.done){
          p.done=true;
          p.el.classList.add('is-closed');
          if(p.closedLabel){
            var lbl=p.el.querySelector('[data-lbl]');
            if(!lbl){
              var scope=p.el.parentNode;
              while(scope&&scope!==document.body&&!lbl){lbl=scope.querySelector('[data-lbl]');scope=scope.parentNode;}
            }
            if(lbl)lbl.textContent=p.closedLabel;
          }
        }
      }
      var d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),
          m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
      if(p.nodes.d)p.nodes.d.textContent=pad(d); if(p.nodes.h)p.nodes.h.textContent=pad(h);
      if(p.nodes.m)p.nodes.m.textContent=pad(m); if(p.nodes.s)p.nodes.s.textContent=pad(s);
    });};
    tick(); setInterval(tick,1000);
  }
  /* PWA */
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){navigator.serviceWorker.register(base+'sw.js').then(function(reg){reg.update();}).catch(function(){});});
    /* NO controllerchange -> location.reload() HERE. That listener is what made
       the home page white out for a few seconds mid-scroll: the worker takes
       control shortly after first load, controllerchange fires, and the page
       reloads under the reader — restoring scroll position, so it looks like a
       rendering glitch at whatever section they had reached rather than a
       reload. It was removed from all 16 HTML pages in v88, but this shared
       module carried its own duplicate and kept firing on the 12 pages that
       load it. The fetch handler is network-first for HTML, so a published
       change is already live on the next page view without any reload. */
  }
})();
