/* Consistent way back from every view.
 *
 * 1. Sticky header on the detail sheet with a Close button you can always see.
 * 2. Phone/browser back button closes whatever is open instead of leaving the page.
 * 3. A close control on the Nearby and indoor-places panels.
 * 4. A sticky top bar with "All trips" and "Back to top" so you are never stranded.
 */
(function () {
  function closeSheet() {
    var s = document.getElementById('sheet'), sc = document.getElementById('scrim');
    if (s) s.classList.remove('on');
    if (sc) sc.classList.remove('on');
    document.body.style.overflow = '';
  }
  function sheetOpen() {
    var s = document.getElementById('sheet');
    return s && s.classList.contains('on');
  }
  function panelOpen() {
    var n = document.getElementById('nearbox'), r = document.getElementById('rainbox');
    return (n && n.innerHTML.trim()) || (r && r.innerHTML.trim());
  }
  function closePanels() {
    var rc = document.getElementById('rain-close');
    if (rc) rc.click();
    var n = document.getElementById('nearbox');
    if (n) n.innerHTML = '';
  }

  function init() {
    var sheet = document.getElementById('sheet');
    if (!sheet) { setTimeout(init, 150); return; }

    /* 1. sticky close on the sheet */
    var grab = sheet.querySelector('.grab');
    if (grab && !document.querySelector('.sheet-top')) {
      var top = document.createElement('div');
      top.className = 'sheet-top';
      top.innerHTML = '<span class="grabline"></span>' +
        '<button class="sheet-x" id="sheet-x">\u2715 Close</button>';
      grab.parentNode.replaceChild(top, grab);
      document.getElementById('sheet-x').onclick = closeSheet;
    }

    /* 4. sticky top bar */
    if (!document.querySelector('.tophome')) {
      var bar = document.createElement('div');
      bar.className = 'tophome';
      bar.innerHTML = '<a href="../">\u2190 All trips</a>' +
        '<button id="to-top">\u2191 Top</button>' +
        '<button class="now" id="to-map">Map</button>';
      var days = document.getElementById('days');
      days.parentNode.insertBefore(bar, days);
      document.getElementById('to-top').onclick = function () {
        closePanels();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      document.getElementById('to-map').onclick = function () {
        closeSheet();
        document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
    }

    /* 2. hardware back button */
    history.replaceState({ base: 1 }, '');
    var guarded = false;
    function guard() {
      if (!guarded) { history.pushState({ overlay: 1 }, ''); guarded = true; }
    }
    new MutationObserver(function () {
      if (sheetOpen() || panelOpen()) guard();
    }).observe(document.body, { attributes: true, childList: true, subtree: true });

    window.addEventListener('popstate', function () {
      guarded = false;
      if (sheetOpen()) { closeSheet(); return; }
      if (panelOpen()) { closePanels(); return; }
    });

    /* 3. close control on the nearby panel */
    var nb = document.getElementById('nearbox');
    if (nb) new MutationObserver(function () {
      var inner = nb.querySelector('.nearbox');
      if (inner && !inner.querySelector('.panel-x')) {
        var b = document.createElement('button');
        b.className = 'panel-x';
        b.textContent = 'Close';
        b.onclick = function () { nb.innerHTML = ''; };
        inner.appendChild(b);
      }
    }).observe(nb, { childList: true });
  }
  setTimeout(init, 340);
})();
