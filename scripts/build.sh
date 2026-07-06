#!/bin/sh

version=$1

docker build --platform linux/amd64 -t melkor73/goals-auth:$version -t melkor73/goals-auth:latest $PWD

docker push melkor73/goals-auth:$version
docker push melkor73/goals-auth:latest