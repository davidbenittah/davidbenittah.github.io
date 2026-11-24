(() => {
  const app = document.getElementById('app');
  const deck = document.getElementById('deck');
  const panes = [...deck.querySelectorAll('.pane')];
  const N = panes.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lib = window.DistortionWave;
  const PALETTE = ['#58b2ff', '#fef9cf', '#9fdeff', '#2c6cb6'];
  const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

  let idx = 0, busy = false, mesures = [];

  // Téléphone (David, 24/11, après avoir vu le site sur son iPhone : « le reflexe de swipe a droite je l'aprecie moins sur
  // telephone, peut etre qu'il faudrai si possible y mettre le slide plutot qu'un swipe ») : sous 760 px de large, les
  // parties se suivent de haut en bas et la page défile comme n'importe quelle page ; plus de glissement de côté ni d'onde.
  // La mise en page du téléphone est dans site.css ; ici, seulement ce qui dépend du défilement.
  const etroit = matchMedia('(max-width: 760px)');
  const TEL = etroit.matches;
  app.classList.toggle('tel', TEL);
  etroit.addEventListener('change', () => location.reload());
  function defilerVers(el, doux) {
    const html = document.documentElement, y = Math.round(el.getBoundingClientRect().top + scrollY);
    if (doux && !reduced) { scrollTo({ top: y, behavior: 'smooth' }); return; }
    html.style.scrollBehavior = 'auto'; scrollTo(0, y); html.style.scrollBehavior = '';
  }

  // La galerie « Mon travail » (galerie.js) recouvre tout : pendant qu'elle est ouverte, les pages ne bougent pas.
  // Même chose pour la page d'un métier (domaine.js).
  const enGalerie = () => app.classList.contains('en-galerie') || app.classList.contains('en-domaine');

  // ——— Repères : où l'on est
  const compte = document.getElementById('compte');
  const suivant = document.getElementById('suivant'), suivantMot = document.getElementById('suivant-mot');
  // Le film d'ouverture joue toujours avec le son (David, 22/11 : « sur le site faut que le son sois directment activé » ;
  // 23/11 : « je voulais que le son doit etre activé des le debut »). Un navigateur refuse le son tant que le visiteur n'a
  // rien touché (première visite) : le film attend alors sur sa première image, sous la pastille « Lancer le film ».
  // Il ne part jamais muet ; seul le bouton « Couper le son » le rend muet.
  const son = document.getElementById('son'), filmOuv = document.getElementById('bobine'), lancer = document.getElementById('lancer');
  let sonCoupe = false;
  // le film existe en deux formats : large pour l'ordinateur, vertical (9:16) pour le téléphone
  filmOuv.poster = filmOuv.dataset[TEL ? 'afficheHaut' : 'afficheLarge'];
  filmOuv.src = filmOuv.dataset[TEL ? 'haut' : 'large'];
  const sonCache = () => (TEL ? !lancer.hidden : idx !== 0 || !lancer.hidden);
  function sonEtat() {
    son.textContent = filmOuv.muted ? 'Activer le son' : 'Couper le son';
    son.setAttribute('aria-pressed', String(!filmOuv.muted));
    son.hidden = sonCache();
  }
  function attendre(oui) { lancer.hidden = !oui; sonEtat(); }
  function filmJoue() {
    filmOuv.muted = sonCoupe;
    const p = filmOuv.play();
    if (p && p.catch) p.catch((err) => { if (err && err.name === 'NotAllowedError' && filmOuv.paused) attendre(true); });
  }
  filmOuv.addEventListener('playing', () => attendre(false));
  lancer.addEventListener('click', () => { filmOuv.currentTime = 0; filmJoue(); });
  son.addEventListener('click', () => {
    sonCoupe = !filmOuv.muted; filmOuv.muted = sonCoupe;
    if (!sonCoupe) { filmOuv.currentTime = 0; filmOuv.play().catch(() => {}); }
    sonEtat();
  });
  const navs = [...document.querySelectorAll('[data-nav]')];
  function reperes(i) {
    compte.textContent = `${i + 1} / ${N}`;
    let actif = null;
    navs.forEach((a) => { if (Number(a.dataset.nav) <= i) actif = a; });
    navs.forEach((a) => a.classList.toggle('ici', a === actif));
    const fin = i === N - 1;
    suivantMot.textContent = fin ? 'Début' : 'Suivant';
    suivant.classList.toggle('retour', fin);
    history.replaceState(null, '', i === 0 ? location.pathname : '#' + panes[i].id);
    son.hidden = sonCache();
  }
  // une zone de texte plus haute que sa tuile : on signale qu'il en reste
  const defiles = [...document.querySelectorAll('.defile')];
  function debords() { defiles.forEach((z) => z.classList.toggle('suite', z.scrollHeight - z.clientHeight - z.scrollTop > 6)); }
  defiles.forEach((z) => z.addEventListener('scroll', debords, { passive: true }));
  addEventListener('resize', debords);
  function medias(i) {
    if (TEL) return;   // au téléphone, ce qui joue dépend de ce qui est à l'écran (plus bas : « Téléphone »)
    requestAnimationFrame(debords);
    panes.forEach((p, n) => p.querySelectorAll('.media video, .telephone video').forEach((v) => { if (n === i) v.play().catch(() => {}); else v.pause(); }));
    if (i === 0) filmJoue(); else filmOuv.pause();
  }
  function poser(i) {
    if (TEL) { defilerVers(panes[i], false); panes[i].classList.add('vue'); idx = i; reperes(i); return; }
    panes.forEach((p, n) => p.classList.toggle('ici', n === i));
    panes[i].classList.add('vue');
    idx = i; reperes(i); medias(i);
  }

  // ——— Glisser : la partie suivante arrive par la droite
  function glisser(i, ms) {
    i = Math.max(0, Math.min(N - 1, i));
    if (TEL || busy || i === idx || enGalerie()) return;
    if (reduced) { poser(i); return; }
    busy = true;
    const dir = i > idx ? 1 : -1, a = panes[idx], b = panes[i];
    b.classList.add('ici');
    reperes(i);
    const opts = { duration: ms || 950, easing: EASE, fill: 'forwards' };
    const A = a.animate([{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(${-dir * 100}%,0,0)` }], opts);
    const B = b.animate([{ transform: `translate3d(${dir * 100}%,0,0)` }, { transform: 'translate3d(0,0,0)' }], opts);
    setTimeout(() => b.classList.add('vue'), opts.duration * 0.42);
    B.finished.then(() => { a.classList.remove('ici'); A.cancel(); B.cancel(); idx = i; medias(i); busy = false; });
  }

  // ——— L'onde : elle part de ce qu'on vient de toucher et emporte la page vers la suivante.
  // Une seule partie est dans la page à la fois : la capture est légère, le clic ne fige plus.
  // Une vidéo en lecture se remplace, le temps de l'onde, par son image du moment : la capture reste rapide
  // et l'image ne saute pas.
  const geles = [];
  function geler(zone) {
    zone.querySelectorAll('video:not([data-dw-ignore])').forEach((v) => {
      const r = v.getBoundingClientRect();
      if (!r.width) return;
      let calque = null;
      if (getComputedStyle(v).opacity !== '0') {
        if (v.readyState >= 2 && v.videoWidth) {
          try {
            const c = document.createElement('canvas');
            c.width = Math.round(r.width); c.height = Math.round(r.height);
            const k = Math.max(c.width / v.videoWidth, c.height / v.videoHeight), w = v.videoWidth * k, h = v.videoHeight * k;
            c.getContext('2d').drawImage(v, (c.width - w) / 2, (c.height - h) / 2, w, h);
            calque = c;
          } catch (err) { calque = null; }
        }
        if (!calque && v.poster) { calque = new Image(); calque.src = v.poster; }
        if (calque) { calque.className = 'gel'; v.parentElement.append(calque); }
      }
      v.setAttribute('data-dw-ignore', '');
      geles.push({ v, calque });
    });
  }
  function degeler() {
    geles.splice(0).forEach(({ v, calque }) => { v.removeAttribute('data-dw-ignore'); if (calque) calque.remove(); });
  }
  function onde(changer0, source, ev) {
    if (!lib || reduced) { changer0(); return; }
    busy = true;
    app.classList.add('fige');
    geler(deck);
    const changer = () => { changer0(); geler(deck); };
    let rendu = false;
    const liberer = () => { if (rendu) return; rendu = true; busy = false; app.classList.remove('fige'); degeler(); };
    try {
      lib.distortionWave(app, changer, {
        source, focus: ev && ev.clientX ? { x: ev.clientX, y: ev.clientY } : null, palette: PALETTE,
        onSettled: liberer, onEnd: (m) => { liberer(); if (m) mesures.push(m); },
      });
    } catch (err) { changer(); liberer(); }
    setTimeout(liberer, 4500);
  }
  function aller(i, source, ev) {
    i = Math.max(0, Math.min(N - 1, i));
    if (TEL) { if (!enGalerie()) defilerVers(panes[i], true); return; }
    if (busy || i === idx || enGalerie()) return;
    onde(() => poser(i), source, ev);
  }
  window.__mesures = mesures;

  // Geste (molette, pavé, flèches, doigt) : on glisse. Clic sur un lien ou un bouton : l'onde.
  let verrou = false, repos = 0, dernierPas = 0;
  addEventListener('wheel', (e) => {
    if (TEL || e.ctrlKey || enGalerie()) return;
    const zone = e.target.closest && e.target.closest('.defile');
    if (zone && zone.scrollHeight > zone.clientHeight + 2 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const auBout = e.deltaY > 0 ? zone.scrollTop + zone.clientHeight >= zone.scrollHeight - 2 : zone.scrollTop <= 0;
      if (!auBout) { dernierPas = performance.now(); return; }
    }
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    clearTimeout(repos);
    repos = setTimeout(() => { verrou = false; }, 170);
    if (verrou || Math.abs(d) < 3) return;
    if (performance.now() - dernierPas < 1500 && Math.abs(d) < 12) return;
    verrou = true; dernierPas = performance.now();
    glisser(idx + Math.sign(d));
  }, { passive: false });

  addEventListener('keydown', (e) => {
    if (TEL || enGalerie()) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.target.closest('a,button'))) { e.preventDefault(); glisser(idx + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); glisser(idx - 1); }
    else if (k === 'Home') glisser(0); else if (k === 'End') glisser(N - 1);
  });

  let doigt = null;
  deck.addEventListener('touchstart', (e) => {
    if (TEL || busy || e.touches.length !== 1 || enGalerie()) return;
    doigt = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: performance.now(), axe: null, dx: 0, voisin: -1 };
  }, { passive: true });
  deck.addEventListener('touchmove', (e) => {
    if (!doigt) return;
    const dx = e.touches[0].clientX - doigt.x, dy = e.touches[0].clientY - doigt.y;
    if (!doigt.axe && Math.abs(dx) + Math.abs(dy) > 8) doigt.axe = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (doigt.axe !== 'x') return;
    const dir = dx < 0 ? 1 : -1, v = idx + dir, ok = v >= 0 && v < N;
    if (doigt.voisin !== v) {
      if (doigt.voisin >= 0 && doigt.voisin !== idx) { panes[doigt.voisin].classList.remove('ici'); panes[doigt.voisin].style.transform = ''; }
      doigt.voisin = ok ? v : -1;
      if (ok) panes[v].classList.add('ici');
    }
    doigt.dx = ok ? dx : dx * 0.22;
    panes[idx].style.transform = `translate3d(${doigt.dx}px,0,0)`;
    if (ok) panes[v].style.transform = `translate3d(${doigt.dx + dir * innerWidth}px,0,0)`;
  }, { passive: true });
  deck.addEventListener('touchend', () => {
    if (!doigt) return;
    const d = doigt; doigt = null;
    if (d.axe !== 'x') return;
    const W = innerWidth, dir = d.dx < 0 ? 1 : -1, a = panes[idx], b = d.voisin >= 0 ? panes[d.voisin] : null;
    const va = b && (Math.abs(d.dx) > W * 0.18 || (Math.abs(d.dx) > 30 && performance.now() - d.t < 260));
    busy = true;
    const opts = { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'forwards' };
    const A = a.animate([{ transform: `translate3d(${d.dx}px,0,0)` }, { transform: `translate3d(${va ? -dir * W : 0}px,0,0)` }], opts);
    const B = b ? b.animate([{ transform: `translate3d(${d.dx + dir * W}px,0,0)` }, { transform: `translate3d(${va ? 0 : dir * W}px,0,0)` }], opts) : null;
    a.style.transform = ''; if (b) b.style.transform = '';
    A.finished.then(() => {
      A.cancel(); if (B) B.cancel();
      if (va) { a.classList.remove('ici'); b.classList.add('vue'); idx = d.voisin; reperes(idx); medias(idx); }
      else if (b) b.classList.remove('ici');
      busy = false;
    });
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-go]');
    if (!a) return;
    e.preventDefault();
    aller(Number(a.dataset.go), a, e);
  });
  suivant.addEventListener('click', (e) => { aller(idx === N - 1 ? 0 : idx + 1, suivant, e); });

  // ce que la galerie a besoin de savoir des pages
  window.SITE = { occupe: () => busy, poser, indexDe: (id) => panes.findIndex((p) => p.id === id) };

  // ——— Contact : l'adresse se copie au clic, en plus d'ouvrir la messagerie
  const mail = document.getElementById('mail');
  mail.addEventListener('click', () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText('david.benittah@gmail.com').then(() => {
      mail.style.minWidth = mail.offsetWidth + 'px';
      mail.textContent = 'Adresse copiée';
      setTimeout(() => { mail.textContent = 'david.benittah@gmail.com'; }, 2600);
    }).catch(() => {});
  });

  // ——— Contact : la demande, en trois réponses données une à la fois. Elle part à l'adresse de réception ;
  // si celle-ci ne répond pas, la messagerie du visiteur s'ouvre avec le message prêt : aucune demande ne se perd.
  // L'aperçu sur le Mac (ou sur le Wi-Fi de la maison) a sa réception sur place. Partout ailleurs, GitHub Pages ou un nom
  // de domaine, la demande part vers le Mac de David par sa porte publique : registre, puis Yossi le prévient.
  const ICI = /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(location.hostname);
  const RECEPTION = ICI ? '/demande' : 'https://macbook-pro-de-mac.tail01b95c.ts.net/demande';
  const demande = document.getElementById('demande'), envoyer = document.getElementById('envoyer'), envoyerMot = envoyer.querySelector('span');
  const dNote = document.getElementById('demande-note'), merci = document.getElementById('merci');
  // une réponse à la fois (24/11, « un truc à remplir à la fois ») : les cases restent dans la page, une seule se montre.
  // Quatre réponses : ce qu'on vend, son site ou ses réseaux (facultatif : David prépare sa proposition avant de
  // rappeler), son nom, où répondre (« sois un mail sois un numero obligatoire rien d'autre »).
  const dChamp = document.getElementById('d-champ'), dCases = [...demande.querySelectorAll('.d-pile input')];
  const dQuestions = [...demande.querySelectorAll('.d-questions label')], dPoints = [...demande.querySelectorAll('.d-points i')];
  const dManque = { vend: 'Il manque ce que vous vendez.', nom: 'Il manque votre nom.', contact: 'Il faut un mail ou un numéro de téléphone.' };
  // un mail, ou un numéro de 8 à 15 chiffres (espaces, points, tirets, parenthèses et « + » admis) ; même règle dans reception.py
  const joignable = (v) => {
    v = v.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return true;
    if (!/^\+?[\d\s().\-\/]+$/.test(v)) return false;
    const chiffres = v.replace(/\D/g, '').length;
    return chiffres >= 8 && chiffres <= 15;
  };
  const refusee = (el) => (el.name === 'contact' ? !joignable(el.value) : el.required && !el.value.trim());
  let dPas = 0;
  // le site et les réseaux : autant qu'on veut (24/11, « la possibilité de mettre plusieurs reseaux et site, ne pas mettre un
  // choix »). Chaque lien écrit se range sous le champ, qui se vide pour le suivant ; une croix le retire.
  const dLiensCase = document.getElementById('d-liens'), dPlus = document.getElementById('d-plus');
  const dAjouts = document.getElementById('d-ajouts'), dListe = dAjouts.querySelector('ul'), dLiens = [];
  function liensDessine() {
    dListe.textContent = '';
    dLiens.forEach((lien, i) => {
      const li = document.createElement('li'), mot = document.createElement('span'), croix = document.createElement('button');
      mot.textContent = lien;
      croix.type = 'button'; croix.setAttribute('aria-label', 'Retirer ' + lien);
      croix.innerHTML = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
      croix.addEventListener('click', () => { dLiens.splice(i, 1); liensDessine(); dLiensCase.focus({ preventScroll: true }); });
      li.append(mot, croix); dListe.append(li);
    });
    dAjouts.classList.toggle('plein', dLiens.length > 0);
    dLiensCase.placeholder = dLiens.length ? 'En ajouter un autre' : 'Site, Instagram, TikTok…';
  }
  function liensRange() {
    dLiensCase.value.split(/[,;]+/).map((v) => v.trim().slice(0, 120)).filter(Boolean).forEach((v) => { if (dLiens.length < 8 && !dLiens.includes(v)) dLiens.push(v); });
    dLiensCase.value = '';
    liensDessine(); demandeBouton();
  }
  dPlus.addEventListener('click', () => { liensRange(); dLiensCase.focus({ preventScroll: true }); });
  // Entrée sur un lien écrit : il se range et la case reste, pour le suivant ; Entrée sur la case vide : on avance
  dLiensCase.addEventListener('keydown', (e) => { if (e.key === 'Enter' && dLiensCase.value.trim()) { e.preventDefault(); liensRange(); } });
  dLiensCase.addEventListener('input', () => { if (/[,;]/.test(dLiensCase.value)) liensRange(); });
  function demandeBouton() {
    const el = dCases[dPas];
    const dernier = dPas === dCases.length - 1;
    envoyer.classList.toggle('mot', dernier);
    envoyer.setAttribute('aria-label', dernier ? 'Envoyer' : 'Suivant');
    dChamp.classList.toggle('plus', el === dLiensCase && !!el.value.trim());   // le « + » : ranger ce lien et en écrire un autre
  }
  function demandePas(n, saisir) {
    dPas = Math.max(0, Math.min(dCases.length - 1, n));
    demande.dataset.pas = dPas;
    [dCases, dQuestions, dPoints].forEach((lot) => lot.forEach((el, i) => { el.classList.toggle('la', i === dPas); el.classList.toggle('fait', i < dPas); }));
    dCases.forEach((el, i) => { el.tabIndex = i === dPas ? 0 : -1; });
    demandeBouton();
    dNote.textContent = '';
    // la case suivante prend la main dans le même geste : sur un téléphone, le clavier reste ouvert
    if (saisir) dCases[dPas].focus({ preventScroll: true });
  }
  function demandeRefus(i) {
    demandePas(i, true);
    dNote.textContent = dManque[dCases[i].name];
    dChamp.classList.remove('non'); void dChamp.offsetWidth; dChamp.classList.add('non');
  }
  document.getElementById('d-retour').addEventListener('click', () => demandePas(dPas - 1, true));
  demande.addEventListener('input', () => { dNote.textContent = ''; demandeBouton(); });
  demande.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (refusee(dCases[dPas])) { demandeRefus(dPas); return; }
    if (dCases[dPas] === dLiensCase) liensRange();   // la flèche : ce qui est écrit se range, puis on avance
    if (dPas < dCases.length - 1) { demandePas(dPas + 1, true); return; }
    const manque = dCases.findIndex(refusee);
    if (manque > -1) { demandeRefus(manque); return; }
    const d = Object.fromEntries(new FormData(demande));
    d.liens = [...dLiens, dLiensCase.value.trim()].filter(Boolean).join(', ').slice(0, 300);
    envoyer.disabled = true; envoyerMot.textContent = 'Envoi…';
    let ok = false;
    const coupe = new AbortController(), delai = setTimeout(() => coupe.abort(), 9000);   // Mac éteint : on n'attend pas plus
    try {
      const r = await fetch(RECEPTION, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d), signal: coupe.signal });
      ok = r.ok;
    } catch (err) { ok = false; }
    clearTimeout(delai);
    envoyer.disabled = false; envoyerMot.textContent = 'Envoyer';
    if (!ok) {
      location.href = 'mailto:david.benittah@gmail.com?subject=' + encodeURIComponent('Une idée de projet') + '&body=' + encodeURIComponent([d.nom, d.vend, d.liens, d.contact].filter(Boolean).join('\n'));
      return;
    }
    demande.hidden = true; merci.hidden = false;
  });

  // ——— Départ : la même entrée à chaque visite
  // une adresse qui nomme un métier (#identite, #site, #contenu) arrive sur « Ce que je construis », sa page par-dessus
  const adresse = window.DOMAINES && window.DOMAINES[location.hash.slice(1)] ? '#ensemble' : location.hash;
  const depart = panes.findIndex((p) => '#' + p.id === adresse);
  if (lib && lib.warmupWave) { try { lib.warmupWave(); } catch (err) {} }
  // ——— Téléphone : la page défile. Une partie se révèle quand elle arrive à l'écran ; le film joue tant qu'il occupe
  // plus de la moitié de l'écran ; le menu et l'adresse suivent la partie qui passe au milieu de l'écran.
  function telephone() {
    const ouverture = panes[0];
    ouverture.append(son);   // le bouton du son se pose en bas du film, au centre
    ouverture.insertAdjacentHTML('beforeend', '<svg class="tel-bas" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    sonEtat();
    const vues = new IntersectionObserver((es) => es.forEach((e) => {
      const p = e.target, la = e.isIntersecting;
      if (la) p.classList.add('vue');
      p.classList.toggle('ici', la);
      p.querySelectorAll('.telephone video').forEach((v) => { if (la && !enGalerie()) v.play().catch(() => {}); else v.pause(); });
    }), { threshold: 0.12 });
    panes.forEach((p) => vues.observe(p));
    new IntersectionObserver((es) => es.forEach((e) => {
      if (e.intersectionRatio >= 0.5 && !enGalerie()) filmJoue(); else filmOuv.pause();
    }), { threshold: [0, 0.5, 1] }).observe(ouverture);
    let attente = false;
    const suivre = () => {
      attente = false;
      if (enGalerie()) return;
      let i = 0;
      panes.forEach((p, n) => { if (p.getBoundingClientRect().top <= innerHeight * 0.5) i = n; });
      if (i !== idx) { idx = i; reperes(i); }
    };
    addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(suivre); } }, { passive: true });
  }

  if (TEL) {
    if (depart > 0 || reduced) {
      app.classList.add('sans-entree', 'pret');
      telephone();
      if (depart > 0) poser(depart); else reperes(0);
    } else {
      reperes(0);
      setTimeout(() => { app.classList.add('pret'); telephone(); }, 1750);
      setTimeout(() => { const el = document.getElementById('entree'); if (el) el.remove(); }, 2700);
    }
  } else if (depart > 0 || reduced) {
    app.classList.add('sans-entree', 'pret');
    poser(Math.max(0, depart));
  } else {
    panes[0].classList.add('ici'); reperes(0);
    setTimeout(() => { app.classList.add('pret'); panes[0].classList.add('vue'); medias(0); }, 1750);
    setTimeout(() => { const el = document.getElementById('entree'); if (el) el.remove(); }, 2700);
  }
})();
