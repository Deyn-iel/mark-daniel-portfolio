import "./style.css";

// =========================
// Smooth scroll
// =========================
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const id = a.getAttribute("href");
  const el = id && id.length > 1 ? document.querySelector(id) : null;
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
});

// =========================
// Accordion
// =========================
const acc = document.getElementById("accordion");
if (acc) {
  const items = Array.from(acc.querySelectorAll(".acc-item"));

  function closeAll(except) {
    items.forEach((it) => {
      if (it === except) return;
      it.classList.remove("open");
      const panel = it.querySelector(".acc-panel");
      if (panel) panel.style.maxHeight = "0px";
    });
  }

  function openItem(it) {
    it.classList.add("open");
    const panel = it.querySelector(".acc-panel");
    const inner = it.querySelector(".acc-panel-inner");
    if (panel && inner) panel.style.maxHeight = inner.scrollHeight + "px";
  }

  items.forEach((it, idx) => {
    const btn = it.querySelector(".acc-btn");
    const panel = it.querySelector(".acc-panel");
    const inner = it.querySelector(".acc-panel-inner");

    if (idx === 0 && panel && inner)
      panel.style.maxHeight = inner.scrollHeight + "px";

    if (btn) {
      btn.addEventListener("click", () => {
        const isOpen = it.classList.contains("open");
        closeAll(it);

        if (!isOpen) openItem(it);
        else {
          it.classList.remove("open");
          if (panel) panel.style.maxHeight = "0px";
        }
      });
    }
  });
}

// =========================
// Tabs filter for Works
// =========================
const tabs = document.getElementById("tabs");
const works = Array.from(document.querySelectorAll(".work"));

if (tabs) {
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;

    const filter = btn.dataset.filter;

    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");

    works.forEach((card) => {
      const cat = card.dataset.cat;
      const show = filter === "all" || cat === filter;
      card.style.display = show ? "" : "none";
    });
  });
}

// =========================
// Background parallax blobs
// =========================
const blobA = document.getElementById("blobA");
const blobB = document.getElementById("blobB");
const blobC = document.getElementById("blobC");

let mx = 0,
  my = 0;

window.addEventListener("mousemove", (e) => {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  mx = e.clientX / w - 0.5;
  my = e.clientY / h - 0.5;
});

function raf() {
  if (blobA && blobB && blobC) {
    const t = Date.now() * 0.0002;
    const ax = mx * 24 + Math.sin(t) * 10;
    const ay = my * 18 + Math.cos(t) * 10;

    blobA.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
    blobB.style.transform = `translate3d(${ax * -0.8}px, ${ay * 0.9}px, 0)`;
    blobC.style.transform = `translate3d(${ax * 0.5}px, ${ay * -0.7}px, 0)`;
  }
  requestAnimationFrame(raf);
}
raf();

// =========================
// Reveal on scroll (multiple directions)
// =========================
const reveals = Array.from(document.querySelectorAll(".reveal"));

if (reveals.length) {
  // cycle: up -> left -> right -> down -> up...
  const cycle = ["up", "left", "right", "down"];
  reveals.forEach((el, i) => {
    // if may manual ka nang class like "reveal-left", skip
    const hasManual =
      el.classList.contains("reveal-up") ||
      el.classList.contains("reveal-left") ||
      el.classList.contains("reveal-right") ||
      el.classList.contains("reveal-down");

    if (!hasManual) el.classList.add(`reveal-${cycle[i % cycle.length]}`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("show");
          io.unobserve(en.target); // optional: animate once
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((el) => io.observe(el));
}

// =========================
// Mobile drawer
// =========================
const drawer = document.getElementById("drawer");
const openDrawer = document.getElementById("openDrawer");
const closeDrawer = document.getElementById("closeDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");

function setDrawer(open) {
  if (!drawer) return;
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", open ? "false" : "true");
  document.body.style.overflow = open ? "hidden" : "";
}

if (openDrawer) openDrawer.addEventListener("click", () => setDrawer(true));
if (closeDrawer) closeDrawer.addEventListener("click", () => setDrawer(false));
if (drawerBackdrop)
  drawerBackdrop.addEventListener("click", () => setDrawer(false));

if (drawer) {
  drawer.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    setDrawer(false);
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setDrawer(false);
});
