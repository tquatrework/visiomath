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