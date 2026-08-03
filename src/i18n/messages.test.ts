import { describe, expect, it } from 'vitest'
import { LOCALES } from './config'
import { getMessages } from './messages'

function collectKeyPaths(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string')
    return [prefix]
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, val]) =>
      collectKeyPaths(val, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

describe('i18n messages', () => {
  const reference = collectKeyPaths(getMessages('es')).sort()

  it('has a non-empty reference key set', () => {
    expect(reference.length).toBeGreaterThan(0)
  })

  for (const locale of LOCALES) {
    it(`${locale} has the exact same key structure as es`, () => {
      const keys = collectKeyPaths(getMessages(locale)).sort()
      expect(keys).toEqual(reference)
    })
  }
})
