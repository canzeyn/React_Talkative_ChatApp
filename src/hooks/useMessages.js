import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const useMessages = (senderId, receiverId, username) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!senderId || !receiverId) return;
    const db = getFirestore(app);
    const messagesCollection = collection(db, 'chats');
    const conversationId = [senderId, receiverId].sort().join('-');
    const messagesQuery = query(
      messagesCollection,
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => doc.data());
      setMessages(messagesData);
    });
    return () => unsubscribe();
  }, [senderId, receiverId]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const db = getFirestore(app);
    const messagesCollection = collection(db, 'chats');
    const conversationId = [senderId, receiverId].sort().join('-');
    const message = {
      text,
      sender: senderId,
      senderName: username,
      receiver: receiverId,
      conversationId,
      timestamp: Date.now(),
    };
    await addDoc(messagesCollection, message);
  };

  return { messages, sendMessage };
};

export default useMessages;
