"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

/**
 * DatePickerInput Component Props
 */
interface DatePickerInputProps {
  /** Current date value in ISO 8601 format (YYYY-MM-DD) */
  value?: string;
  /** Callback when date changes, receives ISO 8601 date string */
  onChange?: (date: string) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
}

/**
 * Controlled date picker component that works with ISO 8601 date strings
 */
export function DatePickerInput({ 
  value, 
  onChange, 
  placeholder = "Pick a date",
  disabled = false 
}: DatePickerInputProps) {
  // Convert ISO string to Date object for the calendar
  const dateValue = value ? new Date(value) : undefined;

  /**
   * Handle date selection from calendar
   * Converts Date to ISO 8601 string (YYYY-MM-DD) for backend compatibility
   */
  const handleSelect = (selectedDate: Date | undefined) => {
    if (onChange) {
      if (selectedDate) {
        // Convert to ISO 8601 date string (YYYY-MM-DD)
        const isoDate = selectedDate.toISOString().split('T')[0];
        onChange(isoDate);
      } else {
        onChange('');
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal input-field",
            !dateValue && "text-muted-foreground input-field"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white text-gray-900 border-none" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          autoFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
