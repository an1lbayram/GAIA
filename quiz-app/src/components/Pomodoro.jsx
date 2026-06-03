import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, ChevronDown, Settings } from 'lucide-react';
import './Pomodoro.css';

const PRESETS = [
  { label: '25/5', work: 25, shortBreak: 5, longBreak: 20 },
  { label: '40/10', work: 40, shortBreak: 10, longBreak: 30 },
  { label: '90/30', work: 90, shortBreak: 30, longBreak: 60 }
];

const Pomodoro = ({ isOpen, setIsOpen }) => {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  const [timeLeft, setTimeLeft] = useState(preset.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [cycleCount, setCycleCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const audioCtxRef = useRef(null);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playSound = (freq, duration, type = 'sine', volume = 0.15) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* silent */ }
  };

  const playStartSound = () => {
    playSound(523, 0.08, 'sine', 0.12);
    setTimeout(() => playSound(659, 0.08, 'sine', 0.12), 80);
    setTimeout(() => playSound(784, 0.12, 'sine', 0.1), 160);
  };

  const playAlarm = () => {
    // 5 loud double-beeps
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playSound(980, 0.25, 'square', 0.4);
        setTimeout(() => playSound(760, 0.25, 'square', 0.4), 250);
      }, i * 600);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      playAlarm();
      
      if (mode === 'work') {
        const nextCycle = cycleCount + 1;
        setCycleCount(nextCycle);
        if (nextCycle % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(preset.longBreak * 60);
        } else {
          setMode('shortBreak');
          setTimeLeft(preset.shortBreak * 60);
        }
      } else {
        // finished shortBreak or longBreak
        setMode('work');
        setTimeLeft(preset.work * 60);
      }
      
      // Auto continue next cycle
      setIsActive(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, cycleCount, preset]);

  // If preset changes while stopped
  useEffect(() => {
    if (!isActive) {
      if (mode === 'work') setTimeLeft(preset.work * 60);
      else if (mode === 'shortBreak') setTimeLeft(preset.shortBreak * 60);
      else if (mode === 'longBreak') setTimeLeft(preset.longBreak * 60);
    }
  }, [presetIdx]);

  const toggleTimer = () => {
    if (!isActive) playStartSound();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setCycleCount(0);
    setMode('work');
    setTimeLeft(preset.work * 60);
  };

  const switchMode = (m) => {
    setMode(m);
    setIsActive(false);
    if (m === 'work') setTimeLeft(preset.work * 60);
    else if (m === 'shortBreak') setTimeLeft(preset.shortBreak * 60);
    else if (m === 'longBreak') setTimeLeft(preset.longBreak * 60);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const getDuration = () => {
    if (mode === 'work') return preset.work * 60;
    if (mode === 'shortBreak') return preset.shortBreak * 60;
    return preset.longBreak * 60;
  };

  const progress = ((getDuration() - timeLeft) / getDuration()) * 100;

  if (!isOpen) return null;

  return (
    <div className={`pomodoro-panel ${mode === 'work' ? 'work' : 'break'}`}>
      <div className="pomo-header">
        <div className="pomo-title">
          <Timer size={14} />
          <span>Pomodoro</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="pomo-minimize" onClick={() => setShowSettings(!showSettings)} aria-label="Ayarlar">
            <Settings size={16} />
          </button>
          <button className="pomo-minimize" onClick={() => setIsOpen(false)} aria-label="Küçült">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="pomo-settings">
          <h4 style={{fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-secondary)'}}>Zamanlayıcı Süresi</h4>
          <div className="pomo-presets">
            {PRESETS.map((p, idx) => (
              <label key={idx} className="pomo-preset-label">
                <input 
                  type="radio" 
                  name="preset" 
                  checked={presetIdx === idx}
                  onChange={() => {
                    setPresetIdx(idx);
                    setShowSettings(false);
                    if (!isActive) {
                      setMode('work');
                      setTimeLeft(PRESETS[idx].work * 60);
                    }
                  }}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
          <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px'}}>* 4. çalışma sonrası 20 dk mola verilir.</p>
        </div>
      ) : (
        <>
          <div className="pomo-tabs">
            <button className={mode === 'work' ? 'active' : ''} onClick={() => switchMode('work')}>Çalışma</button>
            <button className={mode === 'shortBreak' || mode === 'longBreak' ? 'active' : ''} onClick={() => switchMode('shortBreak')}>Mola</button>
          </div>

          <div className="pomo-display">
            <svg className="pomo-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle cx="60" cy="60" r="52" className="ring-fill" 
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
              />
            </svg>
            <span className="pomo-time">{fmt(timeLeft)}</span>
            <span className="pomo-cycle-text">{cycleCount % 4}/4 Döngü</span>
          </div>

          <div className="pomo-controls">
            <button onClick={resetTimer} className="pomo-btn" aria-label="Sıfırla">
              <RotateCcw size={16} />
            </button>
            <button onClick={toggleTimer} className="pomo-btn pomo-play" aria-label="Oynat/Duraklat">
              {isActive ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pomodoro;
