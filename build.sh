#!/bin/bash

set -e

VERSION=$1

if [[ -z $VERSION ]]; then
    echo "Usage: $0 <VERSION>"
    exit 1
fi

echo "Version: $VERSION"

mkdir -p output

(
# Instead of reserving properties from mangling, it is possible to tell uglify-es to skip mangling all quoted propertes (e.g. $_['_data'])
# Something breaks --wrap reshape. Results in very short output.
# Need to protect all properties that are stored in JSON if we want to mangle-props. --mangle-props "reserved=['_data', 'handler', 'keydown']"
echo -n 'javascript:'
(cat reshape.js | sed "s/<VERSION>/$VERSION/" | node_modules/.bin/uglifyjs --compress --mangle "reserved=['$', 'jQuery']" --rename | head -c -1 && \
     echo -n 'reshapeInit();void(0)') |  node --eval "process.stdin.on('data', data => { process.stdout.write(encodeURIComponent(data)); })"
) > output/reshape-$VERSION-bookmarklet.js

(
cat <<EOF
// ==UserScript==
// @name        ReShape
// @namespace   thomasa88
// @match       https://example.com/*
// @grant       none
// @version     $VERSION
// @author      Thomas Axelsson
// @license     GPL-3.0+
// @description 5/9/2020, 7:54:47 PM
// ==/UserScript==
EOF
cat reshape.js | sed "s/<VERSION>/$VERSION/"
echo 'reshapeInitWhenStable();'
) > output/reshape-$VERSION.user.js
cp output/reshape-$VERSION.user.js output/reshape-latest.user.js

cp reshape.js docs/reshape-latest.js

(
    echo -n '<!-- BOOKMARKLET LINK --><a href="'
    cat output/reshape-$VERSION-bookmarklet.js
    echo '">ReShape '$VERSION'</a>'
) > output/reshape-$VERSION-bookmarklet-link.js
sed -i -e "/<!-- BOOKMARKLET LINK -->.*/{r output/reshape-$VERSION-bookmarklet-link.js" -e "d}" docs/index.html
