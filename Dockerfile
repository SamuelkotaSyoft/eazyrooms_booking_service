FROM node:18

WORKDIR /usr/src/eazyrooms_booking_service

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]