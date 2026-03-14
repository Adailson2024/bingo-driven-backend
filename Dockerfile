FROM node:alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /usr/src/backend

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]