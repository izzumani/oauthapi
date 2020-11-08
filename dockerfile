FROM node:14.15.0-alpine as api_production

ENV NODE_ENV=production

WORKDIR /app

COPY ./disxt_api/package*.json ./disxt_api/

RUN npm install --only=production && npm cache clean --force

COPY . .

CMD ["node","./bin/www"]


FROM API_Production as api_development

ENV NODE_ENV=development

RUN apk add --no-cache curl

RUN npm install --only=development

# CMD ["./node_modules/nodemon/bin/nodemon.js","./bin/www","--inspect=0.0.0.0:3001"]
# EXPOSE 3000

# RUN apk add --no-cache tini

# ENTRYPOINT ["tini", "--"]
