import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase'; // Make sure you have Firestore initialized

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.uid && db && doc && getDoc) {
          const identityDocRef = doc(db, 'users', user.uid, 'profile', 'identity');
          const contactDocRef = doc(db, 'users', user.uid, 'profile', 'contact');

          const [identitySnap, contactSnap] = await Promise.all([
            getDoc(identityDocRef),
            getDoc(contactDocRef)
          ]);

          const identityData = identitySnap.exists() ? identitySnap.data() : {};
          const contactData = contactSnap.exists() ? contactSnap.data() : {};

          setProfile({
            ...identityData,
            ...contactData
          });
        }
      } catch (error) {
        console.error('❌ Failed to fetch profile from Firestore:', error);
      }
    };
    fetchProfile();
  }, [user?.uid]);

  return {
    name: profile?.fullName || user?.displayName || 'Guest',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || user?.phoneNumber || '',
    title: profile?.title || '',
    dob: profile?.dob || '',
    uid: user?.uid || null,
  };
};