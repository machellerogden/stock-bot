#!/usr/bin/env bash

function build() {
    git archive -o stock-bot.zip HEAD
    zip -ur stock-bot.zip "secrets.json"
    local deps="$(./scripts/listDeps.sh)"
    for dep in $deps; do
         zip -ur stock-bot.zip "node_modules/$dep"
    done
}
build
