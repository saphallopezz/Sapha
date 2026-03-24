/* ============================================================
   SAPHAL LAMSAL — SHARED JS
   ============================================================ */

// ── CURSOR ──
(function(){
  const dot = document.createElement('div'); dot.id = 'cursor-dot';
  const ring = document.createElement('div'); ring.id = 'cursor-ring';
  document.body.append(dot, ring);
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){
    rx += (mx-rx)*.13; ry += (my-ry)*.13;
    dot.style.cssText = `left:${mx}px;top:${my}px`;
    ring.style.cssText = `left:${rx}px;top:${ry}px`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.tilt-card,.skill-pill,.cert-card,.exp-card,.glass-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
})();

// ── NAV SCROLL ──
(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return;
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled', window.scrollY>40), {passive:true});
})();

// ── HAMBURGER ──
(function(){
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if(!btn||!drawer) return;
  btn.addEventListener('click',()=>{
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    btn.classList.remove('open'); drawer.classList.remove('open');
  }));
})();

// ── SCROLL REVEAL ──
(function(){
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'), i * 90);
        io.unobserve(e.target);
      }
    });
  },{threshold:.12});
  els.forEach(el=>io.observe(el));
})();

// ── PROGRESS BARS ──
(function(){
  document.querySelectorAll('.prog-track').forEach(track=>{
    const io = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){ track.classList.add('animated'); io.disconnect(); }
    },{threshold:.4});
    io.observe(track);
  });
})();

// ── COUNTER ──
(function(){
  document.querySelectorAll('.counter').forEach(el=>{
    const target = parseInt(el.dataset.target);
    const sfx = el.dataset.suffix||'';
    const io = new IntersectionObserver(entries=>{
      if(!entries[0].isIntersecting) return;
      let n=0; const step=Math.max(1,Math.ceil(target/60));
      const t=setInterval(()=>{
        n=Math.min(n+step,target);
        el.textContent=n+sfx;
        if(n>=target) clearInterval(t);
      },28);
      io.disconnect();
    });
    io.observe(el);
  });
})();

// ── 3D TILT CARDS ──
(function(){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    const inner = card.querySelector('.tilt-inner') || card;
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width/2; const cy = r.height/2;
      const rotX = ((y-cy)/cy)*12;
      const rotY = ((x-cx)/cx)*-12;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
      // glow follows cursor
      const glow = card.querySelector('.card-glow');
      if(glow){ glow.style.left=x+'px'; glow.style.top=y+'px'; }
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition='transform .6s cubic-bezier(.23,1,.32,1)';
      setTimeout(()=>card.style.transition='',650);
    });
    card.addEventListener('mouseenter',()=>{ card.style.transition='none'; });
  });
})();

// ── TYPED EFFECT ──
(function(){
  const el = document.querySelector('[data-typed]');
  if(!el) return;
  const words = el.dataset.typed.split('|');
  let wi=0,ci=0,del=false;
  function tick(){
    const w=words[wi];
    el.textContent = del ? w.slice(0,--ci) : w.slice(0,++ci);
    let spd = del ? 55 : 100;
    if(!del && ci===w.length){ spd=2000; del=true; }
    else if(del && ci===0){ del=false; wi=(wi+1)%words.length; spd=350; }
    setTimeout(tick, spd);
  }
  tick();
})();

// ── THANK YOU MODAL ──
window.showThankYou = function(){
  const m = document.getElementById('thankModal');
  if(m){ m.classList.add('show'); }
};
window.closeThankYou = function(){
  const m = document.getElementById('thankModal');
  if(m){ m.classList.remove('show'); }
};
document.addEventListener('click', e=>{
  const m = document.getElementById('thankModal');
  if(m && e.target===m) closeThankYou();
});

// ── COPY CITATION ──
window.copyCitation = function(){
  const text = `Lamsal, S. (2026). Exploring the Effectiveness of Blockchain in Enhancing Data Security in Healthcare Systems. Zenodo. https://doi.org/10.5281/zenodo.18247744`;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = document.getElementById('copyBtn');
    if(btn){ btn.textContent='✓ Copied!'; setTimeout(()=>btn.textContent='Copy Citation',2000); }
  });
};
