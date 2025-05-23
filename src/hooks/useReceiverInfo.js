import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const useReceiverInfo = (receiverId) => {
  const [receiverName, setReceiverName] = useState('');
  const [receiverLastName, setReceiverLastName] = useState('');

  useEffect(() => {
    if (!receiverId) return;
    const fetchInfo = async () => {
      const db = getFirestore(app);
      const receiverRef = doc(db, 'users', receiverId);
      const receiverDoc = await getDoc(receiverRef);
      if (receiverDoc.exists()) {
        setReceiverName(receiverDoc.data().firstName);
        setReceiverLastName(receiverDoc.data().lastName);
      }
    };
    fetchInfo();
  }, [receiverId]);

  return { receiverName, receiverLastName };
};

export default useReceiverInfo;
