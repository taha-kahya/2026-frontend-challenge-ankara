import { useState } from 'react'
import { List, Map } from 'lucide-react'
import { CaseHeader } from '../features/CaseHeader'
import { SuspectList } from '../features/SuspectList'
import { EvidenceFeed } from '../features/EvidenceFeed'
import { PersonDetail } from '../features/PersonDetail'
import { MapView } from '../features/MapView'

type CenterView = 'feed' | 'map'

export function InvestigationPage() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [centerView, setCenterView] = useState<CenterView>('feed')

  function handlePersonClick(name: string) {
    if (!name) {
      setSelectedPerson(null)
      return
    }
    setSelectedPerson(prev => (prev === name ? null : name))
  }

  return (
    <div className="flex flex-col h-screen bg-[--color-base] overflow-hidden">
      <CaseHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Suspects */}
        <div className="w-64 shrink-0 overflow-hidden">
          <SuspectList
            selectedPerson={selectedPerson}
            onSelect={setSelectedPerson}
          />
        </div>

        {/* Center: Feed or Map */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View toggle */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[--color-border] bg-[--color-surface]">
            <ViewToggle
              active={centerView === 'feed'}
              icon={<List className="h-3.5 w-3.5" />}
              label="Evidence"
              onClick={() => setCenterView('feed')}
            />
            <ViewToggle
              active={centerView === 'map'}
              icon={<Map className="h-3.5 w-3.5" />}
              label="Map"
              onClick={() => setCenterView('map')}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {centerView === 'feed' ? (
              <EvidenceFeed
                selectedPerson={selectedPerson}
                onPersonClick={handlePersonClick}
              />
            ) : (
              <MapView
                selectedPerson={selectedPerson}
                onPersonClick={handlePersonClick}
              />
            )}
          </div>
        </div>

        {/* Right: Person detail (conditional) */}
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
    </div>
  )
}

function ViewToggle({
  active, icon, label, onClick,
}: {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? 'bg-[--color-surface-raised] text-[--color-text] border border-[--color-border]'
          : 'text-[--color-text-dim] hover:text-[--color-text]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
