export type GradientType = 'linear' | 'radial'
export type RadialShape = 'circle' | 'ellipse'
export type RadialSize =
  | 'farthest-corner'
  | 'farthest-side'
  | 'closest-corner'
  | 'closest-side'

export interface ColorStop {
  id: string
  /** #rrggbbaa */
  color: string
  /** 0 - 100 */
  position: number
}

export interface GradientConfig {
  type: GradientType
  angle: number
  shape: RadialShape
  size: RadialSize
  posX: number
  posY: number
  stops: ColorStop[]
}

export const RADIAL_SIZES: RadialSize[] = [
  'farthest-corner',
  'farthest-side',
  'closest-corner',
  'closest-side',
]

export const newStopId = () => Math.random().toString(36).slice(2, 9)

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export const sortStops = (stops: ColorStop[]) =>
  [...stops].sort((a, b) => a.position - b.position)

const stopsToCss = (stops: ColorStop[]) =>
  sortStops(stops)
    .map(s => `${s.color} ${Math.round(s.position)}%`)
    .join(', ')

export const gradientToCss = (g: GradientConfig) => {
  if (g.type === 'linear') {
    return `linear-gradient(${Math.round(g.angle)}deg, ${stopsToCss(g.stops)})`
  }
  const size = g.size === 'farthest-corner' ? '' : ` ${g.size}`
  return `radial-gradient(${g.shape}${size} at ${Math.round(g.posX)}% ${Math.round(g.posY)}%, ${stopsToCss(g.stops)})`
}

/** Flat left-to-right strip of the stops, used for the stop bar. */
export const stopsStripCss = (stops: ColorStop[]) =>
  `linear-gradient(90deg, ${stopsToCss(stops)})`

// ---------- color helpers ----------

export const normalizeHex = (hex: string): string | null => {
  let h = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-f]+$/i.test(h)) return null
  if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('')
  if (h.length === 6) h += 'ff'
  if (h.length !== 8) return null
  return `#${h.toLowerCase()}`
}

export const hexToRgba = (hex: string) => {
  const h = normalizeHex(hex) ?? '#000000ff'
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
    a: parseInt(h.slice(7, 9), 16) / 255,
  }
}

const hex2 = (n: number) =>
  Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0')

export const rgbaToHex = (r: number, g: number, b: number, a = 1) =>
  `#${hex2(r)}${hex2(g)}${hex2(b)}${hex2(a * 255)}`

/** Color of the gradient strip at `position`, used when inserting a stop. */
export const colorAt = (stops: ColorStop[], position: number) => {
  const sorted = sortStops(stops)
  if (position <= sorted[0].position) return sorted[0].color
  const last = sorted[sorted.length - 1]
  if (position >= last.position) return last.color
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (position >= a.position && position <= b.position) {
      const t = b.position === a.position ? 0 : (position - a.position) / (b.position - a.position)
      const ca = hexToRgba(a.color)
      const cb = hexToRgba(b.color)
      return rgbaToHex(
        ca.r + (cb.r - ca.r) * t,
        ca.g + (cb.g - ca.g) * t,
        ca.b + (cb.b - ca.b) * t,
        ca.a + (cb.a - ca.a) * t
      )
    }
  }
  return last.color
}

// HSV is what the picker's square works in.
export const rgbToHsv = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

export const hsvToRgb = (h: number, s: number, v: number) => {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255 }
}

// ---------- presets ----------

const preset = (
  name: string,
  type: GradientType,
  colors: [string, number][],
  extra: Partial<GradientConfig> = {}
): { name: string; gradient: GradientConfig } => ({
  name,
  gradient: {
    type,
    angle: 135,
    shape: 'circle',
    size: 'farthest-corner',
    posX: 50,
    posY: 50,
    stops: colors.map(([color, position]) => ({
      id: newStopId(),
      color: normalizeHex(color)!,
      position,
    })),
    ...extra,
  },
})

export const GRADIENT_PRESETS = [
  preset('Dungeon', 'radial', [['#2e2e2e', 0], ['#0a0a0a', 100]], { posX: 30, posY: 20 }),
  preset('Torch', 'radial', [['#f5a524', 0], ['#a3341c', 40], ['#1a0f0a', 100]], { posX: 15, posY: 85 }),
  preset('Moss', 'linear', [['#165a4c', 0], ['#91db69', 100]], { angle: 0 }),
  preset('Abyss', 'linear', [['#0b1026', 0], ['#2b4c7e', 60], ['#6fd0e8', 100]], { angle: 160 }),
  preset('Slime', 'radial', [['#9cff57', 0], ['#1f6b3a', 55], ['#0b1f14', 100]], { shape: 'ellipse', posX: 70, posY: 40 }),
  preset('Blood Moon', 'radial', [['#ffd1a6', 0], ['#d84a4a', 18], ['#2a0a12', 100]], { posX: 80, posY: 25, size: 'closest-corner' }),
  preset('Amethyst', 'linear', [['#2d1b4e', 0], ['#7b3fa0', 50], ['#e08bd6', 100]], { angle: 120 }),
  preset('Frost', 'linear', [['#e9f4ff', 0], ['#8ab6e8', 100]], { angle: 200 }),
]

export const defaultGradient = (): GradientConfig =>
  structuredClone(GRADIENT_PRESETS[0].gradient)
