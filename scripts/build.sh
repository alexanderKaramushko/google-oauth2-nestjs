#!/bin/sh

set -eu

tag=${1:?Image tag is required}

docker build --platform linux/amd64 -t "melkor73/goals-auth:$tag" -t melkor73/goals-auth:latest "$PWD"

docker push "melkor73/goals-auth:$tag"
docker push melkor73/goals-auth:latest
