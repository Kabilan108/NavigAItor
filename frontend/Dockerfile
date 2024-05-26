# modified from https://andrekoenig.de/articles/using-bun-as-the-package-manager-in-production-ready-docker-images

# ---------------------------------- BUILD ------------------------------------
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as build

WORKDIR /build

# install bun
ARG BUN_VERSION=1.1.7
RUN apt update && apt install -y bash curl unzip && \
  curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}
ENV PATH="${PATH}:/root/.bun/bin"

# copy lock file, manifest -> install all dependencies
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile --verbose

# copy source code -> build
COPY . .
RUN mv .env.client .env
RUN bun run build

# ---------------------------------- DIST -------------------------------------

FROM nginx:alpine as dist

RUN apk add --no-cache gettext

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist/ /usr/share/nginx/html

EXPOSE 80/tcp

CMD ["nginx", "-g", "daemon off;"]
