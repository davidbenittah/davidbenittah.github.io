/* « Mon travail » : une salle sombre derrière une porte. Une grille sans bord qu'on fait glisser ; chaque case est une pièce.
   Le même moteur dessine l'aperçu dans la porte (petit, il dérive seul) et la salle (plein écran, elle répond à la main) :
   quand on entre, la salle part exactement de ce que montrait la porte, puis la caméra avance. */
(() => {
  const T = window.TRAVAIL || [], R = window.RESEAUX || {};
  const N = T.length;
  const app = document.getElementById('app');
  const gal = document.getElementById('galerie'), vue = document.getElementById('g-vue');
  const porte = document.getElementById('porte'), porteGrille = document.getElementById('porte-grille');
  if (!N || !gal || !porte) return;

  const PAS = 5;      // décalage d'une rangée à l'autre : une pièce ne revient pas sous elle-même
  const Z0 = 0.5;     // taille de la grille vue depuis la porte
  const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TYPES = { contenu: 'Contenu', identite: 'Identité', site: 'Site' };
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const mod = (a, n) => ((a % n) + n) % n;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const quand = (d) => { const [a, m] = d.split('-'); return MOIS[Number(m) - 1] + ' ' + a; };
  const img = (src) => `<img src="${src}" alt="" decoding="async" draggable="false">`;

  // ——— Le visuel d'une pièce, le même dans sa case et dans sa fiche
  function visuel(it) {
    const m = it.media, e = document.createElement('span');
    e.className = 'v v-' + m.genre + (m.art ? ' a-' + m.art : '');
    if (m.genre === 'film') e.innerHTML = img(`assets/couv-${m.slug}.jpg`);
    else if (m.genre === 'large') e.innerHTML = img(m.img);
    else if (m.genre === 'site') e.innerHTML = '<i class="b"><i></i><i></i><i></i></i>' + img(m.img);
    else if (m.art === 'signe') e.innerHTML = img('assets/db-lever.svg');
    else if (m.art === 'clair') e.innerHTML = img('assets/db-ciel-profond.svg');
    else if (m.art === 'couleurs') e.innerHTML = '<i style="background:#FEF9CF"></i><i style="background:#CAF4FF"></i><i style="background:#9FDEFF"></i><i style="background:#58B2FF"></i>';
    else if (m.art === 'ecriture') e.innerHTML = '<b>Aa</b>';
    return e;
  }
  function caseDe(it, inerte) {
    const c = document.createElement(inerte ? 'div' : 'button');
    c.className = 'case';
    if (!inerte) { c.type = 'button'; c.setAttribute('aria-label', `${it.titre} ${TYPES[it.type]}, ${it.secteur}, ${quand(it.date)}`); }
    c.innerHTML = `<span class="c-haut"><b>${it.titre}</b><i>${TYPES[it.type]}</i></span><span class="c-milieu"></span><span class="c-bas"><i>${it.secteur}</i><i>${it.date.slice(0, 4)}</i></span>`;
    c.querySelector('.c-milieu').append(visuel(it));
    c._it = it;
    return c;
  }

  // ——— La grille : (x, y) est le point du monde posé au centre de la vue, z le grossissement
  class Grille {
    constructor(el, o) {
      this.el = el; this.o = o || {};
      this.plan = document.createElement('div'); this.plan.className = 'g-plan'; el.append(this.plan);
      this.cases = new Map();
      this.z = this.o.z || 1; this.vx = 0; this.vy = 0; this.t = 0; this.touche = -1e9;
      this.actif = false; this.prise = false; this.survol = null; this.W = 0; this.H = 0;
      this.k = 0; this.kr = 0; this.plat = true; this.appui = 0; this.aBouge = false; this.geste = 0;   // k : courbure de la grille, de 0 (plate) à 1
      this.taille();
      this.x = this.cw * 2.5; this.y = this.ch * 1.02;
    }
    taille() {
      const cw = Math.round(clamp(innerWidth / 5, 180, 430)), ch = Math.round(cw * 1.36);
      if (cw !== this.cw) { this.vider(); if (this.cw) { this.x *= cw / this.cw; this.y *= ch / this.ch; } }
      this.cw = cw; this.ch = ch;
      this.plan.style.setProperty('--cw', cw + 'px'); this.plan.style.setProperty('--ch', ch + 'px');
    }
    mesurer() { const r = this.el.getBoundingClientRect(); this.W = r.width; this.H = r.height; this.taille(); return r; }
    vider() { this.cases.forEach((e) => e.remove()); this.cases.clear(); this.survol = null; }
    dessiner() {
      const { W, H, z, cw, ch, k } = this;
      if (!W || !H) return;
      const marge = k > 0.01 ? 1 + Math.ceil(k * 1.5) : 0;                    // bombée, la grille montre plus de cases sur ses bords
      const dw = W / (2 * z), dh = H / (2 * z);
      const c0 = Math.floor((this.x - dw) / cw) - marge, c1 = Math.floor((this.x + dw) / cw) + marge;
      const r0 = Math.floor((this.y - dh) / ch) - marge, r1 = Math.floor((this.y + dh) / ch) + marge;
      const vus = new Set();
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
        const key = c + ',' + r; vus.add(key);
        if (this.cases.has(key)) continue;
        const e = caseDe(T[mod(c + r * PAS, N)], this.o.inerte);
        e._c = c; e._r = r;
        e.style.transform = `translate3d(${c * cw}px,${r * ch}px,0)`;
        this.plan.append(e); this.cases.set(key, e);
      }
      this.cases.forEach((e, key) => { if (!vus.has(key)) { if (e === this.survol) this.quitter(); e.remove(); this.cases.delete(key); } });
      if (k > 0 || !this.plat) {
        // rayon de la sphère : infini quand k = 0 (grille plate), environ 0,8 largeur d'écran quand k = 1
        const R = (Math.max(W, H) * 0.8 / z) / Math.max(k, 0.02);
        this.cases.forEach((e) => {
          if (!k) { e.style.transform = `translate3d(${e._c * cw}px,${e._r * ch}px,0)`; return; }
          const dx = (e._c + 0.5) * cw - this.x, dy = (e._r + 0.5) * ch - this.y;
          const th = clamp(dx / R, -1.35, 1.35), ph = clamp(dy / R, -1.35, 1.35);
          const X = R * Math.sin(th) * Math.cos(ph), Y = R * Math.sin(ph), Z = R * (Math.cos(th) * Math.cos(ph) - 1);
          e.style.transform = `translate3d(${(e._c * cw + X - dx).toFixed(2)}px,${(e._r * ch + Y - dy).toFixed(2)}px,${Z.toFixed(2)}px) rotateY(${th.toFixed(4)}rad) rotateX(${(-ph).toFixed(4)}rad)`;
        });
        this.plat = !k;
      }
      this.plan.style.transform = `translate3d(${(W / 2 - this.x * z).toFixed(2)}px,${(H / 2 - this.y * z).toFixed(2)}px,0) scale3d(${z.toFixed(4)},${z.toFixed(4)},${z.toFixed(4)})`;
    }
    pas(now) {
      if (!this.actif) return;
      const dt = Math.min(50, now - (this.t || now)); this.t = now;
      if (!this.prise) {
        if (Math.abs(this.vx) > 0.004 || Math.abs(this.vy) > 0.004) {
          this.x += this.vx * dt; this.y += this.vy * dt;
          const f = Math.pow(0.996, dt); this.vx *= f; this.vy *= f;      // l'élan s'éteint en un tiers de seconde
        } else if (this.o.derive && !reduced && now - this.touche > 2400) { this.x += this.o.derive * dt; this.y += this.o.derive * 0.42 * dt; }
      }
      if (this.o.courbe && !reduced) {
        if (this.prise && now - this.geste > 60) { this.vx *= 0.8; this.vy *= 0.8; }      // la main tient la grille sans bouger
        const v = Math.hypot(this.vx, this.vy) * this.z;                                // vitesse à l'écran, en px par ms
        this.kr *= Math.exp(-dt / 240);
        let cible = this.prise ? (this.aBouge || now - this.appui > 140 ? 0.6 + Math.min(0.4, v * 0.2) : 0) : Math.min(1, v * 0.45);
        cible = Math.max(cible, this.kr);
        this.k += (cible - this.k) * (1 - Math.exp(-dt / (cible > this.k ? 110 : 280)));
        if (this.k < 0.004 && cible < 0.004) this.k = 0;
      }
      this.dessiner();
      requestAnimationFrame((n) => this.pas(n));
    }
    marche() { if (this.actif) return; this.actif = true; this.t = 0; requestAnimationFrame((n) => this.pas(n)); }
    arret() { this.actif = false; }
    quitter() {
      const c = this.survol; if (!c) return;
      this.survol = null; c.classList.remove('survol', 'joue');
      const v = c.querySelector('video'); if (v) v.pause();
    }
    ecouter() {
      const el = this.el; let p = null;
      el.addEventListener('pointerdown', (e) => {
        if (e.button) return;
        p = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now(), bouge: false, cible: e.target.closest('.case') };
        this.prise = true; this.vx = this.vy = 0; this.touche = p.t; this.appui = p.t; this.geste = p.t; this.aBouge = false;
      });
      addEventListener('pointermove', (e) => {
        if (!p || e.pointerId !== p.id) return;
        const now = performance.now(), dx = e.clientX - p.x, dy = e.clientY - p.y, dt = Math.max(1, now - p.t);
        if (!p.bouge && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > 6) { p.bouge = true; this.aBouge = true; el.classList.add('glisse'); if (this.o.bouge) this.o.bouge(); }
        if (!p.bouge) return;
        this.x -= dx / this.z; this.y -= dy / this.z;
        this.vx = 0.7 * this.vx + 0.3 * (-dx / this.z / dt); this.vy = 0.7 * this.vy + 0.3 * (-dy / this.z / dt);
        p.x = e.clientX; p.y = e.clientY; p.t = now; this.geste = now;
      });
      const fin = (e) => {
        if (!p || e.pointerId !== p.id) return;
        const q = p; p = null; this.prise = false; el.classList.remove('glisse'); this.touche = performance.now();
        if (this.touche - q.t > 90) this.vx = this.vy = 0;                  // la main s'était arrêtée avant de lâcher
        if (!q.bouge && q.cible && e.type === 'pointerup' && this.o.choisir) this.o.choisir(q.cible._it, q.cible);
      };
      addEventListener('pointerup', fin); addEventListener('pointercancel', fin);
      el.addEventListener('click', (e) => { const c = e.target.closest('.case'); if (e.detail === 0 && c && this.o.choisir) this.o.choisir(c._it, c); });
      el.addEventListener('wheel', (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();
        this.x += e.deltaX / this.z; this.y += e.deltaY / this.z; this.vx = this.vy = 0; this.touche = performance.now();
        this.kr = Math.min(0.85, this.kr + Math.hypot(e.deltaX, e.deltaY) / 700);
        if (this.o.bouge) this.o.bouge();
      }, { passive: false });
      // au survol, la boucle du film joue dans sa case
      el.addEventListener('pointerover', (e) => {
        if (e.pointerType === 'touch' || this.prise) return;
        const c = e.target.closest('.case');
        if (!c || c === this.survol) return;
        this.quitter(); this.survol = c; c.classList.add('survol');
        const m = c._it.media;
        if (m.genre !== 'film') return;
        let v = c.querySelector('video');
        if (!v) { v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.src = `assets/loop-${m.slug}.mp4`; c.querySelector('.v').append(v); }
        v.play().then(() => { if (this.survol === c) c.classList.add('joue'); }).catch(() => {});
      });
      el.addEventListener('pointerleave', () => this.quitter());
    }
  }

  const apercu = new Grille(porteGrille, { z: Z0, derive: 0.03, inerte: true });
  const salle = new Grille(vue, { derive: 0.012, courbe: true, choisir: (it, c) => ouvrirFiche(it, c), bouge: () => gal.classList.add('a-bouge') });
  salle.ecouter();

  // ——— La porte : l'aperçu ne tourne que quand sa page est à l'écran
  const pagePorte = porte.closest('.pane');
  let ouvert = false, anime = false;
  function veille() {
    const vu = pagePorte.classList.contains('ici') && !ouvert;
    if (vu) { apercu.mesurer(); apercu.dessiner(); apercu.marche(); } else apercu.arret();
  }
  new MutationObserver(veille).observe(pagePorte, { attributes: true, attributeFilter: ['class'] });

  // ——— Entrer, sortir : la salle se découpe dans la porte et s'ouvre jusqu'aux bords
  const boite = (r, rayon) => `inset(${r.top.toFixed(1)}px ${(innerWidth - r.right).toFixed(1)}px ${(innerHeight - r.bottom).toFixed(1)}px ${r.left.toFixed(1)}px round ${rayon}px)`;
  const plein = () => ({ top: 0, left: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight });
  const adoucir = (k) => (k < 0.5 ? 8 * k * k * k * k : 1 - Math.pow(-2 * k + 2, 4) / 2);
  function zoomer(vers, ms) {
    const de = salle.z, t0 = performance.now();
    const pas = (now) => {
      const k = clamp((now - t0) / ms, 0, 1);
      salle.z = de + (vers - de) * adoucir(k);
      if (k < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  }
  const centre = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  function ouvrir(source) {
    const S = window.SITE;
    if (ouvert || anime || (S && S.occupe())) return;
    const parLaPorte = pagePorte.classList.contains('ici');
    const r = (parLaPorte ? porte : source || porte).getBoundingClientRect();
    ouvert = anime = true;
    gal.hidden = false; gal.classList.remove('la', 'a-bouge'); app.classList.add('en-galerie');
    salle.mesurer();
    if (parLaPorte) {
      const C = centre(plein()), Cw = centre(r);
      salle.z = Z0; salle.x = apercu.x + (C.x - Cw.x) / Z0; salle.y = apercu.y + (C.y - Cw.y) / Z0;
    } else { salle.z = 0.7; document.querySelectorAll('.pane.ici video').forEach((v) => v.pause()); }   // le film de la page quittée se tait tout de suite
    salle.vx = salle.vy = 0; salle.k = salle.kr = 0; salle.touche = performance.now() + 1500;
    salle.dessiner(); salle.marche(); apercu.arret();
    const ms = reduced ? 1 : 950;
    vue.animate([{ opacity: parLaPorte ? 0.5 : 0.2 }, { opacity: 1 }], { duration: ms, easing: 'ease' });
    zoomer(1, ms);
    const a = gal.animate([{ clipPath: boite(r, parLaPorte ? 6 : 99) }, { clipPath: boite(plein(), 0) }], { duration: ms, easing: EASE, fill: 'both' });
    a.finished.then(() => {
      a.cancel(); anime = false; gal.classList.add('la');
      if (!parLaPorte && S) S.poser(S.indexDe('travail'));
      document.getElementById('g-fermer').focus({ preventScroll: true });
    });
  }
  function fermer() {
    if (!ouvert || anime) return;
    if (!fiche.hidden) { fermerFiche(); return; }
    anime = true; gal.classList.remove('la'); salle.quitter();
    const r = porte.getBoundingClientRect(), C = centre(plein()), Cw = centre(r);
    // l'aperçu reprend exactement là où la salle s'arrête
    apercu.mesurer(); apercu.x = salle.x - (C.x - Cw.x) / Z0; apercu.y = salle.y - (C.y - Cw.y) / Z0; apercu.dessiner();
    salle.vx = salle.vy = 0; salle.k = salle.kr = 0; salle.touche = performance.now() + 5000;
    const ms = reduced ? 1 : 820;
    vue.animate([{ opacity: 1 }, { opacity: 0.5 }], { duration: ms, easing: 'ease', fill: 'forwards' }).finished.then((x) => setTimeout(() => x.cancel(), 60));
    zoomer(Z0, ms);
    const a = gal.animate([{ clipPath: boite(plein(), 0) }, { clipPath: boite(r, 6) }], { duration: ms, easing: EASE, fill: 'both' });
    a.finished.then(() => {
      gal.hidden = true; a.cancel(); app.classList.remove('en-galerie'); salle.arret();
      ouvert = anime = false; veille();
      document.getElementById('porte-bouton').focus({ preventScroll: true });
    });
  }

  // ——— La fiche d'une pièce : elle part de sa case et vient se poser en grand
  const fiche = document.getElementById('fiche'), cadre = document.getElementById('f-cadre'), fTexte = fiche.querySelector('.f-texte'), fFond = fiche.querySelector('.f-fond');
  let partie = null;
  function ouvrirFiche(it, c) {
    if (anime || !fiche.hidden) return;
    salle.quitter(); salle.vx = salle.vy = 0;
    const m = it.media;
    fiche.className = 'fiche grille f-' + m.genre;
    document.getElementById('f-type').textContent = TYPES[it.type];
    document.getElementById('f-titre').textContent = it.titre;
    document.getElementById('f-ligne').textContent = `${it.secteur}, ${quand(it.date)}`;
    const note = document.getElementById('f-note'); note.textContent = it.note || ''; note.hidden = !it.note;
    const ig = document.getElementById('f-ig'); ig.hidden = !it.ig; if (it.ig) ig.href = it.ig;
    cadre.replaceChildren();
    let video = null;
    if (m.genre === 'film' || m.genre === 'large') {
      video = document.createElement('video'); video.playsInline = true; video.controls = true; video.preload = 'auto';
      video.poster = m.genre === 'film' ? `assets/couv-${m.slug}.jpg` : m.img;
      video.src = m.genre === 'film' ? `assets/${m.slug}.mp4` : m.video;
      cadre.append(video);
    } else cadre.append(visuel(it));
    const de = c.querySelector('.v').getBoundingClientRect();
    fiche.hidden = false;
    const vers = cadre.getBoundingClientRect();
    partie = c; c.classList.add('partie');
    if (!reduced && vers.height) {
      const s = de.height / vers.height, a = centre(de), b = centre(vers);
      cadre.animate([{ transform: `translate(${(a.x - b.x).toFixed(1)}px,${(a.y - b.y).toFixed(1)}px) scale(${s.toFixed(4)})` }, { transform: 'none' }], { duration: 640, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
      fFond.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease' });
      fTexte.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 0, transform: 'translateY(12px)', offset: 0.35 }, { opacity: 1, transform: 'none' }], { duration: 760, easing: 'ease' });
    }
    if (video) { const p = video.play(); if (p && p.catch) p.catch(() => { video.muted = true; video.play().catch(() => {}); }); }
    document.getElementById('f-fermer').focus({ preventScroll: true });
  }
  function fermerFiche() {
    if (fiche.hidden) return;
    const v = cadre.querySelector('video'); if (v) v.pause();
    const finir = () => { fiche.hidden = true; cadre.replaceChildren(); if (partie) { partie.classList.remove('partie'); if (partie.isConnected) partie.focus({ preventScroll: true }); partie = null; } };
    if (reduced) { finir(); return; }
    fiche.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease' }).finished.then(finir);
  }
  document.getElementById('f-fermer').addEventListener('click', fermerFiche);
  fFond.addEventListener('click', fermerFiche);

  // ——— Commandes
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-galerie]');
    if (a) { e.preventDefault(); ouvrir(a); return; }
    if (e.target.closest('[data-galerie-fermer]')) { e.preventDefault(); fermer(); }
  });
  addEventListener('keydown', (e) => {
    if (!ouvert) return;
    if (e.key === 'Escape') { fermer(); return; }
    if (!fiche.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
    if (!d) return;
    e.preventDefault(); salle.vx = d[0] * 1.4; salle.vy = d[1] * 1.6; salle.touche = performance.now(); gal.classList.add('a-bouge');
  });
  addEventListener('resize', () => {
    if (ouvert) { salle.mesurer(); salle.dessiner(); }
    veille();
  });
  document.querySelectorAll('[data-reseau]').forEach((a) => { if (R[a.dataset.reseau]) a.href = R[a.dataset.reseau]; });
  const nb = document.getElementById('g-compte'); if (nb) nb.textContent = `${N} pièces`;

  window.GALERIE = { ouvrir, fermer, ouvert: () => ouvert, salle, apercu };
  veille();
})();
