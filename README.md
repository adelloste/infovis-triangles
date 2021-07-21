# infovis-triangles

D3.js - INFOVIS

## Table of contents

* [Getting Started](#getting-started)
* [Clone the repo](#clone-the-repo)
* [Install npm packages](#install-npm-packages)
* [Npm scripts](#npm-scripts)
* [Demo](#demo)
* [Goal](#goal)

### Getting Started

This project was generated with [generator-webapp](https://github.com/yeoman/generator-webapp) version 4.0.0-8

**[⬆ back to top](#table-of-contents)**

### Clone the repo

```shell
git clone https://github.com/adelloste/infovis-triangles.git
cd ain
```

**[⬆ back to top](#table-of-contents)**

### Install npm packages

Install packages described in` package.json`

```shell
npm install
```

**[⬆ back to top](#table-of-contents)**

### Npm scripts

* `npm run start` - to preview and watch for changes
* `npm run build` - to build webapp for production
* `npm run serve:dist` - to preview the production build
* `npm run deploy` - to build webapp for production and deploy

**[⬆ back to top](#table-of-contents)**

### Demo

Published site at https://adelloste.github.io/infovis-triangles/

**[⬆ back to top](#table-of-contents)**

### Goal

Crea un file json con dei dati multivariati: ci sono 10 data-cases e
ogni data-case ha cinque variabili quantitative i cui valori sono tutti
positivi. In base a questi dati disegna 10 triangoli isosceli nell'area
di disegno (ogni triangolo corrisponde ad un data-case). La prima
variabile determina la posizione orizzontale del triangolo, la seconda
variabile la posizione verticale, la terza variabile la lunghezza della
base, la quarta variabile l'altezza del triangolo (e dunque la lunghezza
dei due altri lat)i, e la quinta variabile la tonalità del riempimento.
Facendo click con il pulsante sinistro su una caratteristica mentre si
tiene premuto il tasto "y", la variabile corrispondente alla
caratteristica viene utilizzata per la posizione "y" e la variabile
prima utilizzata per la posizione "y" viene utilizzata per la
caratteristica specifica (per tutti i triangoli). Facendo click mentre
si tiene permuto il tasto "x" avviene lo stesso scambio rispetto alla
variabile "x". Fai in modo che i cambi di dimensione, di posizione e di
colore dei triangoli avvengano con un'animazione fluida. Usa le scale
D3.js per mappare l'intervallo dei valori delle variabili (che è
arbitrario) sull'intervallo dei valori delle coordinate, che dipende
dalla tua interfaccia.

**[⬆ back to top](#table-of-contents)**
