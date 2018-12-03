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

echo $(pwd)

if [ -d ./build/client-loading ]; then
rm -rf ./build/client-loading
fi

if [ -d ./build/client-landing ]; then
	rm -rf ./build/client-landing
fi

mv client-loading/build ./build/client-loading
mv client-landing/build ./build/client-landing
