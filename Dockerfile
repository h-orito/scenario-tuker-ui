FROM arm64v8/node:17-bullseye as builder

WORKDIR /app

COPY src src
COPY tsconfig.json tsconfig.json
COPY package*.json ./
COPY nuxt.config.ts nuxt.config.ts

ARG FIREBASE_API_KEY
ENV FIREBASE_API_KEY=${FIREBASE_API_KEY}
ARG FIREBASE_AUTH_DOMAIN
ENV FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
ARG FIREBASE_DATABASE_URL
ENV FIREBASE_DATABASE_URL=${FIREBASE_DATABASE_URL}
ARG FIREBASE_PROJECT_ID
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ARG FIREBASE_STORAGE_BUCKET
ENV FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
ARG FIREBASE_MESSAGING_SENDER_ID
ENV FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
ARG FIREBASE_APP_ID
ENV FIREBASE_APP_ID=${FIREBASE_APP_ID}

RUN npm ci
RUN npm run build

FROM arm64v8/node:17-bullseye

RUN mkdir /app && \
    useradd -m user && \
    chown user:user /app

USER user
WORKDIR /app

ENV NPM_CONFIG_PREFIX /home/user/node_modules
ENV PATH /home/user/node_modules/bin:${PATH}
ENV NODE_ENV production

COPY --chown=user:user package*.json ./
COPY --from=builder --chown=user:user /app/.output ./.output

RUN mkdir /home/user/node_modules

RUN npm ci --only=production
EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0

ENTRYPOINT ["node", ".output/server/index.mjs"] 