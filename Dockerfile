FROM node:11-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run install-all
RUN npm run build-all

ENV NODE_ENV production
EXPOSE 60000
CMD ["node", "-r", "dotenv/config", "server/build/index.js"]
