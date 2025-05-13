import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getDatabase, ref, set } from 'firebase/database';
import { database as db } from '../../../../lib/firebase'; // Ensure your firebase app is exported from here

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  if (!file || !file.name.endsWith('.xlsx') || !userId) {
    return NextResponse.json({ error: 'File (.xlsx) and userId are required' }, { status: 400 });
  }

  const filename = `${userId}-${file.name}`;

  try {
    const blob = await put(filename, file.stream(), {
      access: 'public',
    });

    // Save to Firebase
    await set(ref(db, `users/${userId}/file`), {
      name: file.name,
      url: blob.url,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}