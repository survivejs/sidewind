#!/usr/bin/env bash

set -e # Exit with nonzero exit code if anything fails

curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.43.3

export DENO_INSTALL="/opt/buildhome/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

deno task build
