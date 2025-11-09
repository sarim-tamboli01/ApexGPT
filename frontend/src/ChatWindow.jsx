import React, { useContext, useState, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext";
import { RingLoader } from "react-spinners";
import server from "./config";



function ChatWindow() {
  const {
    prompt,
    reply,
    setPrompt,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
  } = useContext(MyContext);
  
  const [loading, setLoading] = useState(false);
  const [isOpen,setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch(`${server}/api/chat`, options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //new chats to prevchat
  useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);
    const handelProfileClick = () =>{
      setIsOpen(!isOpen);
    }

  return (
    <div className="chatwindow">
      <div className="navbar">
        <span>
          ApexGpt <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handelProfileClick}>
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
                 {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
      <Chat></Chat>
      <RingLoader color="white" loading={loading}></RingLoader>
      <div className="chatInput">
        <div className="inputbox">
          <input
            type="text"
            placeholder="ask any thing..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ApexGPT can mistakes. Check important info. See Cookie Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
