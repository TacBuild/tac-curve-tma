FROM node:20.12.2 AS base
ENV MODE production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 5000

ARG TELEGRAM_MINI_APP_BOT_URL
ENV TELEGRAM_MINI_APP_BOT_URL=${TELEGRAM_MINI_APP_BOT_URL}

ARG TONCENTER_API_KEY
ENV TONCENTER_API_KEY=${TONCENTER_API_KEY}

# Create app directory
WORKDIR /usr/src/app
# Copy package.json for installing dependencies
COPY package.json .
COPY package-lock.json .
# Install app dependencies
RUN npm i
# Copy app source with common folder
COPY . /usr/src/app
# Build app
RUN npm run build
# Start server
CMD [ "node", ".output/server/index.mjs" ]
