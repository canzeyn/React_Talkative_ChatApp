import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useRef } from "react";

const ChatArea = () => {
  const receiverId = useSelector((state) => state.chat.receiverId);
  const [message, setMessage] = useState(""); 
  const [senderId, setSenderId] = useState(null); // Burada kullanıcı id'yi saklıyoruz
  const [receiverName, setReceiverName] = useState("");
  const [receiverLastName, setReceiverLastName] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null); //

  console.log("receiverName  :" + receiverName);

  const auth = getAuth(app); //burada app ile firebaseconfig içinden gelen uygulamayı kullanyoruz

  useEffect(() => {
    const auth = getAuth(app);
    // Bu useEffect, bileşen monte edildiğinde çalışır ve auth durumunda bir değişiklik olduğunda geri çağrılır
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Kullanıcı giriş yapmış, kullanıcı id'yi al ve state'i güncelle
        setSenderId(user.uid);
        console.log("User is logged in, setting senderId:", user.uid);
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid); //burada uysers adlı collection içinden giriş yapan kullanıcının id si referans alınır ve eğer içindeki kullanıcıya ait bilgiler iel işlem yapılmak istenirse referans alınır atandığı değişken
        const userDoc = await getDoc(userRef); //burada getDoc ile referans edilen bilgiler getirilir burada giriş yapan kullanıcının users collection içindeki tüm bilgileri getirilir ve değişkene atanır
        setUsername(userDoc.data().firstName); //burada giriş yapan kullanıcının ismi username adlı state içinde atılır bu sayede istene yerde kullanılır
      } else {
        // Kullanıcı çıkış yapmış ya da hiç giriş yapmamış
        setSenderId(null);
        console.log("User is not logged in or logged out");
        setUsername(null); // kullanıcı çıktığında username'i null olarak ayarla
      }
    });
  }, []); // Boş bir dizi dependency olarak verilmiştir, bu sayede useEffect sadece bir kere çalışır (mount olduğunda)

  useEffect(() => {
    const db = getFirestore(app); //veri tabanına erişim sağlanır
    const messagesCollection = collection(db, "chats"); //collection bulunur

    const conversationId = [senderId, receiverId].sort().join("-");

    // senderId veya receiverId'nin tıklanan kullanıcıyla aynı olduğu tüm mesajları getir
    const messagesQuery = query(
      messagesCollection,
      where("conversationId", "==", conversationId), //burada mesajların görüntülenmesi için tıklanan kişyle olan id ile veri tabanındaki idlerin eşit olanları getiriyor
      orderBy("timestamp", "asc") //burada gelen mesajları zamana göre sıralıyoruz azalan biçimde bu sayede atılan en yeni mesaj en alt kısımda görünüyor
    );

    // Realtime listener, mesajların anlık durumunu dinle
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      //burada onSnaphot fonksiyonuyla yaptığımız sorgu  sonucu değiştiğinde tetiklenir sorgu yapılan collection içinde bir değişiklik olursa tetiklenir
      const messagesData = snapshot.docs.map((doc) => doc.data()); // burada da sorgu yapılan collection içindeki tüm veriler bir değikene atılıyor
      setMessages(messagesData);
    }); // Component unmount olduğunda listener'ı temizle
    return () => {
      unsubscribe();
    };
  }, [senderId, receiverId]); // senderId veya receiverId değiştiğinde, useEffect'i tekrar çalıştır

  const addMessage = async (messageText, senderId, receiverId) => {
    const db = getFirestore(app);
    const messagesCollection = collection(db, "chats"); //chats adındaki collection bir değişkene atanır

    const conversationId = [senderId, receiverId].sort().join("-"); //burada mesaj atan ve mesaj alan kişinin id bilgileri birleştirilerek bir değişkene atılıyor bu sayede artık mesajlaşan her iki kişinin mesajlarına ait bir id oluyor
    //sort kullanılmış çünkü her seferinde id sıralaması aynı olması için yoksa hata olması durumunda değişken sıralaması tam tersi olursa id değeri farklı olur ve başka mesajlaşmayı veya olmayan bir mesajlaşma id sini gösterir
    //joın ile iki dizi birşeltirilir yani mesajı atan ile alan kişilerin adisi arasına - koyularak birleştirilir ve bir değişkene atanır
    const message = {
      text: messageText, // atılan mesaj
      sender: senderId, //mesajı gönderen
      senderName: username, // Mesajı atan kişinin ismi
      receiver: receiverId, //mesajı alan
      conversationId: conversationId, //konuşmayı temsil eden id
      timestamp: Date.now(), //zaman fonksiyonu
    };

    try {
      const docRef = await addDoc(messagesCollection, message); //burada mesaj göndere tıklanınca state içinde tutulan değer veri tabanına gönderilir
      console.log("Document written with ID: ", docRef.id); //burada doc.ref ile her mesajın firestore collection içindeki id si
      setMessage(""); // Mesaj başarıyla gönderildikten sonra textarea'yı temizlenir
    } catch (e) {
      console.error("Error adding document: ", e); //hata olursa hata yazdırır
    }
  };

  useEffect(() => {
    if (receiverId) {
      const receiverData = async () => {
        const db = getFirestore(app);
        const receiverRef = doc(db, "users", receiverId); //mesajın gönderileceği kişinin id değeri ile adını getiriyoruz
        const receiverDoc = await getDoc(receiverRef);

        if (receiverDoc.exists()) { 
          setReceiverName(receiverDoc.data().firstName);
          setReceiverLastName(receiverDoc.data().lastName);
        } else {
          console.log("gönderilecek isim yok");
        }
      };
      receiverData();
    }
  }, [receiverId]);

  const messagesEndRef = useRef(null); // Bu ref ile mesajlaşma yerinin en alt kısmına bir ref eklenecek ve her mesaj atıldığında en alttaki mesaja gidicek yani bu refin oraya kaydırılacak site

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); //burada messagesEndRef adlı refe current ile ulaşıyoruz scrollIntoView ile bu refin yazıldığı dive ekranı kaydırıyor  behavior:smooth ile kaydırma işleminin animasyonlu olmasını sağlar burada yavaş bir şekilde kaydırılır
  };

  useEffect(() => {
    scrollToBottom(); //burada fonksiyon çalıştırılır
  }, [messages]); // Her seferinde mesajlar değiştiğinde, en alttaki mesaja gidilir.

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("handleSubmit is called");

    if (senderId && receiverId) {
      //eğer alıcı ve gönderici id değerleri varsa çalışır
      addMessage(message, senderId, receiverId, username);
      console.log("senderId : " + senderId + " receiverId :" + receiverId);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col justify-between border border-gray-200 h-screen  rounded-md" >
        <div className="sticky top-0 z-50 flex justify-center p-2 border-b-2 border-red-500">
          <p className="text-3xl uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-900 font-bold">
            {receiverName + " " + receiverLastName}
          </p>
        </div>
        <div className="flex-grow overflow-auto"  >
          {/* burada konuşma listelenecek */}
          {messages.map((message, index) => (
            <div
              className={`flex flex-col justify-center border border-gray-400 rounded-xl w-2/5  shadow-lg shadow-pink-200/50 overflow-auto ml-2 mr-2 shadow-md/50 ${
                message.sender === senderId ? "ml-auto" : "mr-auto"
              } mt-5 p-1`}
              key={index}
            >
              <p className="text-red-500 underline underline-offset-1 text-2xl m-1 font-semibold">
                {message.senderName}:
              </p>
              <p className="text-lg font-semibold m-1 indent-2 ">{message.text}</p>
              <p className="text-sm m-1">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="flex flex-row justify-evenly m-2"
          onSubmit={handleSubmit}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-messageInputXs sm:w-messageInputSm 2sm:w-messageInput2sm md:w-messageInputMd lg:w-messageInputLg xl:w-messageInputXl border border-gray-400  resize-none  h-16 px-5 py-3 placeholder-gray-500 text-gray-900 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm"
            placeholder="mesaj yaz..."
          />
          <button
            type="submit"
            className="text-4xl hover:bg-amber-200 rounded-3xl p-2  "
          >
            <AiOutlineSend />
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default ChatArea;
