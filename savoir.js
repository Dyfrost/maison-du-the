// Maison du Thé — contenus « Apprendre » : encyclopédie, défauts, roue des arômes.
window.MDT_SAVOIR = {
  // ---------------------------------------------------------------- Encyclopédie
  cats: [
    ['fab', '🌿', 'Fabrication'],
    ['deg', '👅', 'Dégustation'],
    ['prep', '🫖', 'Préparation'],
    ['type', '🍵', 'Thés & appellations']
  ],
  glossary: [
    // Fabrication
    { t: 'Flétrissage', o: '萎凋 wěi diāo', c: 'fab', d: 'Les feuilles fraîchement cueillies reposent à l’air libre pour perdre une partie de leur eau et s’assouplir. Première étape de presque tous les thés ; pour le thé blanc, c’est quasiment la seule.', f: ['blanc'] },
    { t: 'Fixation', o: '杀青 shā qīng', c: 'fab', d: 'On chauffe la feuille (wok, tambour, vapeur) pour détruire les enzymes et stopper l’oxydation. C’est ce qui garde un thé vert… vert. Au Japon, la fixation se fait à la vapeur, d’où le goût plus végétal et iodé.', f: ['vert', 'jaune', 'sombre'] },
    { t: 'Roulage', o: '揉捻 róu niǎn', c: 'fab', d: 'On roule ou torsade la feuille pour briser ses cellules et libérer les sucs. La forme finale (aiguille, boule, torsade) se joue ici et influence la vitesse d’infusion.', f: ['vert', 'oolong', 'noir'] },
    { t: 'Oxydation', o: '氧化', c: 'fab', d: 'Réaction des enzymes de la feuille avec l’air, comme une pomme coupée qui brunit. Nulle pour un thé vert, partielle pour un oolong (10 à 80 %), complète pour un thé noir. On parle souvent, à tort, de « fermentation ».', f: ['oolong', 'noir'] },
    { t: 'Post-fermentation', o: '后发酵', c: 'fab', d: 'Vraie fermentation par des micro-organismes, après la fabrication. Elle donne les thés sombres (hei cha) : pu’er, liu bao, fu zhuan. Elle se poursuit lentement pendant le vieillissement.', f: ['sombre'] },
    { t: 'Wo dui', o: '渥堆 wò duī', c: 'fab', d: 'Fermentation accélérée en tas humides, inventée dans les années 1970 au Yunnan. C’est elle qui produit le pu’er shou en quelques semaines au lieu de plusieurs décennies.', f: ['sombre'] },
    { t: 'Étouffage', o: '闷黄 mèn huáng', c: 'fab', d: 'Étape propre au thé jaune : après la fixation, les feuilles encore chaudes sont enveloppées pour « jaunir » doucement. Elle adoucit le thé et lui donne ses notes de céréale.', f: ['jaune'] },
    { t: 'Torréfaction', o: '焙火 bèi huǒ', c: 'fab', d: 'Cuisson lente au charbon de bois ou au four, parfois répétée sur plusieurs semaines. Elle donne les notes grillées, de caramel et de fruits secs des oolongs de Wuyi ou de certains Tie Guan Yin.', f: ['oolong'] },
    { t: 'Mao cha', o: '毛茶 máo chá', c: 'fab', d: 'Thé « brut » : la feuille fabriquée mais pas encore triée, assemblée ou pressée. Pour le pu’er, c’est la matière première des galettes.', f: ['sombre'] },
    { t: 'Galette', o: '饼 bǐng', c: 'fab', d: 'Thé pressé en disque, le plus souvent de 357 g (sept galettes forment un « tong »). Forme classique du pu’er, pratique pour le vieillissement et le transport.', f: ['sombre'] },
    { t: 'Ombrage', o: 'kabuse / ōishita', c: 'fab', d: 'Au Japon, on couvre les théiers quelques semaines avant la récolte. Moins de lumière = plus d’acides aminés (L-théanine) : c’est l’umami du gyokuro et du matcha.', f: ['vert'] },
    { t: 'Orthodoxe / CTC', o: 'Crush, Tear, Curl', c: 'fab', d: 'Deux façons de fabriquer le thé noir. Orthodoxe : feuilles entières roulées, pour la dégustation. CTC : feuilles broyées en petits grains, pour les sachets et le thé au lait.', f: ['noir'] },
    // Dégustation
    { t: 'Cha qi', o: '茶气 chá qì', c: 'deg', d: 'L’« énergie » du thé : la sensation physique qu’il procure (chaleur dans le corps, détente, légère ivresse). Très citée pour les vieux pu’er et les thés d’arbres anciens.', f: [] },
    { t: 'Hui gan', o: '回甘 huí gān', c: 'deg', d: 'Le « retour sucré » : une douceur qui remonte dans la gorge quelques secondes après avoir avalé. Signe recherché d’un thé de qualité, surtout dans les pu’er sheng.', f: ['sombre', 'oolong'] },
    { t: 'Sheng jin', o: '生津 shēng jīn', c: 'deg', d: 'La salivation qui suit la gorgée, la bouche qui « se remplit ». Elle accompagne souvent le hui gan.', f: [] },
    { t: 'Astringence', o: '涩 sè', c: 'deg', d: 'Sensation de bouche sèche et râpeuse, due aux tanins. Légère, elle donne de la structure ; trop forte, c’est un défaut (voir Défauts).', f: [] },
    { t: 'Liqueur', o: '茶汤 chá tāng', c: 'deg', d: 'Le thé infusé, dans la tasse. On en juge la couleur, la limpidité, la texture et la longueur.', f: [] },
    { t: 'Feuilles infusées', o: '叶底 yè dǐ', c: 'deg', d: 'Les feuilles après infusion. Les déplier en dit long : bourgeons entiers ou brisés, oxydation régulière ou non, présence de tiges.', f: [] },
    { t: 'Fond de tasse', o: '杯底香 bēi dǐ xiāng', c: 'deg', d: 'Le parfum qui reste dans la tasse vide. Souvent plus sucré et plus profond que la liqueur elle-même : miel, caramel, fleurs.', f: [] },
    { t: 'Longueur', o: '余韵 yú yùn', c: 'deg', d: 'Le temps pendant lequel les arômes persistent en bouche après la gorgée. Plus elle est longue, plus le thé est jugé complexe.', f: [] },
    { t: 'Umami', o: 'うま味', c: 'deg', d: 'La cinquième saveur, savoureuse, « de bouillon ». Très marquée dans les thés verts japonais ombragés (gyokuro, matcha).', f: ['vert'] },
    { t: 'Yan yun', o: '岩韵 yán yùn', c: 'deg', d: 'La « rime de la roche » : caractère minéral et profond attribué aux thés des falaises de Wuyi.', f: ['oolong'] },
    { t: 'Muscat', o: 'muscatel', c: 'deg', d: 'Note de raisin muscat typique des Darjeeling de seconde récolte, due à de petits insectes qui piquent la feuille.', f: ['noir'] },
    // Préparation
    { t: 'Gong fu cha', o: '功夫茶 gōng fu chá', c: 'prep', d: 'Préparer le thé « avec art » : beaucoup de feuilles, peu d’eau, infusions courtes et répétées. On découvre le thé infusion après infusion.', f: [] },
    { t: 'Grandpa style', o: '', c: 'prep', d: 'Quelques feuilles directement dans un grand verre, on boit et on rajoute de l’eau chaude au fil de la journée. Simple et parfait pour les thés verts chinois.', f: ['vert'] },
    { t: 'Rinçage', o: '醒茶 xǐng chá', c: 'prep', d: 'Une première eau versée puis jetée aussitôt (5 s, « quick flush »). Elle réveille les feuilles roulées ou pressées et lave la poussière. Inutile pour un thé vert délicat.', f: ['sombre', 'oolong'] },
    { t: 'Ratio', o: '', c: 'prep', d: 'Quantité de feuilles pour le volume d’eau. Repères : 1 g pour 50 ml à l’occidentale, 5 à 7 g pour 100 ml en gong fu.', f: [] },
    { t: 'Gaiwan', o: '盖碗 gài wǎn', c: 'prep', d: 'Bol à couvercle avec soucoupe. Neutre (porcelaine), il convient à tous les thés et laisse bien sentir les feuilles.', f: [] },
    { t: 'Gongdao bei', o: '公道杯 gōng dào bēi', c: 'prep', d: 'La verseuse (« pichet d’équité ») : on y vide toute l’infusion pour que chaque tasse ait la même force.', f: [] },
    { t: 'Zisha', o: '紫砂 zǐ shā', c: 'prep', d: 'Argile de Yixing. Poreuse, elle « se culotte » avec le temps ; on réserve une théière à une seule famille de thé.', f: [] },
    { t: 'Kyusu', o: '急須', c: 'prep', d: 'Théière japonaise à manche latéral, avec filtre fin pour les feuilles de sencha.', f: ['vert'] },
    { t: 'Chasen', o: '茶筅', c: 'prep', d: 'Fouet en bambou pour battre le matcha en mousse fine, d’un mouvement rapide en « M ».', f: ['vert'] },
    // Thés & appellations
    { t: 'Sheng / Shou', o: '生 / 熟', c: 'type', d: 'Pu’er « cru » (sheng) : vieilli naturellement, vif et souvent astringent jeune. Pu’er « mûr » (shou) : fermenté en wo dui, rond, terreux, prêt à boire.', f: ['sombre'] },
    { t: 'Hei cha', o: '黑茶 hēi chá', c: 'type', d: 'Littéralement « thé noir » en chinois : la famille des thés sombres post-fermentés (pu’er, liu bao, fu zhuan…). Ce que nous appelons thé noir se dit « thé rouge » (hong cha) en Chine.', f: ['sombre', 'noir'] },
    { t: 'Gushu', o: '古树 gǔ shù', c: 'type', d: 'Thé d’arbres anciens (souvent plus de 100 ans). Racines profondes, plus de complexité et de cha qi ; prix en conséquence.', f: ['sombre'] },
    { t: 'Ming qian', o: '明前 míng qián', c: 'type', d: 'Récolté avant la fête de Qingming (début avril). Les premiers bourgeons du printemps, les plus doux et les plus chers des thés verts chinois.', f: ['vert'] },
    { t: 'Dan cong', o: '单丛 dān cóng', c: 'type', d: 'Oolongs du mont Phoenix (Guangdong), issus d’arbres sélectionnés un par un. Célèbres pour leurs parfums naturels : miel-orchidée (Mi Lan Xiang), fleur d’oranger…', f: ['oolong'] },
    { t: 'Yan cha', o: '岩茶 yán chá', c: 'type', d: 'Les « thés de roche » des monts Wuyi (Fujian) : oolongs torréfiés comme Da Hong Pao ou Rou Gui.', f: ['oolong'] },
    { t: 'Fu zhuan', o: '茯砖 fú zhuān', c: 'type', d: 'Brique de thé sombre du Hunan, où se développent volontairement des « fleurs dorées » (jin hua, un champignon) aux notes boisées et sucrées.', f: ['sombre'] },
    { t: 'Liu Bao', o: '六堡 liù bǎo', c: 'type', d: 'Thé sombre du Guangxi, souvent vieilli en paniers. Notes de bois, d’arec et de sous-bois.', f: ['sombre'] },
    { t: 'Lapsang souchong', o: '正山小种 zhèng shān xiǎo zhǒng', c: 'type', d: 'Thé noir des monts Wuyi, l’un des tout premiers. La version fumée au bois de pin est devenue célèbre en Europe.', f: ['noir'] },
    { t: 'Hojicha', o: 'ほうじ茶', c: 'type', d: 'Thé vert japonais torréfié : peu de caféine, notes de noisette et de caramel.', f: ['vert'] },
    { t: 'Genmaicha', o: '玄米茶', c: 'type', d: 'Thé vert japonais mélangé à du riz grillé (parfois soufflé). Goût de céréale grillée.', f: ['vert'] },
    { t: 'First / second flush', o: '', c: 'type', d: 'Récoltes de Darjeeling : printemps (first flush, vif, floral, très clair) et début d’été (second flush, plus rond, muscaté).', f: ['noir'] }
  ],

  // ---------------------------------------------------------------- Défauts
  defects: [
    { t: 'Trop d’astringence', i: '🥴', sign: 'La bouche s’assèche, les gencives « accrochent », sensation râpeuse.', cause: 'Infusion trop longue, eau trop chaude, trop de feuilles ou thé jeune et vif (pu’er sheng, Darjeeling).', fix: 'Raccourcir les infusions de moitié, baisser l’eau de 5 à 10 °C ou mettre moins de feuilles.' },
    { t: 'Amertume', i: '😖', sign: 'Saveur amère qui reste au fond de la langue, comme une endive.', cause: 'Thé vert ou blanc infusé trop chaud, ou feuilles brisées qui libèrent tout d’un coup.', fix: 'Eau à 75–80 °C pour un vert, verser l’eau contre la paroi plutôt que sur les feuilles, infusions plus courtes.' },
    { t: 'Liqueur plate', i: '💧', sign: 'Peu de goût, texture aqueuse, rien ne reste en bouche.', cause: 'Pas assez de feuilles, eau pas assez chaude pour un oolong ou un sombre, infusion trop courte, ou feuilles épuisées.', fix: 'Augmenter la quantité de feuilles, monter la température, allonger de 5 à 10 s. Si plus rien ne vient, le thé est épuisé.' },
    { t: 'Goût de cuit', i: '🔥', sign: 'Thé vert qui sent l’épinard cuit ou le légume bouilli.', cause: 'Eau bouillante sur un thé vert, ou feuilles laissées au chaud sous le couvercle entre deux infusions.', fix: 'Laisser refroidir l’eau, et garder le couvercle entrouvert entre les infusions.' },
    { t: 'Goût de vieux ou de rance', i: '🕰', sign: 'Thé éteint, papier, carton, parfois une note de noix rance.', cause: 'Thé vert ou oolong léger trop vieux, mal fermé, exposé à l’air ou à la lumière.', fix: 'Conserver au frais, au sec et à l’abri de la lumière, dans une boîte hermétique. Les verts se boivent dans l’année.' },
    { t: 'Moisi ou poussière', i: '🍄', sign: 'Odeur de cave humide, de moisi, de poussière, qui ne part pas au rinçage.', cause: 'Stockage trop humide, surtout pour les pu’er et les thés pressés.', fix: 'Deux rinçages rapides peuvent aider ; si l’odeur persiste, le thé a mal vieilli. Stocker loin des odeurs, humidité modérée.' },
    { t: 'Goût de poisson ou de tas', i: '🐟', sign: 'Note de poisson, d’étable ou de terre très forte sur un pu’er shou.', cause: 'Shou trop jeune, encore marqué par le wo dui.', fix: 'Deux rinçages, eau bouillante, infusions courtes. Le laisser respirer quelques mois en boîte en carton.' },
    { t: 'Fumé non voulu', i: '🚬', sign: 'Note de fumée ou de cendre sur un thé qui ne devrait pas en avoir.', cause: 'Torréfaction trop forte ou trop récente, ou stockage près d’odeurs fortes.', fix: 'Laisser reposer le thé quelques semaines : le feu se calme. Toujours ranger les thés loin des épices.' },
    { t: 'Goût métallique ou chloré', i: '🚰', sign: 'Arrière-goût de piscine, de fer ou de calcaire, quel que soit le thé.', cause: 'L’eau : trop calcaire, chlorée, ou bouilloire entartrée.', fix: 'Eau filtrée ou de source peu minéralisée, détartrer la bouilloire, ne pas faire bouillir l’eau plusieurs fois.' },
    { t: 'Infusions déséquilibrées', i: '⚖️', sign: 'Première tasse très forte, la dernière très faible.', cause: 'On ne vide pas tout le gaiwan, ou on sert les tasses directement les unes après les autres.', fix: 'Vider entièrement dans la verseuse (gongdao bei) avant de servir.' }
  ],

  // ---------------------------------------------------------------- Roue des arômes
  wheel: [
    { k: 'floral', n: 'Floral', c: '#d9849b', a: ['Jasmin', 'Orchidée', 'Rose', 'Osmanthus', 'Fleur d’oranger', 'Chèvrefeuille'], h: 'Fleurs blanches, sucrées ou capiteuses. Oolongs légers, thés blancs, dan cong.' },
    { k: 'fruitfrais', n: 'Fruit frais', c: '#e8a35a', a: ['Pêche', 'Abricot', 'Pomme', 'Poire', 'Agrumes', 'Litchi'], h: 'Fruits juteux. Oolongs de Taïwan, Darjeeling first flush, thés blancs.' },
    { k: 'fruitsec', n: 'Fruit mûr & sec', c: '#b5674a', a: ['Raisin sec', 'Datte', 'Figue', 'Pruneau', 'Muscat', 'Fruits rouges'], h: 'Fruits confits, cuits ou séchés. Thés noirs, vieux oolongs, shou.' },
    { k: 'vegetal', n: 'Végétal', c: '#7fa85a', a: ['Herbe coupée', 'Épinard', 'Haricot vert', 'Petits pois', 'Foin', 'Feuille de vigne'], h: 'Vert, frais, herbacé. Thés verts, blancs jeunes, sheng jeune.' },
    { k: 'marin', n: 'Marin', c: '#5f9ea0', a: ['Iodé', 'Algue', 'Embruns', 'Huître'], h: 'L’océan. Thés verts japonais à la vapeur (sencha, gyokuro).' },
    { k: 'grille', n: 'Grillé', c: '#a87a4a', a: ['Pain grillé', 'Noisette', 'Châtaigne', 'Riz grillé', 'Café', 'Caramel'], h: 'Ce qui a vu le feu. Yan cha, hojicha, thés jaunes, oolongs torréfiés.' },
    { k: 'boise', n: 'Boisé', c: '#8a6a4a', a: ['Bois de santal', 'Cèdre', 'Écorce', 'Bois humide', 'Arec'], h: 'Bois sec ou mouillé. Thés sombres, liu bao, vieux sheng.' },
    { k: 'terreux', n: 'Terreux', c: '#6b5444', a: ['Sous-bois', 'Terre humide', 'Champignon', 'Betterave', 'Cave'], h: 'La forêt après la pluie. Pu’er shou, thés sombres.' },
    { k: 'sucre', n: 'Sucré', c: '#d9b25a', a: ['Miel', 'Vanille', 'Sucre brun', 'Malt', 'Sirop d’érable'], h: 'Douceurs pâtissières. Thés noirs, thés blancs vieillis, fond de tasse.' },
    { k: 'lacte', n: 'Lacté', c: '#e6d3a8', a: ['Beurre', 'Lait', 'Crème', 'Maïs doux'], h: 'Rond et gras. Oolongs « milky », thés jaunes.' },
    { k: 'epice', n: 'Épicé', c: '#c0583e', a: ['Cannelle', 'Poivre', 'Clou de girofle', 'Réglisse', 'Gingembre'], h: 'Le placard à épices. Rou gui, thés noirs, vieux thés.' },
    { k: 'fume', n: 'Fumé', c: '#5a5450', a: ['Feu de bois', 'Tabac', 'Cuir', 'Encens'], h: 'Fumée et cuir. Lapsang souchong, certains sheng, vieux oolongs.' },
    { k: 'mineral', n: 'Minéral & frais', c: '#8fa3b0', a: ['Pierre mouillée', 'Camphre', 'Menthol', 'Silex'], h: 'Fraîcheur minérale ou médicinale. Yan cha (yan yun), vieux pu’er (camphre).' }
  ]
};
