# Sagrada  - Front-end toolkit

Sagrada est constitué d'une banque d'outils de développement Web visant à faciliter et augmenter la productivité d'un projet Web.

Après un survol général de ce que le Web peut nous offrir en terme de plugins, de framework et autres widgets, nous sommes venus à la conclusion qu'il était mieux de développer ensemble notre propre tool kit pour des raisons telles que le respect des bonnes pratiques, l'uniformité du code et l'accessibilité Web.

Sagrada est la somme revue et peaufinée de tous nos morceaux d'expertise en intégration chez Libéo.

## Pour utiliser Sagrada dans votre projet
### 1. Cloner Sagrada à la racine de votre projet
```
git clone --depth=1 --branch=main ssh://git@gitlab.libeo.com:36220/frontend/sagrada.git integration
rm -rf integration/.git
```
> Supprimer le fichier `.git` à l'intérieur du dossier integration permet de commit les changements dans votre projet au lieu de les commits dans le template Sagrada.

### 2. Initialisation de Sagrada
```
yarn install
yarn run dev
```
> Si vous n'avez pas yarn. Suivez les instructions sur le [site officiel](https://classic.yarnpkg.com/en/docs/install) pour l'installer. Il n'est pas recommandé d'utiliser ```npm install```, car les versions des dépendances ne seront respectées.

### 3. Créer les symlinks
Sagrada compile les fichiers dans le dossier `build`. Créer un symlink depuis le dossier de ressources de votre CMS vers chacuns des répertoires dans le dossier `build` (Ex. img, svg, css, js, fonts). Vous pouvez ignorer les fichiers `*.html` qui servent uniquement a l'intégration statique.
```
cd src/public
ln -s ../../integration/build/css css
ln -s ../../integration/build/js js
etc...
```

## Liste des scripts disponibles

```
yarn run dev
```
Build le projet, watch les fichiers sources et démarre un serveur de développement local (hot reload) sur ```localhost:3000``` et ouvre le browser.
___

```
yarn run watch
```
Build le projet, watch les fichiers sources, sans démarrer un serveur de développement. N'ouvre pas le browser.
___

```
yarn run optimize
```
Optimize les images, minifie les svg et build un sprite.
___

```
yarn run build
```
Build le projet pour la mise en ligne. Ne watch pas les assets. N'ouvre pas de serveur de développement local. N'ouvre pas le browser.
___

## Fichiers de configuration

- config/config.js
> Configuration du projet et du build system (gulp)

- data/data.json
> Données statiques envoyées au template (twig)

## Architecture de dossier

- build: ```Dossier d'output du build```
  - css: ```CSS compilé, sourcemap et minification si configurer```
  - img: ```Images non-vectorielles (png, jpg, etc.)```
  - js: ```Bundle js pour le header/footer, minifier si configurer```
  - svg: ```Spritemap black & white et originaux pour le CSS```
- config: ```Fichiers de configurations du build```
- src: ```Fichier source utiliser pour le build```
  - data: ```Fichier json pour les données statique```
  - js: ```Dossier des scripts``` ```Utiliser scripts.config.js pour customizer l'output```
    - vendor ```Path d'installation des dépendances bower```
  - scss: ```Dossier des styles```
    - base: ```Styles généraux du site: base, print, accessibilité, typos, etc...```
    - foundation: ```Styles de Foundation et ses settings```
    - layout: ```Styles des différents layouts```
    - modules: ```Styles pour chacuns des modules```
    - settings: ```Variables et mixins```
    - vendor: ```Styles des dépendances bower```
  - svg: ```Dossier des SVG```
  - templates: ```Dossier des templates twig```
    - layouts: ```Dossier contenant les différents layouts```
    - partials: ```Dossier contenant les différents partials```
    - views: ```Dossier contenant toutes les pages a builder```
- tasks: ```Gulpfile sous-divisé en différentes task.``` ```index.js = gulpfile.js```
- utils: ```Fonctions custom pour twig```

> Astuce ! Préfixer le nom de votre template pour ordonner vos pages.  
Ex: `1.index.twig` sera la première page au lieu de suivre l'ordre alphabétique.

## [Foundation](https://foundation.zurb.com/sites/docs/)

Cette version de Sagrada est basée sur Foundation. Vous pouvez donc vous rendre dans ```src/foundation/_foundation-sites.scss``` pour activer et désactiver des fonctionnalités. Les fonctionnalités activées par défaut sont généralement suffisantes.

### Fonctionnalités activés par défaut

- [Global styles](https://foundation.zurb.com/sites/docs/global.html)
- [XY Grid classes](https://foundation.zurb.com/sites/docs/xy-grid.html)
- [Typography helper](https://foundation.zurb.com/sites/docs/typography-helpers.html)
- [Buttons](https://foundation.zurb.com/sites/docs/button.html)
- [Forms](https://foundation.zurb.com/sites/docs/forms.html)
- [Tables](https://foundation.zurb.com/sites/docs/table.html)
- [Visibility classes](https://foundation.zurb.com/sites/docs/visibility.html)
- [Flexbox utility classes ](https://foundation.zurb.com/sites/docs/flexbox-utilities.html)
