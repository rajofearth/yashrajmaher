import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    // Check if directory exists
    if (!existsSync(imagesDir)) {
      return NextResponse.json({ images: [] });
    }
    
    // Read directory contents
    const files = await readdir(imagesDir);
    
    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(ext);
    });
    
    // Format response
    const images = imageFiles.map(file => ({
      name: file,
      path: `/images/${file}`,
      url: `/images/${file}`
    }));
    
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 