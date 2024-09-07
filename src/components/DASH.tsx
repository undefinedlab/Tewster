import React, { useState, useEffect } from 'react';
import './styles.scss';
import Sidebar from './Sidebar';  
import Chat from './Chat';       
import MainContainer from './MainContainer';  
import DetailsContainer from './DetailsContainer';
import Header from './Header';  

interface Video {
  id: string;
  title: string;
   url: string;
}

const Main: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('discover');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null); 
  const [showDetails, setShowDetails] = useState<boolean>(false); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 

  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        if (window.innerWidth > 1090) {
          sidebar.classList.remove('collapse');
        } else {
          sidebar.classList.add('collapse');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();  

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (video: Video) => {
    setSelectedVideo(video);
    setShowDetails(true); 
  };

  const handleBackToMain = () => {
    setShowDetails(false); 
  };

  const handleDiscoverClick = () => {
    setShowDetails(false);
    setActiveSection('discover');
  };

  const handleLogoClick = () => {
    setShowDetails(false); 
    setActiveSection('discover');
  };

  const handleLoginClick = () => {
    console.log('Login button clicked');
    setIsLoggedIn(true);
  };

  return (
    <div className="container">
      <Sidebar activeSection={activeSection} setActiveSection={handleDiscoverClick} />
      <div className="wrapper">
        <Header 
          onLogoClick={handleLogoClick} 
          isLoggedIn={isLoggedIn} 
          onLoginClick={handleLoginClick} 
        />
        {!showDetails ? (
          <MainContainer selectedVideo={selectedVideo} setSelectedVideo={handleCardClick} />
        ) : (
          <DetailsContainer selectedVideo={selectedVideo} onBack={handleBackToMain} />
        )}
      </div>
    </div>
  );
};

export default Main;
