export default function PlaybackControls({ isPlaying, onPlay, onPause, onPrev, onNext, interval, onIntervalChange, disabled }) {
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
        <label>間隔</label>
        <input
          type="range"
          min="300"
          max="2000"
          step="100"
          value={interval}
          onChange={e => onIntervalChange(parseInt(e.target.value))}
        />
        <span>{(interval / 1000).toFixed(1)}秒</span>
      </div>
    </div>
  )
}
