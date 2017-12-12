FROM node:carbon
ADD . /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
CMD [ "npm", "start" ]