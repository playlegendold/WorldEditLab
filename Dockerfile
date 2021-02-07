### build stage
# basic setup
FROM node:lts-alpine as build-stage
WORKDIR /usr/src/app/
COPY . .

# install dependencies
RUN yarn install --frozen-lockfile

# build and cleanup afterwords
RUN yarn build && npm prune --production

### production stage
# base image settings
FROM node:lts-alpine as production-stage

# set working directory
WORKDIR /usr/src/app/

# copy files from build stage
COPY --from=build-stage /usr/src/app/dist dist
COPY --from=build-stage /usr/src/app/node_modules node_modules
COPY --from=build-stage /usr/src/app/public public
COPY --from=build-stage /usr/src/app/views views
COPY --from=build-stage /usr/src/app/package.json package.json

# expose http port
EXPOSE 8080

# start nginx
CMD ["yarn", "start"]
