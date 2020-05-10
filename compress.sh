#!/bin/bash

set -e

VERSION=1.0

# Instead of reserving properties from mangling, it is possible to tell uglify-es to skip mangling all quoted propertes (e.g. $_['_data'])
# Something breaks --wrap reshape. Results in very short output.
# Need to protect all properties that are stored in JSON if we want to mangle-props. --mangle-props "reserved=['_data', 'handler', 'keydown']"
node_modules/.bin/uglifyjs --compress --mangle "reserved=['$', 'jQuery']" --rename -- reshape.js > reshape-compressed.js

(
echo -n 'javascript:'
cat reshape-compressed.js | head -c -1
echo 'reshapeInit();void(0)'
) > reshape-bookmarklet.js

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
cat reshape.js
echo 'reshapeInitWhenStable();'
) > reshape.user.js
