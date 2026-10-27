import PlayCard from './components/PlayCard'
import './App.css'
import StatsCard from './components/StatCard'

function App() {

  return (
    <main className='crt flex min-h-screen items-center justify-center bg-ink font-display text-mist'>
      <PlayCard />
      <StatsCard 
        title="MODEL STATS"
        accent="red"
        stats={[
          { label: 'TOTAL WINS', value: '—' },
          { label: 'TOTAL LOSSES', value: '—' },
        ]}
      />
      <StatsCard 
        title="PLAYER STATS"
        accent="yellow"
        stats={[
          { label: "WINS", value: "—"},
          { label: "LOSSES", value: "—" }
        ]}
      />
    </main>
  )
}

export default App
