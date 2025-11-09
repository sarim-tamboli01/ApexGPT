import React, { useContext, useState, useEffect } from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext";
import { useAuth } from "./AuthContext";
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
    setSidebarOpen,
  } = useContext(MyContext);
  const { getAuthHeaders, logout } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [isOpen,setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch(`${server}/api/chat`, options);
      if (response.status === 401) {
        logout();
        setLoading(false);
        return;
      }
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
        <div className="navbar-left">
          <button 
            className="menu-toggle-btn d-lg-none" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <span>
            ApexGpt <i className="fa-solid fa-chevron-down"></i>
          </span>
        </div>
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
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
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
