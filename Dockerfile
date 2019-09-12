FROM gcr.io/google-appengine/nodejs	
EXPOSE 8080
COPY . /app/
RUN npm install
RUN npm run build
RUN ls
ENTRYPOINT npm run start:prod