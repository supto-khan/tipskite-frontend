'use client'

import { useEffect } from 'react'

export function ExtensionWarningSuppressor() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleWindowError = (e: ErrorEvent) => {
        const file = e.filename || ''
        const msg = e.message || ''
        if (
          file.includes('chrome-extension:') ||
          file.includes('moz-extension:') ||
          msg.includes('M_ID') ||
          msg.includes('bis_skin_checked')
        ) {
          e.preventDefault()
          e.stopImmediatePropagation()
          return true
        }
      }

      window.addEventListener('error', handleWindowError, true)

      const originalError = console.error
      console.error = (...args: any[]) => {
        const fullMessage = args
          .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg) || ''))
          .join(' ')

        if (
          fullMessage.includes('bis_skin_checked') ||
          fullMessage.includes('M_ID') ||
          fullMessage.includes('chrome-extension://') ||
          fullMessage.includes('executors/200.js')
        ) {
          return
        }
        originalError.apply(console, args)
      }

      return () => {
        window.removeEventListener('error', handleWindowError, true)
        console.error = originalError
      }
    }
  }, [])

  return null
}
