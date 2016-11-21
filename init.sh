#!/usr/bin/env bash

echo -n "Package name > "
read pkgname

echo -n "Version > "
read pkgver

echo -n "Homepage > "
read pkghome

echo -n "Description > "
read pkgdescr

echo -n "Git repository > "
read pkgrepo

/usr/bin/env cp package.json.sample package.json

sed -r -i'' "s/(\"name\": \")alm-skel(\",)/\1$pkgname\2/" package.json

if [[ ! -z $pkgver ]]; then
    sed -r -i'' "s|(\"version\": \")0.0.1(\",)|\1$pkgver\2|" package.json
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

# add this script and the sample package.json to gitignore
echo "init.sh" >> .gitignore
echo "package.json.sample" >> .gitignore
