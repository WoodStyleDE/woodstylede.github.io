(function () {
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.getElementById("menu-open");
  var closeBtn = document.getElementById("menu-close");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("hidden", !open);
    menu.classList.toggle("flex", open);
    document.body.classList.toggle("overflow-hidden", open);
    openBtn.setAttribute("aria-expanded", String(open));
    (open ? closeBtn : openBtn).focus();
  }
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener("click", function () { setMenu(true); });
    closeBtn.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.classList.contains("hidden")) setMenu(false); });
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (e) { if (e.matches && !menu.classList.contains("hidden")) setMenu(false); });
  }

  // Katalog: Kategorien filtern
  var filters = document.getElementById("filters");
  if (filters) {
    var on = "min-h-11 rounded-full bg-ink px-5 text-sm text-paper".split(" ");
    var off = "min-h-11 rounded-full border border-line bg-paper px-5 text-sm text-ink hover:border-ink/30".split(" ");
    var buttons = Array.prototype.slice.call(filters.querySelectorAll("button"));
    var items = Array.prototype.slice.call(document.querySelectorAll("#products article"));
    function apply(id) {
      buttons.forEach(function (b) {
        var pressed = b.dataset.filter === id;
        b.setAttribute("aria-pressed", String(pressed));
        b.className = (pressed ? on : off).join(" ");
      });
      var n = 0;
      items.forEach(function (a) {
        var show = id === "alle" || a.dataset.cat === id;
        a.hidden = !show;
        var media = a.querySelector("[data-media]");
        if (show) { media.classList.toggle("lg:order-2", n % 2 === 1); n++; }
      });
    }
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) apply(b.dataset.filter);
    });
    var hash = location.hash.slice(1);
    if (hash) { var t = document.getElementById(hash); if (t) t.scrollIntoView(); }
  }
})();
