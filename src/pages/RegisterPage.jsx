import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle, signInWithFacebook } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signUpWithEmail(email, password);
      const user = userCredential.user;

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // Also sync with backend MongoDB
      let propertyId = localStorage.getItem('propertyId');
      if (!propertyId) {
        propertyId = import.meta.env.VITE_EIGHTFOLD_PROPERTY_ID;
      }
      if (!propertyId || propertyId.length !== 24) {
        throw new Error('Missing or invalid property ID. Please reload the page or contact support.');
      }
      const mongoPayload = {
        userUid: user.uid,
        email: user.email,
        propertyId,
        profile: {
          identity: {
            fullName: '',
            title: '',
            dob: '',
            nationality: '',
            placeOfBirth: '',
          },
          contact: {
            phone: '',
            address: '',
            countryCode: '',
          },
          business: {
            businessEmail: '',
            businessPhone: '',
            billingAddress: '',
            businessAddress: '',
            countryCode: '',
          }
        }
      };

      const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL;
      const response = await fetch(`${apiBaseUrl}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mongoPayload),
      });

      const resultData = await response.json();
      console.log('[Email Register Sync] MongoDB response:', resultData);

      console.log('Registered successfully, navigating...');
      setTimeout(() => {
        navigate('/login');
      }, 0);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="hidden md:block bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-pool.jpg')" }}
        />
        <div className="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8 bg-white h-[100dvh] overflow-hidden">
          <div className="max-w-md w-full space-y-6 flex flex-col justify-center min-h-full">
            <div className="flex justify-center">
              <img src="/Logo.png" alt="Hotel Logo" className="h-20 mb-2 mt-2 md:mt-[-80px]" />
            </div>
            <h2 className="text-2xl font-light text-light text-gray-900 text-left">Create your free account</h2>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full mb-4 p-2 border border-gray-300 rounded pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              onClick={handleRegister}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mb-3"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up with Email'}
            </button>

            <div className="flex items-center my-3">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-sm text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={async () => {
                try {
                  const result = await signInWithGoogle({ prompt: 'select_account' });
                  if (result?.user) {
                    const user = result.user;
                    let propertyId = localStorage.getItem('propertyId');
                    if (!propertyId) {
                      propertyId = import.meta.env.VITE_EIGHTFOLD_PROPERTY_ID;
                    }

                    if (!propertyId || propertyId.length !== 24) {
                      throw new Error('Missing or invalid property ID. Please reload the page or contact support.');
                    }

                    const mongoPayload = {
                      userUid: user.uid,
                      email: user.email,
                      propertyId,
                      profile: {
                        identity: {
                          fullName: user.displayName || '',
                          title: '',
                          dob: '',
                          nationality: '',
                          placeOfBirth: '',
                        },
                        contact: {
                          phone: user.phoneNumber || '',
                          address: '',
                          countryCode: '',
                        },
                        business: {
                          businessEmail: '',
                          businessPhone: '',
                          billingAddress: '',
                          businessAddress: '',
                          countryCode: '',
                        }
                      }
                    };

                    const apiBaseUrl = import.meta.env.VITE_ADMIN_API_URL;
                    const response = await fetch(`${apiBaseUrl}/api/user/register`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(mongoPayload),
                    });

                    const resultData = await response.json();
                    console.log('[Google Register Sync] MongoDB response:', resultData);

                    navigate('/login');
                  }
                } catch (err) {
                  console.error('[Register Error]', err.message);
                  setError(err.message);
                }
              }}
              className="w-full border border-gray-300 text-gray-800 py-3 rounded-[3rem] hover:bg-gray-100 transition flex items-center justify-center gap-4"
            >
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="h-5 w-5 bg-white rounded-full" />
              Continue with Google
            </button>

            {/*<button
              onClick={async () => {
                try {
                  const result = await signInWithFacebook();
                  if (result?.user) {
                    navigate('/login');
                  }
                } catch (err) {
                  console.error(err.message);
                  setError(err.message);
                }
              }}
              className="w-full border border-gray-300 text-gray-800 py-3 rounded-[3rem] hover:bg-gray-100 transition flex items-center justify-center gap-4"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="h-6 w-6 rounded-full shadow-md" />
              Continue with Facebook
            </button>
            */}

            <div className="text-center text-sm text-gray-600 mt-6">
              Already a member?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Log in
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}