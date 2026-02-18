import { getCategoryColor, getCategoryDotClass } from '@/lib/utils/categoryColors'

describe('getCategoryColor', () => {
  it('returns sunset for index 0', () => {
    expect(getCategoryColor(0)).toBe('sunset')
  })

  it('returns honey for index 1', () => {
    expect(getCategoryColor(1)).toBe('honey')
  })

  it('returns jade for index 2', () => {
    expect(getCategoryColor(2)).toBe('jade')
  })

  it('returns sage for index 3', () => {
    expect(getCategoryColor(3)).toBe('sage')
  })

  it('cycles back to sunset for index 4', () => {
    expect(getCategoryColor(4)).toBe('sunset')
  })

  it('handles large indices with modulo', () => {
    expect(getCategoryColor(8)).toBe('sunset')
    expect(getCategoryColor(9)).toBe('honey')
  })
})

describe('getCategoryDotClass', () => {
  it('returns sunset dot class for index 0', () => {
    expect(getCategoryDotClass(0)).toBe('bg-sunset-400')
  })

  it('returns honey dot class for index 1', () => {
    expect(getCategoryDotClass(1)).toBe('bg-honey-400')
  })

  it('returns jade dot class for index 2', () => {
    expect(getCategoryDotClass(2)).toBe('bg-jade-400')
  })

  it('returns sage dot class for index 3', () => {
    expect(getCategoryDotClass(3)).toBe('bg-sage-400')
  })

  it('cycles correctly for higher indices', () => {
    expect(getCategoryDotClass(4)).toBe('bg-sunset-400')
  })
})
