import React from 'react';

const MessageList = ({ messages, senderId }) => (
  <>
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex flex-col justify-center border border-gray-400 rounded-xl w-2/5  shadow-lg shadow-pink-200/50 overflow-auto ml-2 mr-2 shadow-md/50 ${
          message.sender === senderId ? 'ml-auto' : 'mr-auto'
        } mt-5 p-1`}
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
  </>
);

export default MessageList;
