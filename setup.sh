#!/bin/bash

# Create necessary directories
mkdir -p src/{config,price,alert}

# Create main files
touch src/main.ts
touch src/app.module.ts
touch src/config/configuration.ts

# Create price module files
touch src/price/price.module.ts
touch src/price/price.service.ts
touch src/price/price.controller.ts
touch src/price/price.entity.ts

# Create alert module files
touch src/alert/alert.module.ts
touch src/alert/alert.service.ts
touch src/alert/alert.controller.ts
touch src/alert/alert.entity.ts

# Create Docker files
touch Dockerfile
touch docker-compose.yml

# Create .env file
touch .env

echo "Project structure created successfully!"