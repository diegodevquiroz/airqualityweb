FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --force

EXPOSE 3333

CMD [ "PORT=3333", "npm", "run", "start" ]