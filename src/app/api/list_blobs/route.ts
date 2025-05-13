import { list, put } from '@vercel/blob';

export async function POST(request: Request): Promise<Response> {
  const contentType = request.headers.get('Content-Type') || '';

  if (contentType.startsWith('multipart/form-data')) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return new Response('Missing file or userId', { status: 400 });
    }

    const blobPath = `${userId}/${file.name}`;
    await put(blobPath, file, { contentType: file.type, access: 'public' });

    return new Response(JSON.stringify({ message: 'File uploaded successfully', blobPath }), { status: 200 });
  }

  const { userId } = await request.json();
  const { blobs } = await list({ prefix: userId });

  if (blobs.length === 0) {
    return Response.json(null);
  }

  const latestBlob = blobs.reduce((latest, current) => {
    return new Date(current.uploadedAt) > new Date(latest.uploadedAt) ? current : latest;
  });

  return Response.json(latestBlob);
}