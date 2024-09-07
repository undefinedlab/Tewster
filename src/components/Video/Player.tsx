import React, { useState, useEffect } from 'react';
import Chart from './Chart'; 

interface CustomCSSProperties extends React.CSSProperties {
  '--delay'?: string;
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
}

interface Video {
  id: string | undefined; 
  title: string;
  authorImg: string;
  by: string;
  name: string;
  clubInfo?: FanClubInfo;
}

interface PlayerProps {
  selectedVideo: Video | null;
  currentPassesSold: bigint | null;
  marketCap: string | null;
  onMint: () => void;
  isMinting: boolean;
  mintError: string | null;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ 
  selectedVideo, 
  currentPassesSold, 
  marketCap, 
  onMint, 
  isMinting, 
  mintError,
  onBack
}) => {
  const [hasMinted, setHasMinted] = useState(false);
  const [chartData, setChartData] = useState<{ date: string; marketCap: number }[]>([]);

  useEffect(() => {
    if (selectedVideo?.clubInfo) {
      const storageKey = `minted_${selectedVideo.clubInfo.clubAddress}`;
      const mintedStatus = localStorage.getItem(storageKey);
      if (mintedStatus) {
        try {
          const { minted } = JSON.parse(mintedStatus);
          setHasMinted(minted);
        } catch (error) {
          console.error("Error parsing minted status:", error);
          setHasMinted(false);
        }
      } else {
        setHasMinted(false);
      }

      const mockData = generateMockChartData();
      setChartData(mockData);
    }
  }, [selectedVideo, marketCap]); 

  const generateMockChartData = () => {
    const data = [];
    const baseMarketCap = parseFloat(marketCap?.replace(/[^0-9.-]+/g, "") || "0");
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const randomFactor = 0.9 + Math.random() * 0.2; 
      data.push({
        date: date.toISOString().split('T')[0],
        marketCap: baseMarketCap * randomFactor * (30 - i) / 30
      });
    }
    return data;
  };

  if (!selectedVideo) return null;

  const maxSupply = selectedVideo.clubInfo?.maxSupply;
  const passesLeft = maxSupply && (currentPassesSold !== null && currentPassesSold > 0)
    ? maxSupply - currentPassesSold
    : maxSupply;

  return (
    <div className="video-stream">
      <div className="video-p-wrapper anim" style={{ '--delay': '.2s', display: 'flex', alignItems: 'center', margin: '20px', marginBottom : '-20px' } as CustomCSSProperties}>
     
        <div>
          <p style={{ margin: '0px', fontSize: '1rem' }}>
            <span style={{ color: '#888', marginRight: '10px' }}>{selectedVideo.clubInfo?.sport}</span>
            <span style={{ margin: '5px 0', color: '#8889' }}>{selectedVideo.clubInfo?.team}</span>
          </p>
          <h1 style={{ color: '#fff', marginTop: '0px' }}>{selectedVideo.clubInfo?.name}</h1>
        </div>
        <div className="button-wrapper" style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
         
    
         
         <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '5px' }}>
         
         <button style={ { display: 'flex', flexDirection: 'row', color: 'white!important'} }
            className={`like ${hasMinted ? 'joined' : 'red'}`} 
          > 
               {passesLeft !== null && (
            <span style={{ color: 'white', fontSize: '0.8rem', marginTop: '5px' }}>
              {passesLeft.toString()} passes left
            </span>
          )}
          </button>
         
         
          <button style={ { display: 'flex', flexDirection: 'row'} }
            className={`like ${hasMinted ? 'joined' : 'red'}`} 
            onClick={onMint} 
            disabled={isMinting || hasMinted}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.85 2.5c.63 0 1.26.09 1.86.29 3.69 1.2 5.02 5.25 3.91 8.79a12.728 12.728 0 01-3.01 4.81 38.456 38.456 0 01-6.33 4.96l-.25.15-.26-.16a38.093 38.093 0 01-6.37-4.96 12.933 12.933 0 01-3.01-4.8c-1.13-3.54.2-7.59 3.93-8.81.29-.1.59-.17.89-.21h.12c.28-.04.56-.06.84-.06h.11c.63.02 1.24.13 1.83.33h.06c.04.02.07.04.09.06.22.07.43.15.63.26l.38.17c.092.05.195.125.284.19.056.04.107.077.146.1l.05.03c.085.05.175.102.25.16a6.263 6.263 0 013.85-1.3zm2.66 7.2c.41-.01.76-.34.79-.76v-.12a3.3 3.3 0 00-2.11-3.16.8.8 0 00-1.01.5c-.14.42.08.88.5 1.03.64.24 1.07.87 1.07 1.57v.03a.86.86 0 00.19.62c.14.17.35.27.57.29z" />
            </svg>
            {hasMinted ? 'Joined' : (isMinting ? 'Minting...' : 'Mint Pass')}
          </button>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: "-40px", marginTop: "30px" }}>
        <Chart data={chartData} />
      </div>
      
      <div className="stats-section anim" style={{ '--delay': '.3s' } as CustomCSSProperties}>
        <div className="stats-container">
          <div className="stats-wrapper">
            <div className="stats-columns">
              <div className="stats-column">
                <div className="stats-card">
                  <div className="stats-content">
                    <h4 className="stats-title">Members</h4>
                    <h3 className="stats-number">{currentPassesSold?.toString() ?? 'Loading...'}</h3>
                    <p className="stats-percentage stats-increase">▲ 57.1%</p>
                  </div>
                </div>
              </div>
          
              <div className="stats-column">
                <div className="stats-card">
                  <div className="stats-content">
                    <h4 className="stats-title">Max Supply</h4>
                    <h3 className="stats-number">{selectedVideo.clubInfo?.maxSupply.toString() ?? 'N/A'}</h3>
                    <p className="stats-percentage stats-increase">▲ 0%</p>
                  </div>
                </div>
              </div>
              <div className="stats-column">
                <div className="stats-card">
                  <div className="stats-content">
                    <h4 className="stats-title">M.CAP</h4>
                    <h3 className="stats-number">{marketCap ?? 'Loading...'}</h3>
                    <p className="stats-percentage stats-increase">▲ 42.8%</p>
                  </div>
                </div>
              </div>
              <div className="stats-column">
                <div className="stats-card">
                  <div className="stats-content">
                    <h4 className="stats-title">Volume</h4>
                    <h3 className="stats-number">1 ETH</h3>
                    <p className="stats-percentage stats-increase">▲ 0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;