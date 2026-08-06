import type { Payload } from 'payload'

import type { SeedLogEntry, SeedLogLevel } from './types'

function formatTimestamp(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function formatLine(level: SeedLogLevel, message: string, timestamp: string): string {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`
}

export class SeedLogger {
  constructor(
    private onLog: (entry: SeedLogEntry) => void,
    private payloadLogger?: Payload['logger'],
  ) {}

  info(message: string): void {
    this.log('info', message)
  }

  warn(message: string): void {
    this.log('warn', message)
  }

  error(message: string): void {
    this.log('error', message)
  }

  private log(level: SeedLogLevel, message: string): void {
    const timestamp = formatTimestamp()
    const line = formatLine(level, message, timestamp)

    this.onLog({ level, message, timestamp, line })

    if (!this.payloadLogger) return

    if (level === 'info') {
      this.payloadLogger.info(message)
      return
    }

    if (level === 'warn') {
      this.payloadLogger.warn(message)
      return
    }

    this.payloadLogger.error(message)
  }
}
