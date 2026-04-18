import { useState } from 'react'
import { CaseHeader } from '../features/CaseHeader'
import { SuspectList } from '../features/SuspectList'
import { EvidenceFeed } from '../features/EvidenceFeed'
import { PersonDetail } from '../features/PersonDetail'

export function InvestigationPage() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)

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

        {/* Center: Evidence feed */}
        <div className="flex-1 overflow-hidden">
          <EvidenceFeed
            selectedPerson={selectedPerson}
            onPersonClick={handlePersonClick}
          />
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
