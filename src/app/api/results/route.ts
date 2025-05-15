import { NextResponse } from 'next/server';
import { database } from '../../../../lib/firebase';
import { ref, get, set } from 'firebase/database';

export async function GET() {
  try {
    const resultsRef = ref(database, 'results');
    const snapshot = await get(resultsRef);
    const results = snapshot.val();
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      if (!body.results || !Array.isArray(body.results)) {
        return NextResponse.json(
          { message: 'Invalid results data' },
          { status: 400 }
        );
      }
  
      const resultsRef = ref(database, 'results');
      await set(resultsRef, body.results);
  
      return NextResponse.json({ message: 'Results updated successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error updating results:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    }
  }