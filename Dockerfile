FROM node:7.7.4
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install --unsafe-perm  && npm cache clean
COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]