import React from 'react'

const SoundButton = ({ label, onClick, isActive, variant = 'primary', onDelete }) => {
  return (
    <button
      className={`mecha-btn ${isActive ? 'active' : ''} ${variant}`}
      onClick={onClick}
    >
      <span className="btn-content">{label}</span>
      <span className="corner-decor top-left"></span>
      <span className="corner-decor bottom-right"></span>

      {onDelete && (
        <div
          className="delete-handle"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          ×
        </div>
      )}

      <style>{`
        .mecha-btn {
          position: relative;
          background: transparent;
          border: 1px solid var(--color-primary-dim);
          color: var(--color-primary);
          height: 100%;
          min-height: 80px;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: bold;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .mecha-btn:hover .delete-handle {
            opacity: 1;
        }

        .delete-handle {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 20px;
            height: 20px;
            background: rgba(255, 0, 60, 0.2);
            color: var(--color-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            line-height: 1;
            cursor: pointer;
            border: 1px solid var(--color-secondary);
            opacity: 0;
            transition: all 0.2s;
            z-index: 10;
        }

        .delete-handle:hover {
            background: var(--color-secondary);
            color: #fff;
        }

        .mecha-btn.secondary {
            border-color: rgba(255, 0, 60, 0.4);
            color: var(--color-secondary);
        }

        .mecha-btn:hover {
          background: rgba(0, 240, 255, 0.1);
          border-color: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary-dim);
        }
        
        .mecha-btn.secondary:hover {
            background: rgba(255, 0, 60, 0.1);
            border-color: var(--color-secondary);
            box-shadow: 0 0 10px rgba(255, 0, 60, 0.4);
        }

        .mecha-btn.active {
          background: var(--color-primary);
          color: #000;
          box-shadow: 0 0 20px var(--color-primary);
        }
        
        .mecha-btn.secondary.active {
            background: var(--color-secondary);
            color: #fff;
            box-shadow: 0 0 20px var(--color-secondary);
        }

        .corner-decor {
          position: absolute;
          width: 6px;
          height: 6px;
          border: 1px solid currentColor;
          transition: all 0.2s;
        }

        .top-left {
          top: 4px;
          left: 4px;
          border-right: none;
          border-bottom: none;
        }

        .bottom-right {
          bottom: 4px;
          right: 4px;
          border-left: none;
          border-top: none;
        }
      `}</style>
    </button>
  )
}

export default SoundButton
