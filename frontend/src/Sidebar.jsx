import React, { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
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
  } = useContext(MyContext);
  const getAllThreads = async () => {
    try {
      const response = await fetch(`${server}/api/thread`);
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
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(
        `${server}/api/thread/${newThreadId}`
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
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
        }
      );
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
    <section className="sidebar">
      {/* {new chat button} */}
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="background" className="logo" />
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>
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
      </div>
    </section>
  );
}
export default Sidebar;
