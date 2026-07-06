# Wordle

Implémentation du jeu Wordle en TypeScript avec une suite de tests unitaires et une interface React.

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm

## Installation

### 1. Dépendances des tests

```bash
npm install
```

### 2. Dépendances de l'interface (frontend)

```bash
cd view
npm install
```

## Lancer les tests

Depuis la racine du projet :

```bash
npx vitest
```

Pour un run unique sans mode watch :

```bash
npx vitest run
```

## Lancer l'application

Depuis le dossier `view/` :

```bash
cd view
npm run dev
```

L'application est ensuite accessible sur [http://localhost:5173](http://localhost:5173).

## Structure du projet

```
domain/       # Logique métier pure (modèles, erreurs, interfaces)
external/     # Implémentations techniques (API, GameManager)
tests/        # Tests unitaires et doublures de test
view/         # Interface React (frontend)
```
