import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import useMessages from "../hooks/useMessages";
import useReceiverInfo from "../hooks/useReceiverInfo";
import MessageList from "./MessageList";

const ChatArea = () => {
  const receiverId = useSelector((state) => state.chat.receiverId);
  const [message, setMessage] = useState("");
  const { senderId, username } = useAuth();
  const { messages, sendMessage } = useMessages(senderId, receiverId, username);
  const { receiverName, receiverLastName } = useReceiverInfo(receiverId);

  const messagesEndRef = useRef(null); // mesajlaşma listesinin sonuna kaydırmak için

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); //burada messagesEndRef adlı refe current ile ulaşıyoruz scrollIntoView ile bu refin yazıldığı dive ekranı kaydırıyor  behavior:smooth ile kaydırma işleminin animasyonlu olmasını sağlar burada yavaş bir şekilde kaydırılır
  };

  useEffect(() => {
    scrollToBottom(); //burada fonksiyon çalıştırılır
  }, [messages]); // Her seferinde mesajlar değiştiğinde, en alttaki mesaja gidilir.

  const handleSubmit = (e) => {
    e.preventDefault();

    if (senderId && receiverId) {
      sendMessage(message);
      setMessage("");
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
          <MessageList messages={messages} senderId={senderId} />
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
