
export default defineNuxtConfig({
  css: ['~/assets/scss/styles.scss'],
  devtools: { enabled: true },
  app: {
    head: {

      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },
})
