import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import FanClubFactoryABI from '../FanClubFactoryABI.json';
import { useUser } from '../../UserContext';
import Web3 from 'web3';

interface CreateClubModalProps {
  onClose: () => void;
  refreshFanClubs: () => void;

}

const CreateClubModal: React.FC<CreateClubModalProps> = ({ onClose, refreshFanClubs  }) => {
  const { provider, balance, chainId, user, walletAddress } = useUser();
  const [clubName, setClubName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [sport, setSport] = useState('');
  const [team, setTeam] = useState('');
  const [price, setPrice] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);



useEffect(() => {
  console.log('Wallet Address:', walletAddress);
  console.log('Chain ID:', chainId);
  console.log('User Info:', user);
  console.log('Provider:', provider);
  console.log('Own Club:', balance);
}, [provider]);

const handleCreateClub = async () => {
  if (!provider) {
    toast.error('Please connect your wallet to create a club');
    return;
  }

  if (isCreating) {
    toast.error('Transaction is already in progress');
    return;
  }

  if (chainId !== '0x15b32') {  
    toast.error('Please connect to the Ethereum Mainnet');
    return;
  }

  setIsCreating(true);

  try {
    const web3 = new Web3(provider as any);
    const contractAddress = '0x2eDde1b3E1ceD35023413DFec3eb489C0C07C2Ca';
    const contract = new web3.eth.Contract(FanClubFactoryABI as any, contractAddress);

    const priceInWei = web3.utils.toWei(price, 'ether');

    console.log('Estimating gas...');
    const gasEstimate = Number(await contract.methods.createFanClub(
      clubName,
      symbol,
      sport,
      team,
      priceInWei,
      maxSupply,
      profilePicUrl
    ).estimateGas({ from: walletAddress }));

    console.log('Estimated gas:', gasEstimate);

    const gasLimit = Math.floor(gasEstimate * 1.2); 

    console.log('Gas limit with buffer:', gasLimit);

    console.log('Sending transaction...');
    const tx = await contract.methods.createFanClub(
      clubName,
      symbol,
      sport,
      team,
      priceInWei,
      maxSupply,
      profilePicUrl
    ).send({
      from: walletAddress,
      gas: gasLimit,
    });

    console.log('Transaction sent:', tx.transactionHash);
    toast.success('Club created successfully!');

    const newClubAddress = tx.events.FanClubCreated.returnValues.fanClubAddress;

    const newClub = {
      clubAddress: newClubAddress,
      name: clubName,
      symbol,
      sport,
      team,
      price,
      maxSupply,
      profilePicUrl
    };

    localStorage.setItem(`ownClub_${walletAddress}`, JSON.stringify(newClub));
    refreshFanClubs();

    onClose();
  } catch (error: any) {
    console.error('Error creating club:', error);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    toast.error(`Error creating club: ${error.message}`);
  } finally {
    setIsCreating(false);
  }
};



  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <h2>Create Your FanClub</h2>
        <div className="profile-pic-container">
          <img 
            src={profilePicUrl || 'https://via.placeholder.com/100'} 
            alt="Profile Preview" 
            className="profile-pic-preview"
          />
          <input 
            type="text" 
            placeholder="Profile Picture URL" 
            value={profilePicUrl} 
            onChange={(e) => setProfilePicUrl(e.target.value)} 
          />
        </div>
        <input 
          type="text" 
          placeholder="Club Name" 
          value={clubName} 
          onChange={(e) => setClubName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Symbol" 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Sport" 
          value={sport} 
          onChange={(e) => setSport(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Team" 
          value={team} 
          onChange={(e) => setTeam(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Price (CHZ)" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Max Supply" 
          value={maxSupply} 
          onChange={(e) => setMaxSupply(e.target.value)} 
        />
        <button onClick={handleCreateClub} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create'}
        </button>
        <button onClick={onClose} disabled={isCreating}>Cancel</button>
      </div>
    </>
  );
};

export default CreateClubModal;