import { Routes, Route } from 'react-router-dom'
import { InvestigationPage } from './pages/InvestigationPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InvestigationPage />} />
    </Routes>
  )
}
