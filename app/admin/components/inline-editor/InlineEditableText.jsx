'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

export function InlineEditableText({
  value = '',
  onChange,
  placeholder = 'Click to edit',
  className = '',
  multiline = false
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef(null);
  
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.tagName === 'INPUT') {
        // Place cursor at the end for input elements
        const length = currentValue.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  }, [isEditing]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    if (currentValue !== value) {
      onChange(currentValue);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };
  
  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full p-2 border border-border rounded-md bg-background focus:border-primary focus:ring focus:ring-primary/20 outline-none transition-all ${className}`}
          rows={3}
        />
      );
    }
    
    return (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full p-2 border border-border rounded-md bg-background focus:border-primary focus:ring focus:ring-primary/20 outline-none transition-all ${className}`}
      />
    );
  }
  
  return (
    <div 
      onClick={handleEdit}
      className={`group cursor-text relative p-2 -m-2 rounded-md border border-transparent hover:bg-accent/20 hover:border-border ${className}`}
    >
      {value ? (
        <div className="break-words whitespace-normal overflow-hidden">{value}</div>
      ) : (
        <div className="text-muted-foreground">{placeholder}</div>
      )}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
} 