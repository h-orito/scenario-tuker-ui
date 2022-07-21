import { defineNuxtPlugin } from '#app'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import 'dayjs/locale/ja'

declare module '#app' {
  interface NuxtApp {
    $dayjs(
      date?: dayjs.ConfigType,
      option?: dayjs.OptionType,
      locale?: string
    ): dayjs.Dayjs
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(isBetween)
  dayjs.extend(isSameOrAfter)
  dayjs.locale('ja')
  nuxtApp.provide('dayjs', dayjs)
})
