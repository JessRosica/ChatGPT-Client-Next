import type { App } from 'vue'

import { qrCode } from './qrcode'

export const setupDirectives = (app: App) => {
  app.directive('qr', qrCode)
}
