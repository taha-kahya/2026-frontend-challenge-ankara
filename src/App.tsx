import { useCheckins } from './hooks/useCheckins'
import { useMessages } from './hooks/useMessages'
import { useSightings } from './hooks/useSightings'
import { usePersonalNotes } from './hooks/usePersonalNotes'
import { useAnonymousTips } from './hooks/useAnonymousTips'
import { debugAnswerKeys } from './lib/jotform'

// Temporary debug view — verifies API fetching works and shows raw field names
// Replace this with the real UI once form IDs + API key are confirmed
function App() {
  const { checkins, isLoading: l1, isError: e1 } = useCheckins()
  const { messages, isLoading: l2, isError: e2 } = useMessages()
  const { sightings, isLoading: l3, isError: e3 } = useSightings()
  const { notes, isLoading: l4, isError: e4 } = usePersonalNotes()
  const { tips, isLoading: l5, isError: e5 } = useAnonymousTips()

  const sources = [
    { label: 'Checkins', count: checkins.length, isLoading: l1, isError: e1, sample: checkins[0]?.raw },
    { label: 'Messages', count: messages.length, isLoading: l2, isError: e2, sample: messages[0]?.raw },
    { label: 'Sightings', count: sightings.length, isLoading: l3, isError: e3, sample: sightings[0]?.raw },
    { label: 'Personal Notes', count: notes.length, isLoading: l4, isError: e4, sample: notes[0]?.raw },
    { label: 'Anonymous Tips', count: tips.length, isLoading: l5, isError: e5, sample: tips[0]?.raw },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
      <h1 className="text-2xl font-bold text-amber-400 mb-2">🔍 Missing Podo — Data Debug</h1>
      <p className="text-slate-400 text-sm mb-8">
        Verifying API connectivity. Replace form IDs + API key in{' '}
        <code className="text-amber-300">src/lib/constants.ts</code>
      </p>

      <div className="grid grid-cols-1 gap-6">
        {sources.map(({ label, count, isLoading, isError, sample }) => (
          <div key={label} className="border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-slate-200 font-semibold">{label}</span>
              {isLoading && <span className="text-xs text-slate-400">loading…</span>}
              {isError && <span className="text-xs text-red-400">error — check API key / form ID</span>}
              {!isLoading && !isError && (
                <span className="text-xs text-emerald-400">{count} records</span>
              )}
            </div>

            {sample && (
              <details className="text-xs">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-200">
                  Sample field map (use to update transformers.ts)
                </summary>
                <pre className="mt-2 text-slate-300 bg-slate-900 p-3 rounded overflow-auto max-h-48">
                  {JSON.stringify(debugAnswerKeys(sample), null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
