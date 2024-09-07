import React, { useState, useEffect } from 'react';
import Video from './Video/Video';
import { ethers } from 'ethers';
import FanClubABI from './FanClubABI.json';
import { useUser } from '../UserContext';

interface VideoData {
  time?: string | null;
  src?: string | null;
  authorImg?: string | null;
  by: string;
  name: string;
  views?: string | null;
  date?: string | null;
  clubAddress?: string;
  symbol?: string;
  price?: bigint;
  maxSupply?: bigint;
  imageUrl?: string; 
}

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

interface UpdatedFanClubInfo extends FanClubInfo {
  currentPassesSold: bigint;
  marketCap: string;
}

interface MainContainerProps {
  fanClubs: FanClubInfo[];
  error: string | null;
  setSelectedVideo: (video: VideoData) => void;
}

const MainContainer: React.FC<MainContainerProps> = ({ fanClubs, error, setSelectedVideo }) => {
  const { provider } = useUser();
  const [updatedFanClubs, setUpdatedFanClubs] = useState<UpdatedFanClubInfo[]>([]);

  useEffect(() => {
    const fetchUpdatedFanClubData = async () => {
      const ethersProvider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com/');
      
      const updatedClubs = await Promise.all(fanClubs.map(async (club) => {
        const contract = new ethers.Contract(club.clubAddress, FanClubABI, ethersProvider);
        
        try {
          const currentPassesSold = await contract.getPassesSold();
          const price = await contract.price();
          const marketCap = price * currentPassesSold;

          return {
            ...club,
            currentPassesSold,
            marketCap: ethers.formatEther(marketCap)
          };
        } catch (error) {
          console.error(`Error fetching data for club ${club.name}:`, error);
          return {
            ...club,
            currentPassesSold: BigInt(0),
            marketCap: '0'
          };
        }
      }));

      setUpdatedFanClubs(updatedClubs);
    };

    fetchUpdatedFanClubData();
  }, [fanClubs, provider]);

  const formatClubData = (club: UpdatedFanClubInfo): VideoData => {
    return {
      clubAddress: club.clubAddress,
      by: club.name, 
      sport: club.sport, 
      name: club.team, 
      views: `Members: ${club.currentPassesSold.toString()}`, 
      date: `Worth: ${club.marketCap} CHZ`, 
      symbol: club.ticker,
      price: club.price,
      maxSupply: club.maxSupply,
      imageUrl: club.imageUrl 
    };
  };

  const animStyle = (delay: string) => ({
    style: { '--delay': delay } as React.CSSProperties
  });

  return (
    <div className="main-container">
      <div className="main-header anim" {...animStyle('0s')}>Discover</div>
      {error && <div className="error-message">{error}</div>}
      
      {/* Text Blocks */}
      <div className="main-blogs">
        <div className="main-blog anim" {...animStyle('.1s')}>
          <div className="main-blog__title">Follow and Support your Athletes</div>
        </div>
        <div className="main-blog anim" {...animStyle('.2s')}>
          <div className="main-blog__title">Collect and Trade Sport Artifacts</div>
        </div>
        
      </div>

      {/* Fetched Fan Clubs */}
      <div className="small-header anim" {...animStyle('.4s')}>New Clubs</div>
      <div className="videos">
        {updatedFanClubs.map((club, index) => {
          const formattedClub = formatClubData(club);
          return (
            <Video
              key={`club-${index}`}
              video={formattedClub}
              onClick={() => setSelectedVideo(formattedClub)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MainContainer;