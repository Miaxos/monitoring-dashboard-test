FROM messense/rust-musl-cross:x86_64-musl as builder
MAINTAINER Anthony Griffon <an.griffon@gmail.com>
ADD . /home/rust/src

RUN apt-get update && apt-get install -y python && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN rustup update && \
    rustup default nightly && \
    rustup target add --toolchain nightly x86_64-unknown-linux-musl

RUN cargo build --release

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
RUN mkdir resources
COPY --from=builder /home/rust/src/target/x86_64-unknown-linux-musl/release/core-api .
COPY .env.dist .env

EXPOSE 8000

ENTRYPOINT ["ROCKET_ENV=prod ./monitoring-api"]
