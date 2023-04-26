FROM node:18-alpine as build

WORKDIR /app

ARG OPENAI_KEY OPENAI_ORG DISCORD_TOKEN DISCORD_SERVER_ID

ENV OPENAI_KEY=${OPENAI_KEY}
ENV OPENAI_ORG=${OPENAI_ORG}
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV DISCORD_SERVER_ID=${DISCORD_SERVER_ID}


# Create a non-root user to run the container
RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

COPY ./package*.json ./

RUN npm install && chown -R appuser:appuser /app

USER appuser

COPY . .

CMD ["node", "index.js"]