# vma
VisioMath Academie App

BUILD : 

- `npm install` pour installer les dépendances en local (pour complétion du code)
- Copiez le fichier `.env` en `.env.local` et modifiez les variables d'environnement
- Modifiez les DNS de votre machine pour associer visioprof.fr vers 127.0.0.1 (Pris en charge par le conteneur Nginx qui route vers le service frontend)

RUN : 

- `docker compose --env-file .env.local -f docker-compose-vma.override.yml up` pour lancer l'application, accessible sur `http://visioprof.fr` 

TODO :
- Déployer
- Créer une CD
- créer variable d'environnement pour le chemin nginx et remplacer dans le docker-compose-vma.override.yml

En prod : 

PIPE CD :

- cloner le dépot
- créer le fichier `.env.prod` avec les variables d'environnement de production
- modifier le nginx.conf.prod
- copier et créer le fichier docer-compose-vma.override.yml en remplaçant le chemin du nginx 
- docker compose --env-file .env.prod -f docker-compose-vma.override.yml up
- créer un compte admin en BDD