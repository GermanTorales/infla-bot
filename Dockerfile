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

#<-- RELEASE STAGE -->
FROM environment AS release

COPY --from=build "${APP_HOME}/node_modules" "${APP_HOME}/node_modules"
COPY --from=build "${APP_HOME}/dist" "${APP_HOME}/dist"
COPY --from=build "${APP_HOME}/package.json" "${APP_HOME}/package.json"
COPY --from=build "${APP_HOME}/pnpm-lock.yaml" "${APP_HOME}/pnpm-lock.yaml"

EXPOSE 3000

CMD ["sh", "-c", "pnpm run migration:run && pnpm run start:prod"]
