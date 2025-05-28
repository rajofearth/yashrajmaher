'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Eye, EyeOff, ChevronsUpDown, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function InlineEditableMarkdown({
  value = '',
  onChange,
  className = ''
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [mode, setMode] = useState('edit'); // 'edit', 'preview', 'split'
  const [fullscreen, setFullscreen] = useState(false);
  
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  useEffect(() => {
    // Handle escape key to exit fullscreen
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreen]);
  
  // Apply fullscreen class to body
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullscreen]);
  
  const handleChange = (e) => {
    setCurrentValue(e.target.value);
    onChange(e.target.value);
  };
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  const MarkdownPreview = () => (
    <div className="prose dark:prose-invert max-w-none p-4 overflow-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {currentValue || '*No content. Start typing in the editor.*'}
      </ReactMarkdown>
    </div>
  );
  
  const containerClasses = `${className} ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`;
  
  return (
    <div className={containerClasses}>
      <div className={`flex flex-col h-full ${fullscreen ? 'h-screen' : ''}`}>
        <div className="flex items-center justify-between border-b p-2">
          <Tabs 
            value={mode} 
            onValueChange={setMode} 
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-1.5">
                <ChevronsUpDown className="h-4 w-4" />
                <span>Split</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFullscreen}
            className="text-muted-foreground"
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className={`flex-1 ${mode === 'split' ? 'grid grid-cols-2 divide-x' : 'block'}`}>
          {/* Edit Mode */}
          {(mode === 'edit' || mode === 'split') && (
            <div className={`h-full ${mode === 'split' ? '' : (mode !== 'edit' ? 'hidden' : '')}`}>
              <textarea
                value={currentValue}
                onChange={handleChange}
                className="w-full h-full min-h-[400px] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-0 border-none"
                placeholder="Type markdown here..."
              />
            </div>
          )}
          
          {/* Preview Mode */}
          {(mode === 'preview' || mode === 'split') && (
            <div className={`h-full overflow-auto ${mode === 'split' ? '' : (mode !== 'preview' ? 'hidden' : '')}`}>
              <MarkdownPreview />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 