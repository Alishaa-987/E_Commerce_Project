import React, { useState, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");

const CountdownTimer = ({ endDate }) => {
  const getTimeLeft = () => {
    const diff = Math.max(0, endDate - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, endDate - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map(({ label, value }, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-white/10 bg-[#0b0b0d] text-xl sm:text-2xl font-bold font-Playfair text-white">
              {pad(value)}
            </div>
            <span className="mt-1 text-[9px] uppercase tracking-widest text-white/40">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="mb-4 text-lg font-bold text-white/30">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;
