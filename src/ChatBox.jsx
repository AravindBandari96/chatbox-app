import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [conversationStep, setConversationStep] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  /*---For loading dots---*/
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:5000/messages'; 

  
  const handleSendMessage = (message) => {
    const newMessage = {
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);

    /*---Storing the Messages in the JSON server---*/
    axios
      .post(API_URL, newMessage)
      .then(() => {
        handleConversationStep(message);
      })
      .catch((error) => {
        console.error('Error posting message:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /*---Conversation flow of Chat---*/
  const handleConversationStep = (message) => {
    if (conversationStep === 0) {
      const systemMessage = {
        sender: 'system',
        message: 'Are you preparing for JEE or Mains?',
        timestamp: new Date().toISOString(),
      };
      postSystemMessage(systemMessage);
      setConversationStep(1);
    } else if (conversationStep === 1) {
      const systemMessage = {
        sender: 'system',
        message: 'Which subject are you interested in?',
        timestamp: new Date().toISOString(),
      };
      postSystemMessage(systemMessage);
      setConversationStep(2);
    } else if (conversationStep === 2) {
      const systemMessage = {
        sender: 'system',
        message: 'Thank you for the information! Good luck with your studies!',
        timestamp: new Date().toISOString(),
      };
      postSystemMessage(systemMessage);
      setConversationStep(3);
    }
  };


  const postSystemMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    axios.post(API_URL, message).catch((error) => {
      console.error('Error posting system message:', error);
    });
  };

  /*---Initial Start of Chat---*/
  useEffect(() => {
    if (isChatOpen) {
      const welcomeMessage = {
        sender: 'system',
        message: 'Hi, Which class are you studying?',
        timestamp: new Date().toISOString(),
      };
      postSystemMessage(welcomeMessage);
      setConversationStep(0);
    }
  }, [isChatOpen]);

  return (
    <div className="chat-container">
      {!isChatOpen && (
        <button
          className="chat-button"
          onClick={() => setIsChatOpen(true)}
        >
          Start Chat
        </button>
      )}

      {isChatOpen && (
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <strong>{msg.sender}:</strong> {msg.message}
                <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
            {isLoading && <div className="loading-indicator">...</div>}
          </div>

          {conversationStep === 0 && (
            <div className="options">
              <button onClick={() => handleSendMessage('fifth')}>Fifth</button>
              <button onClick={() => handleSendMessage('sixth')}>Sixth</button>
              <button onClick={() => handleSendMessage('seventh')}>Seventh</button>
              <button onClick={() => handleSendMessage('eighth')}>Eighth</button>
              <button onClick={() => handleSendMessage('ninth')}>Ninth</button>
              <button onClick={() => handleSendMessage('tenth')}>Tenth</button>
            </div>
          )}

          {conversationStep === 1 && (
            <div className="options">
              <button onClick={() => handleSendMessage('JEE')}>JEE</button>
              <button onClick={() => handleSendMessage('Mains')}>Mains</button>
            </div>
          )}

          {conversationStep === 2 && (
            <div className="options">
              <button onClick={() => handleSendMessage('Physics')}>Physics</button>
              <button onClick={() => handleSendMessage('Chemistry')}>Chemistry</button>
              <button onClick={() => handleSendMessage('Maths')}>Maths</button>
            </div>
          )}

          {conversationStep === 3 && (
            <div className="options">
              <button onClick={() => setIsChatOpen(false)}>Close Chat</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;








