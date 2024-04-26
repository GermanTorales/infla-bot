FROM node:20-alpine AS environment

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

RUN  npm run migration:run

#<-- RELEASE STAGE -->
FROM environment AS release

COPY --from=build "${APP_HOME}/node_modules" "${APP_HOME}/node_modules"
COPY --from=build "${APP_HOME}/dist" "${APP_HOME}/dist"

EXPOSE 3000

CMD ["node", "./dist/main.js"]
