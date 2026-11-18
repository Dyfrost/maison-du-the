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
  // Inspirée de : T = roues sensorielles du TRES (Taïwan, 2020 ; Su et al., Foods 2021),
  // G = norme chinoise GB/T 14487-2017 (terminologie de l'évaluation sensorielle du thé),
  // K = Lee & Chambers (2007), lexique des arômes du thé vert (Kansas State University),
  // M = vocabulaire courant des dégustateurs (pas de source formelle).
  srcs: {
    T: { n: 'TRES (Taïwan)', u: 'https://www.mdpi.com/2304-8158/10/4/836/htm' },
    G: { n: 'GB/T 14487 (Chine)', u: 'https://www.chinesestandard.net/PDF/English.aspx/GBT14487-2017' },
    K: { n: 'Lee & Chambers (KSU)', u: 'https://bohrium.dp.tech/paper/arxiv/812655149087457280' },
    M: { n: 'usage des dégustateurs', u: '' }
  },
  // « À quoi ça sent » : un repère concret pour les arômes qui ne parlent pas d'eux-mêmes
  smell: {
    'Gardénia': 'Une fleur blanche épaisse et crémeuse, plus capiteuse que le jasmin, presque beurrée. Typique de certains dan cong (« huang zhi xiang »).',
    'Lys': 'Un bouquet de lys dans une pièce fermée : floral puissant, sucré, un peu poivré.',
    'Anis étoilé': 'La badiane du pho ou du vin chaud : anisé, chaud, plus doux que la réglisse.',
    'Cardamome': 'Le chaï indien : épice fraîche, citronnée, un peu camphrée.',
    'Mangue': 'Une mangue bien mûre qu’on coupe : très sucrée, un peu résineuse.',
    'Ananas': 'Un ananas qu’on vient d’ouvrir : sucré, acidulé, juteux.',
    'Fruit de la passion': 'Le jus d’un fruit de la passion : acidulé, exotique, très parfumé.',
    'Banane': 'Une banane bien mûre ou un bonbon banane : sucré, crémeux.',
    'Melon': 'Un melon charentais en été : sucré, aqueux, un peu musqué.',
    'Orge': 'Le mugicha (thé d’orge japonais) ou un café d’orge : céréale grillée, douce.',
    'Céréales': 'Un bol de céréales du petit-déjeuner ou une galette de riz : grain cuit, doux.',
    'Biscuit': 'Un petit-beurre ou un sablé qui sort du four : farine, beurre, sucre.',
    'Brioche': 'Une brioche tiède : pâte levée, beurre, un peu de sucre.',
    'Pain d’épices': 'Une tranche de pain d’épices : miel, cannelle, anis. Fréquent dans les vieux thés blancs.',
    'Bouillon': 'Un bouillon de légumes ou de poule qui mijote : salé, rond, réconfortant.',
    'Umami': 'La « cinquième saveur » : celle d’un parmesan, d’une sauce soja ou d’un dashi. Ça remplit la bouche et donne envie d’y revenir.',
    'Kombu': 'L’algue du dashi japonais : marin, mais surtout savoureux et doux.',
    'Edamame': 'Les fèves de soja cuites à l’eau salée : vert, sucré, légumineux.',
    'Menthe': 'Une feuille de menthe fraîche qu’on froisse : plus végétale et douce que le menthol.',
    'Thym': 'Une branche de thym sec ou la garrigue en été : herbe chaude, un peu résineuse.',
    'Basilic': 'Une feuille de basilic frais : vert, anisé, un peu poivré.',
    'Verveine': 'Une infusion de verveine citronnelle : herbe fraîche et citronnée.',
    'Eucalyptus': 'Une pastille pour la gorge ou un bain d’eucalyptus : frais, camphré, très net.',
    'Orchidée': 'Peu de gens ont senti une orchidée : pense à un parfum floral léger, frais, un peu vanillé, moins sucré que le jasmin. Le Tie Guan Yin jeune en est l’exemple type.',
    'Osmanthus': 'Une petite fleur jaune d’Asie : l’odeur mêle l’abricot sec et la fleur, très douce. On la retrouve dans les confiseries chinoises « 桂花 ».',
    'Fleur d’oranger': 'L’eau de fleur d’oranger des madeleines et des cornes de gazelle : fleur blanche, un peu savonneuse.',
    'Chèvrefeuille': 'La haie fleurie d’un chemin de campagne en juin : sucré, mielleux, une fleur qui sent surtout le soir.',
    'Litchi': 'Le fruit pelé, pas la boisson : une rose sucrée et juteuse, un peu muscatée.',
    'Citron': 'Un zeste de citron qu’on presse entre les doigts : vif, acidulé, frais. Souvent dans les oolongs légers et certains thés verts.',
    'Bergamote': 'L’odeur de l’Earl Grey : un agrume parfumé, entre l’orange amère et la fleur. Certains thés en ont naturellement une touche.',
    'Pamplemousse': 'Un pamplemousse rose qu’on épluche : agrume amer et juteux, un peu soufré.',
    'Yuzu': 'Un agrume japonais : entre le citron, la mandarine et le pamplemousse, très parfumé. Pense au yuzu des desserts ou des sauces ponzu.',
    'Raisin sec': 'Un paquet de raisins secs qu’on ouvre : sucré, cuit, légèrement vineux.',
    'Jujube': 'La « datte rouge » chinoise séchée (枣) : entre la datte et la pomme cuite, caramélisé.',
    'Figue': 'La figue sèche, pas fraîche : sucre brun, graines, un côté confiture épaisse.',
    'Pruneau': 'Le pruneau d’Agen : fruit noir cuit, sucré, presque confituré, avec une pointe acide.',
    'Muscat': 'Le grain de raisin muscat (ou un verre de muscat doux) : fruité, floral, un peu musqué. C’est la signature des Darjeeling d’été (« muscatel »).',
    'Fruits rouges': 'Une confiture de framboise ou de cassis qu’on ouvre : fruit rouge mûr, un peu acidulé.',
    'Caramel': 'Le sucre qui fond et brunit dans la casserole, juste avant de brûler.',
    'Sucre brun': 'La cassonade ou le sucre muscovado : sucré, un peu réglissé, mélassé.',
    'Malt': 'L’Ovomaltine ou l’odeur d’une brasserie : céréale sucrée, chaude, un peu pain.',
    'Sirop d’érable': 'Le sirop sur des pancakes : sucré, boisé, un peu fumé.',
    'Beurre': 'Le beurre doux qui fond dans une poêle tiède, avant qu’il noisette.',
    'Lait': 'Le lait chaud ou le lait concentré sucré : rond, doux. C’est le « milky » du Jin Xuan.',
    'Crème': 'Une crème fraîche ou une crème anglaise : lacté et un peu sucré.',
    'Maïs doux': 'Une boîte de maïs qu’on ouvre ou un épi grillé : sucré, végétal, un peu beurré.',
    'Châtaigne': 'Les marrons chauds vendus dans la rue en hiver : sucré, farineux, grillé. C’est le 栗香 des thés verts chinois.',
    'Noisette': 'Des noisettes qu’on fait dorer à sec dans une poêle.',
    'Amande': 'L’amande fraîche ou la pâte d’amande, parfois un peu amère (comme le noyau d’abricot).',
    'Noix': 'Une noix fraîchement cassée : grasse, boisée, un peu tannique.',
    'Patate douce': 'Une patate douce rôtie au four : sucrée, farineuse, un peu caramélisée.',
    'Pain grillé': 'Une tranche à la sortie du grille-pain, bien dorée mais pas brûlée.',
    'Riz grillé': 'Le genmaicha, ou le fond d’une poêle de riz qui a grillé : céréale chaude, popcorn.',
    'Torréfié': 'L’odeur d’un torréfacteur ou de graines qu’on fait griller : sec, chaud, un peu amer.',
    'Café': 'Le café qu’on vient de moudre, pas la tasse froide.',
    'Cacao': 'La poudre de cacao non sucrée ou un chocolat noir 85 %.',
    'Charbon de bois': 'Un barbecue éteint, les braises froides : minéral, sec, légèrement fumé. Typique des yan cha torréfiés au charbon (炭焙).',
    'Cannelle': 'Un bâton de cannelle qu’on casse, ou le vin chaud.',
    'Poivre': 'Le moulin à poivre qu’on tourne : piquant et boisé, sans brûler le nez.',
    'Clou de girofle': 'Le pain d’épices, ou le cabinet du dentiste : épicé, un peu médicinal.',
    'Réglisse': 'Un bâton de réglisse (la racine) ou un bonbon à l’anis : sucré, anisé, un peu amer.',
    'Gingembre': 'Une racine fraîche qu’on râpe : piquant, citronné, chaud.',
    'Bois sec': 'Une planche de bois brut ou une caisse de rangement : sec, neutre, un peu poussiéreux.',
    'Cèdre': 'Un crayon à papier qu’on taille : bois résineux, propre.',
    'Santal': 'Un bâton d’encens au santal ou un savon de luxe : bois doux, crémeux, presque lacté.',
    'Écorce': 'L’écorce d’un arbre qu’on gratte avec l’ongle : bois vert, tannique, un peu amer.',
    'Arec': 'La noix d’arec (bétel) n’est pas connue en Europe : pense à un bois sec et doux mêlé à une pointe épicée et médicinale. C’est le 槟榔香 typique du liu bao vieilli.',
    'Bois humide': 'Une cabane en bois après la pluie, ou un tonneau : bois mouillé, un peu moisi.',
    'Fumée de pin': 'Un feu de camp de résineux : fumée épaisse, résine, presque saucisson fumé. C’est l’odeur du Lapsang souchong.',
    'Feu de bois': 'Une cheminée allumée dans la pièce d’à côté : fumée douce, chaude.',
    'Tabac': 'Un paquet de tabac à rouler qu’on ouvre ou une boîte de cigares : feuille sèche, sucrée, pas la cendre de cigarette.',
    'Cuir': 'Renifle un portefeuille ou une ceinture en cuir neuf, ou un vieux fauteuil club : animal, un peu fumé et gras.',
    'Encens': 'Un temple ou une église après l’office : résine brûlée, sucrée, poudrée.',
    'Sous-bois': 'Une forêt en automne après la pluie : feuilles mortes, mousse, champignon.',
    'Terre humide': 'Un pot de fleurs qu’on vient d’arroser, ou l’odeur du sol après l’orage (le « petrichor »).',
    'Champignon': 'Des champignons de Paris crus qu’on tranche, ou des cèpes séchés pour un pu’er plus âgé.',
    'Cave': 'Une cave fraîche en pierre : humide, un peu de moisi propre, de vieux cartons. Normal sur un pu’er shou jeune, ça s’en va après quelques rinçages.',
    'Fleur dorée': 'Les « fleurs dorées » (金花), une moisissure bénéfique, sont les points jaunes des briques de Fu cha : une odeur de champignon sec et de pain d’épices, douce et un peu fruitée.',
    'Camphre': 'Un baume du Tigre ou une boule anti-mites en bois de camphrier : frais, médicinal, mentholé. Signe d’un vieux sheng bien conservé.',
    'Pierre mouillée': 'Un galet sorti d’une rivière ou un trottoir après une averse d’été : frais, minéral, sans odeur précise.',
    'Silex': 'Deux cailloux qu’on frappe l’un contre l’autre, ou une allumette qu’on gratte : minéral, un peu « pierre à fusil », comme certains vins blancs.',
    'Menthol': 'Une pastille à la menthe ou du baume pour le rhume : la fraîcheur qui monte dans le nez, plus que la menthe elle-même.',
    'Algue': 'Une feuille d’algue nori de sushi, ou la soupe miso : marin, végétal, un peu umami.',
    'Nori': 'La feuille qui entoure les makis, surtout grillée : marin, salé, légèrement grillé.',
    'Iodé': 'Une plage à marée basse : sel, coquillages, varech.',
    'Embruns': 'Le vent de la mer sur le visage : air salé, frais, plus léger que l’iodé.',
    'Épinard': 'Des épinards en train de cuire à la vapeur ou à la poêle : vert, un peu métallique.',
    'Haricot vert': 'Des haricots verts qu’on blanchit : vert, croquant, un peu sucré.',
    'Asperge': 'Des asperges vertes cuites : végétal, un peu soufré.',
    'Petits pois': 'Des petits pois frais qu’on écosse : vert, sucré, légumineux. C’est le 豆香 des thés verts poêlés.',
    'Foin': 'Une grange ou une botte de paille : herbe séchée au soleil, sucrée.',
    'Persil': 'Une botte de persil frais qu’on hache : vert, vif, un peu poivré.',
    'Bourgeon': 'Le duvet des bourgeons (毫香) : une note très légère, sèche, entre le foin frais et la fleur, typique du Bai Hao Yin Zhen.',
    'Pousse tendre': 'Une feuille de printemps qu’on froisse entre les doigts : vert tendre, frais, un peu sucré (嫩香).',
    'Fraîcheur': 'Pas un arôme précis : la sensation d’air pur et propre, d’un matin de printemps (清香). Un thé « net », sans rien de lourd.'
  },
  // Intensité : un seul niveau par thé, pour savoir à quoi s'attendre
  intens: [
    { t: 'Subtil', d: 'Tout en finesse : il faut tendre le nez et boire concentré, sans rien à côté.' },
    { t: 'Équilibré', d: 'Présent sans forcer : arômes nets, corps moyen. Facile à aborder.' },
    { t: 'Corsé', d: 'De la mâche et du caractère : corps épais, astringence ou torréfaction marquées.' },
    { t: 'Puissant', d: 'Ça tabasse : arômes qui envahissent la bouche, longue persistance. À doser avec prudence.' }
  ],
  // Mots qui comptent pour un arôme quand on les écrit dans un avis (en plus du nom de l'arôme)
  syn: {
    'Jasmin': ['jasmine'], 'Orchidée': ['orchid'], 'Fleur d’oranger': ['oranger', 'neroli'], 'Rose': ['rosé'],
    'Pêche': ['peach', 'nectarine', 'brugnon'], 'Pomme': ['apple'], 'Citron': ['citronn', 'lemon', 'citron vert'], 'Bergamote': ['earl grey'], 'Pamplemousse': ['grapefruit'],
    'Fruits rouges': ['framboise', 'cassis', 'cerise', 'fraise', 'groseille', 'mûre'], 'Raisin sec': ['raisin'], 'Pruneau': ['prune'], 'Jujube': ['datte'],
    'Miel': ['miell', 'honey'], 'Caramel': ['caramélis'], 'Malt': ['malté', 'maltée'], 'Sucre brun': ['cassonade', 'mélasse'],
    'Crème': ['crémeu'], 'Lait': ['lacté', 'laiteu', 'milky'], 'Beurre': ['beurré'],
    'Noisette': ['noisetté'], 'Torréfié': ['torréfaction', 'roasted'], 'Cacao': ['chocolat'], 'Charbon de bois': ['charbon', 'braise'],
    'Poivre': ['poivré'], 'Anis étoilé': ['badiane', 'anisé'], 'Bois sec': ['bois'], 'Fumée de pin': ['lapsang'], 'Feu de bois': ['fumé', 'fumée'],
    'Sous-bois': ['feuilles mortes', 'mousse'], 'Terre humide': ['terre', 'terreu'], 'Champignon': ['champi'], 'Camphre': ['camphré'],
    'Pierre mouillée': ['minéral', 'pierre', 'roche'], 'Menthol': ['mentholé'], 'Menthe': ['mint'], 'Mangue': ['mango'], 'Fruit de la passion': ['passion', 'maracuja'], 'Pain d’épices': ['pain d epice'], 'Bouillon': ['brothy'], 'Umami': ['savoureux'], 'Biscuit': ['biscuité', 'sablé'], 'Céréales': ['céréale', 'grain'], 'Algue': ['algues'], 'Iodé': ['iode', 'marin', 'marine'],
    'Herbe coupée': ['herbe', 'herbacé', 'gazon'], 'Épinard': ['épinards'], 'Petits pois': ['petit pois'], 'Haricot vert': ['haricot'], 'Asperge': ['asperges'], 'Foin': ['paille']
  },
  // Anciens tags → tags de la roue
  oldTags: { 'fruite': 'Fruit frais', 'malte': 'Malt', 'terreux': 'Vieilli & terreux', 'doux': 'Subtil', 'agrumes': 'Citron', 'fume': 'Fumé & cuir', 'sucre': 'Sucré & miel', 'grille': 'Grillé', 'mineral': 'Minéral', 'noix': 'Noix', 'cereale': 'Céréales', 'tropical': 'Fruits tropicaux', 'herbace': 'Herbe coupée', 'plantes': 'Herbes aromatiques', 'vieilli': 'Vieilli & terreux', 'epice': 'Épicé', 'leger': 'Subtil', 'delicat': 'Subtil', 'fort': 'Puissant', 'puissant': 'Puissant', 'corse': 'Corsé' },
  wheel: [
    { k: 'floral', n: 'Floral', c: '#d9849b', s: 'TGK', z: '花香 huāxiāng', a: ['Jasmin', 'Orchidée', 'Rose', 'Osmanthus', 'Fleur d’oranger', 'Chèvrefeuille', 'Gardénia', 'Lys'], h: 'Fleurs blanches, sucrées ou capiteuses. Oolongs légers, Baozhong, thés blancs, dan cong.' },
    { k: 'fruitfrais', n: 'Fruit frais', c: '#e8a35a', s: 'TGK', z: '果香 guǒxiāng', a: ['Pêche', 'Abricot', 'Pomme', 'Poire', 'Litchi', 'Citron', 'Bergamote', 'Pamplemousse', 'Yuzu'], h: 'Fruits juteux, à peine mûrs, et agrumes. Oolongs de Taïwan, Darjeeling first flush, thés blancs.' },
    { k: 'tropical', n: 'Fruits tropicaux', c: '#efb843', s: 'M', z: '热带果香 rèdài guǒxiāng', a: ['Mangue', 'Ananas', 'Fruit de la passion', 'Banane', 'Melon'], h: 'Fruits exotiques bien mûrs. Darjeeling d’été, oolongs très oxydés, certains thés noirs de Taïwan.' },
    { k: 'fruitmur', n: 'Fruit mûr', c: '#b5674a', s: 'TG', z: '熟果香 · 枣香 zǎoxiāng', a: ['Raisin sec', 'Jujube', 'Figue', 'Pruneau', 'Muscat', 'Fruits rouges'], h: 'Fruits cuits, confits ou séchés. Monte avec l’oxydation : Oriental Beauty, thés noirs, vieux oolongs.' },
    { k: 'sucre', n: 'Sucré & miel', c: '#d9b25a', s: 'TG', z: '甜香 · 蜜香 mìxiāng', a: ['Miel', 'Caramel', 'Sucre brun', 'Vanille', 'Malt', 'Sirop d’érable'], h: 'Douceurs pâtissières. Le « miel » d’Oriental Beauty, les thés noirs, le fond de tasse.' },
    { k: 'lacte', n: 'Lacté', c: '#e6d3a8', s: 'M', z: '奶香 nǎixiāng', a: ['Beurre', 'Lait', 'Crème', 'Maïs doux'], h: 'Rond et gras. Oolongs « milky » (jin xuan), thés jaunes.' },
    { k: 'noix', n: 'Noix & châtaigne', c: '#c28e55', s: 'TGK', z: '栗香 lìxiāng', a: ['Châtaigne', 'Noisette', 'Amande', 'Noix', 'Patate douce'], h: 'Fruits à coque et racines. Thés verts chinois poêlés (栗香), oolongs mi-torréfiés.' },
    { k: 'cereale', n: 'Céréales & pâtisserie', c: '#c9a46a', s: 'M', z: '谷物香 gǔwùxiāng', a: ['Orge', 'Céréales', 'Biscuit', 'Brioche', 'Pain d’épices'], h: 'Le petit-déjeuner et la boulangerie. Thés noirs du Yunnan, thés jaunes, genmaicha, vieux thés blancs.' },
    { k: 'grille', n: 'Grillé', c: '#a87a4a', s: 'TGK', z: '火香 · 焦香 jiāoxiāng', a: ['Pain grillé', 'Riz grillé', 'Torréfié', 'Café', 'Cacao', 'Charbon de bois'], h: 'Ce qui a vu le feu. Yan cha, hojicha, oolongs fortement torréfiés.' },
    { k: 'epice', n: 'Épicé', c: '#c0583e', s: 'T', z: '辛香 xīnxiāng', a: ['Cannelle', 'Poivre', 'Clou de girofle', 'Réglisse', 'Gingembre', 'Anis étoilé', 'Cardamome'], h: 'Le placard à épices. Rou gui, Baozhong, thés noirs, vieux thés.' },
    { k: 'boise', n: 'Boisé', c: '#8a6a4a', s: 'TGK', z: '木香 · 槟榔香', a: ['Bois sec', 'Cèdre', 'Santal', 'Écorce', 'Arec', 'Bois humide'], h: 'Bois sec ou mouillé. Liu bao (槟榔香, l’arec), vieux sheng, thés sombres.' },
    { k: 'fume', n: 'Fumé & cuir', c: '#5a5450', s: 'GK', z: '松烟香 sōngyānxiāng', a: ['Fumée de pin', 'Feu de bois', 'Tabac', 'Cuir', 'Encens'], h: 'Fumée et cuir. Lapsang souchong (fumé au pin), certains sheng, vieux oolongs.' },
    { k: 'vieilli', n: 'Vieilli & terreux', c: '#6b5444', s: 'GK', z: '陈香 · 菌花香 · 樟香', a: ['Sous-bois', 'Terre humide', 'Champignon', 'Cave', 'Fleur dorée', 'Camphre'], h: 'Le temps qui passe. Pu’er shou et vieux sheng (陈香, 樟香 camphre), briques de Fu (菌花香, la « fleur dorée »).' },
    { k: 'mineral', n: 'Minéral', c: '#8fa3b0', s: 'M', z: '岩韵 yányùn', a: ['Pierre mouillée', 'Silex', 'Menthol'], h: 'Fraîcheur de roche. Le « yan yun » des thés de rocher du Wuyi.' },
    { k: 'marin', n: 'Marin', c: '#5f9ea0', s: 'GK', z: '海藻香 hǎizǎoxiāng', a: ['Algue', 'Nori', 'Iodé', 'Embruns'], h: 'L’océan. Thés verts à la vapeur : sencha, gyokuro, enshi yulu.' },
    { k: 'umami', n: 'Umami & bouillon', c: '#7f8c55', s: 'M', z: '鲜味 xiānwèi', a: ['Bouillon', 'Umami', 'Kombu', 'Edamame'], h: 'Savoureux, presque salé. Gyokuro, sencha ombragés, matcha de qualité.' },
    { k: 'vegetal', n: 'Végétal', c: '#7fa85a', s: 'TK', z: '青香 · 豆香 dòuxiāng', a: ['Herbe coupée', 'Épinard', 'Haricot vert', 'Asperge', 'Petits pois', 'Foin', 'Persil'], h: 'Vert, herbacé, légumineux. Thés verts, blancs jeunes, sheng jeune.' },
    { k: 'herbes', n: 'Herbes aromatiques', c: '#6fa37a', s: 'K', z: '草本香 cǎoběnxiāng', a: ['Menthe', 'Thym', 'Basilic', 'Verveine', 'Eucalyptus'], h: 'Le jardin d’herbes. Certains sheng jeunes, oolongs verts, thés de montagne.' },
    { k: 'tendre', n: 'Tendre & frais', c: '#b3c77a', s: 'G', z: '毫香 · 嫩香 · 清香', a: ['Bourgeon', 'Pousse tendre', 'Fraîcheur'], h: 'Le parfum des bourgeons duveteux (毫香) et des jeunes pousses (嫩香). Bai hao yin zhen, grands verts printaniers.' }
  ]
};

// Roue animée (dessinée à la main dans #mdt-wheel, hors moteur de template).
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const C = 260, R0 = 58, R1 = 138, R2 = 232;
  const lum = h => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const pt = (r, a, e, m) => [C + r * Math.cos(a) + e * Math.cos(m), C + r * Math.sin(a) + e * Math.sin(m)];
  function arc(ri, ro, a0, a1, e) {
    const m = (a0 + a1) / 2, big = a1 - a0 > Math.PI ? 1 : 0, f = v => v.toFixed(1);
    const p1 = pt(ro, a0, e, m), p2 = pt(ro, a1, e, m), p3 = pt(ri, a1, e, m), p4 = pt(ri, a0, e, m);
    return 'M' + f(p1[0]) + ' ' + f(p1[1]) + ' A' + ro + ' ' + ro + ' 0 ' + big + ' 1 ' + f(p2[0]) + ' ' + f(p2[1]) + ' L' + f(p3[0]) + ' ' + f(p3[1]) + ' A' + ri + ' ' + ri + ' 0 ' + big + ' 0 ' + f(p4[0]) + ' ' + f(p4[1]) + ' Z';
  }
  function layout(W, sel, selA) {
    const tot = W.reduce((t, w) => t + w.a.length, 0); const base = []; let a = -Math.PI / 2;
    W.forEach(w => { const sp = 2 * Math.PI * w.a.length / tot; base.push({ a0: a, sp: sp }); a += sp; });
    const si = W.findIndex(w => w.k === sel);
    if (si < 0) return W.map((w, i) => ({ a0: base[i].a0, sp: base[i].sp, e: 0, r1: R1, r2: R2, op: 1, aop: w.a.map(() => .62), big: 0 }));
    const F = 0.36, others = tot - W[si].a.length, ws = F / (1 - F) * others;
    const tot2 = others + ws; const sp = W.map((w, i) => 2 * Math.PI * (i === si ? ws : w.a.length) / tot2);
    // garde le centre de la famille choisie à sa place : elle s'ouvre des deux côtés
    let start = base[si].a0 + base[si].sp / 2 - sp[si] / 2; for (let i = 0; i < si; i++) start -= sp[i];
    let b = start;
    return W.map((w, i) => { const o = { a0: b, sp: sp[i], e: i === si ? 10 : 0, r1: i === si ? R1 + 8 : R1 - 4, r2: i === si ? R2 + 16 : R2 - 8, op: i === si ? 1 : .5, aop: w.a.map(x => i !== si ? .3 : (!selA || x === selA) ? (x === selA ? 1 : .72) : .45), big: i === si ? 1 : 0 }; b += sp[i]; return o; });
  }
  const lerp = (x, y, t) => x + (y - x) * t;
  function mix(A, B, t) { return A.map((p, i) => { const q = B[i]; return { a0: lerp(p.a0, q.a0, t), sp: lerp(p.sp, q.sp, t), e: lerp(p.e, q.e, t), r1: lerp(p.r1, q.r1, t), r2: lerp(p.r2, q.r2, t), op: lerp(p.op, q.op, t), aop: p.aop.map((v, k) => lerp(v, q.aop[k], t)), big: lerp(p.big, q.big, t) }; }); }
  const ease = t => { const c1 = 1.25, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function place(span, r, ang, e, m, size, txt, show) {
    const p = pt(r, ang, e, m); let deg = ((ang * 180 / Math.PI) % 360 + 360) % 360; if (deg > 90 && deg < 270) deg -= 180;
    span.style.left = (p[0] / 5.2).toFixed(2) + '%'; span.style.top = (p[1] / 5.2).toFixed(2) + '%';
    span.style.transform = 'translate(-50%,-50%) rotate(' + deg.toFixed(1) + 'deg)';
    span.style.fontSize = 'clamp(7px,' + (size / 5.2).toFixed(2) + 'cqw,' + (size * 1.4).toFixed(1) + 'px)';
    span.style.opacity = show; if (txt != null && span.textContent !== txt) span.textContent = txt;
  }
  function paint(st, L) {
    const W = st.W;
    W.forEach((w, i) => {
      const l = L[i], m = l.a0 + l.sp / 2, el = st.fam[i];
      el.p.setAttribute('d', arc(R0, l.r1, l.a0, l.a0 + l.sp, l.e)); el.p.setAttribute('fill-opacity', l.op.toFixed(2));
      const fs = 11.5 + 2.5 * l.big, need = Math.min(fs, (l.r1 - R0 - 8) / (0.56 * w.n.length)) * 1.1;
      const fsF = Math.min(fs, (l.r1 - R0 - 8) / (0.56 * w.n.length)); place(el.t, (R0 + l.r1) / 2, m, l.e, m, fsF, null, l.sp * (R0 + l.r1) / 2 > need ? (l.op < .75 ? .8 : 1) : 0); el.t.style.color = l.op < .75 ? '#2b2118' : el.fg;
      w.a.forEach((x, k) => {
        const b0 = l.a0 + l.sp * k / w.a.length, b1 = l.a0 + l.sp * (k + 1) / w.a.length, ae = el.a[k];
        ae.p.setAttribute('d', arc(l.r1, l.r2, b0, b1, l.e)); ae.p.setAttribute('fill-opacity', l.aop[k].toFixed(2));
        const r = (l.r1 + l.r2) / 2 + 3, s = (x.length > 12 ? 9 : 10) + 2 * l.big;
        place(ae.t, r, (b0 + b1) / 2, l.e, m, s, null, (b1 - b0) * r > s * 1.05 ? (l.op < .75 ? .7 : 1) : 0);
        ae.t.style.fontWeight = x === st.selA ? '800' : l.big > .5 ? '600' : '500';
        ae.t.style.color = l.aop[k] > .9 && lum(w.c) < .6 ? '#fff' : '#2b2118';
      });
    });
  }
  window.mdtWheel = function (el, o) {
    if (!el) return; const W = (window.MDT_SAVOIR || {}).wheel || [];
    let st = el._mdtw;
    if (!st || st.W !== W) {
      el.innerHTML = ''; const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 520 520'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Roue des arômes du thé');
      svg.style.cssText = 'width:100%;height:auto;display:block;overflow:visible;';
      const gA = document.createElementNS(NS, 'g'), gF = document.createElementNS(NS, 'g'); svg.appendChild(gA); svg.appendChild(gF);
      const ctr = document.createElementNS(NS, 'circle'); ctr.setAttribute('cx', C); ctr.setAttribute('cy', C); ctr.setAttribute('r', R0 - 2); ctr.setAttribute('fill', '#f6efe2'); ctr.style.cursor = 'pointer'; svg.appendChild(ctr);
      el.appendChild(svg);
      st = el._mdtw = { W: W, fam: [], sel: null, selA: null, L: null, o: o };
      const mk = (txt, cls) => { const s = document.createElement('span'); s.className = 'sv-lbl ' + cls; s.textContent = txt; el.appendChild(s); return s; };
      W.forEach((w, i) => {
        const fg = lum(w.c) > .72 ? '#2b2118' : '#fff';
        const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', w.c); p.setAttribute('stroke', '#f6efe2'); p.setAttribute('stroke-width', '2'); p.setAttribute('class', 'sv-p');
        p.addEventListener('click', () => st.o.onFam(w.k)); gF.appendChild(p);
        const t = mk(w.n, 'sv-lf'); t.style.color = fg; t.style.fontWeight = '700';
        const a = w.a.map(x => { const q = document.createElementNS(NS, 'path'); q.setAttribute('fill', w.c); q.setAttribute('stroke', '#f6efe2'); q.setAttribute('stroke-width', '1.2'); q.setAttribute('class', 'sv-p');
          q.addEventListener('click', () => st.o.onAro(w.k, x)); gA.appendChild(q); const tt = mk(x, 'sv-la'); tt.style.color = '#2b2118'; return { p: q, t: tt }; });
        st.fam.push({ p: p, t: t, a: a, fg: fg });
      });
      const cz = document.createElement('div'); cz.className = 'sv-ctr'; cz.addEventListener('click', () => st.o.onCenter()); el.appendChild(cz); st.cz = cz;
      ctr.addEventListener('click', () => st.o.onCenter());
    }
    st.o = o;
    const sel = o.sel || '', selA = o.selA || '';
    const w = W.find(z => z.k === sel);
    const html = w ? '<b style="color:' + w.c + '">' + w.n + '</b><small>' + (w.z || '') + '</small>' : '<b>Arômes</b><small>du thé</small>';
    if (st.cz.innerHTML !== html) st.cz.innerHTML = html;
    st.cz.style.cursor = w ? 'pointer' : 'default';
    if (st.L && st.sel === sel && st.selA === selA) return;
    const target = layout(W, sel, selA); const from = st.L || layout(W, '', '');
    st.sel = sel; st.selA = selA; cancelAnimationFrame(st.raf);
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!st.L || reduce) { st.L = target; paint(st, target); return; }
    const t0 = performance.now(), D = 560;
    const step = now => { const t = Math.min(1, (now - t0) / D); st.L = mix(from, target, ease(t)); paint(st, st.L); if (t < 1) st.raf = requestAnimationFrame(step); else st.L = target; };
    st.raf = requestAnimationFrame(step);
  };
})();
