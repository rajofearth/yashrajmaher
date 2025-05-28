'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

export function InlineEditableDate({
  value = '',
  onChange,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(value ? new Date(value) : new Date());
  
  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);
  
  const handleSelect = (newDate) => {
    setDate(newDate);
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal group ${className}`}
        >
          <div className="flex items-center justify-between w-full">
            <span>{value ? format(date, 'PPP') : 'Select date'}</span>
            <CalendarIcon className="h-4 w-4 text-muted-foreground opacity-70 group-hover:opacity-100" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
} 