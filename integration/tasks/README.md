# Tâches de Sagrada

## Tâches disponibles

### Scripts (scripts.js)

Tout ce qui a rapport aux fichiers JS. Intialement pensé pour aussi gérer du Vue.JS, pour l'instant seulement les tâche de legacy sont utilisés régulièrement.

#### build

Compile les fichiers javascript à l'aide de Webpack. Pas vraiment utilisé / testé pour le moment.

#### check

Vérifie que les fichiers js sont valide avec eslint.
Le fichier `.eslintrc.js` contient la configuration de vérification.

#### clean

Supprime le dossier js qui se trouve dans le dossier de build.


### Styles (styles.js)

Tout ce qui a rapport aux fichiers de styles. Zurb Foundation est inclus par défaut.

#### build

Construit le scss avec la base de Zurb Foundation.

#### check

Vérifie que les fichiers scss sont valide avec sasslint.
Le fichier `.sass-lint.yml` contient la configuration de vérification.

#### clean

Supprime le dossier css qui se trouve dans le dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean, check et build.


### Templates (templates.js)

Tout ce qui a rapport aux fichiers de templates statiques. Fonctionne avec Twig.

#### json

Compile les données inclues dans data pour les inclure dans le contexte de twig.

#### build

Construit le html à partir des vues dans templates.
Chaque vue a une fichier html associé au même nom construit dans build.

#### clean

Supprime le fichiers html qui se trouvent dans le dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean, json et build.

### Images (images.js)

#### copy

Copie toutes les images du dossier src/img dans le dossier build/img.

#### check

Vérifie que toutes les images soit en dessous d'une certaine taille.

#### optimize

Optimize toutes les images dans le dossier src avec imagemin.

#### clean

Supprime le dossier img du dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean et copy


### SVGs (svgs.js)

#### copy

Copie tous les svgs de src à build (svg/originals).
Cette tâche copie sans faire de modifications au SVG.

#### sprite

Compile les svgs dans les bundles indiqués dans `svgs.json`.
```js
{
    "symbols": [
        "*.svg"
    ],
    "icons": [
        "icons/*.svg"
    ]
}
```

#### optimize

Optimize tous les svgs dans le dossier src avec svgo

#### clean

Supprime le dossier svg du dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean, sprite et copy

### Fonts (fonts.js)

#### copy

Copie toutes les fonts de src à build.

#### clean

Supprime le dossier fonts du dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean et copy.


### Assets (assets.js)

#### copy

Copie tous les assets de src à build.

#### clean

Supprime le dossier assets du dossier de build.

#### watch

Détecte les modifications dans le dossier src et roule les tâches clean et copy.

### Server (server.js)

#### start

Démarre un serveur BrowserSync qui point sur le dossier build.
Détecte automatiquement les modifications du dossier build et reload le navigateur.

### Utilitaires (util.js)

#### clean

Supprime le dossier build au complet.

## Tâches d'aggrégat (index.js)

Des tâches d'aggrégat existent pour lancer les différentes tâches disponibles.

### build

Lance un clean de tout le dossier build et lance toutes les tâches de build/copy.

### watch

Lance toutes les tâches watch.

### dev

Combine les deux tâches précédentes, build et watch, en plus de démarrer le serveur web

### start

Lance un build et, ensuite, démarre le serveur web

### optimize

Lance toutes les tâches d'optimisation.

## Créer une nouvelle tâche

Il faut se demander si la tâche devrait être inclus dans une tâche existante.
Si non, créer un fichier dans `tasks` avec un nom approprié.

Idéalement, il faudrait suivre la même convention pour les tâches.
Donc nommer les tâches sous les types suivant `build`, `copy`, `clean`, etc.
