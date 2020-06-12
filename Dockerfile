#================================================
# BUILD STAGE
#================================================
FROM node:alpine as builder
WORKDIR /app/api
COPY package.json .
RUN npm i
COPY . .
RUN npm run build

#================================================
# RUN STAGE
#================================================
FROM node:alpine
EXPOSE 80
COPY --from=builder /app/api/dist /dist
COPY --from=builder /app/api/node_modules node_modules
CMD ["node", "dist/main"]
