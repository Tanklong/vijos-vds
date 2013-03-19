vijos-cdn
=========

vijos-cdn is a very simple Node.js HTTP static server application.

It is now being used in [Vijos](https://vijos.org) CDN.

# Features:

- Static file server (via [express](https://github.com/visionmedia/express))
- GZip (via [gzippo](https://github.com/tomgco/gzippo))
- JS & CSS minify (via [UglifyJs](https://github.com/mishoo/UglifyJS2) & [UglifyCss](https://github.com/fmarcia/UglifyCSS))
- SPDY (via [node-spdy](https://github.com/indutny/node-spdy))
- Reverse proxy (via [node-http-proxy](https://github.com/nodejitsu/node-http-proxy))

# Licence:

GPL v3

# Author:

[Breezewish](http://breeswish.org)

# Deploy:

Start server:

    node app.js
