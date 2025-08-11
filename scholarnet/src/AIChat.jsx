import React from 'react';
import './AIChat.css';

const AIChat = () => {
  return (
    <div className="aichat-container">
      <h1 className="aichat-title">AI Chat</h1>
      <div className="aichat-iframe-container">
        <iframe
          src="https://app-aichat-vipul.streamlit.app/?embed=true"
          title="AI Chat"
          className="aichat-iframe"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default AIChat;
