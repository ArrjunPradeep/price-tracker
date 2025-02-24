FROM node:21.5.0-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3369

CMD ["npm", "run", "start:dev"]