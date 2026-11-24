/* Les pièces de la galerie « Mon travail ». UNE ligne par pièce : pour en retirer une, on supprime sa ligne ;
   pour en ajouter une, on en écrit une. L'ordre de cette liste est l'ordre de la grille.
   type    : ce que la pièce prouve de ce qu'il vend (contenu, identite, site)
   media   : film  = une de ses vidéos 9:16 (assets/couv-<slug>.jpg, loop-<slug>.mp4, <slug>.mp4)
             large = une vidéo 16:9 (img = image fixe, video = fichier)
             site  = une capture de page (img)
             art   = une pièce de son identité dessinée dans la page (signe, clair, couleurs, ecriture)
   date    : année-mois de publication (pour ses films : lue dans le lien Instagram) */
window.RESEAUX = { instagram: 'https://www.instagram.com/david_benittah/', tiktok: 'https://www.tiktok.com/@david_benittah' };
window.TRAVAIL = [
  { type: 'contenu', titre: 'Open anywhere.', secteur: 'Publicité', date: '2026-10', note: 'Film non officiel, sans lien avec la marque.', media: { genre: 'film', slug: 'open-anywhere' }, ig: 'https://www.instagram.com/reel/DezYnH5IFMR/' },
  { type: 'identite', titre: 'Le signe.', secteur: 'Mon identité', date: '2026-11', media: { genre: 'art', art: 'signe' } },
  { type: 'contenu', titre: 'Choisi en dernier.', secteur: 'Publicité', date: '2026-10', note: 'Film non officiel, sans lien avec la marque.', media: { genre: 'film', slug: 'choisi-en-dernier' }, ig: 'https://www.instagram.com/reel/DehVrYlxRwa/' },
  { type: 'contenu', titre: 'Pourquoi on vous remarque.', secteur: 'Motion design', date: '2026-11', media: { genre: 'large', img: 'assets/film-ouverture.jpg', video: 'assets/film-ouverture.mp4' } },
  { type: 'contenu', titre: 'Ce resto n’existe pas.', secteur: 'Restauration', date: '2026-09', media: { genre: 'film', slug: 'la-maquette' }, ig: 'https://www.instagram.com/reel/Dd6tOOBRJ71/' },
  { type: 'contenu', titre: 'Personne n’y résiste.', secteur: 'Publicité', date: '2026-10', note: 'Film non officiel, sans lien avec la marque.', media: { genre: 'film', slug: 'personne-ny-resiste' }, ig: 'https://www.instagram.com/reel/DfC3aNSRYK_/' },
  { type: 'site', titre: 'Ce site.', secteur: 'Mon site', date: '2026-11', note: 'Vous êtes dessus.', media: { genre: 'site', img: 'assets/apercu-site.jpg' } },
  { type: 'contenu', titre: 'Ils ne se connaissent pas encore.', secteur: 'Immobilier', date: '2026-09', media: { genre: 'film', slug: 'romance' }, ig: 'https://www.instagram.com/reel/Dc_fbYACOs3/' },
  { type: 'identite', titre: 'Les couleurs.', secteur: 'Mon identité', date: '2026-11', media: { genre: 'art', art: 'couleurs' } },
  { type: 'contenu', titre: 'Protège ton rêve.', secteur: 'Cinéma', date: '2026-09', note: 'Film non officiel, sans lien avec le film d’origine.', media: { genre: 'film', slug: 'le-reve' }, ig: 'https://www.instagram.com/reel/Dd1vDb3xV5e/' },
  { type: 'contenu', titre: 'Je bosse où je veux.', secteur: 'Produit', date: '2026-09', media: { genre: 'film', slug: 'bureau' }, ig: 'https://www.instagram.com/reel/Dc8uzmKM2xC/' },
  { type: 'contenu', titre: 'Vous avez choisi ?', secteur: 'Humour', date: '2026-10', media: { genre: 'film', slug: 'la-flamme' }, ig: 'https://www.instagram.com/reel/DewykKAIF5k/' },
  { type: 'identite', titre: 'L’écriture.', secteur: 'Mon identité', date: '2026-11', media: { genre: 'art', art: 'ecriture' } },
  { type: 'contenu', titre: 'Ils y vivent déjà.', secteur: 'Immobilier', date: '2026-08', media: { genre: 'film', slug: 'deja-chez-eux' }, ig: 'https://www.instagram.com/reel/Dcq5X4BMFGN/' },
  { type: 'contenu', titre: 'Nouvelle ère.', secteur: 'Récit', date: '2026-09', media: { genre: 'film', slug: 'nouvelle-ere' }, ig: 'https://www.instagram.com/reel/Dc1S-XvMDNN/' },
  { type: 'contenu', titre: 'Tout tient dans une poche.', secteur: 'Produit', date: '2026-09', media: { genre: 'film', slug: 'iphone' }, ig: 'https://www.instagram.com/reel/DdEXi0So40P/' },
  { type: 'identite', titre: 'Sur fond clair.', secteur: 'Mon identité', date: '2026-11', media: { genre: 'art', art: 'clair' } },
  { type: 'contenu', titre: 'Oublier l’écran.', secteur: 'Imaginaire', date: '2026-09', media: { genre: 'film', slug: 'votre-histoire' }, ig: 'https://www.instagram.com/reel/DdZcUi6MFeT/' },
];
