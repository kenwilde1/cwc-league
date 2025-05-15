import { NextResponse } from 'next/server';
import { database } from '../../../../lib/firebase';
import { ref, get } from 'firebase/database';

export async function GET() {
  try {
    const fixturesRef = ref(database, 'fixtures');
    console.log('Fetching fixtures from Firebase:', fixturesRef);
    const snapshot = await get(fixturesRef);
    const fixtures = snapshot.val();
    return NextResponse.json({ fixtures }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}