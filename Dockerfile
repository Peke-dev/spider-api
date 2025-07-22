###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-alpine AS development

WORKDIR /usr/src/app

# Instala pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --chown=node:node package.json pnpm-lock.yaml ./

ENV CI=true
RUN corepack pnpm@latest install --frozen-lockfile --prod 

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Instala pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --chown=node:node package.json pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm run build

ENV NODE_ENV=production

ENV CI=true
RUN corepack pnpm@latest install --frozen-lockfile --prod && pnpm store prune && pnpm cache clean

USER node

###################
# PRODUCTION
###################

FROM node:22-alpine AS production

# Instala pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]