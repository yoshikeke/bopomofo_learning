export default function PlaybackControls({ isPlaying, onPlay, onPause, onPrev, onNext, speed, onSpeedChange, disabled }) {
  return (
    <div className="playback">
      <div className="playback-buttons">
        <button className="btn-icon" onClick={onPrev} disabled={disabled} title="前へ">◀</button>
        <button
          className="btn-play"
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled}
          title={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="btn-icon" onClick={onNext} disabled={disabled} title="次へ">▶▶</button>
      </div>
      <div className="playback-speed">
        <label>速度</label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={speed}
          onChange={e => onSpeedChange(parseFloat(e.target.value))}
        />
        <span>{speed.toFixed(1)}×</span>
      </div>
    </div>
  )
}
