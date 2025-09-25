import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react"; // using lucide-react icons

export interface TimePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  defaultValue?: string;
  onChange?: (time: string) => void;
  times?: string[];
}

const TimePicker: React.FC<TimePickerProps> = ({
  label = "Select Time",
  defaultValue,
  onChange,
  required,
  name,
  className,
  times,
  ...rest
}) => {
  const [time, setTime] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const defaultTimes = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Auto-set default to current time if none is given
  useEffect(() => {
    if (!defaultValue) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;
      setTime(currentTime);
      onChange?.(currentTime);
    }
  }, [defaultValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    onChange?.(e.target.value);
  };

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="label"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        {/* Input field */}
        <input
          id={name}
          name={name}
          type="time"
          value={time}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          required={required}
        //   className="input-field pr-10 py-3"
          className={`border rounded-lg px-3 py-2 w-full text-sm pr-10 
            focus:ring-2 focus:ring-purple-500 focus:outline-none ${className}`}
          {...rest}
        />

        {/* Custom purple clock icon */}
        <Clock
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 pointer-events-none"
        />
        {open && (
          <div className="absolute z-50 right-0 mt-2 text-gray-900 w-full bg-white border-none rounded shadow">
            <ul className="max-h-48 overflow-auto">
              {(times && times.length ? times : defaultTimes).map((t: string) => (
                <li
                  key={t}
                  className="px-3 py-2 hover:bg-violet-100 cursor-pointer text-sm"
                  onClick={() => {
                    setTime(t);
                    onChange?.(t);
                    setOpen(false);
                  }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
