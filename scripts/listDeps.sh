#!/usr/bin/env bash

function listDeps() {
    npm ls --prod --parseable=true | rev | cut -d'/' -f1 | rev | sed '1d'
}
listDeps
