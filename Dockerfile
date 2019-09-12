FROM node:10
EXPOSE 8080
COPY . /app/
RUN ls
RUN npm install
RUN npm run build
ENTRYPOINT npm run start:prod