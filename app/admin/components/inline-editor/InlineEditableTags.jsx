'use client';

import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function InlineEditableTags({
  value = [],
  onChange,
  className = ''
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  
  const handleAddTag = () => {
    setIsAdding(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  
  const handleRemoveTag = (indexToRemove) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };
  
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newTag = inputValue.trim();
      // Don't add if tag already exists
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace if input is empty
      handleRemoveTag(value.length - 1);
    }
  };
  
  const handleInputBlur = () => {
    if (inputValue.trim()) {
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
    }
    setInputValue('');
    setIsAdding(false);
  };
  
  return (
    <div className={`flex flex-wrap gap-2 min-h-9 p-2 border border-border rounded-md ${className}`}>
      {value.map((tag, index) => (
        <Badge key={index} variant="secondary" className="gap-1 group">
          {tag}
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="rounded-full hover:bg-muted p-0.5"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      
      {isAdding ? (
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          className="flex-1 min-w-24 h-7 text-sm p-1"
          placeholder="Add tag and press Enter"
        />
      ) : (
        <button
          type="button"
          onClick={handleAddTag}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{value.length > 0 ? 'Add tag' : 'Add tags'}</span>
        </button>
      )}
    </div>
  );
} 