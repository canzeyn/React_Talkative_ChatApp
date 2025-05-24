import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const useAuth = () => {
  const [senderId, setSenderId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setSenderId(user.uid);
        const db = getFirestore(app);
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().firstName);
        }
      } else {
        setSenderId(null);
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { senderId, username };
};

export default useAuth;
