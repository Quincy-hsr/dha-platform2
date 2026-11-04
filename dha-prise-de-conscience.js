/* =========================================================
   DHA — Mindset · Développement personnel (« Prise de conscience »)
   Partie 1 : parcours obligatoire, +50 XP par vidéo vue (clé pc_v<n>), +100 XP à la fin (pc_fin).
   Partie 2 : bibliothèque par chapitres, à son rythme (pas d'XP).
   Vidéos chargées seulement au clic (miniature → lecteur YouTube).
   ========================================================= */
(function () {
  var XP_VIDEO = 50, XP_FIN = 100, ATTENTE = 60; // secondes de lecture avant « J'ai regardé »

  /* ---------- Partie 1 : la prise de conscience ---------- */
  var P1 = [
    { t: 'Le point de départ', html:
      '<p class="pc-q">La personne que tu es aujourd\'hui te permet d\'avoir les résultats que tu as actuellement.</p>' +
      '<p>Les lois du succès sont précises. Si tu les négliges, tu as déjà perdu. Le jour où tu comprends que tu es <b>responsable de tout ce que tu as et de tout ce que tu n\'as pas</b> dans ta vie, tu as gagné.</p>' +
      '<p>Sans comprendre, prendre conscience et appliquer ce contenu, tu plafonneras. Tu dois <b>devenir</b> un succès pour en avoir.</p><p class="pc-sign">Bon voyage, bonne évolution.</p>' },
    { t: 'Pilule bleue ? Pilule rouge ?', v: [['eig3Bw_O434', 'Pilule bleue ou pilule rouge']],
      html: '<img class="pc-img" src="mindset/pilules.jpg" alt="Pilule rouge et pilule bleue" loading="lazy"><p>Dans ce parcours, on va te transmettre 0,00005 % de la pilule rouge… 🔴</p>' },
    { t: 'Une manière différente de voir les choses', v: [['1ni6zJ3BAwg', 'Une manière différente de voir les choses'], ['HFbJz_sAOt8', 'Voir les choses autrement (suite)']],
      html: '<p>On peut suggérer à ton cerveau de prendre conscience… mais en aucun cas on ne peut agir à ta place.</p>' },
    { t: 'Robert Kiyosaki va t\'ouvrir les yeux', v: [['Hwom46OTKbY', 'Un épisode de Robert Kiyosaki']] },
    { t: 'Le conditionnement', v: [['2uG3IliVCUY', 'Intéressons-nous à notre génération']],
      html: '<p>L\'être humain a trop tendance à négliger les informations qu\'il a eues « gratuitement » sur Internet.</p>' +
        '<p class="pc-big">Arrête de paraître ❌ → <b>sois</b> ✅</p>' +
        '<p>Nous sommes victimes de notre ignorance. Nous passons plus de temps à nous divertir avec les médias qu\'à nous instruire avec Internet et les livres 📚. Tout ça est dû à notre <b>conditionnement</b> :</p>' +
        '<img class="pc-img" src="mindset/conditionnement.jpg" alt="Définition du conditionnement" loading="lazy">' },
    { t: 'Médias contre Internet',
      html: '<p>Un schéma pour résumer le fonctionnement des médias face à Internet :</p><img class="pc-img" src="mindset/echange.jpg" alt="Schéma médias face à Internet" loading="lazy">' +
        '<p><b>Ne lis pas pour lire 📚.</b> Examine et applique les conseils des personnes qui ont les résultats que tu veux, et n\'oublie jamais que « tu ne sais pas ce que tu ne sais pas ».</p><img class="pc-img" src="mindset/medias.jpg" alt="Télévision face à Internet" loading="lazy">' },
    { t: 'Où en serais-tu aujourd\'hui ?',
      html: '<p>Bob Proctor, Napoléon Hill, Kevin Trudeau, Tony Robbins… Nombreux sont ceux qui savent et qui ont réussi. Mais combien de personnes autour de toi évoluent vraiment, en attitude et en argent ?</p>' +
        '<p>Si tu ne te développes pas mentalement et que tu n\'utilises pas consciemment les lois universelles en ta faveur, <b>tu plafonneras dans tes résultats</b>. Aujourd\'hui, tout le monde utilise ces lois sans en avoir conscience.</p>' +
        '<p class="pc-q">Si toutes ces heures passées sur ta console 🕹 ou devant la télé réalité 🖥, tu les avais utilisées pour ton développement 🧠… où en serais-tu aujourd\'hui ?</p><img class="pc-img" src="mindset/libre.jpg" alt="Je suis libre" loading="lazy">' },
    { t: 'Casser les croyances limitantes', vAvant: true, v: [['mmTAkWT8ZkA', 'Briser ses chaînes : d\'où viennent les croyances'], ['lLF17MleKD4', 'Casser les croyances limitantes']],
      html: '<p class="pc-q">Si tous ces achats compulsifs que tu faisais juste pour « paraître », tu les avais investis… où en serais-tu aujourd\'hui ?</p><img class="pc-img" src="mindset/shopping.jpg" alt="Achats compulsifs" loading="lazy">' +
        '<p>On n\'achète plus des besoins, mais des envies. Il faut trouver un équilibre ⚖️. Ce sont les questions que je me suis posées quand je suis arrivé à un certain stade de ma vie (découvert, dettes, crédits…). <b>J\'en avais marre d\'en avoir marre !</b></p><img class="pc-img" src="mindset/marre.jpg" alt="Ras le bol" loading="lazy">' +
        '<p>La vérité, c\'est qu\'on veut tous de l\'<b>argent</b>… mais on ne sait même pas ce que c\'est réellement.</p>' },
    { t: 'L\'argent, le travail et la loi des 40/40/40', v: [['hhEZzCe7A28', 'Rêveur ou suiveur ? Aller à contre-courant']],
      html: '<div class="pc-3"><div>💸<b>Tu le dépenses</b></div><div>🏦<b>Tu l\'épargnes</b></div><div>📈<b>Tu l\'investis</b></div></div>' +
        '<p>Avec le travail, c\'est encore plus simple : soit tu travailles pour quelqu\'un toute ta vie en espérant une retraite, soit tu <b>entreprends</b> en parallèle de ton travail ou de tes études. Prends ta vie en main, travaille dur sur toi-même, entoure-toi des bonnes personnes 💼</p>' +
        '<div class="pc-callout"><b>La triste loi des 40/40/40</b>Après 40 ans de travail, beaucoup de retraités touchent environ 40 % de leurs anciens revenus. 40 % de 10 000 €/mois, c\'est 4 000 €. Mais 40 % d\'un SMIC, c\'est quelques centaines d\'euros par mois.</div>' },
    { t: 'Ta coachabilité', html:
      '<p class="pc-big">C\'est ta <b>coachabilité</b> qui définira ton niveau de réussite.</p><img class="pc-img" src="mindset/coach.jpg" alt="Coach et joueur" loading="lazy">' +
      '<p>Savoir mettre ta fierté, ton ego et tes anciennes croyances de côté pour laisser place à de nouvelles façons de penser 🧬. Il y a un prix à payer : si tu n\'es pas prêt à faire des sacrifices, tu n\'auras pas de succès.</p>' +
      '<ul class="pc-list"><li>🙊 <span><b>Être incompris</b> par une grande partie de ton entourage pendant un moment.</span></li>' +
      '<li>💰 <span><b>En argent :</b> investir sur toi et ton business devient une priorité (livres, formations, séminaires…).</span></li>' +
      '<li>⏳ <span><b>En temps :</b> ne pas compter tes heures, mettre de côté certains loisirs, rester focus pendant que les autres sortent.</span></li></ul>' +
      '<p class="pc-q">En résumé : sacrifier la personne que tu es… pour celle que tu veux devenir.</p>' },
    { t: 'Le comité de Murphy', v: [['H47gjfkpBbE', 'Êtes-vous un rhinocéros ou une vache ? (Jerry Clark)']] },
    { t: 'Les 14 lois universelles', v: [['dalbFra9LFc', 'Le pouvoir des 14 lois universelles'], ['rzhF2zFGY9Y', 'Le film « Le Secret » (Rhonda Byrne, avec Bob Proctor)']],
      html: '<img class="pc-img" src="mindset/cerveau.jpg" alt="Les lois universelles" loading="lazy"><p>Crois-tu que tout arrive par <b>hasard</b>, ou que ton <b>destin</b> est déjà tracé ? Personne d\'autre que <b>toi</b> ne tire les ficelles. Tant que tu ne prends pas 100 % de la responsabilité de ce qui t\'arrive, tu ne pourras jamais reprendre le contrôle.</p>' +
        '<p>L\'univers est régi par des lois que tu en aies conscience ou non. Découvre-les pour mieux comprendre le monde qui t\'entoure.</p><img class="pc-img" src="mindset/lois.jpg" alt="Les 14 lois universelles" loading="lazy">' }
  ];

  /* ---------- Partie 2 : la bibliothèque ---------- */
  var BIB = [
    { ic: '🎓', t: 'Bob Proctor', d: 'Le mentor de centaines de milliers de personnes. 7 vidéos pour comprendre qui tu es réellement, puis la suite.', v: [
      ['N1k1oxHNCi0', 'Savez-vous qui vous êtes ?'], ['lnf8UOuluOc', 'Le secret de la loi d\'attraction'], ['UYn4tIQjpkE', 'L\'esprit subconscient et comment le contrôler'], ['hFxbU8rKY5Q', 'Une habitude indispensable à adopter'],
      ['4MzwuMo0rTk', 'Changez vos habitudes, changez votre vie'], ['ZbM07db-awQ', 'La loi de la vibration'], ['Shl3I7xG5K0', 'La loi de l\'attraction expliquée'],
      ['xW4JBOMhrno', 'Élever ta fréquence pour atteindre tes objectifs'], ['2Bq8Py6H_1M', 'Augmenter ses vibrations'], ['tCTobIN6oIM', 'Développer son intuition (sous-titré)'], ['oh8JfSalvR8', 'Adopter une bonne attitude'], ['zHgy6W_nE3U', 'Changer sa perception, changer sa vie']] },
    { ic: '📜', t: 'Napoléon Hill', d: 'L\'auteur de « Réfléchissez et devenez riche ».', v: [['SBzBIOJ2SoI', 'Les clés secrètes du succès'], ['iTIN8761pQ0', '20 choses qui ont changé le monde']],
      l: [['Réfléchissez et devenez riche', 'https://www.amazon.fr/R%C3%A9fl%C3%A9chissez-devenez-riche-Napoleon-Hill/dp/2922405303'], ['Plus malin que le diable', 'https://www.amazon.fr/dp/2370650001']] },
    { ic: '🎙️', t: 'Earl Nightingale & Kevin Trudeau', d: 'Le plus étrange des secrets, et la visualisation créatrice.', v: [['FTMYM7lIRlg', 'Le plus étrange des secrets'], ['hvKiQBpwLiA', 'Créer un tableau de visualisation créatrice']] },
    { ic: '📚', t: 'Les livres à avoir', d: 'Dans les livres, il y a des choses qu\'il n\'y a pas dans les vidéos. « Les grands leaders de ce monde sont de grands lecteurs. » Dans l\'ordre :', l: [
      ['L\'entreprise du 21e siècle · Robert Kiyosaki', 'https://www.amazon.fr/Lentreprise-21e-si%C3%A8cle-Robert-Kiyosaki/dp/2892257824'], ['Go Pro · Eric Worre', 'https://www.amazon.fr/Go-pro-Eric-Worre/dp/2892258464'],
      ['Réfléchissez et devenez riche · Napoléon Hill', 'https://www.amazon.fr/R%C3%A9fl%C3%A9chissez-devenez-riche-Napoleon-Hill/dp/2922405303'], ['La magie de croire · Claude M. Bristol', 'https://www.amazon.fr/MAGIE-CROIRE-Claude-M-Bristol/dp/2892255880'],
      ['Comment se faire des amis · Dale Carnegie', 'https://www.amazon.fr/Comment-faire-amis-Dale-Carnegie/dp/2253009105'], ['Les 5 niveaux du leadership · John C. Maxwell', 'https://www.amazon.fr/5-Niveaux-du-Leadership/dp/2922713148'],
      ['La magie de voir grand · David J. Schwartz', 'https://www.amazon.fr/magie-voir-grand-David-Schwartz/dp/2892258944'], ['Rendez-vous au sommet · Zig Ziglar', 'https://www.amazon.fr/dp/2892258952'],
      ['Confiance illimitée · Franck Nicolas', 'https://www.amazon.fr/Confiance-Illimit%C3%A9e-Franck-Nicolas/dp/2892258375'], ['Plus malin que le diable · Napoléon Hill', 'https://www.amazon.fr/dp/2370650001'],
      ['La maîtrise de la persuasion · Napoléon Hill', 'https://www.amazon.fr/ma%C3%AEtrise-persuasion-Votre-attitude-millions/dp/2370650109'], ['Les quatre accords toltèques · Don Miguel Ruiz', 'https://www.amazon.fr/quatre-accords-tolt%C3%A8ques-libert%C3%A9-personnelle/dp/2889116549'],
      ['Demandez et vous recevrez · Esther et Jerry Hicks', 'https://www.amazon.fr/Demandez-vous-recevrez-manifestation-lenseignement/dp/2290114219'], ['Le fonceur · Peter B. Kyne', 'https://www.amazon.fr/FONCEUR-Peter-Kyne/dp/2892256283'],
      ['Comment parler en public · Dale Carnegie', 'https://www.amazon.fr/dp/2253061204'], ['Les secrets du parrainage · Tom « Big Al » Schreiter', 'https://www.amazon.fr/dp/2922882101'],
      ['Le plus étrange des secrets · Earl Nightingale', 'https://www.amazon.fr/dp/1607962705'], ['Devenir super conscient · Joe Dispenza', 'https://www.amazon.fr/dp/2813215775'],
      ['La maîtrise de l\'amour · Don Miguel Ruiz', 'https://www.amazon.fr/ma%C3%AEtrise-lamour-Don-Miguel-Ruiz/dp/2889118169'], ['Rompre avec soi-même pour se créer à nouveau · Joe Dispenza', 'https://www.amazon.fr/dp/2896261222'],
      ['L\'homme le plus riche de Babylone · George S. Clason', 'https://www.amazon.fr/dp/1607964252'], ['Miracle Morning · Hal Elrod', 'https://www.amazon.fr/dp/275408472X']] },
    { ic: '🤝', t: 'Business & leadership', d: 'Eric Worre, Jim Rohn, Holton Buggs, Don Failla.', v: [
      ['VBLCXuQ_Eg0', 'La puissance du marketing relationnel · Eric Worre'], ['0YKZ5sl6UYo', 'Développer son entreprise · Jim Rohn'], ['XgVz0IqXllg', 'Les clés du développement personnel · Jim Rohn'],
      ['g-NFDnzaqOI', 'Recruter 20 personnes en 30 jours · Eric Worre'], ['hHO-vI0IHVY', 'Changer votre vie en 90 jours · Eric Worre'], ['tcI2uAsPtOI', 'Comment lancer un gros réseau · Holton Buggs'], ['548Nsl6pFtM', '45 secondes qui changeront votre vie · Don Failla']] },
    { ic: '💪', t: 'Confiance, concentration & communication', d: 'Estime de soi, regard des autres, focus, posture et prise de parole.', v: [
      ['-YV17U4J_4g', 'La confiance en soi'], ['FOT8imeq2RQ', 'Retrouver l\'estime de soi · David Laroche'], ['uWG0WGq4nVY', 'Apprendre à vraiment se concentrer · Dandapani'], ['CzCVnx2V8TM', 'Se concentrer (suite)'],
      ['jlC2MRlDrG0', 'Passer au-dessus du regard des autres · David Laroche'], ['aI3okGwrt-s', 'Traverser les moments difficiles · Sadhguru'], ['MNYz9y82FPA', 'Améliorer ta concentration'], ['pLAuIT0zcQE', 'Organisation et productivité'],
      ['g-LnOvguN7U', 'Productivité (suite)'], ['tZ4n0bHeXsw', 'Améliorer ton comportement · Neil Strauss'], ['yVYcmfv5FAg', 'L\'attitude à adopter'], ['stbNf4i9t6k', 'Améliorer ta posture'],
      ['XaHph6yBHY0', 'Comment vendre sans vendre · Big Al'], ['ZQNBfE85n2s', 'Améliorer sa prise de parole en public'], ['4po9h1uYmh4', 'Prise de parole (suite)'], ['LnziVpXhM68', 'L\'art d\'avoir toujours raison']] },
    { ic: '🪞', t: 'L\'ego', d: 'Le comprendre pour arrêter qu\'il décide à ta place.', v: [
      ['FYIT_GiOpoY', 'Qu\'est-ce que l\'ego ?'], ['eOosLK8s8Vw', 'Comment se débarrasser de l\'ego'], ['DSwJ9iHuWHg', 'D\'où vient l\'ego'], ['t_Kkt9nJO44', 'Être sans ego'], ['X31z3VlrHus', '7 façons de tuer son ego · David Laroche']] },
    { ic: '🧠', t: 'Le subconscient & les croyances', d: 'Comment ton cerveau fonctionne et comment le reprogrammer.', v: [
      ['7bhb4axOzIg', 'Comment attirer l\'argent'], ['3YXGCa89S2g', 'La puissance de votre subconscient'], ['beLXeGRzNfA', 'Penser en termes d\'énergie et de vibrations'], ['BPM2baHYTN0', 'Génétique et épigénétique (partie 1)'],
      ['Qlw_ORM_Cqs', 'Génétique et épigénétique (partie 2)'], ['_D95Q9kcrYQ', 'La biologie des croyances'], ['Hp5C0w2YUII', 'Comment mieux utiliser son cerveau'], ['sQToC65N0vU', 'Reprogrammer son subconscient']] },
    { ic: '✨', t: 'Joe Dispenza : devenir super conscient', d: 'Visualisation, moment présent, gestion des émotions.', v: [
      ['MMd6sOQlXtI', 'Débloque ton esprit au potentiel infini'], ['oI7xMCuPVsY', 'Deviens super conscient (1)'], ['Bo05z0LdDMg', 'Deviens super conscient (2)'], ['qv9qk0IfZ3E', 'Deviens super conscient (3)'], ['AHeWbQKHJ3M', 'Deviens super conscient (4)'],
      ['3T4FK6KB9kU', 'Réussir grâce à la visualisation'], ['XvNSgiO9alQ', 'Attirer et manifester tes rêves'], ['i2qabB0o29c', 'L\'importance du moment présent'], ['GZC1zTuDEHU', 'La gestion des émotions'], ['zrz5jQs3k7U', 'Rompre avec soi-même pour se créer à nouveau']] },
    { ic: '❤️', t: 'La cohérence du cœur', d: 'Prendre de meilleures décisions, plus calmement.', v: [
      ['F-a1P6Hq184', 'La cohérence du cœur'], ['9Eo7OgMKEa8', 'Application'], ['GxQW6SZFu-0', 'Avant de prendre une décision'], ['QCLSbpEWF-M', 'Le secret de la prière']] },
    { ic: '🔭', t: 'Les facultés de l\'esprit', d: 'Les niveaux de conscience, la perception, la mémoire, l\'intuition, l\'imagination et la volonté.', v: [
      ['a7BeL5tx9ps', 'Les niveaux de conscience de D. Hawkins (1)'], ['6YqqRiS9ICk', 'Les niveaux de conscience (2)'], ['sQpbfSr6EfA', 'La perception'], ['0_jSwbfIcz8', 'La mémoire (1)'], ['s-KbM7iEUAI', 'La mémoire (2)'],
      ['MdqKQm-I8k8', 'L\'intuition (1)'], ['h-kWzYnWGJ4', 'L\'intuition (2)'], ['YJ2ax1bK2kU', 'L\'imagination'], ['YD9_heDwfb8', 'La volonté et la persistance (1)'], ['HPLhGRqvBwY', 'La volonté et la persistance (2)']] },
    { ic: '💰', t: 'L\'argent & la liberté financière', d: 'Comprendre l\'argent pour mieux le gérer.', v: [
      ['syAkdb_TDyo', 'Qui a créé l\'argent ? Pourquoi ? Pour qui ?'], ['0KcMld81UTk', 'Les 4 piliers de la liberté financière'], ['nPR-63fSF5c', 'L\'homme le plus riche de Babylone (résumé)'], ['L1DD-wcZzC0', 'Les secrets d\'un esprit millionnaire']],
      l: [['L\'homme le plus riche de Babylone', 'https://www.amazon.fr/dp/1607964252']] },
    { ic: '☀️', t: 'Ta routine du matin', d: 'Miracle Morning, visualisation, méditation, douche froide.', v: [['hvKiQBpwLiA', 'Créer un tableau de visualisation créatrice'], ['4VgxHfYKOf0', 'La méditation'], ['r5tZmPKI2l0', 'Les bienfaits de la douche froide']],
      l: [['Miracle Morning · Hal Elrod', 'https://www.amazon.fr/dp/275408472X']] },
    { ic: '🌌', t: 'Vibrations, conscience & réalité', d: 'Pour aller plus loin.', v: [
      ['o1A0sD022WE', 'Les vibrations et s\'accepter soi-même'], ['kOOiQWPP1G4', 'Montée en vibrations'], ['vJc6vqivFQQ', 'Renaître'], ['QIU0BUyZ0-A', 'Que faut-il pour prospérer ?'], ['LMwLtl08zJw', 'Que sait-on vraiment de la réalité ?'],
      ['geiVAWYqOZ0', 'Prise de conscience · Matthieu Ricard'], ['ibIjlXSagME', 'Comment libérer notre cerveau ? · Idriss Aberkane'], ['70Xg0cclf5Q', 'La puissance de l\'intention'], ['sb2s7dbvChA', 'En conscience'], ['hG04LX4zrlA', 'La révolution de l\'esprit'],
      ['ZwgovJSQ5UM', 'La magie du son (1)'], ['gU4Q0LpZ2g4', 'La magie du son (2)'], ['oZWOYtVHpkY', 'Cessez d\'être gentil, soyez vrai'], ['Fe-sjQ9EIfE', 'Le langage corporel et la communication non verbale'], ['UQLWAPePp8o', 'Pour les lady boss'], ['Nxpl7judCwY', 'La puissance des couleurs']],
      l: [['Documentaire Netflix · Tony Robbins, « I Am Not Your Guru »', 'https://www.netflix.com/title/80102204']] }
  ];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s) { return document.querySelector(s); }

  // Chaque vidéo a sa clé XP : pc_<id YouTube>. « Le Secret » rapporte le triple.
  var SECRET = 'rzhF2zFGY9Y';
  var VID1 = []; P1.forEach(function (s) { (s.v || []).forEach(function (v) { VID1.push(v[0]); }); });
  var VIDB = []; BIB.forEach(function (c) { (c.v || []).forEach(function (v) { if (VIDB.indexOf(v[0]) < 0 && VID1.indexOf(v[0]) < 0) VIDB.push(v[0]); }); });
  function cleVid(id) { return 'pc_' + id; }
  function xpDe(id) { return id === SECRET ? XP_VIDEO * 3 : XP_VIDEO; }
  var TOTAL1 = VID1.reduce(function (t, id) { return t + xpDe(id); }, 0);
  var vues = {}, finOk = false;

  function carte(v, p1) {
    var id = v[0], k = cleVid(id), x = xpDe(id), feat = id === SECRET;
    return '<div class="pc-vid' + (feat ? ' pc-feat' : '') + '" data-id="' + id + '" data-k="' + k + '" data-xp="' + x + '">' +
      (feat ? '<div class="pc-feat-tag">🎬 LE FILM · DERNIÈRE VIDÉO · XP ×3</div>' : '') +
      '<button type="button" class="pc-thumb" aria-label="Lire : ' + esc(v[1]) + '"><img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()"><span class="pc-play">▶</span>' + (feat ? '<span class="pc-feat-xp">+' + x + ' XP</span>' : '') + '</button>' +
      '<div class="pc-vt"><b>' + esc(v[1]) + '</b>' + (feat ? '<span class="pc-feat-d">Le film à ne pas manquer pour clôturer la prise de conscience. Il rapporte le triple d\'XP.</span>' : '') +
      '<button type="button" class="pc-seen" data-k="' + k + '" disabled>▶ Lance la vidéo · +' + x + ' XP</button></div></div>';
  }
  function rendre() {
    $('#pcSteps').innerHTML = P1.map(function (s, i) {
      var vids = s.v ? '<div class="pc-vids">' + s.v.filter(function (v) { return v[0] !== SECRET; }).map(function (v) { return carte(v, true); }).join('') + '</div>' : '';
      var sec = (s.v || []).filter(function (v) { return v[0] === SECRET; })[0];
      return '<article class="pc-step"><div class="pc-num">' + (i + 1) + '</div><div class="pc-body"><h3>' + esc(s.t) + '</h3>' + (s.vAvant ? vids + (s.html || '') : (s.html || '') + vids) + (sec ? carte(sec, true) : '') + '</div></article>';
    }).join('');
    $('#pcLib').innerHTML = BIB.map(function (c, i) {
      var n = (c.v || []).length;
      return '<details class="pc-ch"' + (i === 0 ? ' open' : '') + '><summary><span class="pc-chi">' + c.ic + '</span><span class="pc-cht"><b>' + esc(c.t) + '</b><small>' + (n ? '<span class="pc-chn" data-ch="' + i + '"></span>' + n + ' vidéo' + (n > 1 ? 's' : '') + ' · +' + XP_VIDEO + ' XP chacune' : '') + (n && c.l ? ' · ' : '') + (c.l ? c.l.length + ' lien' + (c.l.length > 1 ? 's' : '') : '') + '</small></span><span class="pc-chv">▾</span></summary>' +
        '<div class="pc-chb"><p>' + esc(c.d) + '</p>' + (n ? '<div class="pc-vids">' + c.v.map(function (v) { return carte(v, false); }).join('') + '</div>' : '') +
        (c.l ? '<ul class="pc-links">' + c.l.map(function (l) { return '<li><a href="' + l[1] + '" target="_blank" rel="noopener">📖 ' + esc(l[0]) + ' <span>›</span></a></li>'; }).join('') + '</ul>' : '') + '</div></details>';
    }).join('');
    maj();
  }
  function maj() {
    var n = VID1.filter(function (id) { return vues[cleVid(id)]; }).length;
    var g = VID1.filter(function (id) { return vues[cleVid(id)]; }).reduce(function (t, id) { return t + xpDe(id); }, 0);
    $('#pcProgTxt').textContent = n + ' / ' + VID1.length + ' vidéos vues';
    $('#pcProgXp').textContent = '⚡ ' + (g + (finOk ? XP_FIN : 0)) + ' / ' + (TOTAL1 + XP_FIN) + ' XP';
    $('#pcBar').style.width = Math.round(n / VID1.length * 100) + '%';
    document.querySelectorAll('.pc-seen').forEach(function (b) {
      var k = b.getAttribute('data-k'), x = b.closest('.pc-vid').getAttribute('data-xp');
      if (vues[k]) { b.disabled = true; b.className = 'pc-seen ok'; b.textContent = '✓ Vue · +' + x + ' XP'; b.closest('.pc-vid').classList.add('done'); }
    });
    BIB.forEach(function (c, i) {
      var el = document.querySelector('.pc-chn[data-ch="' + i + '"]'); if (!el) return;
      var v = (c.v || []).filter(function (x) { return vues[cleVid(x[0])]; }).length;
      el.textContent = v ? '✓ ' + v + ' / ' : ''; el.parentNode.classList.toggle('pc-chdone', v === c.v.length);
    });
    $('#pcDone').classList.toggle('on', n === VID1.length);
    $('#pcDoneXp').textContent = finOk ? '✓ +' + XP_FIN + ' XP BONUS GAGNÉS' : '+' + XP_FIN + ' XP BONUS';
  }
  function toast(t) { var d = document.createElement('div'); d.className = 'pc-toast'; d.textContent = t; document.body.appendChild(d); setTimeout(function () { d.classList.add('on'); }, 20); setTimeout(function () { d.classList.remove('on'); setTimeout(function () { d.remove(); }, 400); }, 2600); }
  async function crediter(k, xp, raison) {
    try { var r = await DHA.award(k, xp, raison); if (r && (r.ok || r.deja)) { if (r.ok) toast('⚡ +' + (r.gagne || xp) + ' XP · ' + raison); return true; } } catch (e) {}
    toast('XP non enregistrée, réessaie'); return false;
  }

  document.addEventListener('click', async function (e) {
    var th = e.target.closest('.pc-thumb');
    if (th) {
      var box = th.closest('.pc-vid'), id = box.getAttribute('data-id'), x = box.getAttribute('data-xp');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      f.title = 'Vidéo'; f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'; f.allowFullscreen = true;
      th.replaceWith(f);
      var b = box.querySelector('.pc-seen');
      if (b && !vues[b.getAttribute('data-k')]) {
        var s = ATTENTE; b.textContent = 'Regarde encore ' + s + ' s…';
        var t = setInterval(function () { s--; if (s > 0) b.textContent = 'Regarde encore ' + s + ' s…'; else { clearInterval(t); b.disabled = false; b.textContent = '✓ J\'ai regardé · +' + x + ' XP'; } }, 1000);
      }
      return;
    }
    var sb = e.target.closest('.pc-seen');
    if (sb && !sb.disabled) {
      var k = sb.getAttribute('data-k'), bx = sb.closest('.pc-vid'), xp = Number(bx.getAttribute('data-xp'));
      sb.disabled = true; sb.textContent = 'Enregistrement…';
      var titre = sb.parentNode.querySelector('b').textContent;
      if (await crediter(k, xp, '🧠 Prise de conscience · ' + titre)) { vues[k] = true; }
      else { sb.disabled = false; sb.textContent = '✓ J\'ai regardé · +' + xp + ' XP'; }
      if (!finOk && VID1.every(function (id) { return vues[cleVid(id)]; })) {
        if (await crediter('pc_fin', XP_FIN, '🌱 Prise de conscience terminée')) finOk = true;
        setTimeout(function () { $('#pcDone').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300);
      }
      maj();
    }
    var tab = e.target.closest('.ms-tab');
    if (tab) {
      var p = tab.getAttribute('data-tab');
      document.querySelectorAll('.ms-tab').forEach(function (x) { var on = x === tab; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
      document.querySelectorAll('.ms-pane').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-pane') === p); });
      try { history.replaceState(null, '', '#' + p); } catch (er) {}
    }
  });

  rendre();
  if (location.hash === '#trading') { var tb = document.querySelector('.ms-tab[data-tab="trading"]'); if (tb) tb.click(); }
  // progression déjà enregistrée
  (async function () {
    try {
      var keys = VID1.concat(VIDB).map(cleVid).concat(['pc_fin']);
      var h = await DHA.historique({ keys: keys });
      (h || []).forEach(function (r) { if (r.action_key === 'pc_fin') finOk = true; else vues[r.action_key] = true; });
      maj();
    } catch (e) {}
  })();
  window.DHAPriseConscience = { p1: VID1, bib: VIDB, secret: SECRET };
})();
