# Monitoring-OS

A small project made for a tech recruitment test.

The purpose of this test was to create a small monitoring dashboard.


I chose to make a small backend in rust, not in NodeJS. I've architected my applications following some DDD principles.

On the front side, I made a classical React-redux architecture, with the use of quite advanced functional programming, a fully functional middleware as well as examples with sagas. I used the concept of opaque types to abstract the apis of my domain and also used the "pattern matchin" of typescript.
I symbolized the behaviors of my different components through abstraction hooks.

# Installation

## Backend

Just install the nighly toolchain for rust and run
```
cargo run
```

## Frontend

Storybook with `npm run storybook`.
Dev build with `npm run start`.
Test build with `npm run test`.
