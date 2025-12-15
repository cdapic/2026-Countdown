import React, { useEffect, useState, useRef, useCallback } from 'react';
import { TARGET_DATE_ISO, CRITICAL_THRESHOLD_SECONDS } from './constants';
import { getNetworkTimeOffset } from './services/timeService';
import { TimeLeft, AppState } from './types';
import { initAudio, playTick, playFinalBoom } from './utils/audio';
import Digit from './components/Digit';
import { Fireworks } from './components/Fireworks';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isComplete: false });
  const [offset, setOffset] = useState<number>(0);
  const [testModeOffset, setTestModeOffset] = useState<number>(0);
  
  // Ref to track previous second to trigger sound only on change
  const prevSecondsRef = useRef<number>(-1);
  const requestRef = useRef<number>(0);

  // 1. Initialize Time Synchronization
  useEffect(() => {
    const syncTime = async () => {
      const netOffset = await getNetworkTimeOffset();
      setOffset(netOffset);
      setAppState(AppState.READY_TO_START);
    };
    syncTime();
  }, []);

  // 2. Main Loop Logic
  const calculateTime = useCallback(() => {
    if (appState === AppState.LOADING || appState === AppState.READY_TO_START) return;

    const targetDate = new Date(TARGET_DATE_ISO).getTime();
    
    // "Now" is System Time + Network Offset + Manual Test Offset
    const now = Date.now() + offset + testModeOffset;
    const difference = targetDate - now;

    if (difference <= 0) {
      // Complete
      setTimeLeft({
        days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isComplete: true
      });
      if (!timeLeft.isComplete) {
         playFinalBoom();
         setAppState(AppState.COMPLETE);
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    const totalSeconds = Math.floor(difference / 1000);

    // Audio Trigger Logic
    if (totalSeconds <= CRITICAL_THRESHOLD_SECONDS && totalSeconds !== prevSecondsRef.current) {
        // Play tick
        playTick();
        prevSecondsRef.current = totalSeconds;
    }

    setTimeLeft({
      days, hours, minutes, seconds, totalSeconds, isComplete: false
    });

  }, [appState, offset, testModeOffset, timeLeft.isComplete]);

  // Request Animation Frame Loop
  useEffect(() => {
    const animate = () => {
      calculateTime();
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [calculateTime]);


  // 3. User Interaction Handlers
  const handleStart = () => {
    initAudio(); // Initialize AudioContext on user gesture
    setAppState(AppState.RUNNING);
  };

  const handleTestMode = () => {
    // Determine how much time is left actually
    const targetDate = new Date(TARGET_DATE_ISO).getTime();
    const nowReal = Date.now() + offset;
    const realDiff = targetDate - nowReal;

    // We want to simulate that we are 15 seconds away
    // So: SimulatedNow = Target - 15s
    // OffsetNeeded = SimulatedNow - NowReal
    // OffsetNeeded = (Target - 15s) - NowReal
    // OffsetNeeded = Target - 15s - (Target - RealDiff) = RealDiff - 15s
    
    const desiredSecondsLeft = 15;
    const shift = realDiff - (desiredSecondsLeft * 1000);
    
    setTestModeOffset(shift);
    
    // Reset state if it was complete
    setAppState(AppState.RUNNING); 
    prevSecondsRef.current = -1; // Reset audio trigger
  };


  // 4. Render Helpers
  const isCritical = timeLeft.totalSeconds <= CRITICAL_THRESHOLD_SECONDS && timeLeft.totalSeconds > 0;

  if (appState === AppState.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-pulse">Synchronizing with Beijing Time...</div>
      </div>
    );
  }

  if (appState === AppState.READY_TO_START) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        
        <div className="z-10 text-center space-y-8 p-6">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 pb-2">
            2026 Countdown
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Ready to synchronize. Please click below to enable audio effects and start the timer.
          </p>
          <button 
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 font-mono rounded-lg focus:outline-none hover:bg-indigo-500 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            ENTER
            <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 animate-pulse" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col relative overflow-hidden transition-colors duration-1000 ${isCritical ? 'bg-black' : 'bg-slate-950'}`}>
      
      {/* Background Ambience */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isCritical ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Critical Red Pulse Overlay */}
      <div className={`absolute inset-0 pointer-events-none bg-red-900/10 mix-blend-overlay transition-opacity duration-100 ${isCritical ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

      {/* Fireworks Effect */}
      <Fireworks active={appState === AppState.COMPLETE} />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center z-10 w-full p-4">
        
        {/* Header - Hidden on mobile landscape to save vertical space */}
        <div className="absolute top-8 left-0 right-0 flex justify-center opacity-80 landscape:hidden lg:landscape:flex">
             <h2 className="text-sm md:text-lg font-mono text-slate-500 tracking-[0.5em] uppercase">
               {appState === AppState.COMPLETE ? "Welcome to" : "Time Until"}
             </h2>
        </div>

        {/* 2026 Large Display (Only shows when complete) */}
        {appState === AppState.COMPLETE ? (
          <div className="animate-[bounce_2s_infinite]">
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-600 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              2026
            </h1>
            <p className="text-center text-white mt-4 font-mono text-xl tracking-widest">HAPPY NEW YEAR</p>
          </div>
        ) : (
          /* Countdown Digits */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 items-center justify-center">
             <Digit value={timeLeft.days} label="Days" isCritical={isCritical} />
             <Digit value={timeLeft.hours} label="Hours" isCritical={isCritical} />
             <Digit value={timeLeft.minutes} label="Minutes" isCritical={isCritical} />
             <Digit value={timeLeft.seconds} label="Seconds" isCritical={isCritical} />
          </div>
        )}

        {/* Countdown to 2026 text below - Hidden on mobile landscape */}
         {!timeLeft.isComplete && (
            <div className="absolute bottom-12 md:bottom-20 opacity-50 text-center landscape:hidden lg:landscape:block">
              <span className="text-slate-600 text-sm font-mono">
                TARGET: 2026-01-01 00:00:00 (CST)
              </span>
            </div>
         )}
      </main>

      {/* Concealed Test Trigger - Bottom Right Corner */}
      {/* Increased opacity slightly to ensure it's findable (20%), and ensured high z-index */}
      <button 
          onClick={handleTestMode}
          className="fixed bottom-2 right-2 z-50 p-2 text-[10px] text-white/20 hover:text-white/80 font-mono tracking-widest uppercase transition-colors cursor-pointer select-none"
          title="Test Mode"
      >
        DEV_TEST
      </button>

    </div>
  );
};

export default App;