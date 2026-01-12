import React, { useState, useEffect, useRef } from 'react'

const SoundEditor = ({ file, onSave, onCancel }) => {
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [dragging, setDragging] = useState(null) // 'start' or 'end'

    const audioRef = useRef(null)
    const sliderRef = useRef(null)

    useEffect(() => {
        if (file) {
            const name = file.name.replace(/\.[^/.]+$/, "").substring(0, 15).toUpperCase()
            setTitle(name)

            const audio = new Audio(URL.createObjectURL(file))
            audio.onloadedmetadata = () => {
                setDuration(audio.duration)
                setEndTime(audio.duration)
                audioRef.current = audio
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [file])

    const handlePreview = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
            return
        }

        audioRef.current.currentTime = startTime
        audioRef.current.play()
        setIsPlaying(true)

        // Stop at end time
        const checkTime = () => {
            if (!audioRef.current) return
            if (audioRef.current.currentTime >= endTime) {
                audioRef.current.pause()
                setIsPlaying(false)
                audioRef.current.removeEventListener('timeupdate', checkTime)
            }
        }
        audioRef.current.addEventListener('timeupdate', checkTime)
    }

    const handleSave = () => {
        onSave({
            title,
            file,
            startTime: parseFloat(startTime),
            endTime: parseFloat(endTime)
        })
    }

    const handleMouseDown = (type) => (e) => {
        setDragging(type)
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (e) => {
        if (!sliderRef.current || !duration) return

        const rect = sliderRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, x / rect.width))
        const time = percentage * duration

        setDragging(current => {
            if (current === 'start') {
                setStartTime(Math.min(time, endTime - 0.1))
            } else if (current === 'end') {
                setEndTime(Math.max(time, startTime + 0.1))
            }
            return current
        })
    }

    const handleMouseUp = () => {
        setDragging(null)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    // Calculate percentages for UI
    const startWait = duration ? (startTime / duration) * 100 : 0
    const endWait = duration ? (endTime / duration) * 100 : 100
    const width = endWait - startWait

    return (
        <div className="editor-overlay">
            <div className="editor-modal">
                <h2>CONFIGURE SOUND</h2>

                <div className="form-group">
                    <label>TITLE</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.toUpperCase())}
                        maxLength={15}
                    />
                </div>

                <div className="form-group">
                    <label>CROP REGION</label>

                    <div className="crop-slider-container" ref={sliderRef}>
                        <div className="track-bg"></div>
                        <div
                            className="track-active"
                            style={{ left: `${startWait}%`, width: `${width}%` }}
                        ></div>

                        {/* Handles */}
                        <div
                            className="handle start-handle"
                            style={{ left: `${startWait}%` }}
                            onMouseDown={handleMouseDown('start')}
                        >
                            <div className="handle-label">{startTime.toFixed(1)}s</div>
                        </div>
                        <div
                            className="handle end-handle"
                            style={{ left: `${endWait}%` }}
                            onMouseDown={handleMouseDown('end')}
                        >
                            <div className="handle-label">{endTime.toFixed(1)}s</div>
                        </div>
                    </div>

                    <div className="range-summary">
                        Duration: {(endTime - startTime).toFixed(1)}s
                    </div>
                </div>

                <div className="preview-bar">
                    <button className={`preview-btn ${isPlaying ? 'active' : ''}`} onClick={handlePreview}>
                        {isPlaying ? 'STOP PREVIEW' : '▶ PREVIEW CLIP'}
                    </button>
                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onCancel}>CANCEL</button>
                    <button className="save-btn" onClick={handleSave}>CONFIRM</button>
                </div>
            </div>
        </div>
    )
}

export default SoundEditor
