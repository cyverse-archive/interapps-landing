FROM node:11-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN ./build.sh

ENV NODE_ENV production
EXPOSE 60000
CMD ["node", "-r", "dotenv/config", "server/build/index.js"]
