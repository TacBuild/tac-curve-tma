FROM node:20.12.2 AS base
ENV MODE production
ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 5000

ARG TONCONNECT_MANIFEST_URL
ENV TONCONNECT_MANIFEST_URL=${TONCONNECT_MANIFEST_URL}

ARG TELEGRAM_MINI_APP_BOT_URL
ENV TELEGRAM_MINI_APP_BOT_URL=${TELEGRAM_MINI_APP_BOT_URL}

ARG TONCENTER_URL
ENV TONCENTER_URL=${TONCENTER_URL}

ARG ETHERS_PROVIDER_URL
ENV ETHERS_PROVIDER_URL=${ETHERS_PROVIDER_URL}

ARG ETHERS_POOL_ADDRESS
ENV ETHERS_POOL_ADDRESS=${ETHERS_POOL_ADDRESS}

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
