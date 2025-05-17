'use client';
import Image from 'next/image';
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
  const [profilePicName, setProfilePicName] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profilePicInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch user
        const userPromise = get(ref(db, `users/${userId}`));
        // Fetch prediction blob
        const predictionPromise = fetch('/api/list_blobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, type: 'prediction' }),
        }).then(res => res.json());
        // Fetch profile picture blob
        const profilePicPromise = fetch('/api/list_blobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, type: 'profilePic' }),
        }).then(res => res.json());

        const [snapshot, data, dataPic] = await Promise.all([
          userPromise,
          predictionPromise,
          profilePicPromise,
        ]);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser(userData);
          setName(userData.name);
        }
        if (data) {
          const blobName = data.pathname.split(`${userId}/`)[1];
          setBlobName(blobName);
        }
        if (dataPic) {
          const picName = dataPic.pathname.split(`${userId}/`)[1];
          setProfilePicName(picName);
          setProfilePicUrl(dataPic.url);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllData();
    }
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

  const handleFileUpload = async (type: 'prediction' | 'profilePic' = 'prediction') => {
    let file: File | null = null;
    if (type === 'prediction' && fileInputRef.current?.files?.length && userId) {
      file = fileInputRef.current.files[0];
    } else if (type === 'profilePic' && profilePicInputRef.current?.files?.length && userId) {
      file = profilePicInputRef.current.files[0];
    }
    if (file && userId) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId.toString());
      formData.append('type', type);
      try {
        const res = await fetch('/api/list_blobs', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (type === 'prediction') {
            setBlobName(file.name);
          } else {
            setProfilePicName(file.name);
          }
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
      await handleFileUpload('prediction');
    }
    if (profilePicInputRef.current?.files?.length) {
      await handleFileUpload('profilePic');
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

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

        <div className="mb-6">
          <label className="block text-lg mb-2">Profile Picture</label>
          {profilePicName ? (
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={profilePicUrl}
                alt="Club World Cup Predictor Logo"
                width={60}
                height={60}
                className="w-16 h-16 rounded-full object-cover border border-zinc-700"
              />
              {/* <img
                src={`https://${process.env.NEXT_PUBLIC_BLOB_HOST || 'blob.vercel-storage.com'}/${userId}/${profilePicName}`}
                alt="Profile Picture"
                className="w-16 h-16 rounded-full object-cover border border-zinc-700"
              /> */}
              <span className="text-sm text-gray-400">{profilePicName}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-2">No profile picture uploaded yet.</p>
          )}
          <input
            type="file"
            accept="image/*"
            ref={profilePicInputRef}
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
