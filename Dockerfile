FROM node:20-alpine AS environment

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# RUN apk update && apk add --no-cache nmap && \
#     echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
#     echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
#     apk update && \
#     apk add --no-cache \
#       chromium \
#       harfbuzz \
#       "freetype>2.8" \
#       ttf-freefont \
#       nss && \
#       npm i -g pnpm

RUN npm i -g pnpm

ARG APP_HOME=/app
ENV APP_HOME="${APP_HOME}"

WORKDIR "${APP_HOME}"

FROM environment AS dependencies

COPY ["./package.json", "./pnpm-lock.yaml", "${APP_HOME}"]

RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY . "${APP_HOME}"

RUN pnpm run build \
    && pnpm install --prod --frozen-lockfile

FROM environment AS release

COPY --from=build "${APP_HOME}/node_modules" "${APP_HOME}/node_modules"
COPY --from=build "${APP_HOME}/dist" "${APP_HOME}/dist"
COPY --from=build "${APP_HOME}/package.json" "${APP_HOME}/package.json"

RUN npx puppeteer browsers install chrome

EXPOSE 3000

CMD ["sh", "-c", "pnpm run migration:run && node dist/main.js"]
