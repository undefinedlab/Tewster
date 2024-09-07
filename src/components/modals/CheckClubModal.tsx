import React from 'react';

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

interface CheckClubModalProps {
  onClose: () => void;
  clubData: ClubData;
}

const CheckClubModal: React.FC<CheckClubModalProps> = ({ onClose, clubData }) => {
  return (
    <>
      <div className="fanclub_modal-overlay" onClick={onClose}></div>
      <div className="fanclub_modal">
        <h2>My FanClub</h2>
        <img 
          src={clubData.profilePicUrl || 'https://via.placeholder.com/100'} 
          alt="Club Profile" 
          className="fanclub_profile-pic-preview"
        />
        <div className='fanclub_modal-content'> 
          <p><strong>Name:</strong> {clubData.name}</p>
          <p><strong>Symbol:</strong> {clubData.symbol}</p>
          <p><strong>Sport:</strong> {clubData.sport}</p>
          <p><strong>Team:</strong> {clubData.team}</p>
          <p><strong>Price:</strong> {clubData.price} ETH</p>
          <p><strong>Max Supply:</strong> {clubData.maxSupply}</p>
          <button onClick={onClose}>X</button>
        </div>
      </div>
    </>
  );
};

export default CheckClubModal;