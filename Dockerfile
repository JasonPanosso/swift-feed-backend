FROM node:16

WORKDIR /app

EXPOSE 3000

EXPOSE 2121

EXPOSE 1025-1050

RUN apt-get update && apt-get install -y wget gnupg && wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add - && echo deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse | tee /etc/apt/sources.list.d/mongodb-org-5.0.list && apt-get update && apt-get install -y mongodb-org-tools

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
