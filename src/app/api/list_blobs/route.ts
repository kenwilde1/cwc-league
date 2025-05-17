import { list, put } from '@vercel/blob';

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.startsWith('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const type = (formData.get('type') as string) || 'prediction';

    if (!file || !userId) {
      return new Response('Missing file or userId', { status: 400 });
    }

    // Use type as the filename (e.g., profilePic.png or prediction.xlsx)
    const ext = file.name.split('.').pop();
    const blobPath = `${userId}/${type}.${ext}`;
    await put(blobPath, file, { contentType: file.type, access: 'public' });

    return new Response(JSON.stringify({ message: 'File uploaded successfully', blobPath }), { status: 200 });
  }

  const { userId, type } = await request.json();
  const { blobs } = await list({ prefix: userId });

  if (blobs.length === 0) {
    return Response.json(null);
  }

  // If type is specified, filter blobs by type
  let filteredBlobs = blobs;
  if (type) {
    filteredBlobs = blobs.filter(blob => blob.pathname.includes(`${userId}/${type}.`));
  }

  if (filteredBlobs.length === 0) {
    return Response.json(null);
  }

  const latestBlob = filteredBlobs.reduce((latest, current) => {
    return new Date(current.uploadedAt) > new Date(latest.uploadedAt) ? current : latest;
  });

  return Response.json(latestBlob);
}