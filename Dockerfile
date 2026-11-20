FROM node:24-slim AS builder
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /workspace
RUN apt update && \
  apt install -y --no-install-recommends git ca-certificates
COPY explorer .
RUN npm ci --ignore-scripts

FROM node:24-alpine
WORKDIR /workspace
COPY --from=builder /workspace .

CMD ["npm", "start"]
EXPOSE 3002
