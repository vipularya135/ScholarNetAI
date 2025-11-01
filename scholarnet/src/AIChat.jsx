import React from 'react';
import './AIChat.css';

const AIChat = () => {
  return (
    <div className="aichat-container">
      <h1 className="aichat-title">AI Chat</h1>
      <div className="aichat-help-message" style={{marginTop: '1.5rem', textAlign: 'center', color: '#d73c0dff', fontSize: '1rem', padding: '1rem'}}>
        If the chat doesn't work, please contact <a href="mailto:krishnamvipul@gmail.com" style={{color: '#2563eb', textDecoration: 'underline'}}>krishnamvipul@gmail.com</a>
      </div>
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
