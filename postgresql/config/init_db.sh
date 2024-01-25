#!/bin/bash

# Load environment variables from .env file
cd docker-entrypoint-initdb.d
ls -la
export $(egrep -v '^#' .env | xargs)

# Run SQL commands
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_URL -U $POSTGRES_USER -p $POSTGRES_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_GRAFANA_DB'" | grep -q 1 || psql -h localhost -U $POSTGRES_USER -p $POSTGRES_PORT -c "CREATE DATABASE $POSTGRES_GRAFANA_DB;"