import * as React from 'react'
import './App.css'
import * as Icons from './index'

type IconComponent = React.ComponentType<{
  size?: number | string
  color?: string
  title?: string
  className?: string
  style?: React.CSSProperties
}>

const ALL_ICONS = Object.entries(Icons)
  .filter(([, value]) => typeof value === 'function')
  .map(([name, value]) => [name, value as IconComponent] as const)
  .sort(([a], [b]) => a.localeCompare(b))

function buildUsageCode(name: string, size: number, color: string) {
  return `<${name} size={${size}} color="${color}" />`
}

function App() {
  const [query, setQuery] = React.useState('')
  const [size, setSize] = React.useState<number>(32)
  const [color, setColor] = React.useState<string>('#111827') // slate-900-ish
  const [bg, setBg] = React.useState<'light' | 'dark'>('light')
  const [selectedName, setSelectedName] = React.useState<string>(() => ALL_ICONS[0]?.[0] ?? '')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_ICONS
    return ALL_ICONS.filter(([name]) => name.toLowerCase().includes(q))
  }, [query])

  React.useEffect(() => {
    if (!selectedName) return
    const stillVisible = filtered.some(([name]) => name === selectedName)
    if (!stillVisible && filtered[0]) setSelectedName(filtered[0][0])
  }, [filtered, selectedName])

  const selectedIcon = React.useMemo(() => {
    const entry = ALL_ICONS.find(([name]) => name === selectedName)
    return entry?.[1]
  }, [selectedName])

  const usageCode = React.useMemo(() => buildUsageCode(selectedName || 'Icon', size, color), [
    selectedName,
    size,
    color,
  ])

  const copyUsageCode = async () => {
    try {
      await navigator.clipboard.writeText(usageCode)
    } catch {
      // clipboard may be blocked; no big deal for a demo page
    }
  }

  return (
    <div className={`demoRoot ${bg === 'dark' ? 'isDark' : 'isLight'}`}>
      <header className="demoHeader">
        <div className="titleBlock">
          <h1 className="title">ghicons demo</h1>
          <p className="subtitle">Pick an icon, tweak props, and copy the exact JSX you’re previewing.</p>
        </div>

        <div className="controls">
          <label className="control">
            <span className="controlLabel">Search</span>
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Sankofa, Ghana..."
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
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </label>

          <label className="control">
            <span className="controlLabel">Color</span>
            <div className="colorRow">
              <input
                className="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                aria-label="Icon color"
              />
              <input
                className="input mono"
                value={color}
                onChange={(e) => setColor(e.target.value)}
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
                onClick={() => setBg('light')}
              >
                Light
              </button>
              <button
                type="button"
                className={`segBtn ${bg === 'dark' ? 'active' : ''}`}
                onClick={() => setBg('dark')}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="demoMain">
        <div className="metaRow">
          <div className="badge">{filtered.length} icons</div>
          <div className="hint">Click a tile to preview it on the right.</div>
        </div>

        <div className="twoCol">
          <section className="grid" aria-label="Icon gallery">
            {filtered.map(([name, Icon]) => {
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
              {selectedIcon ? (
                <div className="previewIcon">
                  {React.createElement(selectedIcon, { size, color })}
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
      </main>
    </div>
  )
}

export default App