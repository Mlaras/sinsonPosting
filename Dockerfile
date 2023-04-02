FROM node:16-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

RUN mkdir to-post

RUN mkdir posted

COPY . .

CMD ["npm","run", "deploy"]