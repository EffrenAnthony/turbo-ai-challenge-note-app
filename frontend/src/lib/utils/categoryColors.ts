import type { CardColor } from '@/components/ui/Card'

const COLORS: CardColor[] = ['sunset', 'honey', 'jade', 'sage']

export function getCategoryColor(index: number): CardColor {
  return COLORS[index % COLORS.length]
}

const DOT_CLASSES: Record<CardColor, string> = {
  sunset: 'bg-sunset-400',
  honey: 'bg-honey-400',
  sage: 'bg-sage-400',
  jade: 'bg-jade-400',
}

export function getCategoryDotClass(index: number): string {
  return DOT_CLASSES[getCategoryColor(index)]
}
