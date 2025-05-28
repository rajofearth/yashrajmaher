import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get file as buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, '-').toLowerCase();
    
    // Generate unique filename with timestamp to prevent overwrites
    const timestamp = Date.now();
    const uniqueFilename = `${path.parse(filename).name}-${timestamp}${path.parse(filename).ext}`;
    
    // Make sure the directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write the file
    const filePath = path.join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Return the path relative to public folder
    return NextResponse.json({ 
      success: true, 
      path: `/public/images/${uniqueFilename}`,
      url: `/images/${uniqueFilename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 