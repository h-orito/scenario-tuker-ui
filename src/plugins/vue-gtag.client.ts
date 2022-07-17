import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    VueGtag,
    {
      config: {
        id: 'G-MYPWHRSMYQ'
      }
    },
    nuxtApp.$router
  )
})
