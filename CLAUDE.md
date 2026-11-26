# L’Unanimithé — notes pour Claude

Site de collection de thés partagée (Raph, Maël…). Réponses en français, concises. Toujours donner la version à la fin : « **Version : vX.Y.Z** ».

**Au début de chaque nouvelle conversation**, le tout premier message à Raph donne la version actuelle du site (lire `MDT_VERSION` dans `version.js` sur `main` après un `git pull`) : « **Site en vX.Y.Z** », avant toute autre chose.

## Hébergement
- GitHub Pages (branche `main`, dépôt Dyfrost/maison-du-the), domaine **https://lunanimithe.fr** (OVH, fichier `CNAME`).
- Base : Supabase projet `hnyomaobuftunuhwkzox` (ap-southeast-1 / Singapour — migration vers l’UE prévue au retour en France). Stockage v2 : table `mdt_items(kind,id,owner,data,deleted,updated_at)`.
- **Jamais** de clé secrète dans le site : la clé service est dans le secret GitHub `SUPABASE_SERVICE_KEY`, la clé VAPID privée seulement dans les secrets de l’Edge Function.

## Fichiers
- `index.html` : toute l’appli (moteur de gabarits `.dc.html` de `support.js` : `{{ }}`, `<sc-if>`, `<sc-for>`, `renderVals()`, `window.__mdtApp`). `Site The.dc.html` = simple redirection vers `./`.
- Toujours écrire `<sc-raw-select>` au lieu de `<select>` (Safari iOS). `</script>` dans le gabarit doit être échappé.
- `version.js` : `MAJEUR.MINEUR.CORRECTIF` — correctif pour une petite modif, mineur (2.20…) pour une nouvelle fonctionnalité, majeur seulement pour une très grosse mise à jour.
- `supabase-config.js` : URL/clé publique + mentions légales (`MDT_LEGAL`, éditeurs en tableau).
- `image-slot.js` (images du site, enregistrées dans `options.siteImages`), `crop.js` (recadrage), `sw.js` (notifications + cache des fichiers fixes).
- Scripts SQL `supabase-*.sql` : à faire lancer par l’utilisateur dans le SQL Editor (bouton « Copier » dans Admin › Accueil › Santé de la base pour suivi, temps réel, ménage).

## Performances (à préserver)
- Calculs lourds mémorisés via `memo()/memoObj()` : le cache est vidé quand `this._adds`/`_chg`, la session, l’encyclopédie ou les unités changent. Ne jamais muter `this._adds` sans passer par `setAdds()`.
- Sync : incrémentale (+ temps réel Supabase si activé), rechargement complet à l’ouverture / changement de droits / toutes les 6 h.
- Unités d’affichage (°C/°F, cL/fl oz, g/oz) : stockage toujours en °C, g, cL ; utiliser `tempTxt`, `massTxt`, `volTxt`, `recoTxt`.

## Façon de travailler
1. Modifier → tester en local (Playwright, `python3 -m http.server 8765` dans le dépôt, routes Supabase bloquées, données fictives) → vérifier capture d’écran.
2. Monter `version.js` → commit (`git -c user.name=Dyfrost -c user.email=Dyfrost@users.noreply.github.com commit`) → push → attendre le déploiement (`gh api repos/Dyfrost/maison-du-the/actions/runs`).
3. Rapport court en français, sans jargon, terminé par la version.
- Pages : sur PC le contenu occupe ~3/4 de la largeur.
- Document d’idées : Claude Doc « L’Unanimithé — idées d’amélioration » (retirer ce qui est implémenté).
