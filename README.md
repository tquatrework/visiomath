# vma
VisioMath Academie App

BUILD : 

- `npm install` pour installer les dépendances en local (pour complétion du code)
- Copiez le fichier `.env` en `.env.local` et modifiez les variables d'environnement
- Modifiez les DNS de votre machine pour associer visioprof.fr vers 127.0.0.1 (Pris en charge par le conteneur Nginx qui route vers le service frontend)

RUN : 

- Pour lancer l'application en dev, accessible sur `http://visioprof.fr` :
1) Arrête et supprime le stack, volumes, conteneurs orphelins :
`docker compose --env-file .env.prod -f docker-compose-vma.prod.yml down --volumes --remove-orphans`

2) Reconstruis sans cache et relance
`docker compose --env-file .env.prod -f docker-compose-vma.prod.yml build --no-cache`
`docker compose --env-file .env.prod -f docker-compose-vma.prod.yml up`

2) Reconstruis sans cache et relance
docker compose --env-file .env.prod -f docker-compose-vma.prod.yml \
build --no-cache
docker compose --env-file .env.prod -f docker-compose-vma.prod.yml \
up -d
- `docker compose --env-file .env.local -f docker-compose-vma.local.yml up` pour lancer l'application en dev, accessible sur `http://visioprof.fr`


TODO :
- Déployer
- Créer une CD
- 

En prod : 

PIPE CD :

- cloner le dépot
- créer le fichier `.env.prod` avec les variables d'environnement de production
- créer un compte admin en BDD