'use strict'

const CFClient = require('cloudflare')
const path = require('path')
const url = require('url')
const async = require('async')
const request = require('request')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// configure dotenv
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

// check required env variables
let keys = ['CLUSTER_DOMAIN', 'CONTROLLER_AUTH_KEY', 'CF_EMAIL', 'CF_KEY']
keys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`)
  }
})

// create cloudflare api client
const client = new CFClient({
  email: process.env.CF_EMAIL,
  key: process.env.CF_KEY
})

const str = new Buffer(`:${process.env.CONTROLLER_AUTH_KEY}`).toString('base64')
const controllerRequest = (pathname, cb) => {
  request({
    url: url.format({
      protocol: 'https',
      hostname: 'controller.' + process.env.CLUSTER_DOMAIN,
      pathname: pathname
    }),
    headers: {
      Authorization: `Basic ${str}`
    },
    json: true
  }, cb)
}

const getRoutes = (cb) => {
  controllerRequest('/apps', (err, res, apps) => {
    // error handler
    if (err) throw err
    // iterate applications
    let data = []
    async.each(apps, (app, next) => {
      // ignore system applications
      if (app.meta['flynn-system-app']) return next()
      // check application routes
      controllerRequest(`/apps/${app.id}/routes`, (err, res, routes) => {
        // error handler
        if (err) return next(err)
        // iterate routes
        routes.forEach((route) => {
          // check route for cluster domain
          if (route.domain.indexOf(process.env.CLUSTER_DOMAIN) !== -1) {
            data.push(route.domain)
          }
        })
        // move on
        next()
      })
    }, err => cb(err, data))
  })
}

const getZone = (cb) => {
  // find cluster domain zone
  client.browseZones({ name: process.env.CLUSTER_DOMAIN }).then((zones) => {
    // check zone
    let zone = zones.result.find(zone => zone.name === process.env.CLUSTER_DOMAIN)
    if (zone) {
      cb(null, zone)
    } else {
      cb(new Error('Cluster domain is not a valid cloudflare zone'))
    }
  }).catch(cb)
}

const check = () => {
  getRoutes((err, routes) => {
    // error handler
    if (err) throw err
    // check routes
    if (routes.length === 0) {
      console.log('no routes found on flynn cluster')
      return
    }
    console.log('%s routes found on flynn cluster', routes.length)
    // get zone
    getZone((err, zone) => {
      // error handler
      if (err) throw err
      // browse dns records
      client.browseDNS(zone).then((records) => {
        let filtered = routes.filter((route) => {
          return !records.result.find((record) => {
            return route === record.name
          })
        })
        if (filtered.length === 0) {
          console.log('cloudflare is up to date')
          return
        }
        console.log('dns records to create: %s', filtered.join(', '))
        async.each(filtered, (route, next) => {
          let dnsRecord = CFClient.DNSRecord.create({
            zone_id: zone.id,
            type: 'CNAME',
            name: route,
            content: process.env.CLUSTER_DOMAIN,
            proxied: true
          })

          client.addDNS(dnsRecord).then((result) => {
            console.log('dns record %s added to cloudflare', route)
            next()
          }, (err) => {
            console.log(err)
            next()
          }).catch(next)
        }, (err) => {
          // error handler
          if (err) throw err
          console.log('cloudflare records updated successfully')
        })
      }).catch((err) => { throw err })
    })
  })
}
setImmediate(check)
setInterval(check, 10 * 60 * 1000)
