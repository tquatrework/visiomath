# VisioMath Academie App

### BUILD: 

- `npm install` pour installer les dépendances en local (pour complétion du code)
- Copiez le fichier `.env` en `.env.local` et modifiez les variables d'environnement
- Modifiez les DNS de votre machine pour associer visioprof.fr vers 127.0.0.1 (Pris en charge par le conteneur Nginx qui route vers le service frontend)

### RUN: 

- Pour lancer l'application en dev, accessible sur `http://visioprof.fr` :
- `docker compose --env-file .env.local -f docker-compose-vma.dev.yml up` pour lancer l'application en dev, accessible sur `http://visioprof.fr`**


### DEPLOY:

Première installation : 

- cloner le dépot
- créer le fichier `.env.prod` avec les variables d'environnement de production


Continuous integration :
- Chaque push sur feature/teacher-invoice déclenche un hook de prepush qui lance les tests et annule le push si les tests échouent.

Continuous delivery : 
Manuel : 
- ssh sur le serveur
- `git pull origin feature/teacher-invoice`
- `docker compose --env-file .env.prod -f docker-compose-vma.prod.yml up --build`

Automatisé :
- Push sur feature/teacher-invoice (github action configuré)

Pour arrêter et supprimer le stack, volumes, conteneurs orphelins :

  `docker compose --env-file .env.prod -f docker-compose-vma.prod.yml down --volumes --remove-orphans`