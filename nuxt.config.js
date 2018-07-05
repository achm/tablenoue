const webpack = require('webpack')
const parseArgs = require("minimist")
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: "hostname",
    p: "port"
  },
  string: ["H"],
  unknown: parameter => false
})

const port =
  argv.port ||
  process.env.PORT ||
  process.env.npm_package_config_nuxt_port ||
  "3000"
const host =
  argv.hostname ||
  process.env.HOST ||
  process.env.npm_package_config_nuxt_host ||
  "localhost"
module.exports = {
  env: {
    baseUrl:
      process.env.BASE_URL ||
      `http://${host}:${port}`
  },
  router: {
    middleware: "authenticated"
  },
  head: {
    title: "tablenoue",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: "Nuxt.js project"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      }
    ]
  },
  plugins: [
    "~/plugins/fontawesome.js"
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  css: [
    "~/assets/css/main.css",
    { src: "bulma/bulma.sass", lang: "sass" }
  ],
  build: {
    extend (config, { isDev, isClient }) {
      config.plugins.push(
        new webpack.EnvironmentPlugin([
          'API_KEY',
          'AUTH_DOMAIN',
          'DATABASE_URL',
          'PROJECT_ID',
          'STORAGE_BUCKET',
          'MESSAGING_SENDER_ID'
        ])
      )
    }
  },
  modules: [
    "@nuxtjs/axios",
    ["@nuxtjs/pwa", { icon: false }],
    "~/modules/typescript.js"
  ],
  manifest: {
    "gcm_sender_id": "103953800507",
  },
  axios: {}
}
