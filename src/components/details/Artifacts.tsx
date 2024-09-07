import React, { useState, useEffect } from 'react';
import { useUser } from '../../UserContext'; 
import FNSTokenABI from '../FNSTokenABI.json';

interface ArtifactItem {
  id: string;
  club: string;
  clubImage: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'sold';
}

interface ArtifactsProps {
  clubAddress: string;
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

const FNS_TOKEN_ADDRESS = '0x100F4B8dE640603520a3CFc73FdEc63Eadff70C2';
const MERCHANT_ADDRESS = '0x1eeE42e1109db980dE575D95169BB8F90cAC63D5';

const Artifacts: React.FC<ArtifactsProps> = ({ clubAddress, clubInfo }) => {
  const { provider, isLoggedIn, walletAddress } = useUser();
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newArtifact, setNewArtifact] = useState({ name: '', club: '', description: '', price: '', imageUrl: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string>('0');

  useEffect(() => {
    loadArtifacts();
    if (isLoggedIn && provider) {
      fetchUserBalance();
    }
  }, [clubAddress, isLoggedIn, provider, walletAddress]);

  const loadArtifacts = () => {
    const storedArtifacts = localStorage.getItem(`artifacts_${clubAddress}`);
    if (storedArtifacts) {
      setArtifacts(JSON.parse(storedArtifacts));
    }
  };

  const fetchUserBalance = async () => {
    if (!provider || !isLoggedIn || !walletAddress) return;

    try {
      const fnsToken = new provider.eth.Contract(FNSTokenABI, FNS_TOKEN_ADDRESS);
      const balance = await fnsToken.methods.balanceOf(walletAddress).call();
      setUserBalance(provider.utils.fromWei(balance, 'ether'));
    } catch (err) {
      console.error('Error fetching user balance:', err);
    }
  };

  const handleCreateArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    const createdArtifact: ArtifactItem = {
      id: Date.now().toString(),
      club: clubInfo?.name || '',
      clubImage: clubInfo?.imageUrl || '',
      name: newArtifact.name,
      description: newArtifact.description,
      price: parseFloat(newArtifact.price),
      imageUrl: newArtifact.imageUrl,
      status: 'available',
    };

    const updatedArtifacts = [...artifacts, createdArtifact];
    setArtifacts(updatedArtifacts);
    localStorage.setItem(`artifacts_${clubAddress}`, JSON.stringify(updatedArtifacts));
    setShowForm(false);
    setNewArtifact({ name: '', description: '', price: '', imageUrl: '' });
  };

  const buyArtifact = async (artifact: ArtifactItem) => {
    if (!provider || !isLoggedIn || !walletAddress) {
      setError('Please connect your wallet to make a purchase.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fnsToken = new provider.eth.Contract(FNSTokenABI, FNS_TOKEN_ADDRESS);
      const price = provider.utils.toWei(artifact.price.toString(), 'ether');

      const balance = await fnsToken.methods.balanceOf(walletAddress).call();
      if (BigInt(balance) < BigInt(price)) {
        throw new Error('Insufficient FNS balance');
      }

      const gasPrice = await provider.eth.getGasPrice();
      const gas = await fnsToken.methods.transfer(MERCHANT_ADDRESS, price).estimateGas({ from: walletAddress });

      const transferTx = await fnsToken.methods.transfer(MERCHANT_ADDRESS, price).send({
        from: walletAddress,
        gas,
        gasPrice
      });

      if (!transferTx.status) {
        throw new Error('Transaction failed');
      }

      const updatedArtifacts = artifacts.map(item =>
        item.id === artifact.id ? { ...item, status: 'sold' as const } : item
      );
      setArtifacts(updatedArtifacts);
      localStorage.setItem(`artifacts_${clubAddress}`, JSON.stringify(updatedArtifacts));

      alert(`Successfully purchased ${artifact.name}!`);
      await fetchUserBalance();
    } catch (err: any) {
      console.error('Error buying artifact:', err);
      setError(`Failed to buy artifact: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (artifacts.length > 0) {
    return (
      <div className="artifacts-container">
        {error && <p className="error-message">{error}</p>}
        <div className="artifacts-grid">
          {artifacts.map(artifact => (
            <div key={artifact.id} className="artifact-item">
              <h3>{artifact.name}</h3>
              <p>{artifact.description}</p>
              <p className="artifact-price">FNS {artifact.price.toFixed(2)}</p>
              {artifact.imageUrl && <img src={artifact.imageUrl} alt={artifact.name} className="artifact-image" />}
              {artifact.status === 'available' ? (
                <button 
                  className="buy-button" 
                  onClick={() => buyArtifact(artifact)}
                  disabled={loading || !isLoggedIn || parseFloat(userBalance) < artifact.price}
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </button>
              ) : (
                <p className="sold-out">Sold Out</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleCreateArtifact}>
        <div className='card_container'>
          <label htmlFor="name">Artifact Name</label>
          <input
            className='post_card_input'
            id="name"
            type="text"
            value={newArtifact.name}
            onChange={(e) => setNewArtifact({ ...newArtifact, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className='post_card_input'
            style={{ height: '100px' }}
            value={newArtifact.description}
            onChange={(e) => setNewArtifact({ ...newArtifact, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price (FNS)</label>
          <input
            className='post_card_input'
            id="price"
            type="number"
            step="0.01"
            value={newArtifact.price}
            onChange={(e) => setNewArtifact({ ...newArtifact, price: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            className='post_card_input'
            type="text"
            value={newArtifact.imageUrl}
            onChange={(e) => setNewArtifact({ ...newArtifact, imageUrl: e.target.value })}
            required
          />
        </div>
        <button type="submit" className='create-post-button'>Create Artifact</button>
      </form>
    );
  }

  return (
    <button onClick={() => setShowForm(true)} className="create-post-button">
      + Add Artifact
    </button>
  );
};

export default Artifacts;