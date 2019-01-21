#volume to mount is tawawa

FROM mhart/alpine-node:10.15

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 3001

CMD npm start
