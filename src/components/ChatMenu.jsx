import React, { useState } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import { BiMessage } from "react-icons/bi";
import PersonList from "./PersonList";
import MessageList from "./MessageList";

const ChatMenu = () => {
  const [view, setView] = useState("message");

  const handleClick = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center border border-amber-500 p-3 space-x-20">
        <button onClick={() => handleClick("persons")}>
          <BsFillPersonFill className=" text-3xl fill-blue-500" />
        </button>
        <button onClick={() => handleClick("message")}>
          <BiMessage className="text-3xl fill-blue-500" />
        </button>
      </div>
      {view === "persons" ? <PersonList /> : <MessageList />}
    </div>
  );
};

export default ChatMenu;
