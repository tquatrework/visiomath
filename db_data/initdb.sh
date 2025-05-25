#!/bin/bash

# Copier le fichier schema.sql dans le container
docker cp ./database/scripts/schema.sql visiomaths-postgres:/schema.sql

# Exécuter le script dans PostgreSQL
docker exec -it vma_postgres_1 psql -U visiomathuser -d visiomathdb -f /schema.sql