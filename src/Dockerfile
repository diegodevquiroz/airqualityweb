FROM node:20-alpine

WORKDIR /app

COPY build .

COPY package.json .

RUN npm install serve -g

EXPOSE 3333

CMD [ "serve", "-s", "build", "-l", "3333" ]