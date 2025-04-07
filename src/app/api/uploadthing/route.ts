import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
 
  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }
 
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }
 
    // Generate a unique filename with original extension
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueFilename = `${filename}-${Date.now()}.${fileExtension}`;
 
    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: 'public',
    });
 
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
