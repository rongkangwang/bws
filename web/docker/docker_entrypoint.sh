#!/bin/sh

env

set -e

if [[ -f /web/components.json ]]; then
  echo "Applying existing components file..."
  echo "Success!"
else
  . /web/docker/generate_components.sh > /web/components.json
fi

exec "$@"
