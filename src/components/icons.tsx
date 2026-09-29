import { SVGProps } from 'react'

// Drawn from ASCII grids so every icon stays on the pixel grid.

type IconProps = SVGProps<SVGSVGElement>

const toPath = (rows: string[]) =>
  rows
    .flatMap((row, y) => [...row].map((c, x) => (c === '#' ? `M${x} ${y}h1v1h-1z` : '')))
    .join('')

const PixelIcon = ({ rows, ...props }: IconProps & { rows: string[] }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox={`0 0 ${rows.length} ${rows.length}`}
    width='1em'
    height='1em'
    shapeRendering='crispEdges'
    aria-hidden
    {...props}
  >
    <path fill='currentColor' d={toPath(rows)} />
  </svg>
)

const TRASH_ICON_ROWS = [
  '...####...',
  '..#....#..',
  '##########',
  '.#......#.',
  '.#.#..#.#.',
  '.#.#..#.#.',
  '.#.#..#.#.',
  '.#.#..#.#.',
  '.#......#.',
  '..######..',
]
export const TrashIcon = (p: IconProps) => <PixelIcon rows={TRASH_ICON_ROWS} {...p} />

const COPY_ICON_ROWS = [
  '######....',
  '#....#....',
  '#..######.',
  '#..#....#.',
  '#..#....#.',
  '####....#.',
  '...#....#.',
  '...#....#.',
  '...######.',
  '..........',
]
export const CopyIcon = (p: IconProps) => <PixelIcon rows={COPY_ICON_ROWS} {...p} />

const CHECK_ICON_ROWS = [
  '..........',
  '.........#',
  '........##',
  '.......##.',
  '#.....##..',
  '##...##...',
  '.##.##....',
  '..###.....',
  '...#......',
  '..........',
]
export const CheckIcon = (p: IconProps) => <PixelIcon rows={CHECK_ICON_ROWS} {...p} />

const SUN_ICON_ROWS = [
  '....#.....',
  '.#..#..#..',
  '..#...#...',
  '...###....',
  '##.###.##.',
  '...###....',
  '..#...#...',
  '.#..#..#..',
  '....#.....',
  '..........',
]
export const SunIcon = (p: IconProps) => <PixelIcon rows={SUN_ICON_ROWS} {...p} />

const MOON_ICON_ROWS = [
  '...####...',
  '..##......',
  '.##.......',
  '.##.......',
  '.##.......',
  '.##.......',
  '.###....#.',
  '..######..',
  '...####...',
  '..........',
]
export const MoonIcon = (p: IconProps) => <PixelIcon rows={MOON_ICON_ROWS} {...p} />

const LINK_ICON_ROWS = [
  '..........',
  '..........',
  '####..####',
  '#........#',
  '#..####..#',
  '#........#',
  '####..####',
  '..........',
  '..........',
  '..........',
]
export const LinkIcon = (p: IconProps) => <PixelIcon rows={LINK_ICON_ROWS} {...p} />

const RELOAD_ICON_ROWS = [
  '...####.#.',
  '..#....##.',
  '.#....###.',
  '.#........',
  '.#........',
  '.#......#.',
  '.#......#.',
  '..#....#..',
  '...####...',
  '..........',
]
export const ReloadIcon = (p: IconProps) => <PixelIcon rows={RELOAD_ICON_ROWS} {...p} />

const DOWNLOAD_ICON_ROWS = [
  '....#.....',
  '....#.....',
  '....#.....',
  '..#.#.#...',
  '...###....',
  '....#.....',
  '#.......#.',
  '#.......#.',
  '#########.',
  '..........',
]
export const DownloadIcon = (p: IconProps) => <PixelIcon rows={DOWNLOAD_ICON_ROWS} {...p} />

const SCROLL_ICON_ROWS = [
  '.#######..',
  '#.......#.',
  '.#......#.',
  '.#.####.#.',
  '.#......#.',
  '.#.####.#.',
  '.#......#.',
  '.#.......#',
  '..#######.',
  '..........',
]
export const ScrollIcon = (p: IconProps) => <PixelIcon rows={SCROLL_ICON_ROWS} {...p} />

const SKULL_ICON_ROWS = [
  '..#####...',
  '.#.....#..',
  '#.......#.',
  '#.##.##.#.',
  '#.##.##.#.',
  '#...#...#.',
  '.#.....#..',
  '..#.#.#...',
  '..#####...',
  '..........',
]
export const SkullIcon = (p: IconProps) => <PixelIcon rows={SKULL_ICON_ROWS} {...p} />

const GEM_ICON_ROWS = [
  '..........',
  '..#####...',
  '.#.#.#.#..',
  '#########.',
  '.#.....#..',
  '..#...#...',
  '...#.#....',
  '....#.....',
  '..........',
  '..........',
]
export const GemIcon = (p: IconProps) => <PixelIcon rows={GEM_ICON_ROWS} {...p} />

const EYE_ICON_ROWS = [
  '..........',
  '..........',
  '..#####...',
  '.#.....#..',
  '#..###..#.',
  '#..###..#.',
  '.#.....#..',
  '..#####...',
  '..........',
  '..........',
]
export const EyeIcon = (p: IconProps) => <PixelIcon rows={EYE_ICON_ROWS} {...p} />

const DROPPER_ICON_ROWS = [
  '.......##.',
  '......####',
  '.....#####',
  '....####..',
  '...#.##...',
  '..#.#.....',
  '.#.#......',
  '#.#.......',
  '##........',
  '..........',
]
export const DropperIcon = (p: IconProps) => <PixelIcon rows={DROPPER_ICON_ROWS} {...p} />

export const TorchIcon = ({ className = '', ...p }: IconProps) => (
  <svg viewBox='0 0 16 24' width='16' height='24' shapeRendering='crispEdges' aria-hidden className={className} {...p}>
    <g className='torch-flame'>
      <rect x='6' y='1' width='4' height='2' fill='#ffe08a' />
      <rect x='5' y='3' width='6' height='3' fill='#f5a524' />
      <rect x='4' y='6' width='8' height='3' fill='#e0582b' />
      <rect x='7' y='4' width='2' height='4' fill='#fff3c4' />
    </g>
    <rect x='5' y='9' width='6' height='2' fill='#6b4a2b' />
    <rect x='6' y='11' width='4' height='12' fill='#4a311c' />
    <rect x='6' y='11' width='1' height='12' fill='#7a5533' />
  </svg>
)
