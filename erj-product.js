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
    return {deadline:new Date(p.dataset.deadline),nodes:{
      d:p.querySelector('[data-k="d"]'),h:p.querySelector('[data-k="h"]'),
      m:p.querySelector('[data-k="m"]'),s:p.querySelector('[data-k="s"]')}};
  }).filter(function(p){return p.nodes.d;});
  if(panels.length){
    var tick=function(){panels.forEach(function(p){
      var diff=p.deadline-new Date(); if(diff<0)diff=0;
      var d=Math.floor(diff/86400000),h=Math.floor((diff%86400000)/3600000),
          m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
      if(p.nodes.d)p.nodes.d.textContent=pad(d); if(p.nodes.h)p.nodes.h.textContent=pad(h);
      if(p.nodes.m)p.nodes.m.textContent=pad(m); if(p.nodes.s)p.nodes.s.textContent=pad(s);
    });};
    tick(); setInterval(tick,1000);
  }
  /* PWA */
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){navigator.serviceWorker.register(base+'sw.js').catch(function(){});});
  }
})();
