import pino from 'pino'

const level = typeof process.env.LOG_LEVEL === 'string' && process.env.LOG_LEVEL.length > 0
  ? process.env.LOG_LEVEL
  : 'info'

export const logger = pino({
  level,
  base: { service: 'cafco' },
})
