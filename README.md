# Flynn Cloudflare

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Creates `Cloudflare` CNAME records for `Flynn` routes.

- [Installation](#installation)
  + [On Flynn using dashboard](#installing-on-flynn-using-dashboard)
  + [On Flynn using cli](#installing-on-flynn-using-cli)
  + [On Heroku](#installing-on-heroku)
  + [Locally](#installing-locally)
- [Environment variables reference](#environment-variables-reference)
- [Reporting an issue or a feature request](#reporting-an-issue-or-a-feature-request)

## Installation

There are various ways you can install Flynn cloudflare:

### Installing on Flynn using dashboard

To install using Flynn dashboard open the url below and follow the instructions on page

https://dashboard.foobar.flynnhub.com/github?owner=eymengunay&repo=flynn-cloudflare

- If you are using a custom domain to access your cluster, replace `foobar.flynnhub.com` with that domain!

- If you are using an auto-generated flynnhub subdomain, replace `foobar` with id assigned to your cluster!

> For Vagrant clusters: https://dashboard.demo.localflynn.com/github?owner=eymengunay&repo=flynn-cloudflare

### Installing on Flynn using cli

To install using Flynn cli

```
# Clone git repository
git clone git@github.com:eymengunay/flynn-cloudflare.git
cd flynn-cloudflare

# Create flynn application
flynn create cloudflare

# Set environment variables
flynn env set CLUSTER_DOMAIN=XXXX
flynn env set CONTROLLER_AUTH_KEY=XXXX
flynn env set CF_EMAIL=XXXX
flynn env set CF_KEY=XXXX

# Deploy application
git push flynn master
```

### Installing on Heroku

If you may want to keep flynn cloudflare outside of your cluster you can use Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/eymengunay/flynn-cloudflare)

### Installing locally

> Flynn cloudflare requires node.js/npm. Make sure that you have installed and configured node.js.

```
# Install dependencies via npm
cd /path/to/flynn-cloudflare
npm install

# Set required environment variables
export CLUSTER_DOMAIN=XXXX
export CONTROLLER_AUTH_KEY=XXXX
export CF_EMAIL=XXXX
export CF_KEY=XXXX

# Run application
npm start
```

> You can also put environment variables inside .env file. See https://www.npmjs.com/package/dotenv


*Not tested on Windows*

## Environment variables reference

Flynn cloudflare stores configuration in environment variables.

| Key                  |
|----------------------|
| CLUSTER_DOMAIN       |
| CONTROLLER_AUTH_KEY  |
| CF_EMAIL             |
| CF_KEY               |

Learn more:

* [Flynn - How can I pass configuration to my app?](https://flynn.io/docs/faq/how-can-i-pass-configuration-to-my-app)
* [Heroku - Configuration and Config Vars](https://devcenter.heroku.com/articles/config-vars)

## Reporting an issue or a feature request

Issues and feature requests related to this project are tracked in the Github issue tracker: https://github.com/eymengunay/flynn-cloudflare/issues
