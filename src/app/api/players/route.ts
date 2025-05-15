import { NextResponse } from 'next/server';
import { database } from '../../../../lib/firebase';
import { ref, get } from 'firebase/database';

export async function GET() {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    let users = [] as any;
    
    if (snapshot.exists()) {
      const usersData = snapshot.val();
      
      // Convert the object to an array and hide emails
      users = Object.values(usersData).map((user: any) => ({
        id: user.id,
        name: user.name,
        registeredAt: user.registeredAt,
        isAdmin: user.isAdmin
      }));
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}