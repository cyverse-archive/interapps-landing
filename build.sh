#!/bin/sh

orig_dir=$(pwd)
cd client-loading && \
	npm install && \
	npm run build

cd $orig_dir

cd client-landing && \
	npm install && \
	npm run build

cd $orig_dir

cd server && \
	npm install && \
	npm run build

cd $orig_dir

echo $(pwd)
