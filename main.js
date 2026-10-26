(function(){
var root=document.documentElement;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;

/* ---------- mobile menu ---------- */
var d=document.getElementById('drawer'),o=document.getElementById('menu-open'),c=document.getElementById('menu-close');
function t(s){d.classList.toggle('open',s);o.setAttribute('aria-expanded',s);document.body.style.overflow=s?'hidden':''}
if(o){o.onclick=function(){t(true)};c.onclick=function(){t(false)};d.addEventListener('click',function(e){if(e.target.tagName==='A')t(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape')t(false)})}
document.addEventListener('error',function(e){if(e.target.tagName==='IMG'&&e.target.closest('.ph'))e.target.style.display='none'},true);

/* ---------- catalog filter ---------- */
var f=document.getElementById('filters');
if(f){var items=document.querySelectorAll('.item');
function apply(k){f.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.filter===k)});items.forEach(function(i){i.hidden=!(k==='alle'||i.dataset.cat===k);if(!i.hidden)i.classList.add('in')})}
f.addEventListener('click',function(e){var b=e.target.closest('button');if(b)apply(b.dataset.filter)});
var h=location.hash.slice(1);if(h&&document.querySelector('.item[data-cat="'+h+'"]'))setTimeout(function(){document.getElementById(h).scrollIntoView()},50)}

/* ---------- header + scroll progress + 3D stage (cheap, rAF-throttled) ---------- */
var top=document.querySelector('.top'),stage=document.querySelector('.stage'),bar=document.createElement('div'),tick=false;
bar.className='progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
function onScroll(){
  var y=window.scrollY||0,max=root.scrollHeight-window.innerHeight;
  bar.style.setProperty('--p',max>0?Math.min(1,y/max).toFixed(4):0);
  if(top)top.classList.toggle('stuck',y>24);
  if(stage&&!reduce){
    var r=stage.getBoundingClientRect(),vh=window.innerHeight;
    var p=1-Math.min(1,Math.max(0,(r.top+r.height/2)/(vh+r.height/2)));
    stage.style.setProperty('--sp',p.toFixed(3));
  }
  tick=false;
}
window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});
window.addEventListener('resize',onScroll);onScroll();

if(reduce)return;

/* ---------- 3D scroll reveal ---------- */
var sel=['.hero>div','.card','.vals>div','.steps li','.atelier .ph','.atelier .box','.band>*','.item','.split section','.ph-head','.prose-grid>*','.chan li','.aside','.quote','.sec>.wrap>.head','.sec>.wrap>.h2','.two>*','.legal>*'].join(',');
var els=[].slice.call(document.querySelectorAll(sel));
if('IntersectionObserver' in window&&els.length){
  root.classList.add('rv-on');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(el){
    el.classList.add('rv');
    if(el.parentElement)el.parentElement.classList.add('rvp');
    var sibs=el.parentElement?[].slice.call(el.parentElement.children).filter(function(s){return s.classList.contains('rv')||els.indexOf(s)>-1}):[];
    var i=Math.max(0,sibs.indexOf(el));
    el.style.setProperty('--d',(Math.min(i,5)*.09).toFixed(2)+'s');
    io.observe(el);
  });
}

/* ---------- 3D tilt with moving light ---------- */
if(fine){
  function tilt(el,max,target){
    var ph=target||el;
    el.classList.add('tilt');
    el.addEventListener('pointerenter',function(){el.classList.add('live')});
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      el.style.setProperty('--ry',((x-.5)*2*max).toFixed(2)+'deg');
      el.style.setProperty('--rx',((.5-y)*2*max).toFixed(2)+'deg');
      var g=el.querySelector('.ph')||el;
      g.style.setProperty('--mx',(x*100).toFixed(1)+'%');g.style.setProperty('--my',(y*100).toFixed(1)+'%');
    });
    el.addEventListener('pointerleave',function(){el.classList.remove('live');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
  }
  document.querySelectorAll('.card').forEach(function(el){tilt(el,7)});
  document.querySelectorAll('.item .ph').forEach(function(el){tilt(el,6)});
  document.querySelectorAll('.atelier .ph,.prose-grid .ph').forEach(function(el){tilt(el,3)});
}

/* ---------- hero: depth, parallax and embers ---------- */
var hero=document.querySelector('.hero');
if(hero){
  var fig=hero.children[1];
  if(fig){
    fig.classList.add('hero-fig');
    if(fine){
      hero.addEventListener('pointermove',function(e){
        var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        fig.style.setProperty('--ry',(-4+(x-.5)*16).toFixed(2)+'deg');
        fig.style.setProperty('--rx',((.5-y)*10).toFixed(2)+'deg');
        var ph=fig.querySelector('.ph');if(ph){ph.style.setProperty('--mx',(x*100).toFixed(1)+'%');ph.style.setProperty('--my',(y*100).toFixed(1)+'%')}
      });
      hero.addEventListener('pointerleave',function(){fig.style.removeProperty('--rx');fig.style.removeProperty('--ry')});
    }
  }
  var sp=document.createElement('div');sp.className='sparks';sp.setAttribute('aria-hidden','true');
  for(var n=0;n<16;n++){
    var s=document.createElement('i');
    s.style.left=(Math.random()*100).toFixed(1)+'%';
    s.style.setProperty('--s',(2+Math.random()*4).toFixed(1)+'px');
    s.style.setProperty('--t',(7+Math.random()*8).toFixed(1)+'s');
    s.style.setProperty('--d',(-Math.random()*12).toFixed(1)+'s');
    s.style.setProperty('--x',((Math.random()-.5)*160).toFixed(0)+'px');
    sp.appendChild(s);
  }
  hero.insertBefore(sp,hero.firstChild);
}
})();
