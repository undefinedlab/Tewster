import React, { useState, useEffect } from 'react';
import './styles.scss';
import walletIcon from './pics/wallet.png';
import logoutIcon from './pics/power-off.png';
import { toast, Toaster } from 'react-hot-toast';
import { useUser } from '../UserContext';
import CreateClubModal from './modals/CreateClubModal';
import CheckClubModal from './modals/CheckClubModal';

interface ClubData {
  clubAddress: string;
  name: string;
  symbol: string;
  sport: string;
  team: string;
  price: string;
  maxSupply: string;
  profilePicUrl: string;
}

const Header: React.FC<HeaderProps> = ({ refreshFanClubs }) => {

  const { userInfo, walletAddress, chainId, provider, web3auth, logout, updateUserData, balance } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [ownClub, setOwnClub] = useState<ClubData | null>(null);
  const { isLoggedIn, showWalletUI } = useUser();


  
  useEffect(() => {


    if (walletAddress) {
      const storedClub = localStorage.getItem(`ownClub_${walletAddress}`);
      if (storedClub) {
        setOwnClub(JSON.parse(storedClub));
      } else {
        setOwnClub(null);
      }
    }
  }, [walletAddress, chainId, userInfo, provider]);

  const handleWalletClick = async () => {
    if (isLoggedIn) {
      try {
        console.log("Attempting to show wallet UI...");
        await showWalletUI();
        console.log("Wallet UI should now be visible");
      } catch (error) {
        console.error("Error showing wallet UI:", error);
        toast.error("Failed to show wallet UI");
      }
    } else {
      console.log("User is not logged in");
      toast.error("Please login to access the wallet");
    }
  };

  const handleLogout = async () => {
    try {
      if (logout && typeof logout === 'function') {
        await logout();
        updateUserData({
          userInfo: null,
          walletAddress: '',
          chainId: '',
          balance: '',
          provider: null,
        });
        toast.success('Logged out successfully');
      } else {
        console.error('Logout function is not available');
        toast.error('Logout function is not available');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="header">
      <div className="search-bar">
        <input type="text" placeholder="Search" />
      </div>
      <div className="user-settings">
        {walletAddress && (
          ownClub ? (
            <button className="create-club-button" onClick={() => setShowCheckModal(true)}>
              My FanClub
            </button>
          ) : (
            <button className="create-club-button" onClick={() => setShowCreateModal(true)}>
              Create Club
            </button>
          )
        )}
        {!walletAddress ? (
          <div className="icon-button" onClick={() => web3auth?.connect()}>
            <img src={walletIcon} alt="Connect Wallet" />
          </div>
        ) : (
          <>
            <div className="icon-button">
              <img src={walletIcon} alt="Wallet"  onClick={handleWalletClick} />
            </div>
            <div className="icon-button" onClick={handleLogout}>
              <img src={logoutIcon} alt="Logout" />
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateClubModal
        onClose={() => setShowCreateModal(false)}
        provider={provider}
          refreshFanClubs={refreshFanClubs}
        />
      )}

      {showCheckModal && ownClub && (
        <CheckClubModal
          onClose={() => setShowCheckModal(false)}
          clubData={ownClub}
        />
      )}

      <Toaster />
    </div>
  );
};

export default Header;