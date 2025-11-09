import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores of all chats
  const [newChat, setNewChat] = useState(true); //stores of new chats
  const [allThreads, setAllThreads] = useState([]); //stores of all threads
  const [sidebarOpen, setSidebarOpen] = useState(false); //for mobile sidebar toggle
  const [showSignup, setShowSignup] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    sidebarOpen,
    setSidebarOpen,
  }; //passing down value

  if (loading) {
    return (
      <div className="app">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#ececec" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        {showSignup ? (
          <Signup onSwitchToLogin={() => setShowSignup(false)} />
        ) : (
          <Login onSwitchToSignup={() => setShowSignup(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
