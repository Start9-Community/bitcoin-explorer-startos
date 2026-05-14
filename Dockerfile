FROM node:24-slim AS builder
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /workspace
RUN apt update && \
  apt install -y --no-install-recommends git ca-certificates && \
  npm install -g pnpm
COPY explorer .
RUN sed -i 's|github:janoside/app-utils#ba4c23d3f|github:janoside/app-utils#master|' package.json
RUN pnpm install --ignore-scripts

FROM node:24-alpine
WORKDIR /workspace
COPY --from=builder /workspace .

CMD ["npm", "start"]
EXPOSE 3002
