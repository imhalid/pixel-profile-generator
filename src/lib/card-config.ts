import { GradientConfig, defaultGradient, gradientToCss } from './gradient'

export const API_BASE = 'https://pixel-profile.vercel.app/api'

export type Scheme = 'light' | 'dark'
export type CardType = 'stats' | 'crt'

export const THEMES = [
  { id: 'crt', label: 'CRT', swatch: '#000000' },
  { id: 'journey', label: 'Journey', swatch: 'linear-gradient(180deg,#f7b267,#5b3b6e)' },
  { id: 'road_trip', label: 'Road Trip', swatch: 'linear-gradient(180deg,#8fd3f4,#e8a87c)' },
  { id: 'fuji', label: 'Fuji', swatch: 'linear-gradient(180deg,#f6c1c7,#3c5a8a)' },
  { id: 'monica', label: 'Monica', swatch: 'linear-gradient(135deg,#0c7bb3,#f2bae8)' },
  { id: 'summer', label: 'Summer', swatch: 'linear-gradient(135deg,#74dcc4,#4597e9)' },
  { id: 'blue_chill', label: 'Blue Chill', swatch: 'linear-gradient(135deg,#5580eb,#2aeeff)' },
  { id: 'lax', label: 'Lax', swatch: 'linear-gradient(135deg,#F9957F,#F2F5D0)' },
  { id: 'serene', label: 'Serene', swatch: 'linear-gradient(135deg,#07A3B2,#D9ECC7)' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const HIDE_KEYS = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'rank', label: 'Rank' },
  { key: 'stars', label: 'Stars' },
  { key: 'commits', label: 'Commits' },
  { key: 'prs', label: 'PRs' },
  { key: 'issues', label: 'Issues' },
  { key: 'contributions', label: 'Contrib' },
] as const

export type HideKey = (typeof HIDE_KEYS)[number]['key']

/** Everything that can differ between the light and dark card. */
export interface CardConfig {
  cardType: CardType
  /** null = custom background */
  theme: ThemeId | null
  gradient: GradientConfig
  imageUrl: string
  textColor: string
  screenEffect: boolean
  pixelateAvatar: boolean
  avatarBorder: boolean
  dithering: boolean
  hide: HideKey[]
}

/** Data options shared by both cards. */
export interface SharedConfig {
  username: string
  includeAllCommits: boolean
  excludeRepo: string
  /** seconds, 0 = API default */
  cacheSeconds: number
}

export const defaultCard = (): CardConfig => ({
  cardType: 'stats',
  theme: null,
  gradient: defaultGradient(),
  imageUrl: '',
  textColor: '#ffffffff',
  screenEffect: false,
  pixelateAvatar: true,
  avatarBorder: false,
  dithering: false,
  hide: [],
})

export const defaultShared = (): SharedConfig => ({
  username: 'imhalid',
  includeAllCommits: true,
  excludeRepo: '',
  cacheSeconds: 0,
})

/**
 * Renders the public API can't finish inside Vercel's time limit right now:
 * the curved screen shader and the CRT card/theme.
 */
export const isHeavyCard = (card: CardConfig) =>
  card.cardType === 'crt' || card.screenEffect || card.theme === 'crt'

export const backgroundCss = (card: CardConfig) => {
  const gradient = gradientToCss(card.gradient)
  const url = card.imageUrl.trim()
  return url ? `${gradient}, url(${url})` : gradient
}

/**
 * Builds the query exactly as the API reads it: only send what differs from
 * the API defaults so generated URLs stay short.
 */
export const buildParams = (card: CardConfig, shared: SharedConfig) => {
  const p = new URLSearchParams()
  p.set('username', shared.username.trim())
  if (shared.includeAllCommits) p.set('include_all_commits', 'true')
  const exclude = shared.excludeRepo
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  if (exclude.length) p.set('exclude_repo', exclude.join(','))
  if (shared.cacheSeconds) p.set('cache_seconds', String(shared.cacheSeconds))

  if (card.cardType === 'crt') return p

  if (card.theme) {
    p.set('theme', card.theme)
  } else {
    p.set('background', backgroundCss(card))
  }
  if (!card.theme || card.textColor.toLowerCase() !== '#ffffffff') {
    p.set('color', card.textColor)
  }
  if (card.screenEffect) p.set('screen_effect', 'true')
  if (!card.pixelateAvatar) p.set('pixelate_avatar', 'false')
  if (card.avatarBorder) p.set('avatar_border', 'true')
  if (card.dithering) p.set('dithering', 'true')
  if (card.hide.length) p.set('hide', card.hide.join(','))
  return p
}

const endpoint = (card: CardConfig) =>
  card.cardType === 'crt' ? 'github-stats-crt' : 'github-stats'

export const buildUrl = (card: CardConfig, shared: SharedConfig) =>
  `${API_BASE}/${endpoint(card)}?${buildParams(card, shared).toString()}`

// ---------- snippets ----------

export interface Snippets {
  html: string
  markdown: string
  actions: string
}

export const buildSnippets = (
  cards: Record<Scheme, CardConfig>,
  shared: SharedConfig,
  linked: boolean
): Snippets => {
  const light = buildUrl(cards.light, shared)
  const dark = linked ? light : buildUrl(cards.dark, shared)
  const alt = `${shared.username.trim() || 'github'}'s github stats`

  const html = linked
    ? `<img alt="${alt}" src="${light}" />`
    : [
        '<picture>',
        `  <source media="(prefers-color-scheme: dark)" srcset="${dark}" />`,
        `  <source media="(prefers-color-scheme: light)" srcset="${light}" />`,
        `  <img alt="${alt}" src="${light}" />`,
        '</picture>',
      ].join('\n')

  const markdown = linked
    ? `![${alt}](${light})`
    : [
        `![${alt}](${light}#gh-light-mode-only)`,
        `![${alt}](${dark}#gh-dark-mode-only)`,
      ].join('\n')

  // The action takes `<file>?<query>` lines; CRT cards go under crt_outputs.
  const outputs: string[] = []
  const crtOutputs: string[] = []
  const add = (file: string, card: CardConfig) => {
    const line = `dist/${file}?${buildParams(card, shared).toString()}`
    ;(card.cardType === 'crt' ? crtOutputs : outputs).push(line)
  }
  add('github-stats', cards.light)
  if (!linked) add('github-stats-dark', cards.dark)

  const user = shared.username.trim() || '<username>'
  const raw = (file: string) =>
    `https://raw.githubusercontent.com/${user}/${user}/output/${file}.png`
  const rawReadme = linked
    ? [`<img alt="${alt}" src="${raw('github-stats')}" />`]
    : [
        '<picture>',
        `  <source media="(prefers-color-scheme: dark)" srcset="${raw('github-stats-dark')}" />`,
        `  <img alt="${alt}" src="${raw('github-stats')}" />`,
        '</picture>',
      ]

  const block = (key: string, lines: string[]) =>
    lines.length
      ? [`          ${key}: |`, ...lines.map(l => `            ${l}`)]
      : []

  const actions = [
    'name: generate-pixel-profile',
    '',
    'on:',
    '  schedule:',
    '    - cron: "0 */24 * * *"',
    '  workflow_dispatch:',
    '',
    'jobs:',
    '  generate:',
    '    permissions:',
    '      contents: write',
    '    runs-on: ubuntu-latest',
    '    timeout-minutes: 5',
    '    steps:',
    '      - name: generate github stats card',
    '        uses: LuciNyan/pixel-profile/action@main',
    '        with:',
    ...block('outputs', outputs),
    ...block('crt_outputs', crtOutputs),
    '',
    '      - name: push cards to the output branch',
    '        uses: crazy-max/ghaction-github-pages@v3.1.0',
    '        with:',
    '          target_branch: output',
    '          build_dir: dist',
    '        env:',
    '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
    '',
    '# Then use the pre-rendered cards in README.md:',
    ...rawReadme.map(l => `# ${l}`),
  ].join('\n')

  return { html, markdown, actions }
}
