import { useState } from 'react'
import { List, Map, Clock, Users, ChevronLeft } from 'lucide-react'
import { CaseHeader } from '../features/CaseHeader'
import { SuspectList } from '../features/SuspectList'
import { EvidenceFeed } from '../features/EvidenceFeed'
import { PersonDetail } from '../features/PersonDetail'
import { MapView } from '../features/MapView'
import { TimelineView } from '../features/TimelineView'
import { SummaryStrip } from '../features/SummaryStrip'

type CenterView = 'feed' | 'map' | 'timeline'
// Mobile panel: suspects list | main content | person detail
type MobilePanel = 'suspects' | 'main' | 'detail'

export function InvestigationPage() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [centerView, setCenterView] = useState<CenterView>('feed')
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('main')

  function handlePersonClick(name: string) {
    if (!name) {
      setSelectedPerson(null)
      setMobilePanel('main')
      return
    }
    const next = selectedPerson === name ? null : name
    setSelectedPerson(next)
    if (next) setMobilePanel('detail')
  }

  function handleSuspectSelect(name: string | null) {
    setSelectedPerson(name)
    if (name) setMobilePanel('detail')
  }

  return (
    <div className="flex flex-col h-screen bg-[--color-base] overflow-hidden">
      <CaseHeader />
      <SummaryStrip onPersonClick={handlePersonClick} />

      {/* ── Desktop layout (lg+): 3-panel side by side ── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-72 shrink-0 overflow-hidden">
          <SuspectList selectedPerson={selectedPerson} onSelect={setSelectedPerson} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ViewBar centerView={centerView} onChange={setCenterView} />
          <div className="flex-1 overflow-hidden">
            <CenterPanel centerView={centerView} selectedPerson={selectedPerson} onPersonClick={handlePersonClick} />
          </div>
        </div>

        {selectedPerson && (
          <div className="w-80 shrink-0 overflow-hidden">
            <PersonDetail
              personName={selectedPerson}
              onClose={() => setSelectedPerson(null)}
              onPersonClick={handlePersonClick}
            />
          </div>
        )}
      </div>

      {/* ── Mobile layout (<lg): single panel at a time ── */}
      <div className="flex lg:hidden flex-1 flex-col overflow-hidden">
        {/* Mobile nav bar */}
        <div className="flex items-center border-b border-[--color-border] bg-[--color-surface] px-2 py-1.5 gap-1 shrink-0">
          {mobilePanel !== 'main' && (
            <button
              onClick={() => setMobilePanel('main')}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-[--color-text-dim] hover:text-[--color-text] transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setMobilePanel('suspects')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${mobilePanel === 'suspects' ? 'bg-[--color-surface-raised] text-[--color-text] border border-[--color-border]' : 'text-[--color-text-dim]'}`}
          >
            <Users className="h-3.5 w-3.5" />
            Suspects
          </button>
          <ViewBar centerView={centerView} onChange={v => { setCenterView(v); setMobilePanel('main') }} compact />
          {selectedPerson && (
            <button
              onClick={() => setMobilePanel('detail')}
              className={`ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${mobilePanel === 'detail' ? 'border-amber-500/50 bg-amber-500/8 text-amber-300' : 'border-[--color-border] text-[--color-text-dim]'}`}
            >
              {selectedPerson}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {mobilePanel === 'suspects' && (
            <SuspectList selectedPerson={selectedPerson} onSelect={handleSuspectSelect} />
          )}
          {mobilePanel === 'main' && (
            <CenterPanel centerView={centerView} selectedPerson={selectedPerson} onPersonClick={handlePersonClick} />
          )}
          {mobilePanel === 'detail' && selectedPerson && (
            <PersonDetail
              personName={selectedPerson}
              onClose={() => { setSelectedPerson(null); setMobilePanel('main') }}
              onPersonClick={handlePersonClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function CenterPanel({ centerView, selectedPerson, onPersonClick }: {
  centerView: CenterView
  selectedPerson: string | null
  onPersonClick: (name: string) => void
}) {
  return (
    <>
      {centerView === 'feed' && <EvidenceFeed selectedPerson={selectedPerson} onPersonClick={onPersonClick} />}
      {centerView === 'map'  && <MapView      selectedPerson={selectedPerson} onPersonClick={onPersonClick} />}
      {centerView === 'timeline' && <TimelineView selectedPerson={selectedPerson} onPersonClick={onPersonClick} />}
    </>
  )
}

function ViewBar({ centerView, onChange, compact = false }: {
  centerView: CenterView
  onChange: (v: CenterView) => void
  compact?: boolean
}) {
  return (
    <div className={`flex items-center gap-1 ${compact ? '' : 'px-4 h-11 border-b border-[--color-border] bg-[--color-surface] shrink-0'}`}>
      <ViewToggle active={centerView === 'feed'}     icon={<List  className="h-3.5 w-3.5" />} label={compact ? '' : 'Evidence'} onClick={() => onChange('feed')} />
      <ViewToggle active={centerView === 'map'}      icon={<Map   className="h-3.5 w-3.5" />} label={compact ? '' : 'Map'}      onClick={() => onChange('map')} />
      <ViewToggle active={centerView === 'timeline'} icon={<Clock className="h-3.5 w-3.5" />} label={compact ? '' : 'Timeline'} onClick={() => onChange('timeline')} />
    </div>
  )
}

function ViewToggle({ active, icon, label, onClick }: {
  active: boolean; icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
          : 'border-transparent text-[--color-text-dim] hover:text-[--color-text] hover:bg-white/5'
      }`}
    >
      {icon}{label}
    </button>
  )
}
