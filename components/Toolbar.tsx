import React, { useState, useEffect, useCallback, useRef } from 'react';
import { COLORS, BRUSH_SIZES } from '../types';
import { Trash2, BrainCircuit, Palette, Paintbrush } from 'lucide-react';
import gsap from 'gsap';

const ANALYZE_COOLDOWN_MS = 10000; // 10 seconds cooldown

interface ToolbarProps {
  selectedColor: string;
  brushSize: number;
  tool: 'draw' | 'erase';
  onSelectColor: (color: string) => void;
  onSelectSize: (size: number) => void;
  onSelectTool: (tool: 'draw' | 'erase') => void;
  onClear: () => void;
  onAnalyze: () => void;
  isAnalysing: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedColor,
  brushSize,
  tool,
  onSelectColor,
  onSelectSize,
  onSelectTool,
  onClear,
  onAnalyze,
  isAnalysing
}) => {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const isOnCooldown = cooldownRemaining > 0;
  const isButtonDisabled = isAnalysing || isOnCooldown;

  const handleAnalyzeClick = useCallback(() => {
    if (isButtonDisabled) return;
    onAnalyze();
    setCooldownRemaining(ANALYZE_COOLDOWN_MS);
  }, [isButtonDisabled, onAnalyze]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => {
        const next = prev - 100;
        return next <= 0 ? 0 : next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);

  useEffect(() => {
    if (!indicatorRef.current) return;

    if (!isAnalysing) {
      gsap.killTweensOf(indicatorRef.current);
      gsap.set(indicatorRef.current, { clearProps: 'all' });
      return;
    }

    const rotationTween = gsap.to(indicatorRef.current, {
      rotate: 360,
      repeat: -1,
      ease: 'none',
      duration: 1.4,
    });

    const pulseTween = gsap.to(indicatorRef.current, {
      boxShadow: '0 0 18px rgba(167, 139, 250, 0.8), 0 0 32px rgba(52, 211, 153, 0.35)',
      repeat: -1,
      yoyo: true,
      duration: 0.8,
      ease: 'sine.inOut',
    });

    return () => {
      rotationTween.kill();
      pulseTween.kill();
    };
  }, [isAnalysing]);

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-[#141414]/95 border-l border-[#1f1f1f] text-zinc-100 p-5 flex flex-col gap-6 z-20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 via-slate-700 to-black border border-[#242424] shadow-inner flex items-center justify-center text-sm font-semibold">
          S
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Studio</p>
          <p className="text-sm font-semibold text-white">AIRDRAW</p>
        </div>
      </div>

      {/* Tool toggle */}
      <div className="grid grid-cols-2 gap-2 bg-[#121212] border border-[#1f1f1f] rounded-lg p-2">
        <button
          data-tool="draw"
          onClick={() => onSelectTool('draw')}
          className={`flex items-center gap-2 h-10 px-3 rounded-md border transition-all ${
            tool === 'draw'
              ? 'border-[#2f8cff] bg-[#1b2f4f] text-white shadow-[0_0_0_1px_rgba(47,140,255,0.35)]'
              : 'border-[#1f1f1f] bg-[#161616] text-zinc-300 hover:border-[#2a2a2a]'
          }`}
        >
          <Paintbrush className="w-4 h-4" />
          <span className="text-sm font-medium">Brush</span>
        </button>
        <button
          data-tool="erase"
          onClick={() => onSelectTool('erase')}
          className={`flex items-center gap-2 h-10 px-3 rounded-md border transition-all ${
            tool === 'erase'
              ? 'border-[#2f8cff] bg-[#1b2f4f] text-white shadow-[0_0_0_1px_rgba(47,140,255,0.35)]'
              : 'border-[#1f1f1f] bg-[#161616] text-zinc-300 hover:border-[#2a2a2a]'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Eraser</span>
        </button>
      </div>

      {/* Palette */}
      <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="font-semibold text-zinc-200">Selection colors</span>
          </div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-[0.2em]">Palette</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              data-color={c.value}
              onClick={() => onSelectColor(c.value)}
              className={`h-10 w-full rounded-lg border transition-all duration-150 flex items-center justify-center ${
                selectedColor === c.value
                  ? 'border-[#2f8cff] shadow-[0_0_0_1px_rgba(47,140,255,0.35)] scale-105'
                  : 'border-[#1f1f1f] hover:border-[#2a2a2a]'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Brush size */}
      <div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4" />
            <span className="font-semibold text-zinc-200">Stroke</span>
          </div>
          <span className="text-[11px] text-zinc-500 uppercase tracking-[0.2em]">Weight</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              data-size={size}
              onClick={() => onSelectSize(size)}
              className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                brushSize === size
                  ? 'border-[#2f8cff] bg-[#1b2f4f] text-white shadow-[0_0_0_1px_rgba(47,140,255,0.35)]'
                  : 'border-[#1f1f1f] bg-[#161616] text-zinc-300 hover:border-[#2a2a2a]'
              }`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: Math.max(4, size / 2.2), height: Math.max(4, size / 2.2) }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="space-y-3 pb-2">
        <div className="relative">
          {isAnalysing && (
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute -inset-[6px] rounded-md overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f8cff] via-[#6ee7ff] to-[#7c3aed] opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2f8cff] via-[#6ee7ff] to-[#7c3aed] opacity-25 blur-lg" />
            </div>
          )}
          <button
            data-action="analyze"
            onClick={handleAnalyzeClick}
            disabled={isButtonDisabled}
            className={`group relative w-full h-11 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all
              ${isButtonDisabled
                ? 'bg-[#1a1a1a] text-zinc-500 cursor-not-allowed border border-[#222]'
                : 'bg-[#2f8cff] text-white hover:bg-[#2574d7] border border-[#2f8cff] shadow-[0_10px_30px_rgba(47,140,255,0.25)]'
              }`}
          >
            {isAnalysing ? (
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            ) : (
              <BrainCircuit className="w-4 h-4 transition-transform group-hover:scale-110" />
            )}
            <span className="tracking-wide font-semibold">
              {isAnalysing ? 'ENHANCING...' : isOnCooldown ? `WAIT ${cooldownSeconds}s` : 'ENHANCE DRAWING'}
            </span>
          </button>
        </div>

        <button
          data-action="clear"
          onClick={onClear}
          className="group w-full h-11 rounded-md bg-[#161616] border border-[#1f1f1f] text-zinc-300 hover:bg-[#1d1d1d] hover:text-white hover:border-[#2a2a2a] flex items-center justify-center gap-2 text-sm font-medium transition-all"
        >
          <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="tracking-wide">CLEAR CANVAS</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
