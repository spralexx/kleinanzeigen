FROM node:10
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install --unsafe-perm
COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "start" ]