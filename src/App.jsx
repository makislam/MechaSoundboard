import { useState, useRef } from 'react'
import SoundButton from './components/SoundButton'
import SoundEditor from './components/SoundEditor'
import './index.css'

function App() {
  const [activeSound, setActiveSound] = useState(null)
  const [editingSound, setEditingSound] = useState(null) // For the upload modal
  // Initialize with default sounds. We map a 'src' to each so logic is uniform.
  const [sounds, setSounds] = useState([
    { id: 'welcome', label: 'WELCOME', color: 'primary', src: '/sounds/welcome.mp3' },
    { id: 'gong-cha', label: 'GONG CHA', color: 'secondary', src: '/sounds/gong-cha.mp3' },
    { id: 'judging', label: 'JUDGE REMIND', color: 'secondary', src: '/sounds/judging.mp3' },
    { id: 'open-d1', label: 'OPEN DAY 1', color: 'primary', src: '/sounds/open-d1.mp3' },
    { id: 'close-d1', label: 'CLOSE DAY 1', color: 'secondary', src: '/sounds/close-d1.mp3' },
    { id: 'open-d2', label: 'OPEN DAY 2', color: 'primary', src: '/sounds/open-d2.mp3' },
    { id: 'close-d2', label: 'CLOSE DAY 2', color: 'secondary', src: '/sounds/close-d2.mp3' },
    { id: 'open-d3', label: 'OPEN DAY 3', color: 'primary', src: '/sounds/open-d3.mp3' },
    { id: 'close-d3', label: 'CLOSE DAY 3', color: 'secondary', src: '/sounds/close-d3.mp3' },
  ])

  const fileInputRef = useRef(null)

  const handlePlay = (sound) => {
    setActiveSound(sound.id)
    console.log(`Playing sound: ${sound.id}`)

    setTimeout(() => {
      if (activeSound === sound.id) setActiveSound(null)
    }, 500)

    try {
      // Use explicit src if available, otherwise fallback to convention
      const src = sound.src || `/sounds/${sound.id}.mp3`
      const audio = new Audio(src)
      audio.volume = 0.5

      // Apply crop settings if they exist
      if (sound.startTime) {
        audio.currentTime = sound.startTime
      }

      const stopTime = sound.endTime || 9999

      const checkTime = () => {
        if (audio.currentTime >= stopTime) {
          audio.pause()
          audio.removeEventListener('timeupdate', checkTime)
        }
      }

      if (sound.endTime) {
        audio.addEventListener('timeupdate', checkTime)
      }

      audio.play().catch(e => console.warn("Audio play failed:", e))
    } catch (err) {
      console.error("Audio error:", err)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return
    setEditingSound(file)
    event.target.value = null
  }

  const handleSaveSound = (config) => {
    const url = URL.createObjectURL(config.file)

    const newSound = {
      id: `custom-${Date.now()}`,
      label: config.title,
      color: 'primary',
      src: url,
      startTime: config.startTime,
      endTime: config.endTime,
      isCustom: true
    }

    setSounds(prev => [...prev, newSound])
    setEditingSound(null)
  }

  const handleDelete = (id) => {
    if (confirm('DELETE CLIP?')) {
      setSounds(prev => prev.filter(s => s.id !== id))
    }
  }

  return (
    <div className="mecha-container">
      <header className="mecha-header">
        <div className="branding">
          <img src="/logo.png" alt="Mecha Logo" className="logo-img" />
          <h1>MECHA SOUNDBOARD <span className="version">v1.2</span></h1>
        </div>
        <div className="header-controls">
          <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
            [ + UPLOAD MP3 ]
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="audio/mp3,audio/wav"
            style={{ display: 'none' }}
          />
          <div className="status-indicator">ONLINE</div>
        </div>
      </header>

      <main className="sound-grid">
        {sounds.map(sound => (
          <SoundButton
            key={sound.id}
            label={sound.label}
            isActive={activeSound === sound.id}
            variant={sound.color}
            onClick={() => handlePlay(sound)}
            onDelete={sound.isCustom ? () => handleDelete(sound.id) : undefined}
          />
        ))}
      </main>

      {editingSound && (
        <SoundEditor
          file={editingSound}
          onSave={handleSaveSound}
          onCancel={() => setEditingSound(null)}
        />
      )}

      <footer className="mecha-footer">
        <div className="system-log">
          System Ready... Waiting for input.
        </div>
      </footer>

      <style>{`
        .mecha-container {
          display: flex;
          flex-direction: column;
          width: 900px;
          min-height: 600px;
          background-color: var(--color-panel);
          border: 2px solid var(--color-primary-dim);
          box-shadow: 0 0 20px var(--color-primary-dim);
          position: relative;
          padding: 20px;
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% 90%, 
            95% 100%, 
            0 100%
          );
        }

        .mecha-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-primary-dim);
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .branding {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-img {
          height: 60px;
          filter: drop-shadow(0 0 5px var(--color-primary-dim));
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .upload-btn {
            background: transparent;
            border: 1px dashed var(--color-primary);
            color: var(--color-primary);
            font-size: 0.8rem;
            padding: 5px 10px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .upload-btn:hover {
            background: rgba(0, 240, 255, 0.1);
            box-shadow: 0 0 10px var(--color-primary-dim);
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
          grid-template-columns: repeat(4, 1fr); /* Increased columns for more space */
          gap: 15px;
          flex-grow: 1;
          align-content: start;
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
