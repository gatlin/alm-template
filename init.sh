#!/usr/bin/env bash

echo -n "Package name > "
read pkgname

echo -n "Version > "
read pkgver

echo -n "Author > "
read pkgauthor

echo -n "Homepage > "
read pkghome

echo -n "Description > "
read pkgdescr

echo -n "Git repository > "
read pkgrepo

cp package.json.sample package.json

sed -r -i'' "s/(\"name\": \")alm-skel(\",)/\1$pkgname\2/" package.json

if [[ ! -z $pkgver ]]; then
    sed -r -i'' "s|(\"version\": \")0.0.1(\",)|\1$pkgver\2|" package.json
fi

if [[ ! -z $pkgauthor ]]; then
    sed -r -i'' "s|(\"author\": \")CHANGEME(\",)|\1$pkgauthor\2|" package.json
fi

if [[ ! -z $pkghome ]]; then
    sed -r -i'' "s|(\"homepage\": \")n/a(\",)|\1$pkghome\2|" package.json
fi

if [[ ! -z $pkgdescr ]]; then
    sed -r -i'' "s|(\"description\": \")CHANGEME(\",)|\1$pkgdescr\2|" package.json
fi

if [[ ! -z $pkgrepo ]]; then
    sed -r -i'' "s|(\"url\": \")n/a(\")|\1$pkgrepo\2|" package.json
fi

# remove all traces of the old project
rm -rf .git/
rm package.json.sample
rm init.sh
