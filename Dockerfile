FROM node:10
EXPOSE 8080
WORKDIR /usr/src/app
COPY . .
RUN ls
RUN npm install
RUN npm run build
ENTRYPOINT npm run start:prod