import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Legal assistant. Ask me anything...", sender: "assistant" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user"
    };
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate assistant thinking
    setIsTyping(true);
    
    // Send POST request to FastAPI backend
    try {
      const response = await fetch('http://127.0.0.1:8080/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      const data = await response.json();
      const assistantResponse = {
        id: messages.length + 2,
        text: data.answer || "Sorry, I couldn't get an answer.",
        sender: "assistant"
      };
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
    } catch (error) {
      console.error('Error fetching data:', error);
      const assistantResponse = {
        id: messages.length + 2,
        text: "There was an error. Please try again later.",
        sender: "assistant"
      };
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Create a new chat session
  const handleNewChat = () => {
    setMessages([
      { id: 1, text: "Hello! I'm your Legal assistant. Ask me anything...", sender: "assistant" }
    ]);
    inputRef.current.focus();
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>AI Assistant</h1>
          <button className="new-chat-button" onClick={handleNewChat}>
            New Chat
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="chat-content">
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-row ${message.sender}`}
            >
              <div className="message-container">
                <div className="message-content">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message-row assistant">
              <div className="message-container">
                <div className="message-content typing">
                  <span className="typing-bubble"></span>
                  <span className="typing-bubble"></span>
                  <span className="typing-bubble"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Input area */}
      <footer className="input-area">
        <div className="input-container">
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Message AI Assistant..."
              className="message-input"
            />
            <button 
              type="submit" 
              className={`send-button ${inputValue.trim() ? 'active' : ''}`} 
              disabled={!inputValue.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;
