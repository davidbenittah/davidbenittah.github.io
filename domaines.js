/* Les trois métiers : une page entière par métier, ouverte depuis sa carte de la page « Ce que je construis ».
   Tout le texte est ici. Chaque page répond dans l'ordre à : c'est quoi, pourquoi, à quoi ça sert, et pour vous,
   avec des marques que tout le monde connaît, puis ce que David construit. Le lecteur ne doit plus voir le métier
   de la même façon en sortant (David, 23/11 : « il doit y'avoir un avant apres cette page dans sa maniere de raisonner »).
   forme  : centre  = titre au centre, image dessous, texte sous l'image
            gauche  = texte à gauche, image à droite
            droite  = image à gauche, texte à droite
   image  : une illustration dessinée dans la page (domaine.js, PREUVES), qui montre exactement ce que dit le texte :
            marques, ecran, partout, teeshirts, systeme, recherche, chezvous, decision, pages, fil, canette, presence, trois */
window.__hash0 = location.hash;
window.DOMAINES = {
  ordre: ['identite', 'site', 'contenu'],
  fin: { etiquette: 'Votre projet', titre: 'Dites-moi ce que vous vendez.', contact: 'Parlons de votre projet', travail: 'Voir mon travail', ensuite: 'Ensuite' },

  identite: {
    nom: 'Identité de marque',
    titre: 'Ce qui fait qu’on vous reconnaît sans lire votre nom.',
    sous: 'Une identité de marque, c’est un signe, des couleurs et une écriture, toujours les mêmes, partout où l’on vous croise.',
    mention: 'Apple, Nike et Instagram sont cités comme exemples. Je n’ai aucun lien avec ces marques.',
    blocs: [
      { forme: 'centre', etiquette: 'Faites l’essai', titre: 'Trois entreprises. Aucun nom.', image: 'marques', texte: 'Vous les avez reconnues avant la fin de cette phrase. Personne ne vous a rien expliqué : un signe a suffi. C’est ça, une identité de marque.' },
      { forme: 'gauche', etiquette: 'À quoi ça sert', titre: 'D’abord, à être reconnu.', image: 'ecran', texte: 'Sur un écran, on vous accorde une seconde. Personne ne lit un nom dans ce délai. Une forme et une couleur, si : sur votre téléphone, vous trouvez Instagram sans chercher, au milieu de dizaines d’autres.' },
      { forme: 'droite', etiquette: 'À quoi ça sert', titre: 'Ensuite, à inspirer confiance.', image: 'partout', texte: 'Chez Apple, la boîte, le sac, l’écran et le téléphone portent la même pomme, posée avec le même soin. On n’a pas encore touché le produit, et on le croit déjà bon. Une marque qui se ressemble partout a l’air de savoir ce qu’elle fait.' },
      { forme: 'gauche', etiquette: 'À quoi ça sert', titre: 'Enfin, à valoir plus cher.', image: 'teeshirts', texte: 'Prenez deux tee-shirts blancs, le même coton, la même coupe. Posez la virgule de Nike sur l’un des deux. Vous savez lequel se vend le plus cher, et le tissu n’y est pour rien.' },
      { forme: 'centre', etiquette: 'Et pour vous', titre: 'Vous n’avez pas besoin d’être Apple.', image: 'systeme', texte: 'Le mécanisme est le même à votre taille. Dans votre secteur, vous êtes dix à vendre la même chose : celui qu’on reconnaît est celui qu’on rappelle. Je construis ces quatre pièces pour vous, et la façon de s’en servir. Ci-dessus, les miennes.' },
    ],
  },

  site: {
    nom: 'Site',
    titre: 'Le seul endroit d’internet qui est à vous.',
    sous: 'Un site, c’est là qu’on vient vérifier qui vous êtes, et là qu’on se décide.',
    mention: 'Nike, Instagram et Tesla sont cités comme exemples. Je n’ai aucun lien avec ces marques.',
    blocs: [
      { forme: 'centre', etiquette: 'Faites l’essai', titre: 'La dernière fois que vous avez hésité, vous avez tapé un nom.', image: 'recherche', texte: 'Un restaurant, un artisan, une marque : avant de payer, tout le monde vérifie. Vos clients font pareil avec vous. La seule question est ce qu’ils trouvent.' },
      { forme: 'gauche', etiquette: 'Pourquoi', titre: 'Sur les réseaux, vous êtes locataire.', image: 'chezvous', texte: 'Nike a des centaines de millions d’abonnés sur Instagram. Chacune de ses publications renvoie pourtant au même endroit : son site. Un réseau peut changer ses règles demain. Votre site ne dépend que de vous.' },
      { forme: 'droite', etiquette: 'À quoi ça sert', titre: 'C’est là qu’on se décide.', image: 'decision', texte: 'Tesla n’a pas de concessionnaire : la voiture se choisit et se commande sur son site. Si une voiture se vend sur une page, votre offre peut s’y expliquer, s’y montrer et s’y conclure.' },
      { forme: 'centre', etiquette: 'Ce que je construis', titre: 'Un salon, pas une vitrine.', image: 'pages', texte: 'Une vitrine, on passe devant. Un salon, on y entre et on sait chez qui on est. Vous êtes sur un site construit de cette façon : une idée par page, rien qui déborde, un chemin court jusqu’à moi.' },
    ],
  },

  contenu: {
    nom: 'Contenu réseaux',
    titre: 'Ce qu’on voit de vous quand on ne vous cherche pas.',
    sous: 'Le contenu, ce sont les vidéos qui vous gardent sous les yeux de vos clients, semaine après semaine.',
    mention: 'Red Bull est cité comme exemple. Je n’ai aucun lien avec cette marque.',
    blocs: [
      { forme: 'centre', etiquette: 'Faites l’essai', titre: 'Hier soir, vous avez fait défiler des dizaines de vidéos.', image: 'fil', texte: 'Chacune a eu une seconde. Vous en avez gardé une ou deux en tête, et rarement la plus belle : presque toujours quelqu’un que vous aviez déjà vu.' },
      { forme: 'gauche', etiquette: 'Pourquoi', titre: 'Red Bull vend une canette.', image: 'canette', texte: 'Ce que vous connaissez d’eux, ce sont des sauts, des courses, des exploits : des vidéos. La canette, on l’achète parce qu’on a vu tout le reste. Les marques publient sans arrêt pour une raison simple : on achète à ceux qu’on a déjà vus.' },
      { forme: 'droite', etiquette: 'À quoi ça sert', titre: 'À être là le jour où l’on a besoin de vous.', image: 'presence', texte: 'Personne n’achète le jour où il vous découvre. On vous croise une fois, puis dix, et le jour où le besoin arrive, votre nom vient tout seul. Une vidéo seule s’oublie. Une présence régulière s’installe.' },
      { forme: 'centre', etiquette: 'Ce que je construis', titre: 'Le niveau d’un studio, au rythme des réseaux.', image: 'trois', texte: 'Ce qui demandait un plateau et une équipe se fabrique aujourd’hui pour dix fois moins. Être présent chaque semaine avec des images de ce niveau n’est plus réservé aux grandes marques. Ci-dessus, trois de mes vidéos.' },
    ],
  },
};
