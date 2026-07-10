export type SeedLogLevel = 'info' | 'warn' | 'error'

export type SeedLogEntry = {
  level: SeedLogLevel
  message: string
  timestamp: string
  line: string
}

export type SeedLogEvent = {
  type: 'log'
} & SeedLogEntry

export type SeedDoneEvent = {
  type: 'done'
  result: unknown
}

export type SeedErrorEvent = {
  type: 'error'
  message: string
}

export type SeedStreamEvent = SeedLogEvent | SeedDoneEvent | SeedErrorEvent

export type SeedLogStatus = 'running' | 'complete' | 'error'
