FROM node:24-slim AS builder
ENV DEBIAN_FPRONTEND=noninteractive
WORKDIR /workspace
RUN apt update && \
  apt install -y --no-install-recommends git ca-certificates && \
  npm install -g pnpm
COPY explorer .
RUN pnpm install

FROM node:24-alpine
WORKDIR /workspace
COPY --from=builder /workspace .

CMD ["npm", "start"]
EXPOSE 3002
