import * as React from 'react'
import './App.css'
import * as Icons from '@ghicons/react'

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
type IconComponent = React.ComponentType<{
  size?: number | string
  color?: string
  title?: string
  className?: string
  style?: React.CSSProperties
}>

type Category = 'all' | 'adinkra' | 'general' | 'national'

interface IconEntry {
  name: string
  component: IconComponent
  category: Category
}

// ──────────────────────────────────────────────────────────────────────────────
// Map every export to its category.
//
// These sets are duplicated data: the real category is the SVG's directory in
// svg/, and nothing keeps them in step with it. They go away once the generated
// icon registry ships and the playground can read the category from there —
// see docs/wiki/Roadmap.md (v0.2). Until then, anything not listed is adinkra.
// ──────────────────────────────────────────────────────────────────────────────
const GENERAL_NAMES = new Set(['GhanaCedi'])
const NATIONAL_NAMES = new Set(['BlackStar', 'GhanaFlag'])

const ALL_ICONS: IconEntry[] = Object.entries(Icons)
  .filter(([, v]) => typeof v === 'function')
  .map(([name, v]) => {
    let category: Category = 'adinkra'
    if (GENERAL_NAMES.has(name)) category = 'general'
    else if (NATIONAL_NAMES.has(name)) category = 'national'
    return { name, component: v as IconComponent, category }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Icons', emoji: '⊞' },
  { id: 'adinkra', label: 'Adinkra', emoji: '✦' },
  { id: 'general', label: 'General', emoji: '◈' },
  { id: 'national', label: 'National', emoji: '⚑' },
]

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
function buildUsageCode(name: string, size: number, color: string) {
  return `<${name} size={${size}} color="${color}" />`
}

function useHash() {
  const [hash, setHash] = React.useState(() => window.location.hash || '#/')
  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash
}

// ──────────────────────────────────────────────────────────────────────────────
// Docs / Installation page
// ──────────────────────────────────────────────────────────────────────────────
function DocsPage({ bg }: { bg: 'light' | 'dark' }) {
  const [copied, setCopied] = React.useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* noop */ }
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const CodeBlock = ({ id, code }: { id: string; code: string }) => (
    <div className="docsCodeBlock">
      <pre className="docsCode mono">{code}</pre>
      <button
        type="button"
        className={`docsCopyBtn ${copied === id ? 'copied' : ''}`}
        onClick={() => copy(code, id)}
      >
        {copied === id ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  )

  return (
    <div className={`docsPage ${bg === 'dark' ? 'isDark' : 'isLight'}`}>
      <div className="docsContainer">

        {/* Hero */}
        <div className="docsHero">
          <h1 className="docsHeroTitle">ghicons</h1>
          <p className="docsHeroSub">
            A React icon library of Ghanaian cultural symbols — Adinkra symbols, national icons, and more.
          </p>
          <div className="docsHeroBadges">
            <a
              className="docsBadge npm"
              href="https://www.npmjs.com/package/ghicons"
              target="_blank"
              rel="noopener noreferrer"
            >
              📦 View on npm
            </a>
            <a
              className="docsBadge github"
              href="https://github.com/ProfessorBlackman/ghicons"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⭐ GitHub Repository
            </a>
            <a
              className="docsBadge issues"
              href="https://github.com/ProfessorBlackman/ghicons/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐛 Report an Issue
            </a>
          </div>
        </div>

        {/* Installation */}
        <section className="docsSection">
          <h2 className="docsSectionTitle">Installation</h2>
          <p className="docsSectionBody">
            Install <code className="inlineCode">ghicons</code> from npm using your preferred package manager:
          </p>
          <CodeBlock id="npm" code="npm install ghicons" />
          <CodeBlock id="pnpm" code="pnpm add ghicons" />
          <CodeBlock id="yarn" code="yarn add ghicons" />
          <p className="docsSectionBody">
            <strong>Peer dependency:</strong> ghicons requires React 19+.
          </p>
        </section>

        {/* Usage */}
        <section className="docsSection">
          <h2 className="docsSectionTitle">Basic Usage</h2>
          <p className="docsSectionBody">
            Import any icon by name and render it as a React component. Each icon accepts
            the <code className="inlineCode">size</code>, <code className="inlineCode">color</code>,{' '}
            <code className="inlineCode">title</code>, <code className="inlineCode">className</code>, and{' '}
            <code className="inlineCode">style</code> props.
          </p>
          <CodeBlock
            id="usage-basic"
            code={`import { Sankofa } from 'ghicons'

export default function App() {
  return <Sankofa size={48} color="#006B3F" />
}`}
          />
        </section>

        {/* Props */}
        <section className="docsSection">
          <h2 className="docsSectionTitle">Props</h2>
          <div className="docsTable">
            <div className="docsTableHead">
              <span>Prop</span>
              <span>Type</span>
              <span>Default</span>
              <span>Description</span>
            </div>
            {[
              { prop: 'size', type: 'number | string', def: '24', desc: 'Width & height of the SVG in px' },
              { prop: 'color', type: 'string', def: '"currentColor"', desc: 'Fill / stroke colour' },
              { prop: 'title', type: 'string', def: '—', desc: 'Accessible SVG title (aria)' },
              { prop: 'className', type: 'string', def: '—', desc: 'Extra CSS class names' },
              { prop: 'style', type: 'CSSProperties', def: '—', desc: 'Inline style object' },
            ].map(r => (
              <div key={r.prop} className="docsTableRow">
                <code className="inlineCode">{r.prop}</code>
                <code className="inlineCode">{r.type}</code>
                <code className="inlineCode">{r.def}</code>
                <span>{r.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Icon categories */}
        <section className="docsSection">
          <h2 className="docsSectionTitle">Icon Categories</h2>
          <div className="docsCatCards">
            <div className="docsCatCard">
              <span className="docsCatIcon">✦</span>
              <strong>Adinkra</strong>
              <p>103 traditional Akan symbols from Ghana, each carrying a philosophical meaning.</p>
            </div>
            <div className="docsCatCard">
              <span className="docsCatIcon">⚑</span>
              <strong>National</strong>
              <p>Symbols of Ghana's national identity — the Black Star and the flag.</p>
            </div>
            <div className="docsCatCard">
              <span className="docsCatIcon">◈</span>
              <strong>General</strong>
              <p>General Ghanaian symbols such as the Ghana Cedis currency icon.</p>
            </div>
          </div>
        </section>

        {/* Contributing */}
        <section className="docsSection">
          <h2 className="docsSectionTitle">Contributing &amp; Issues</h2>
          <p className="docsSectionBody">
            Found a bug or want to request a new icon? Open an issue on GitHub — all contributions
            are welcome!
          </p>
          <div className="docsLinkRow">
            <a
              className="docsLink"
              href="https://github.com/ProfessorBlackman/ghicons/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              🐛 Open a Bug Report
            </a>
            <a
              className="docsLink"
              href="https://github.com/ProfessorBlackman/ghicons/issues/new?labels=feature-request"
              target="_blank"
              rel="noopener noreferrer"
            >
              💡 Request a Feature / Icon
            </a>
            <a
              className="docsLink"
              href="https://github.com/ProfessorBlackman/ghicons"
              target="_blank"
              rel="noopener noreferrer"
            >
              📖 Read the README
            </a>
          </div>
        </section>

        {/* License */}
        <section className="docsSection docsLicenseSection">
          <p className="docsSectionBody">
            Released under the <strong>MIT License</strong> · Built by{' '}
            <a className="docsInlineLink" href="https://github.com/ProfessorBlackman" target="_blank" rel="noopener noreferrer">
              Methuselah Nwodobeh
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Icon gallery page
// ──────────────────────────────────────────────────────────────────────────────
function GalleryPage({ bg }: { bg: 'light' | 'dark' }) {
  const [query, setQuery] = React.useState('')
  const [size, setSize] = React.useState<number>(32)
  const [color, setColor] = React.useState<string>('#111827')
  const [category, setCategory] = React.useState<Category>('all')
  const [selectedName, setSelectedName] = React.useState<string>(() => ALL_ICONS[0]?.name ?? '')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL_ICONS.filter(entry => {
      const matchCat = category === 'all' || entry.category === category
      const matchQ = !q || entry.name.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [query, category])

  React.useEffect(() => {
    const stillVisible = filtered.some(e => e.name === selectedName)
    if (!stillVisible && filtered[0]) setSelectedName(filtered[0].name)
  }, [filtered, selectedName])

  const selectedEntry = React.useMemo(() => ALL_ICONS.find(e => e.name === selectedName), [selectedName])
  const SelectedIcon = selectedEntry?.component

  const usageCode = React.useMemo(
    () => buildUsageCode(selectedName || 'Icon', size, color),
    [selectedName, size, color]
  )

  const copyUsageCode = async () => {
    try { await navigator.clipboard.writeText(usageCode) } catch { /* noop */ }
  }

  const catCounts = React.useMemo(() => {
    const counts: Record<Category, number> = { all: ALL_ICONS.length, adinkra: 0, general: 0, national: 0 }
    ALL_ICONS.forEach(e => { counts[e.category]++ })
    return counts
  }, [])

  return (
    <div className="galleryRoot">
      {/* Left sidebar */}
      <aside className={`categorySidebar ${sidebarOpen ? 'open' : 'collapsed'} ${bg === 'dark' ? 'isDark' : 'isLight'}`}>
        <button
          type="button"
          className="sidebarToggle"
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {sidebarOpen && (
          <>
            <div className="sidebarTitle">Categories</div>
            <nav className="sidebarNav" aria-label="Icon categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`sidebarItem ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="sidebarEmoji" aria-hidden="true">{cat.emoji}</span>
                  <span className="sidebarLabel">{cat.label}</span>
                  <span className="sidebarCount">{catCounts[cat.id]}</span>
                </button>
              ))}
            </nav>
          </>
        )}

        {!sidebarOpen && (
          <nav className="sidebarNavCollapsed" aria-label="Icon categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`sidebarItemCollapsed ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
                title={cat.label}
              >
                <span aria-hidden="true">{cat.emoji}</span>
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* Main content */}
      <div className={`galleryContent ${bg === 'dark' ? 'isDark' : 'isLight'}`}>
        {/* Controls bar */}
        <div className="galleryControls">
          <label className="control">
            <span className="controlLabel">Search</span>
            <input
              className="input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Sankofa, Ghana…"
              spellCheck={false}
            />
          </label>
          <label className="control">
            <span className="controlLabel">Size: {size}px</span>
            <input
              className="range"
              type="range"
              min={12}
              max={256}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
            />
          </label>
          <label className="control">
            <span className="controlLabel">Color</span>
            <div className="colorRow">
              <input
                className="color"
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                aria-label="Icon color"
              />
              <input
                className="input mono"
                value={color}
                onChange={e => setColor(e.target.value)}
                aria-label="Icon color hex"
              />
            </div>
          </label>
          <div className="control">
            <span className="controlLabel">Background</span>
            <div className="segmented">
              <button
                type="button"
                className={`segBtn ${bg === 'light' ? 'active' : ''}`}
                onClick={() => window.dispatchEvent(new CustomEvent('ghicons:setbg', { detail: 'light' }))}
              >Light</button>
              <button
                type="button"
                className={`segBtn ${bg === 'dark' ? 'active' : ''}`}
                onClick={() => window.dispatchEvent(new CustomEvent('ghicons:setbg', { detail: 'dark' }))}
              >Dark</button>
            </div>
          </div>
        </div>

        {/* Meta row */}
        <div className="metaRow">
          <div className="badge">{filtered.length} icon{filtered.length !== 1 ? 's' : ''}</div>
          <div className="hint">Click a tile to preview it on the right.</div>
        </div>

        {/* Two-column: grid + preview */}
        <div className="twoCol">
          <section className="grid" aria-label="Icon gallery">
            {filtered.map(entry => {
              const { name, component: Icon } = entry
              const isSelected = name === selectedName
              return (
                <button
                  key={name}
                  type="button"
                  className={`tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedName(name)}
                  title={`Preview "${name}"`}
                >
                  <div className="iconWrap" aria-hidden="true">
                    <Icon size={28} color={bg === 'dark' ? '#E5E7EB' : '#111827'} />
                  </div>
                  <div className="iconName">{name}</div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="emptyState">No icons match your search.</div>
            )}
          </section>

          <aside className="previewPanel" aria-label="Selected icon preview">
            <div className="previewHeader">
              <div className="previewTitleBlock">
                <div className="previewTitle">{selectedName || 'Select an icon'}</div>
                <div className="previewSub">Live preview updates as you change size/color.</div>
              </div>
              <div className="previewActions">
                <div className="previewCode mono" title={usageCode} aria-label="Usage code">
                  {usageCode}
                </div>
                <button type="button" className="copyBtn" onClick={copyUsageCode} title="Copy usage code">
                  Copy
                </button>
              </div>
            </div>

            <div className="previewStage" aria-label="Preview stage">
              {SelectedIcon ? (
                <div className="previewIcon">
                  {React.createElement(SelectedIcon, { size, color })}
                </div>
              ) : (
                <div className="previewEmpty">No icon selected.</div>
              )}
            </div>

            <div className="previewFooter">
              <div className="previewHelp mono">Tip: paste this directly into your app: {usageCode}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Root App — global nav + routing
// ──────────────────────────────────────────────────────────────────────────────
export default function App() {
  const hash = useHash()
  const [bg, setBg] = React.useState<'light' | 'dark'>('light')

  // Allow GalleryPage controls to bubble bg changes up
  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<'light' | 'dark'>).detail
      setBg(detail)
    }
    window.addEventListener('ghicons:setbg', handler)
    return () => window.removeEventListener('ghicons:setbg', handler)
  }, [])

  const isDocsPage = hash === '#/docs'

  return (
    <div className={`appShell ${bg === 'dark' ? 'isDark' : 'isLight'}`}>
      {/* Global header */}
      <header className="appHeader">
        <a href="#/" className="appLogo">
          <span className="appLogoSymbol" aria-hidden="true">✦</span>
          <span className="appLogoText">ghicons</span>
        </a>

        <nav className="appNav" aria-label="Site navigation">
          <a href="#/" className={`appNavLink ${!isDocsPage ? 'active' : ''}`}>
            Gallery
          </a>
          <a href="#/docs" className={`appNavLink ${isDocsPage ? 'active' : ''}`}>
            Docs
          </a>
          <a
            href="https://www.npmjs.com/package/ghicons"
            target="_blank"
            rel="noopener noreferrer"
            className="appNavLink external"
          >
            npm ↗
          </a>
          <a
            href="https://github.com/ProfessorBlackman/ghicons"
            target="_blank"
            rel="noopener noreferrer"
            className="appNavLink external"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      {/* Page */}
      {isDocsPage ? <DocsPage bg={bg} /> : <GalleryPage bg={bg} />}
    </div>
  )
}