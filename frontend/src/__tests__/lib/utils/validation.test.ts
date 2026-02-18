import { isValidEmail, isValidPassword, getPasswordErrors } from '@/lib/utils/validation'

describe('isValidEmail', () => {
  it('returns true for valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('name.surname@domain.co')).toBe(true)
    expect(isValidEmail('test+tag@gmail.com')).toBe(true)
  })

  it('returns false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('spaces in@email.com')).toBe(false)
  })
})

describe('isValidPassword', () => {
  it('returns true for a strong password', () => {
    expect(isValidPassword('MyP@ssw0rd')).toBe(true)
    expect(isValidPassword('Str0ng!Pass')).toBe(true)
  })

  it('returns false for weak passwords', () => {
    expect(isValidPassword('short')).toBe(false)
    expect(isValidPassword('nouppercase1!')).toBe(false)
    expect(isValidPassword('NOLOWERCASE1!')).toBe(false)
    expect(isValidPassword('NoNumber!!')).toBe(false)
    expect(isValidPassword('NoSpecial1a')).toBe(false)
  })
})

describe('getPasswordErrors', () => {
  it('returns empty array for a strong password', () => {
    expect(getPasswordErrors('MyP@ssw0rd')).toEqual([])
  })

  it('returns error for short password', () => {
    const errors = getPasswordErrors('Ab1!')
    expect(errors).toContain('At least 8 characters')
  })

  it('returns error for missing uppercase', () => {
    const errors = getPasswordErrors('lowercase1!')
    expect(errors).toContain('At least one uppercase letter')
  })

  it('returns error for missing lowercase', () => {
    const errors = getPasswordErrors('UPPERCASE1!')
    expect(errors).toContain('At least one lowercase letter')
  })

  it('returns error for missing number', () => {
    const errors = getPasswordErrors('NoNumbers!!')
    expect(errors).toContain('At least one number')
  })

  it('returns error for missing special character', () => {
    const errors = getPasswordErrors('NoSpecial1a')
    expect(errors).toContain('At least one special character')
  })

  it('returns multiple errors for very weak password', () => {
    const errors = getPasswordErrors('abc')
    expect(errors.length).toBeGreaterThan(1)
    expect(errors).toContain('At least 8 characters')
    expect(errors).toContain('At least one uppercase letter')
    expect(errors).toContain('At least one number')
    expect(errors).toContain('At least one special character')
  })
})
