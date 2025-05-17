import { NextResponse } from 'next/server';


export async function GET() {
  try {
    return NextResponse.json({ users: [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}