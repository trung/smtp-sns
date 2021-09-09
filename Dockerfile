ARG NODE_IMAGE=node:14-alpine
FROM $NODE_IMAGE as BUILD

WORKDIR /app

# Copy in the source code
COPY . /app
# Install and build
RUN npm ci --prefer-offline --no-audit --progress=false
RUN npm run build

# Only use PROD dependencies
RUN npm ci --prefer-offline --no-audit --progress=false --production

FROM $NODE_IMAGE
ENV NODE_ENV production
WORKDIR /app
RUN chown node:node -R /app
USER node
COPY --chown=node:node --from=BUILD /app/node_modules /app/node_modules
COPY --chown=node:node --from=BUILD /app/build /app/build

EXPOSE 8587
ENTRYPOINT ["node", "-r", "dotenv/config", "build/app.js"]
