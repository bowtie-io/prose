## Prose [![Build Status](https://travis-ci.org/prose/prose.svg?branch=master)](https://travis-ci.org/prose/prose)

Prose provides a beautifully simple content authoring environment for [CMS-free websites](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/). It's a web-based interface for managing content on [GitHub](http://github.com). Use it to create, edit, and delete files, and save your changes directly to GitHub. Host your website on [GitHub Pages](http://pages.github.com) for free, or set up your own [GitHub webhook server](http://developmentseed.org/blog/2013/05/01/introducing-jekyll-hook/).

[Read more about Prose](http://prose.io/#about)

### Setting up Prose with BowTie.io

The `oauth.json` file is usually `.gitignore`d since OAuth to GitHub is used for
general prose.io installations. For BowTie, it's been added to the repository
and configures this modified version of Prose to use the BowTie API.

1. Drop this folder into your Project Site (/admin is a good choice).
1. Check that `.bowtie.yml` file exists and prevents access without a `key` on
   the current user's `browser` profile.
1. Navigate to your project site's `/users/sign_up` path. Register a user that
   you'd like to act as the site's administrative editor.
1. Open your browser's javascript console and run `bowtie.user.profile({ key:
   "ENVIRONMENT_SECRET_KEY" })`, replacing "ENVIRONMENT_SECRET_KEY" with the
   value from the environment settings on the BowTie dashboard
   (Settings->General->Keys->Secret Key).
1. Navigate to `/admin` on your Project Site. Prose will read the secret key
   from this user's profile and use it to authenticate with the Repository API.

### Setting up Prose with your site

Prose supports configuration settings with a variety of options, which makes it easy to adjust the application to support your project needs. Read the [Getting Started Guide](https://github.com/prose/prose/wiki/Getting-Started) to learn more.

### Installation and developing

Prose is hosted at [Prose.io](http://prose.io), or you can use on your own server. For installation instructions and contributing guidelines, please [read contributing.md](CONTRIBUTING.md).

### Getting help

Have questions? Jump into the #prose channel on irc.freenode.net.

New to Internet Relay Chat? [Join quickly & easily using your Web browser](http://webchat.freenode.net/?randomnick=1&channels=%23prose&prompt=1&uio=d4) or sign-up for a no-cost account on [IRCcloud](https://www.irccloud.com/).

### Help contribute

Prose project is currently looking for [new maintainers](https://github.com/prose/prose/issues/743).
