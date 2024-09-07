import React, { useState, useEffect } from 'react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const words = ['Follow', 'Support', 'Collect', 'Meet', 'Learn', 'Connect', 'Grow', 'Trade'];
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = words.indexOf(prevWord);
        return words[(currentIndex + 1) % words.length];
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="login-container">
      <div className="login_lft">
        <div className="login-title">
          <span className="animated-word">{currentWord}</span>
          <span style={{ fontSize: '40px' }}>Athletes</span>
        </div>
      </div>

      <div className="login_divider"></div>

      <div className="login_rgt">
        <button onClick={onLogin} className="login-button">Start</button>
      </div>
    </div>
  );
};

export default Login;