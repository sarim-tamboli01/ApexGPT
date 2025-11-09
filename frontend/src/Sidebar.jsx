import React, { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { useAuth } from "./AuthContext";
import { v1 as uuidv1 } from "uuid";
import server from "./config";

import "./Sidebar.css";
function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    sidebarOpen,
    setSidebarOpen,
  } = useContext(MyContext);
  const { getAuthHeaders, logout, user } = useAuth();

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${server}/api/thread`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 401) {
        logout();
        return;
      }
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filteredData);
      setAllThreads(filteredData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `${server}/api/thread/${newThreadId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        logout();
        return;
      }
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setSidebarOpen(false); // Close sidebar on mobile after selecting thread
    } catch (err) {
      console.log(err);
    }
  };
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${server}/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (response.status === 401) {
        logout();
        return;
      }
      const res = await response.json();
      console.log(res);
      //updated threaed-re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* {new chat button} */}
      <div className="sidebar-header">
        <button onClick={createNewChat} className="new-chat-btn">
          <img src="src/assets/blacklogo.png" alt="background" className="logo" />
          <span>
            {" "}
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
        <button 
          className="close-sidebar-btn d-lg-none" 
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
      {/* {history} */}
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)}
          className={thread.threadId === currThreadId ? "highlight" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>
      {/* {sign} */}
      <div className="sign">
        <p>By ApexGPT</p>
        {user && (
          <div className="user-info">
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "#339cff" }}>
              {user.name}
            </p>
            <button 
              onClick={logout} 
              className="logout-btn"
              style={{
                marginTop: "0.5rem",
                padding: "6px 12px",
                fontSize: "0.75rem",
                background: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "4px",
                color: "#b4b4b4",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
export default Sidebar;
