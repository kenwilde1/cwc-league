// app/api/register/route.js
import { NextResponse } from 'next/server';
import { database } from '../../../../lib/firebase';
import { ref, set, get, push, child } from 'firebase/database';

export async function POST(request: any) {
  try {
    const { name, email } = await request.json();

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      const emailExists = Object.values(users).some(
        (user: any) => user.email === email
      );
      
      if (emailExists) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 400 }
        );
      }
    }

    // Add new user with auto-generated key
    const newUserRef = push(usersRef);
    const userId = newUserRef.key;
    
    const newUser = {
      id: userId,
      name,
      email,
      registeredAt: new Date().toISOString(),
    };

    await set(newUserRef, newUser);

    return NextResponse.json(
      { message: 'Registration successful', user: { id: userId, name, email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
