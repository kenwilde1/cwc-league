'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      // Redirect after successful registration
      setTimeout(() => {
        router.push('/registration-success');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/main.png"
          alt="Club World Cup Predictor Logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register for Club World Cup 2025 Predictor</h1>

        {success ? (
          <div className="bg-green-800 text-white p-4 rounded-md mb-4">
            Registration successful! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg">
            {error && (
              <div className="bg-red-800 text-white p-4 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <a href="/" className="text-yellow-500 hover:text-yellow-400">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
