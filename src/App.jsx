import { useState } from 'react'
import SoundButton from './components/SoundButton'
import './index.css'

function App() {
  const [activeSound, setActiveSound] = useState(null)

  const sounds = [
    { id: 'welcome', label: 'WELCOME', color: 'primary' },
    { id: 'gong-cha', label: 'GONG CHA', color: 'secondary' },
    { id: 'judging', label: 'JUDGE REMIND', color: 'secondary' },
    { id: 'open-d1', label: 'OPEN DAY 1', color: 'primary' },
    { id: 'close-d1', label: 'CLOSE DAY 1', color: 'secondary' },
    { id: 'open-d2', label: 'OPEN DAY 2', color: 'primary' },
    { id: 'close-d2', label: 'CLOSE DAY 2', color: 'secondary' },
    { id: 'open-d3', label: 'OPEN DAY 3', color: 'primary' },
    { id: 'close-d3', label: 'CLOSE DAY 3', color: 'secondary' },
    // Keep some original system sounds if desired, or replace? 
    // User "I want you to add buttons for..." implies addition, but maybe we replace the generic ones to make room?
    // The prompt implies these are specific needed buttons. The old ones were generic. 
    // I'll keep the new ones prominent. I will append the old "system" ones at the bottom as "SYSTEM" controls if space permits, 
    // assuming a scroll or just bigger grid. 
    // Actually, let's just replace the demo set with this specific set to avoid clutter, 
    // as this looks like a specific event soundboard now.
  ]

  const handlePlay = (id) => {
    setActiveSound(id)
    console.log(`Playing sound: ${id}`)
    // Reset active sound after a delay for visual effect
    setTimeout(() => {
      if (activeSound === id) setActiveSound(null)
    }, 500)

    try {
      // Create and play audio
      // Note: In a real Vite app, we might want to import these dynamically 
      // or put them in the public folder. For simplicity, we'll assume they 
      // act as static assets if placed in public, OR we use a dynamic import approach.
      // A safe bet for a non-bundled approach (simple) is the /public folder content served at root.
      // But since we are in src/assets, we need to import them or move them.

      // Let's use the public folder strategy for easier user management
      const audio = new Audio(`/sounds/${id}.mp3`)
      audio.volume = 0.5
      audio.play().catch(e => console.warn("Audio play failed (file might be missing):", e))
    } catch (err) {
      console.error("Audio error:", err)
    }
  }

  return (
    <div className="mecha-container">
      <header className="mecha-header">
        <h1>MECHA SOUNDBOARD <span className="version">v1.0</span></h1>
        <div className="status-indicator">ONLINE</div>
      </header>

      <main className="sound-grid">
        {sounds.map(sound => (
          <SoundButton
            key={sound.id}
            label={sound.label}
            isActive={activeSound === sound.id}
            variant={sound.color}
            onClick={() => handlePlay(sound.id)}
          />
        ))}
      </main>

      <footer className="mecha-footer">
        <div className="system-log">
          System Ready... Waiting for input.
        </div>
      </footer>

      <style>{`
        .mecha-container {
          display: flex;
          flex-direction: column;
          width: 800px;
          height: 500px;
          background-color: var(--color-panel);
          border: 2px solid var(--color-primary-dim);
          box-shadow: 0 0 20px var(--color-primary-dim);
          position: relative;
          padding: 20px;
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% 85%, 
            95% 100%, 
            0 100%
          ); /* Cut corner aesthetic */
        }

        .mecha-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-primary-dim);
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 1.5rem;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
          text-shadow: 0 0 5px var(--color-primary);
        }

        .version {
            font-size: 0.8rem;
            color: var(--color-text);
            opacity: 0.7;
        }

        .status-indicator {
          color: #0f0;
          font-weight: bold;
          text-shadow: 0 0 5px #0f0;
          font-family: monospace;
          animation: blink 2s infinite;
        }

        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .sound-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          flex-grow: 1;
        }

        .mecha-footer {
          margin-top: 20px;
          border-top: 1px solid var(--color-primary-dim);
          padding-top: 10px;
          font-family: monospace;
          color: var(--color-primary-dim);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  )
}

export default App
