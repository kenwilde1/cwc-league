'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ref, get, set } from 'firebase/database';
import { database as db } from '../../../../lib/firebase'; // Ensure your firebase app is exported from here
import { CheckCircleIcon } from '@heroicons/react/24/solid'; // Importing a green tick icon from Heroicons
import Link from 'next/link';

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<{ name: string }>();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false); // State to track success animation
  const [blobName, setBlobName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const snapshot = await get(ref(db, `users/${userId}`));
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser(userData);
          setName(userData.name);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser()
    };

    const fetchBlobs = async () => {
      try {
        const res = await fetch('/api/list_blobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        console.log('Response:', data);
        if (data) {
          const blobName = data.pathname.split(`${userId}/`)[1];
          console.log('Blob name:', blobName);
          setBlobName(blobName); // Assuming you want to set the first blob name
        }
        console.log('Fetched blobs:', data);
      } catch (err) {
        console.error('Error fetching blobs:', err);
      }
    }

    fetchBlobs();
  }, [userId, db]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameSave = async () => {
    try {
      await set(ref(db, `users/${userId}`), { name });
      setSuccess(true); // Show success animation
      setTimeout(() => setSuccess(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error('Error saving name:', err);
    }
  };

  const handleFileUpload = async () => {
    if (fileInputRef.current?.files?.length && userId) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId.toString());

      try {
        const res = await fetch('/api/list_blobs', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          console.log('File uploaded:', data);
          setBlobName(file.name); // Update the displayed blob name
        } else {
          console.error('Error uploading file:', await res.text());
        }
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  const handleSave = async () => {
    if (name !== user?.name) {
      await handleNameSave();
    }

    if (fileInputRef.current?.files?.length) {
      await handleFileUpload();
    }

    setSuccess(true); // Show success animation
    setTimeout(() => setSuccess(false), 2000); // Hide after 2 seconds
  }

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  console.log(blobName);

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-semibold mb-4">
          Edit Profile
        </h1>

        <div className="mb-6">
          <label className="block text-lg mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-2">Prediction</label>
          {blobName ? (
            <p className="text-sm text-gray-400 mb-2">Current file: {blobName}</p>
          ) : (
            <p className="text-sm text-gray-400 mb-2">No prediction uploaded yet.</p>
          )}
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none mb-2"
          />
        </div>

        <button
            onClick={handleSave}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-xl"
          >
            Save
          </button>
        {success && (
            <span className="flex items-center mt-2 text-green-500">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>Saved successfully!</span>
            </span>
          )}
      </div>

      <div className="mt-6 text-center">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400">
            ← Back to Home
          </Link>
        </div>
    </main>
  );
};
