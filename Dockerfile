FROM gcr.io/google-appengine/nodejs	
EXPOSE 8080
COPY . /app/
RUN ls
ENTRYPOINT npm run start:prod