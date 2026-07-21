import { describe, expect, it } from 'vitest'
import { logger } from './logger'

describe('logger', () => {
  it('exposes info level logging', () => {
    expect(typeof logger.info).toBe('function')
    expect(logger.bindings()).toMatchObject({ service: 'cafco' })
  })
})
