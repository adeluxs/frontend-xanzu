"use client";

import { useCallback, useRef, useState } from "react";

export default function PriceFilter({
  min = 0,
  max = 2000,
  defaultFrom = 800,
  defaultTo = 1299,
  step = 1,
  onChange,
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const trackRef = useRef(null);

  const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

  const percentFrom = ((from - min) / (max - min)) * 100;
  const percentTo = ((to - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback(
    (clientX) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return Math.round((ratio * (max - min) + min) / step) * step;
    },
    [max, min, step],
  );

  const handleThumbMouseDown = (thumb) => (e) => {
    e.stopPropagation();

    const move = (ev) => {
      const value = getValueFromPosition(ev.clientX);
      if (thumb === "from") {
        const next = clamp(value, min, to - step);
        setFrom(next);
        onChange?.({ from: next, to });
      } else {
        const next = clamp(value, from + step, max);
        setTo(next);
        onChange?.({ from, to: next });
      }
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleTrackMouseDown = (e) => {
    const value = getValueFromPosition(e.clientX);
    const distFrom = Math.abs(value - from);
    const distTo = Math.abs(value - to);
    const target = distFrom <= distTo ? "from" : "to";

    if (target === "from") {
      const next = clamp(value, min, to - step);
      setFrom(next);
      onChange?.({ from: next, to });
    } else {
      const next = clamp(value, from + step, max);
      setTo(next);
      onChange?.({ from, to: next });
    }
  };

  return (
    <div className="inline-flex flex-col gap-4 rounded-2xl select-none min-w-full">
      <div>
        <div className="flex justify-between text-[14px] font-medium text-grayish/80 mb-2">
          <span>From</span>
          <span>To</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-primary/8 justify-center border border-primary/40 rounded-full px-4 py-2">
            <input
              type="number"
              value={from}
              min={min}
              max={to - step}
              step={step}
              onChange={(e) => {
                const next = clamp(Number(e.target.value), min, to - step);
                setFrom(next);
                onChange?.({ from: next, to });
              }}
              className="w-full bg-transparent text-grayish text-sm font-medium text-center outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-400 font-light text-lg">—</span>
          <div className="flex-1 flex items-center bg-primary/8 justify-center border border-primary/40 rounded-full px-4 py-2">
            <input
              type="number"
              value={to}
              min={from + step}
              max={max}
              step={step}
              onChange={(e) => {
                const next = clamp(Number(e.target.value), from + step, max);
                setTo(next);
                onChange?.({ from, to: next });
              }}
              className="w-full bg-transparent text-grayish text-sm font-semibold text-center outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      <div
        className="relative h-5 flex items-center"
        ref={trackRef}
        onMouseDown={handleTrackMouseDown}
      >
        <div className="absolute inset-x-0 h-[4px] rounded-full bg-[rgba(31,42,55,0.16)]" />

        <div
          className="absolute h-[3px] rounded-full  bg-primary"
          style={{
            left: `${percentFrom}%`,
            width: `${percentTo - percentFrom}%`,
          }}
        />

        <div
          className="absolute w-4 h-4 rounded-full bg-primary border-2 border-white shadow-[0_0_8px_rgba(124,92,252,0.7)] cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{ left: `calc(${percentFrom}% - 8px)` }}
          onMouseDown={handleThumbMouseDown("from")}
        />

        <div
          className="absolute w-4 h-4 rounded-full bg-primary border-2 border-white shadow-[0_0_8px_rgba(124,92,252,0.7)] cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{ left: `calc(${percentTo}% - 8px)` }}
          onMouseDown={handleThumbMouseDown("to")}
        />
      </div>
    </div>
  );
}
