/* Les pages des trois métiers (le texte est dans domaines.js). Une carte de la page « Ce que je construis » s'ouvre :
   sa vitrine grandit jusqu'à devenir l'image d'ouverture de la page, qui se lit ensuite de haut en bas.
   Chaque explication est posée à côté de sa preuve : une image tirée du travail de David. */
(() => {
  const D = window.DOMAINES, S = window.SITE;
  const app = document.getElementById('app'), couche = document.getElementById('domaine');
  if (!D || !S || !couche) return;
  const defile = document.getElementById('d-defile'), page = document.getElementById('d-page');
  const onglets = [...couche.querySelectorAll('.d-onglets [data-domaine]')];
  const dessous = [document.querySelector('.tete'), document.getElementById('deck'), document.querySelector('.pied')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
  let ouvert = null, occupe = false, source = null, cadre = null, vitrine = null, veille = null;

  // ——— Les illustrations : chacune montre exactement ce que dit son texte, dessinée dans la page, sans cadre autour.
  // Les marques connues servent d'exemples (leurs tracés viennent de la bibliothèque libre Simple Icons).
  const G = {
    apple: 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
    nike: 'M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z',
    instagram: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
  };
  const glyphe = (m) => `<svg class="glyphe" viewBox="0 0 24 24" aria-hidden="true"><path d="${G[m]}"/></svg>`;
  const pomme = (x, y) => `<path class="plein" transform="translate(${x - 22} ${y - 22}) scale(1.85)" d="${G.apple}"/>`;
  const img = (src) => `<img src="${src}" alt="" loading="lazy" decoding="async">`;
  const boucle = (slug) => `<video src="assets/loop-${slug}.mp4" poster="assets/couv-${slug}.jpg" muted loop playsinline preload="none"></video>`;
  const tel = (dedans) => `<span class="telephone">${dedans}</span>`;
  const nav = (src) => `<span class="navigateur"><span class="barre"><i></i><i></i><i></i><b>votre-nom.fr</b></span>${img(src)}</span>`;
  const MAILLOT = 'M70 12 L40 24 L8 54 L30 80 L48 66 L48 172 L152 172 L152 66 L170 80 L192 54 L160 24 L130 12 Q100 36 70 12 Z';
  const piece = (classe, dedans, nom) => `<figure><span class="v v-art ${classe}">${dedans}</span><figcaption>${nom}</figcaption></figure>`;
  const PREUVES = {
    // trois marques, aucun nom : on les reconnaît quand même
    marques: () => `<div class="i-marques">${glyphe('apple')}${glyphe('nike')}${glyphe('instagram')}</div>`,
    // un écran de téléphone : parmi vingt-quatre icônes, une seule se reconnaît
    ecran: () => `<div class="i-tel">${Array.from({ length: 24 }, (_, i) => (i === 13 ? `<i class="insta">${glyphe('instagram')}</i>` : '<i></i>')).join('')}</div>`,
    // la même pomme sur la boîte, le sac, l'écran et le téléphone
    partout: () => `<svg class="i-trait" viewBox="0 0 520 440" aria-hidden="true">
      <rect x="40" y="50" width="190" height="130" rx="8"/>${pomme(135, 115)}
      <rect x="310" y="70" width="150" height="130" rx="4"/><path d="M345 70 C345 28 425 28 425 70"/>${pomme(385, 135)}
      <rect x="40" y="250" width="190" height="124" rx="8"/><path d="M135 374 v26 M95 400 h80"/>${pomme(135, 312)}
      <rect x="345" y="236" width="84" height="170" rx="16"/>${pomme(387, 321)}</svg>`,
    // deux tee-shirts blancs identiques, la virgule sur un seul
    teeshirts: () => `<svg class="i-trait" viewBox="0 0 480 190" aria-hidden="true">
      <path transform="translate(14 4)" d="${MAILLOT}"/>
      <path transform="translate(266 4)" d="${MAILLOT}"/><path class="plein" transform="translate(332 60) scale(2.9)" d="${G.nike}"/></svg>`,
    // ce qu'il construit : les quatre pièces de sa propre identité, nommées
    systeme: () => `<div class="i-systeme">${piece('a-signe', img('assets/db-lever.svg'), 'Un signe')}${piece('a-clair', img('assets/db-ciel-profond.svg'), 'Sa version claire')}${piece('a-couleurs', '<i style="background:#FEF9CF"></i><i style="background:#CAF4FF"></i><i style="background:#9FDEFF"></i><i style="background:#58B2FF"></i>', 'Des couleurs')}${piece('a-ecriture', '<b>Aa</b>', 'Une écriture')}</div>`,
    // on tape un nom avant de payer
    recherche: () => `<div class="i-recherche"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span>votre nom</span><i></i></div>`,
    // le réseau renvoie au site
    chezvous: () => `<div class="i-chezvous"><span class="i-reseau insta">${glyphe('instagram')}</span><svg class="i-vers" viewBox="0 0 48 24" aria-hidden="true"><path d="M2 12h42M34 4l10 8-10 8"/></svg><span class="i-fenetre"><b>votre-nom.fr</b><i></i><i></i><i class="court"></i></span></div>`,
    // une page qui se termine par un bouton : c'est là qu'on se décide
    decision: () => `<div class="i-fenetre grande"><b>votre-nom.fr</b><span class="i-photo"></span><i></i><i class="court"></i><em>Commander</em></div>`,
    // trois pages de ce site
    pages: () => `<div class="i-pages">${nav('assets/page-ensemble.jpg')}${nav('assets/page-travail.jpg')}${nav('assets/page-moi.jpg')}</div>`,
    // le fil : une vidéo par seconde
    fil: () => `<div class="i-fil"><span class="i-tel vide"><span class="fil">${'<i></i>'.repeat(7)}</span></span><b>1 s</b></div>`,
    // une canette, et tout ce qu'on a vu avant de l'acheter
    canette: () => `<div class="i-canette"><svg class="i-trait" viewBox="0 0 120 220" aria-hidden="true"><path d="M20 34 Q20 16 60 16 Q100 16 100 34 V190 Q100 206 60 206 Q20 206 20 190 Z M20 34 Q60 50 100 34"/><path d="M50 26 h20"/></svg><span class="i-mur">${'<i></i>'.repeat(15)}</span></div>`,
    // des vidéos semaine après semaine, puis un message
    presence: () => `<div class="i-presence"><span class="i-ligne">${'<i></i>'.repeat(7)}</span><span class="i-bulle">Bonjour, je vous suis depuis un moment.</span></div>`,
    // trois de ses vidéos, en lecture
    trois: () => `<div class="i-trois">${['la-maquette', 'romance', 'deja-chez-eux'].map((x) => tel(boucle(x))).join('')}</div>`,
  };
  const fleche = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const tuile = (id) => document.querySelector(`.brique[data-domaine="${id}"] .vitrine`);

  function remplir(id) {
    const d = D[id], f = D.fin, suivant = D.ordre[(D.ordre.indexOf(id) + 1) % D.ordre.length];
    page.innerHTML = `
      <section class="d-ouverture grille">
        <header class="chapeau"><p class="etiquette">${d.nom}</p><h1 class="dit" id="d-titre">${d.titre}</h1><p class="sous">${d.sous}</p></header>
        <div class="d-scene"><div class="d-cadre"></div></div>
        <span class="d-bas" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </section>
      ${d.blocs.map((b) => `
      <section class="d-bloc grille f-${b.forme}">
        <div class="d-texte" data-r><p class="etiquette">${b.etiquette}</p><h2>${b.titre}</h2>${b.forme === 'centre' ? '' : `<p class="d-corps">${b.texte}</p>`}</div>
        <div class="d-image" data-r style="--i:1" aria-hidden="true">${PREUVES[b.image]()}</div>
        ${b.forme === 'centre' ? `<p class="d-corps d-apres" data-r style="--i:2">${b.texte}</p>` : ''}
      </section>`).join('')}
      <section class="d-fin grille">
        <div class="d-fin-centre" data-r>
          <p class="etiquette">${f.etiquette}</p>
          <h2 class="dit">${f.titre}</h2>
          <p class="d-actions"><button class="envoyer" type="button" data-vers="contact">${f.contact}</button><button class="d-lien" type="button" data-galerie>${f.travail} ${fleche}</button></p>
        </div>
        <button class="d-ensuite" type="button" data-domaine="${suivant}" data-r style="--i:1"><span class="etiquette">${f.ensuite}</span><span class="d-ensuite-nom">${D[suivant].nom} ${fleche}</span></button>
        <p class="d-mention" data-r style="--i:2">${d.mention || ''}</p>
      </section>`;
    cadre = page.querySelector('.d-cadre');
    vitrine = tuile(id).cloneNode(true);
    vitrine.removeAttribute('role'); vitrine.setAttribute('aria-hidden', 'true');
    cadre.appendChild(vitrine);
    onglets.forEach((o) => { const ici = o.dataset.domaine === id; o.classList.toggle('ici', ici); if (ici) o.setAttribute('aria-current', 'page'); else o.removeAttribute('aria-current'); });
    couche.setAttribute('aria-label', d.nom);
    ouvert = id;
    regler(); surveiller();
  }

  // l'image d'ouverture est la vitrine de la carte, à la même forme, agrandie : c'est elle qui fait le passage
  function regler() {
    if (!cadre || !ouvert) return;
    const t = tuile(ouvert), tw = t.offsetWidth || 4, th = t.offsetHeight || 3;
    const scene = cadre.parentElement, etroit = matchMedia('(max-width: 760px)').matches;   // au téléphone, l'image prend la largeur
    const l = etroit ? scene.clientWidth : Math.min(scene.clientWidth, scene.clientHeight * tw / th);
    cadre.style.width = l + 'px'; cadre.style.height = (l * th / tw) + 'px';
    vitrine.style.width = tw + 'px'; vitrine.style.height = th + 'px';
    vitrine.style.transform = `scale(${(l / tw).toFixed(4)})`;
  }

  // ce qui est à l'écran se montre et joue ; le reste attend
  function surveiller() {
    if (veille) veille.disconnect();
    veille = new IntersectionObserver((vus) => vus.forEach((v) => {
      if (v.isIntersecting) v.target.classList.add('vue');
      v.target.classList.toggle('en-vue', v.isIntersecting);
      v.target.querySelectorAll('video').forEach((x) => { if (v.isIntersecting) x.play().catch(() => {}); else x.pause(); });
    }), { root: defile, threshold: 0.2 });
    page.querySelectorAll('.d-ouverture, .d-bloc, .d-fin').forEach((s) => veille.observe(s));
  }

  const boite = (r) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 6px)`;
  const PLEIN = 'inset(0px 0px 0px 0px round 0px)';
  // la page vue à travers la carte : à l'instant zéro, son image d'ouverture recouvre exactement la vitrine de la carte
  function passage(sens) {
    const T = tuile(ouvert).getBoundingClientRect(), H = cadre.getBoundingClientRect();
    const s = T.width / H.width, de = `translate(${T.left - H.left * s}px, ${T.top - H.top * s}px) scale(${s})`;
    const ms = sens > 0 ? 860 : 680, o = { duration: ms, easing: EASE, fill: 'both' };
    defile.style.transformOrigin = '0 0';
    const a = couche.animate(sens > 0 ? [{ clipPath: boite(T) }, { clipPath: PLEIN }] : [{ clipPath: PLEIN }, { clipPath: boite(T) }], o);
    const b = defile.animate(sens > 0 ? [{ transform: de }, { transform: 'none' }] : [{ transform: 'none' }, { transform: de }], o);
    return a.finished.then(() => [a, b]);
  }

  function poser(oui) {
    couche.hidden = !oui; app.classList.toggle('en-domaine', oui);
    dessous.forEach((e) => { if (e) e.inert = oui; });
    document.querySelectorAll('.pane.ici .telephone video').forEach((v) => { if (oui) v.pause(); else v.play().catch(() => {}); });
  }

  function ouvrir(id, depuis, anime = true) {
    if (!D[id] || occupe || S.occupe() || app.classList.contains('en-galerie')) return;
    if (ouvert) { changer(id); return; }
    if (!document.getElementById('ensemble').classList.contains('ici')) S.poser(S.indexDe('ensemble'));
    source = depuis || null;
    poser(true); remplir(id); defile.scrollTop = 0;
    history.replaceState(null, '', '#' + id);
    const pret = () => { occupe = false; couche.classList.add('la'); couche.querySelector('.d-fermer').focus({ preventScroll: true }); };
    if (!anime || reduced || !tuile(id).offsetWidth) { pret(); return; }
    occupe = true;
    passage(1).then((anims) => { anims.forEach((x) => x.cancel()); pret(); });
  }

  function vider() {
    poser(false); couche.classList.remove('la'); if (veille) veille.disconnect();
    page.textContent = ''; ouvert = null; cadre = vitrine = null; occupe = false;
  }

  function fermer() {
    if (!ouvert || occupe) return;
    occupe = true;
    const fin = () => { vider(); history.replaceState(null, '', '#ensemble'); if (source && source.isConnected) source.focus({ preventScroll: true }); };
    if (reduced) { fin(); return; }
    if (defile.scrollTop > 6 || !tuile(ouvert).offsetWidth) {   // plus bas dans la page : elle s'efface simplement
      couche.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease', fill: 'both' }).finished.then((a) => { fin(); a.cancel(); });
      return;
    }
    defile.scrollTop = 0;
    couche.classList.remove('la');   // le fond gris de la carte revient avant qu'elle ne se referme
    setTimeout(() => passage(-1).then((anims) => { fin(); anims.forEach((x) => x.cancel()); }), 200);
  }

  // d'un métier à l'autre, ou vers une autre partie du site : la page s'efface, la suivante arrive
  function fondu(entre) {
    occupe = true;
    if (reduced) { entre(); occupe = false; return; }
    page.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease', fill: 'both' }).finished.then((a) => {
      entre(); a.cancel();
      page.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).finished.then(() => { occupe = false; });
    });
  }
  function changer(id) {
    if (occupe || id === ouvert) return;
    fondu(() => { remplir(id); defile.scrollTop = 0; history.replaceState(null, '', '#' + id); });
  }
  function versContact() {
    if (occupe) return;
    occupe = true;
    S.poser(S.indexDe('contact'));
    const fin = () => { vider(); history.replaceState(null, '', '#contact'); };
    if (reduced) { fin(); return; }
    couche.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: 'ease', fill: 'both' }).finished.then((a) => { fin(); a.cancel(); });
  }

  document.addEventListener('click', (e) => {
    const d = e.target.closest('[data-domaine]');
    if (d) { e.preventDefault(); ouvrir(d.dataset.domaine, d.closest('.brique')); return; }
    if (!ouvert) return;
    if (e.target.closest('[data-domaine-fermer]')) { e.preventDefault(); fermer(); return; }
    if (e.target.closest('#domaine [data-vers="contact"]')) { versContact(); return; }
    // « Voir mon travail » : la galerie s'ouvre par-dessus (galerie.js), puis cette page se retire sans bruit
    if (e.target.closest('#domaine [data-galerie]')) setTimeout(() => { if (app.classList.contains('en-galerie')) vider(); }, 1000);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && ouvert && !app.classList.contains('en-galerie')) { e.preventDefault(); fermer(); } });
  addEventListener('resize', regler);

  window.DOMAINE = { ouvrir, fermer, ouvert: () => ouvert };

  // une adresse qui nomme un métier (#identite, #site, #contenu) ouvre sa page d'emblée
  const depart = (window.__hash0 || '').slice(1);
  if (D[depart] && D.ordre.includes(depart)) ouvrir(depart, null, false);
})();
