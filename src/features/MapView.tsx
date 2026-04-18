import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet'
import { useAllRecords } from '../hooks/useAllRecords'
import { useSightings } from '../hooks/useSightings'
import { SourceBadge } from '../components/SourceBadge'
import { formatDate, formatTime, sortByTimestamp } from '../utils/time'
import type { RecordItem, Coordinates } from '../types'

// Ankara center
const ANKARA: [number, number] = [39.9208, 32.8541]

const SOURCE_COLOR: Record<RecordItem['type'], string> = {
  checkin:  '#60a5fa',
  message:  '#a78bfa',
  sighting: '#fbbf24',
  note:     '#34d399',
  tip:      '#fb923c',
}

interface MapViewProps {
  selectedPerson: string | null
  onPersonClick: (name: string) => void
}

function RecenterOnMount() {
  const map = useMap()
  useEffect(() => {
    map.setView(ANKARA, 13)
  }, [map])
  return null
}

export function MapView({ selectedPerson, onPersonClick }: MapViewProps) {
  const { records } = useAllRecords()
  const { sightings } = useSightings()

  // Filter records that have coordinates
  const mapped = records.filter(r => getCoords(r) !== null)
  const filtered = selectedPerson
    ? mapped.filter(r => recordInvolvesPerson(r, selectedPerson))
    : mapped

  // Podo's route: sightings in chronological order
  const route = [...sightings]
    .filter(s => s.coordinates)
    .sort((a, b) => sortByTimestamp(b.timestamp, a.timestamp)) // oldest first for route
    .map(s => [s.coordinates!.lat, s.coordinates!.lng] as [number, number])

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={ANKARA}
        zoom={13}
        className="h-full w-full"
        style={{ background: '#0e0c15' }}
        zoomControl={false}
      >
        <RecenterOnMount />

        {/* Dark CartoDB tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Podo's route as a dashed polyline */}
        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#fbbf24',
              weight: 2,
              opacity: 0.5,
              dashArray: '6 6',
            }}
          />
        )}

        {/* Record markers */}
        {filtered.map(record => {
          const coords = getCoords(record)
          if (!coords) return null
          const color = SOURCE_COLOR[record.type]
          const isSelected = selectedPerson && recordInvolvesPerson(record, selectedPerson)

          return (
            <CircleMarker
              key={`${record.type}-${record.id}`}
              center={[coords.lat, coords.lng]}
              radius={record.type === 'sighting' ? 9 : 6}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: isSelected ? 0.95 : 0.7,
                weight: isSelected ? 2 : 1,
                opacity: 1,
              }}
            >
              <Popup className="podo-popup">
                <MapPopup record={record} onPersonClick={onPersonClick} />
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-1000 rounded-xl border border-[--color-border] bg-[--color-surface]/95 backdrop-blur-sm px-3 py-2.5 space-y-1.5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[--color-muted] mb-2">Legend</p>
        {(Object.entries(SOURCE_COLOR) as [RecordItem['type'], string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[10px] capitalize text-[--color-text-dim]">{type}</span>
          </div>
        ))}
        {route.length > 1 && (
          <div className="flex items-center gap-2 pt-1 border-t border-[--color-border]">
            <span className="text-amber-400 font-mono text-[10px]">- - -</span>
            <span className="text-[10px] text-[--color-text-dim]">Podo's route</span>
          </div>
        )}
      </div>

      {/* Record count */}
      <div className="absolute top-4 right-4 z-1000 rounded-lg border border-[--color-border] bg-[--color-surface]/95 backdrop-blur-sm px-3 py-1.5">
        <span className="font-mono text-xs text-[--color-text-dim]">{filtered.length} pins</span>
      </div>
    </div>
  )
}

function MapPopup({ record, onPersonClick }: { record: RecordItem; onPersonClick: (name: string) => void }) {
  const timestamp = getTimestamp(record)
  const location = getLocation(record)

  return (
    <div className="min-w-40 space-y-2 font-sans" style={{ color: '#ede9f8' }}>
      <div className="flex items-center justify-between gap-3">
        <SourceBadge source={record.type} size="sm" />
        {timestamp && (
          <span className="font-mono text-[10px] opacity-60">
            {formatDate(timestamp)} {formatTime(timestamp)}
          </span>
        )}
      </div>

      <div className="text-xs leading-relaxed opacity-80">{getDescription(record)}</div>

      {location && (
        <div className="text-[10px] opacity-50 font-mono">{location}</div>
      )}

      <div className="flex flex-wrap gap-1 pt-1 border-t border-white/10">
        {getNames(record).map(name => (
          <button
            key={name}
            onClick={() => onPersonClick(name)}
            className="rounded-full bg-white/10 hover:bg-white/20 px-2 py-0.5 text-[10px] transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCoords(record: RecordItem): Coordinates | null {
  return ('coordinates' in record && record.coordinates) ? record.coordinates : null
}

function getTimestamp(record: RecordItem): string {
  if (record.type === 'checkin') return record.timestamp
  if (record.type === 'message') return record.timestamp
  if (record.type === 'sighting') return record.timestamp
  if (record.type === 'note') return record.timestamp
  if (record.type === 'tip') return record.timestamp
  return ''
}

function getLocation(record: RecordItem): string {
  if ('location' in record) return record.location as string
  return ''
}

function getDescription(record: RecordItem): string {
  if (record.type === 'checkin') return record.note ?? record.personName
  if (record.type === 'message') return record.text
  if (record.type === 'sighting') return record.note ?? `${record.personName} seen with ${record.seenWith}`
  if (record.type === 'note') return record.note
  if (record.type === 'tip') return record.tip
  return ''
}

function getNames(record: RecordItem): string[] {
  if (record.type === 'checkin') return [record.personName]
  if (record.type === 'message') return [record.senderName, record.recipientName]
  if (record.type === 'sighting') return [record.seenWith]
  if (record.type === 'note') return [record.authorName, ...record.mentionedPeople]
  if (record.type === 'tip') return [record.suspectName]
  return []
}

function recordInvolvesPerson(record: RecordItem, name: string): boolean {
  return getNames(record).some(n => n.toLowerCase() === name.toLowerCase())
}
