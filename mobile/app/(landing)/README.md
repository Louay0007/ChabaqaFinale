# Landing Page Structure

Cette section contient la page d'accueil restructurée de l'application mobile Chabaqa.

## Architecture

```
(landing)/
│
├── _layout.tsx          // Configuration de navigation Expo Router
├── index.tsx            // Page principale orchestrant les composants
├── styles.ts            // Styles partagés
│
├── components/          // Composants UI réutilisables
│   ├── Header.tsx       // En-tête avec logo + boutons navigation + logout
│   ├── Hero.tsx         // Section principale avec titre + CTA
│   ├── Stats.tsx        // Section statistiques avec icônes
│   ├── Footer.tsx       // Pied de page
│   ├── HowItWorks.tsx   // Modal "Comment ça marche"
│   ├── index.ts         // Export centralisé des composants
│   └── icons/           // Icônes SVG
│       ├── ArrowLeftIcon.tsx
│       ├── UsersIcon.tsx
│       ├── DollarIcon.tsx
│       └── ChartIcon.tsx
```

## Composants

### Header
- Affiche le logo Chabaqa
- Bouton "How it Works" pour ouvrir la modal
- Bouton "Logout" conditionnel (si utilisateur connecté)

### Hero
- Titre principal avec gradient
- Sous-titre descriptif
- Bouton CTA "Start Building Free"
- Lien vers la connexion

### Stats
- Affichage des statistiques avec icônes
- Gradients colorés pour chaque statistique
- Icons: Users, Dollar, Chart

### HowItWorks
- Modal plein écran
- Animation de scroll pour la flèche de retour
- Design par étapes avec palette de couleurs
- Bouton CTA final

### Footer
- Copyright simple

## Utilisation

Le fichier `index.tsx` orchestre tous les composants et gère :
- L'état d'authentification
- La navigation
- Les callbacks entre composants
- La gestion des modals

Chaque composant est autonome avec ses propres props typées et peut être réutilisé facilement.
