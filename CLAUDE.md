# Conventions globales

Le but est de pouvoir générer une vertical slice complète pour chaque user story, en suivant les conventions de nommage et la structure définies dans ce document. 
En lui fournissant une user story et un scénario d'acceptation, le générateur doit créer tout le vertical slice, en suivant une approche proche du TDD.

J’utilise la méthodologie TDD avec une orientation BDD. Les user stories sont déjà rédigées ; chacune possède un ensemble de scénarios pouvant servir de tests d’acceptation.

## Architecture et approche de developpement

Le projet est un "monorepo" avec un dossier frontend (react) et un backend (nestjs). Voici les étapes que je suis pour une user story :
- dev frontend en tdd avec fake repository (pas d'appel API) pour le scénario nominal (happy path) et un sad path
- mise en test pour le client
- dev backend de la logique métier en tdd avec fake repository sur tous les scénarios
- dev backend du e2e avec testcontainers pour le scénario nominal (happy path) et un sad path
- dev frontend pour l'appel d'api (pas de test e2e) avec test manuel de la fonctionnalité


## Pièges TDD courants à éviter

- Écrire du code de production avant d’avoir un test en échec 
- Créer plusieurs tests avant de faire passer le premier 
- Écrire plus de code que nécessaire pour satisfaire le test en cours 
- Sauter l’étape de refactorisation lorsque le code pourrait être amélioré 
- Ajouter des fonctionnalités « tant qu’à faire » sans d’abord écrire le test qui les pilote


## Conventions TypeScript
- **Types stricts** : Pas de `any`, utiliser des types explicites
- **Imports** : Utiliser les alias `@src/` configurés
- **Interfaces** : Pour définir les contrats des repositories

# Frontend : 

## Structure et Vertical Slice

Chaque fonctionnalité en vertical slice doit suivre la structure établie dans ce dossier de guidelines avec les exemples `guidelines/frontend/{module}/{userStory}`:

```
frontend/src/features/{module}/{userStory}/
├── {userStory}.queryResult/command.ts      # Modèles de données TypeScript pour les résultats de la requête ou la commande
├── {userStory}.{resource}.repository.ts               # Interface du repository avec le nom de la ressource ajouté à la user story
├── {userStory}.{resource}.repository.provider.tsx     # Provider avec Context API pour injection de dépendance (avec le nom de la ressource)
├── {userStory}.{resource}.fetchRepository.ts          # Repository réel utilisant l'API (avec le nom de la ressource)
├── use{UserStory}.usecase.ts              # Hook React contenant la logique métier
├── {UserStory}.component.tsx               # Composant React principal
└── test/
    ├── {userStory}.spec.tsx                   # Tests de la fonctionnalité
    └── {userStory}.{resource}.inMemoryRepositories.ts # Repository fakes pour les tests (success, failure, etc.)
```

## Orientation Clean architecture : 

Le use case est implémenté dans un hook React, qui est ensuite utilisé dans un composant. Le repository est injecté via le Context API pour permettre l'inversion de dépendance. Le composant n'a pas connaissance du repository.
Chaque ressource utilise un repository dédié, qui est injecté dans le use case via le provider. Le use case contient la logique métier et appelle le repository pour récupérer ou modifier les données.

## Orientation CQS : 

Les repositories liés à des commandes renvoient une promesse avec void. Ils peuvent renvoyer une erreur / exception avec un message, mais ne renvoie pas de données. Les repositories liés à des query renvoient une promesse avec les données demandées (mais ne modifient pas l'état des données).

## Conventions de nommage :
- **Fichiers** : camelCase avec le nom de la user story (ex: `{userStory}.command.ts`)
- **Composants React** : PascalCase (ex: `{UserStory}Component.tsx`)
- **Hooks** : préfixe `use` + PascalCase (ex: `use{userStory}.usecase.ts`)
- **Interfaces** : PascalCase (ex: `{UserStory}.user.repository.ts`)
- **Repository implementations** : PascalCase (ex: `{userStory}.user.successInMemoryRepository.ts`)
- **Query, Query Result and Command Types** : PascalCase (ex: `{userStory}.queryResult/command.ts`)


## Patterns :
1. **Inversion de dépendance** : Les repositories sont injectés dans les use cases via Context API
2. **Influence de la **Clean Architecture** : Les uses cases sont séparés des appels API via l'inversion de dépendance. Le provider fournit donc une implémentation du repository et est typé avec une interface. Le but de cette séparation est de permettre de tester ici les use case (en partant des composants, donc pas 100% clean archi), sans dépendre des appels API réels.
3. **Gestion d'état** : useState dans les hooks pour loading, error, success
4. **Tests sociaux** : Tests unitaires testant composant + logique mais pas les appels API
5. **Repository** : un repository pour chaque ressource

## Conventions pour les Fetch Repositories (Queries)

Pour les repositories qui effectuent des requêtes (GET), suivre ces conventions :

### 2. **URL cohérente** :
- Utiliser l'URL exacte définie dans le contrôleur backend
- Respecter la méthode HTTP (GET pour les queries)
- Correspondance exacte avec l'endpoint défini dans le contrôleur backend

### 3. **Gestion d'erreur** :
- Quand l'errur est envoyée par le repo ou une lib (infra), le use case doit la catcher et la renvoyer avec un message explicite

### 4. **Typage TypeScript** :
- Implémente l'interface du repository correspondant
- Retourne un `Promise<{UserStory}QueryResult>`
- Imports avec les alias `@src/` comme dans les autres fichiers
- Respect des conventions de nommage établies

## Conventions pour les Fetch Repositories (Commands)

Pour les repositories qui effectuent des commandes (POST, PUT, DELETE), suivre ces conventions :

### 2. **Méthodes HTTP** :
- POST pour les créations
- PUT pour les mises à jour complètes
- PATCH pour les mises à jour partielles
- DELETE pour les suppressions

### 3. **Gestion des paramètres** :
- Utiliser un objet Command pour encapsuler les paramètres
- Validation des paramètres côté frontend avant envoi
- Respect du contrat défini dans l'interface

### 4. **Retour** :
- Les commandes retournent `Promise<void>`
- Pas de données retournées, seulement succès ou erreur
- Respecter le principe CQS (Command Query Separation)

Les tests côté frontend sont des tests unitaires / d'intégration (tests « sociaux ») réalisés avec vitest. Ils vérifient les composants et la logique, mais pas les appels API.
La logique est écrite dans des hooks ; ils sont donc couplés à React. Chaque hook joue le rôle de cas d’usage, avec le repository injecté (inversion de dépendance) via l’API Context.

Je commence par écrire le test frontend pour le scénario nominal (happy path) et un seul scénario d’échec (sad path) — celui où une règle métier est violée (le deuxième scénario de la user story). Ensuite, j’écris juste le code nécessaire pour faire passer ce test, en utilisant un repository factice. Quand le test passe, je bascule sur le backend pour la même user story.

## Itérations TDD

Lorsque je te demande de générer des tests pour le frontend :

### Première itération :

Quand je te demande de générer le premier test, tu dois produire uniquement le test du premier scénario : donc une seule fonction test ou it. La première itération ne doit contenir que :
```typescript
import {describe, expect, test, } from "vitest";

describe('Name of the US (replace with the name of the US)', async () => {
    

    test('name of the first scenario (replace with the name of the scenario)', async () => {

        // Etant donné que ...(replace with the given part of the scenario)

        // Quand ... (replace with the when part of the scenario)

        // Alors ... (replace with the then part of the scenario)
        expect(false).toBe(true); // This will fail, but it's ok for the first iteration

    })

})
```

### Deuxième itération :

La deuxième itération doit ajouter le code correspondant aux étapes Given / When / Then, sans créer d’autres fichiers.
Par exemple :

```
import {describe, expect, test, vi} from "vitest";
import {render, waitFor, screen} from "@testing-library/react";


describe('#{userStoryId}: {userStoryName}', async () => {
  
    test('#{acceptanceCriteriaId}: {acceptanceCriteriaName}', async () => {

        // Etant donné que ...(replace with the given part of the scenario)

        // Quand ... (replace with the when part of the scenario)
        render(<xxxxProvider
            xxxxRepository={new xxxxInMemoryRepository()}>
            <xxxxComponent/>
        </xxxxProvider>);

        // Alors ... (replace with the then part of the scenario)
        // replace with coherent expect for the scenario
        expect(
          await screen.findByTestId('xxxId')
        ).toHaveTextContent('xxxValue);
        
    })


})

```

Le test échouera parce que le composant 'xxxxComponent', le provider 'xxxxProvider', etc. n’existent pas encore ; c’est normal pour cette étape.
Évidemment, il faudra remplacer 'xxxxComponent', 'xxxxProvider' et 'mockXxxRepository' par les noms cohérents du composant, du provider et du repository que vous créerez plus tard.
Ne créez aucun autre fichier ; seul le fichier de test doit être modifié. N’ajoutez pas non plus les imports des composants ou providers qui n’existent pas encore.

Important : Attention, avant de générer la deuxième itération, vérifie de bien respecter les conventions de nommage pour les vertical slices.

### Troisième itération :

Implémentez ensuite le code nécessaire pour que le test passe.
Attention, il faut absolument que le composant n'ai pas de dépendance avec le repository. Il a une dépendance au use case, qui lui récupère le repository via le provider. Une fois les cycles de TDD terminés, le composant sera utilisé avec le provider dans un autre composant (mais c'est une étape de développement ultérieure, qui n'est pas demandée ici).

# Backend :

## Structure et Vertical Slice

Chaque fonctionnalité en vertical slice doit suivre la structure établie dans ce dossier de guidelines avec les exemples `backend/{module}/{userStory}`:

```
backend/src/modules/{module}/{userStory}/
├── {userStory}.usecase.ts           # Use case contenant la logique métier
├── {userStory}.controller.ts        # Contrôleur REST
├── {userStory}.{resource}.repository.ts        # Interface du repository (pour les queries) avec le nom de la ressource
├── {userStory}.{resource}.typeOrmRepository.ts # Repository réel utilisant TypeORM avec le nom de la ressource
├── {userStory}.queryResult.ts       # Modèle de données pour les queries
├── {userStory}.command.ts           # Modèle de données pour les commandes
└── test/
    ├── {userStory}.usecase.spec.ts      # Tests unitaires du use case
    ├── {userStory}.e2e-spec.ts         # Tests e2e avec testcontainers
    └── {userStory}.{resource}.inMemoryRepositories.ts # Repository fakes pour les tests (success, failure, notFound, etc.)
```

**Note importante sur l'organisation des tests :**
Tous les fichiers liés aux tests (fichiers de test `.spec.tsx` et repositories in-memory) doivent être organisés dans un dossier `test` séparé, similaire à la structure du backend. Cela permet une meilleure organisation et une séparation claire entre le code de production et le code de test.

**Organisation des repositories in-memory :**
Pour optimiser l'organisation et réduire le nombre de fichiers, les repositories in-memory pour les tests d'une même ressource doivent être regroupés dans un seul fichier :
- Frontend : `{userStory}.{resource}.inMemoryRepositories.ts` contenant toutes les classes de repository (success, failure, etc.)
- Backend : `{userStory}.{resource}.inMemoryRepositories.ts` contenant toutes les classes de repository (success, failure, notFound, etc.)

Exemple pour le backend :
```typescript
// getTeacherInvoicesNumber.user.inMemoryRepositories.ts
export class GetTeacherInvoicesNumberUserSuccessInMemoryRepository { ... }
export class GetTeacherInvoicesNumberUserNotFoundInMemoryRepository { ... }
export class GetTeacherInvoicesNumberUserWrongRoleInMemoryRepository { ... }
```

Les imports dans les tests utilisent alors des imports nommés :
```typescript
import {
    GetTeacherInvoicesNumberUserSuccessInMemoryRepository,
    GetTeacherInvoicesNumberUserNotFoundInMemoryRepository
} from "./getTeacherInvoicesNumber.user.inMemoryRepositories";
```

## Orientation Clean architecture :

Le use case est implémenté dans une classe dédiée. Le contrôleur appelle ce use case pour traiter les requêtes HTTP. Les repositories, libs etc sont injectés dans le use case via le constructeur, permettant l'inversion de dépendance. Dans les tests, les repostories fakes sont injectés manuellement. Dans le flow normal, la classe de repository est injecté via le décorateur de NestJS.
Chaque ressource utilise un repository dédié, qui est injecté dans le use case via le constructeur. Le use case contient la logique métier et appelle le repository pour récupérer ou modifier les données.

## CQS :

Pour les user stories commandes (update, delete, create), j’utilise l’ORM dans le repository et l’entité pour la logique métier (changement d’état, etc.).
Pour les user stories requêtes (get, list), j’utilise directement des requêtes SQL dans le repository (pas d’ORM, pas d’entité, seulement le repository).

## Erreurs :
Les erreurs attendues dans les tests sont lancées par le use case ou l’entité (sauf certaines erreurs gérés par le controleur, comme la validation des données d'entrée) Les erreurs de l’infrastructure (par exemple, les erreurs de la base de données) sont toujours catchées et renvoyées de manière personnalisée dans le use case.


## Conventions de nommage :
- **Fichiers** : camelCase avec le nom de la user story (ex: `{userStory}.usecase.ts`)
- **Classes** : PascalCase avec suffixe approprié (ex: `{UserStory}Usecase`)

## Patterns :
1. **Use cases** : Logique métier dans des classes dédiées
2. **Entities** : Logique business dans les entités TypeORM. Il n'y a pas d'entités de domain séparées des entités TypeORM. 
3. **Repository pattern** : Pour les commandes (create/update/delete) utiliser l'ORM avec le nom de la ressource
4. **Raw SQL** : Pour toutes les queries (get/list) utiliser des requêtes SQL directes
5. **Tests unitaires** : Avec repositories in-memory
6. **Tests e2e** : Avec testcontainers pour la base de données


## Structure des tests
- **Nommage** : Utiliser les noms et id des user stories et acceptance criteria
- **Organisation** : Un describe par user story, un test par acceptance criteria
- **Given/When/Then** : Commentaires en français suivant le format BDD
- **Repositories fake** : Un pour le succès, un pour chaque type d'erreur

## TDD 

Il y a deux types de tests : unitaires (sociaux) et e2e.
Je débute par le test unitaire, avec le même scénario nominal que côté frontend. J’écris le test avec un repository factice, puis le code (cas d’usage + logique métier dans les entités) pour qu’il passe. J’ajoute ensuite un second test basé sur le deuxième scénario et je le fais passer ; puis ainsi de suite jusqu’à couvrir tous les scénarios.

Une fois les tests unitaires terminés, j’écris le premier test e2e sur le scénario nominal :
j’utilise le vrai repository et testcontainers pour lancer la base de données ;
j’écris le contrôleur qui renvoie une réponse sans passer par le cas d’usage ;

si le test passe, je refactorise pour utiliser le vrai cas d’usage et le vrai repository.
J’écris ensuite le second test e2e (sad path) et je le fais passer.

Je m’arrête là pour les e2e : deux ou trois scénarios maximum (happy path + un sad path) par user story.


## Itérations TDD use case

Lorsque je te demande de générer des tests unitaires pour le backend :

### Première itération :

Quand je te demande de générer le premier test, tu dois produire uniquement le test du premier scénario : donc une seule fonction test ou it. La première itération ne doit contenir que :
```typescript
import {beforeEach, describe, expect, test, } from "vitest";

describe('Name of the US (replace with the name of the US)', async () => {

    beforeEach(() => {
    })

    test('name of the first scenario (replace with the name of the scenario)', async () => {

        // Etant donné que ...(replace with the given part of the scenario)

        // Quand ... (replace with the when part of the scenario)

        // Alors ... (replace with the then part of the scenario)
        expect(false).toBe(true); // This will fail, but it's ok for the first iteration

    })

})
```

### Deuxième itération :

La deuxième itération doit ajouter le code correspondant aux étapes Given / When / Then, sans créer d'autres fichiers.
Par exemple :

```typescript
import {beforeEach, describe, expect, test} from "vitest";
import {{UserStory}Usecase} from "../{userStory}.usecase";
import {{UserStory}InMemoryRepository} from "./{userStory}.inMemoryRepository";

describe('#{userStoryId}: {userStoryName}', () => {
    
    let {userStory}InMemoryRepository: {UserStory}InMemoryRepository;
    let {userStory}Usecase: {UserStory}Usecase;

    beforeEach(() => {
        {userStory}InMemoryRepository = new {UserStory}InMemoryRepository();
        {userStory}Usecase = new {UserStory}Usecase({userStory}InMemoryRepository);
    });
  
    test('#{acceptanceCriteriaId}: {acceptanceCriteriaName}', async () => {

        // Etant donné que ...(replace with the given part of the scenario)
        // Setup test data
        
        // Quand ... (replace with the when part of the scenario)
        const result = await {userStory}Usecase.execute(/* parameters */);

        // Alors ... (replace with the then part of the scenario)
        expect(result).toEqual(/* expected value */);
        
    })

})
```

Le test échouera parce que le usecase '{UserStory}Usecase', le repository '{UserStory}InMemoryRepository', etc. n'existent pas encore ; c'est normal pour cette étape.
Évidemment, il faudra remplacer '{UserStory}Usecase', '{UserStory}InMemoryRepository' par les noms cohérents du usecase et du repository que vous créerez plus tard.
Ne créez aucun autre fichier ; seul le fichier de test doit être modifié. N'ajoutez pas non plus les imports des classes qui n'existent pas encore.

Important : Attention, avant de générer la deuxième itération, vérifie de bien respecter les conventions de nommage pour les vertical slices.

### Troisième itération :

Implémentez ensuite le code nécessaire pour que le test passe.
Créez le usecase, le repository in-memory, les types nécessaires, et toute autre classe requise pour faire passer le test.
Attention, il faut absolument respecter l'inversion de dépendance : le usecase dépend de l'interface du repository, pas de l'implémentation concrète.
Attention, les messages d'erreur doivent être lancés explicitement par le use case.
Attention, les services, repositories etc doivent être enregistrés dans le module NestJS correspondant, pour que l'injection de dépendance fonctionne correctement.

## Checklist de validation avant de proposer le code :

- [ ] Le code respecte les conventions de nommage et la structure définie
- [ ] Aucun code de production n'est écrit sans qu'il ne soit nécessaire pour faire passer un test. Il ne faut donc pas écrire de code incluant des vérifications si le test n'est pas encore écrit.
- [ ] Les erreurs attendues dans les tests sont lancées par le use case ou l'entité ou le controleur. Les erreurs de l'infra sont toujours catchées et renvoyées de manière custom dans le use case 