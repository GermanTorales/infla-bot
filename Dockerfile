FROM node:20-alpine AS environment

RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm

ARG APP_HOME=/app
ENV APP_HOME="${APP_HOME}"

WORKDIR "${APP_HOME}"

#<-- DEPENDENCIES STAGE -->
FROM environment AS dependencies

COPY ["./package.json", "./pnpm-lock.yaml", "${APP_HOME}"]

RUN pnpm install --frozen-lockfile

#<-- BUILD STAGE -->
FROM dependencies AS build

COPY . "${APP_HOME}"

RUN pnpm run build \
    && pnpm install --prod --frozen-lockfile

#<-- RELEASE STAGE -->
FROM environment AS release

COPY --from=build "${APP_HOME}/node_modules" "${APP_HOME}/node_modules"
COPY --from=build "${APP_HOME}/dist" "${APP_HOME}/dist"
COPY --from=build "${APP_HOME}/package.json" "${APP_HOME}/package.json"
COPY --from=build "${APP_HOME}/pnpm-lock.yaml" "${APP_HOME}/pnpm-lock.yaml"

EXPOSE 3000

CMD ["sh", "-c", "pnpm run migration:run && node dist/main.js"]
