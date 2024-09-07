import React, { useState, useEffect } from 'react';
import './styles.scss';
import Sidebar from './Sidebar';  
import MainContainer from './MainContainer';  
import DetailsContainer from './DetailsContainer';
import Header from './Header';  
import FanClubFactoryABI from './FanClubFactoryABI.json';
import Marketplace from './Marketplace';
import Trending from './Trending';
import { useUser } from '../UserContext';
import { ethers } from 'ethers';

interface FanClubInfo {
  clubAddress: string;
  name: string;
  ticker: string;
  sport: string;
  team: string;
  price: bigint;
  maxSupply: bigint;
  passesSold: bigint;
  owner: string;
  imageUrl?: string;
}

interface ClubMembership {
  name: string;
  team: string;
}

interface VideoData {
  id: string;
  title: string;
  time: string;
  src: string;
  authorImg: string;
  by: string;
  name: string;
  views: number;
  date: string;
  clubInfo?: FanClubInfo;
  clubAddress?: string;
}

const Main: React.FC = () => {
  const { provider } = useUser();
  const [activeSection, setActiveSection] = useState<string>('discover');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false); 
  const [fanClubs, setFanClubs] = useState<FanClubInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clubMemberships, setClubMemberships] = useState<ClubMembership[]>([]);





  useEffect(() => {
    if (provider) {
      fetchFanClubs();
    }
    console.log('Provider:', provider);
  }, [provider]);

  const fetchFanClubs = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com/');
      const contract = new ethers.Contract(
        '0x2eDde1b3E1ceD35023413DFec3eb489C0C07C2Ca',
        FanClubFactoryABI,
        provider
      );

      const clubs = await contract.getAllFanClubs();
      console.log('Fan clubs:', clubs);

      const parsedClubs = clubs.map((club: any) => ({
        clubAddress: club.clubAddress,
        name: club.name,
        ticker: club.ticker,
        sport: club.sport,
        team: club.team,
        imageUrl: club.imageUrl,
        price: BigInt(club.price),
        maxSupply: BigInt(club.maxSupply),
        passesSold: BigInt(club.passesSold),
        owner: club.owner
      }));

      setFanClubs(parsedClubs);
      setError(null);
    } catch (error) {
      console.error('Error fetching fan clubs:', error);
      setError(`Error fetching fan clubs: ${error.message}`);
      setFanClubs([]); 
    }
  };


  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setShowDetails(false);
  };

  const handleCardClick = (video: VideoData) => {
    console.log("Video data received in handleCardClick:", video);
    
    const clubInfo = fanClubs.find(club => club.clubAddress === video.clubAddress);
    console.log("Club info found:", clubInfo);
    
    if (clubInfo) {
      const updatedVideo = {
        ...video,
        clubInfo: clubInfo
      };
      console.log("Updated video data to be set as selectedVideo:", updatedVideo);
      setSelectedVideo(updatedVideo);
    } else {
      console.log("No matching club info found, setting original video data");
      setSelectedVideo(video);
    }
    
    setShowDetails(true);
    setActiveSection('details');
  };
  

  console.log("Current selectedVideo state:", selectedVideo);

  return (
    <div className="container">
      

      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange}
        clubMemberships={clubMemberships}
      />
      <div className="wrapper">
        <Header 
         refreshFanClubs={fetchFanClubs}
          onLogoClick={() => handleSectionChange('discover')}
        />
        {activeSection === 'discover' && (
          <MainContainer 
            fanClubs={fanClubs}
            error={error}
            setSelectedVideo={handleCardClick} 
          />
        )}
        {activeSection === 'trending' && (
          <Trending 
            fanClubs={fanClubs}
            error={error}
          />
        )}
        {activeSection === 'details' && (
          <DetailsContainer 
          fanClubs={fanClubs}

            selectedVideo={selectedVideo} 
            onBack={() => handleSectionChange('discover')} 
          />
        )}
        {activeSection === 'marketplace' && (
          <Marketplace 
            fanClubs={fanClubs}
            error={error}
            setSelectedVideo={handleCardClick}
          />
        )}
      </div>
    </div>
  );
};

export default Main;