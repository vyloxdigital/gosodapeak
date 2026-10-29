/* SodaPeak — Main JS | v2 */
(function(){
  'use strict';

  /* ── Mobile Nav ── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  if(hamburger && mobileNav){
    hamburger.addEventListener('click',function(){
      var open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    /* Close mobile nav when clicking outside */
    document.addEventListener('click',function(e){
      if(!hamburger.contains(e.target) && !mobileNav.contains(e.target)){
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      }
    });
  }

  /* ── Sticky Nav Shadow — passive, no forced reflow ── */
  var nav = document.querySelector('.site-nav');
  if(nav){
    var ticking = false;
    window.addEventListener('scroll',function(){
      if(!ticking){
        window.requestAnimationFrame(function(){
          nav.style.boxShadow = window.scrollY > 60
            ? '0 4px 30px rgba(0,0,0,0.5)'
            : 'none';
          ticking = false;
        });
        ticking = true;
      }
    },{passive:true});
  }

  /* ── FAQ Accordion ── */
  /* Supports both .faq-q (most pages) and .faq-question (blog comparison) classes */
  var faqBtns = document.querySelectorAll('.faq-q, .faq-question');
  faqBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var item = this.closest('.faq-item');
      if(!item) return;
      var isOpen = item.classList.contains('open');
      /* Close ALL items on this page */
      document.querySelectorAll('.faq-item').forEach(function(el){
        el.classList.remove('open');
        var ans = el.querySelector('.faq-a, .faq-answer');
        if(ans) ans.removeAttribute('hidden');
        var b = el.querySelector('.faq-q, .faq-question');
        if(b) b.setAttribute('aria-expanded','false');
      });
      /* Open this one if it was closed */
      if(!isOpen){
        item.classList.add('open');
        var ans = item.querySelector('.faq-a, .faq-answer');
        if(ans) ans.removeAttribute('hidden');
        this.setAttribute('aria-expanded','true');
      }
    });
  });

  /* ── Smooth Scroll — uses scrollIntoView to avoid forced reflow ── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click',function(e){
      var href = this.getAttribute('href');
      if(href === '#') return;
      var target = document.querySelector(href);
      if(target){
        e.preventDefault();
        /* scrollIntoView avoids getBoundingClientRect forced reflow */
        target.scrollIntoView({behavior:'smooth',block:'start'});
        if(mobileNav) mobileNav.classList.remove('open');
      }
    });
  });

  /* ── Lazy Load Images — no forced reflow ── */
  if('IntersectionObserver' in window){
    var imgs = document.querySelectorAll('img[data-src]');
    if(imgs.length){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      },{rootMargin:'300px'});
      imgs.forEach(function(img){ observer.observe(img); });
    }
  } else {
    document.querySelectorAll('img[data-src]').forEach(function(img){
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  /* ── CLS Fix: Reserve font space before fonts load ── */
  /* This prevents the FOUT-caused layout shift by marking fonts as loaded
     once they arrive, avoiding a second render pass */
  if('fonts' in document){
    document.fonts.ready.then(function(){
      document.documentElement.classList.add('fonts-loaded');
    });
  }

})();
