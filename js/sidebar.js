(function(){
  'use strict';
  // lightweight focus trap + ESC-to-close for the injected sidebar
  function trapFocus(container){
    var FOCUSABLE = 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    var nodes = [];
    function update(){ nodes = Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE)); }
    update();
    function handleKey(e){
      if(e.key !== 'Tab') return;
      update();
      if(nodes.length === 0) return;
      var first = nodes[0];
      var last = nodes[nodes.length-1];
      if(e.shiftKey){
        if(document.activeElement === first){ e.preventDefault(); last.focus(); }
      } else {
        if(document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    }
    container.addEventListener('keydown', handleKey);
    return { destroy: function(){ container.removeEventListener('keydown', handleKey); } };
  }

  function init(){
    var sidebar = document.getElementById('sidebar');
    if(!sidebar) return;
    var overlay = document.querySelector('.sidebar-overlay');
    var mobileBtn = document.querySelector('.mobile-sidebar-button');
    var toggle = sidebar.querySelector('.toggle-btn');

    // ESC closes if open
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' || e.key === 'Esc'){
        if(sidebar.classList.contains('open')){
          sidebar.classList.remove('open');
          if(overlay) overlay.classList.remove('visible');
          if(mobileBtn) mobileBtn.classList.remove('open');
          try{ localStorage.setItem('sidebarOpen','false'); }catch(e){}
          if(toggle) toggle.setAttribute('aria-expanded','false');
        }
      }
    });

    // focus trap while open
    var trap = trapFocus(sidebar);

    // when sidebar opens, focus first focusable
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        if(m.attributeName === 'class'){
          if(sidebar.classList.contains('open')){
            // small timeout to allow DOM focusable changes
            setTimeout(function(){
              var first = sidebar.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
              if(first) first.focus();
            }, 40);
          }
        }
      });
    });
    mo.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

    // Keep aria-expanded attribute on the mobile button in sync
    if(mobileBtn){
      var obs2 = new MutationObserver(function(){
        mobileBtn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
      });
      obs2.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    // clean up on unload
    window.addEventListener('unload', function(){ try{ trap.destroy(); }catch(e){} });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
