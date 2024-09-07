import React, { useState, useEffect } from 'react';
import Player from './Video/Player';
import Chat from './Chat';
import Votes from './Votes';
import Posts from './Posts';
import { ethers } from 'ethers';
import FanClubABI from './FanClubABI.json';
import Events from './details/Events';  
import Artifacts from './details/Artifacts';
import { useUser } from '../UserContext';
import Web3 from 'web3';


interface VideoData {
  id: string;
  title: string;
  time: string;
  src: string;
  author: {
    name: string;
    avatar: string;
  };
  by: string;
  name: string;
  views: number;
  date: string;
  clubInfo?: FanClubInfo;
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


interface DetailsContainerProps {
  selectedVideo: VideoData | null;  
  onBack: () => void;
}

const DetailsContainer: React.FC<DetailsContainerProps> = ({ selectedVideo, onBack }) => {
  const { provider, isLoggedIn, walletAddress } = useUser();
  const [currentPassesSold, setCurrentPassesSold] = useState<bigint | null>(null);
  const [marketCap, setMarketCap] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [hasMinted, setHasMinted] = useState(false);
  const [activeTab, setActiveTab] = useState<'fanfeed' | 'events' | 'artifacts'>('fanfeed');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (selectedVideo?.clubInfo && isLoggedIn && walletAddress) {
      fetchClubData();
      checkMintStatus();
  
      const storedClubKey = `ownClub_${walletAddress}`;
      const storedClub = localStorage.getItem(storedClubKey);
  
      if (storedClub) {
        const parsedClub = JSON.parse(storedClub);
        if (parsedClub.clubAddress === selectedVideo.clubInfo.clubAddress) {
          setIsOwner(true);
        } else {
          setIsOwner(false);  
        }
      } else {
        setIsOwner(false); 
      }
    }
  }, [selectedVideo, isLoggedIn, walletAddress, provider]);
  
  


  const fetchClubData = async () => {
    if (!selectedVideo?.clubInfo) return;

    try {
      const ethersProvider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com/');
      const contract = new ethers.Contract(selectedVideo.clubInfo.clubAddress, FanClubABI, ethersProvider);

      const passesSold = await contract.getPassesSold();
      setCurrentPassesSold(passesSold);

      const price = selectedVideo.clubInfo.price;
      const calculatedMarketCap = price * passesSold;
      setMarketCap(ethers.formatEther(calculatedMarketCap));

    } catch (error) {
      console.error("Error fetching club data:", error);
      setCurrentPassesSold(null);
      setMarketCap(null);
    }
  };

  const checkMintStatus = async () => {
    if (!provider || !selectedVideo?.clubInfo || !isLoggedIn) return;
  
    try {
      const web3 = new Web3(provider as any);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      
      const clubContract = new web3.eth.Contract(FanClubABI as any, selectedVideo.clubInfo.clubAddress);
      
      const balance = await clubContract.methods.balanceOf(address).call();
      const minted = parseInt(balance) > 0;
      setHasMinted(minted);
  
      const storageKey = `minted_${selectedVideo.clubInfo.clubAddress}`;
      const storageValue = JSON.stringify({
        minted: minted,
        name: selectedVideo.clubInfo.name,
        imageUrl: selectedVideo.clubInfo.imageUrl 
      });
      localStorage.setItem(storageKey, storageValue);
    } catch (error) {
      console.error("Error checking mint status:", error);
    }
  };

  const handleMint = async () => {
    if (!provider || !selectedVideo?.clubInfo || !isLoggedIn) return;

    setIsMinting(true);
    setMintError(null);

    try {
      const web3 = new Web3(provider as any);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(FanClubABI as any, selectedVideo.clubInfo.clubAddress);

      const gasEstimate = await contract.methods.mint().estimateGas({
        from: accounts[0],
        value: selectedVideo.clubInfo.price.toString()
      });

      console.log('Estimated gas:', gasEstimate);

      const gasLimit = BigInt(Math.floor(Number(gasEstimate) * 1.2));

      console.log('Gas limit with buffer:', gasLimit.toString());

      const tx = await contract.methods.mint().send({
        from: accounts[0],
        value: selectedVideo.clubInfo.price.toString(),
        gas: gasLimit.toString(),
      });

      console.log("Minting transaction sent:", tx.transactionHash);

      setHasMinted(true);
      
      const newPassesSold = (currentPassesSold || BigInt(0)) + BigInt(1);
      setCurrentPassesSold(newPassesSold);

      if (selectedVideo.clubInfo.price && marketCap !== null) {
        const newMarketCap = ethers.formatEther(selectedVideo.clubInfo.price * newPassesSold);
        setMarketCap(newMarketCap);
      }

      const storageKey = `minted_${selectedVideo.clubInfo.clubAddress}`;
      const storageValue = JSON.stringify({
        minted: true,
        name: selectedVideo.clubInfo.name,
        imageUrl: selectedVideo.clubInfo.imageUrl 
      });
      localStorage.setItem(storageKey, storageValue);

      console.log("Successfully minted a pass and updated UI!");

    } catch (error) {
      console.error("Error minting pass:", error);
      if (error.message.includes("replacement transaction underpriced")) {
        setMintError("Transaction failed due to network congestion. Please try again.");
      } else if (error.message.includes("insufficient funds")) {
        setMintError("Insufficient funds to complete the transaction. Please check your balance.");
      } else {
        setMintError("Failed to mint a pass. Please try again. Error: " + error.message);
      }
    } finally {
      setIsMinting(false);
    }
  };
const renderLockedContent = (content: React.ReactNode) => {
  if (isOwner) {
    return <div className="content">{content}</div>;
  }

  return (
    <div className="locked-content">
      {!hasMinted && (
        <div className="overlay">
          <div className="lock-icon">🔒</div>
          <div className="lock-message">Join to 👀</div>
        </div>
      )}
      <div className={`content ${!hasMinted ? 'blurred' : ''}`}>
        {content}
      </div>
    </div>
  );
};


const renderTabContent = () => {
  let content;
  switch (activeTab) {
    case 'fanfeed':
      content = <Posts 
        clubAddress={selectedVideo?.clubInfo?.clubAddress ?? ''} 
        clubInfo={selectedVideo?.clubInfo}
      />;
      break;
    case 'events':
      content = <Events 
      clubAddress={selectedVideo?.clubInfo?.clubAddress ?? ''} 
      clubInfo={selectedVideo?.clubInfo}
      provider={provider}      />;
      break;
    case 'artifacts':
      content = <Artifacts  
        clubAddress={selectedVideo?.clubInfo?.clubAddress ?? ''} 
        clubInfo={selectedVideo?.clubInfo}
        provider={provider}
      />;
      break;
  }
  return renderLockedContent(content);
};

  if (!selectedVideo) return null;

  return (
    <div className="details-container">     
      <div className="video-and-chat">
        <div className="PlayerALL">
          <Player 
            selectedVideo={selectedVideo}
            currentPassesSold={currentPassesSold}
            marketCap={marketCap}
            onMint={handleMint}
            isMinting={isMinting}
            mintError={mintError}
            onBack={onBack}
            hasMinted={hasMinted}
            clubAddress={selectedVideo.clubInfo?.clubAddress ?? ''}
          />
          <div className="ContentBLOCK">
            <div className="tab-selection">
              <button 
                onClick={() => setActiveTab('fanfeed')}
                className={`tab-button ${activeTab === 'fanfeed' ? 'active' : ''}`}
              >
                Fan Feed
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
              >
                Events
              </button>
              <button 
                onClick={() => setActiveTab('artifacts')}
                className={`tab-button ${activeTab === 'artifacts' ? 'active' : ''}`}
              >
                Artifacts
              </button>
            </div>
            {renderTabContent()}
          </div>
        </div>

        <div className="ContentBLOCK">
          {renderLockedContent(
            <div className="chat-and-votes">
              <Votes clubAddress={selectedVideo?.clubInfo?.clubAddress ?? ''} />
              <br />
              <Chat />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsContainer;