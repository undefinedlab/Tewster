import React, { useState, useEffect } from 'react';
import Marketplace from './Marketplace'; 

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive, onClick }) => (
  <a className={`sidebar-link ${isActive ? 'is-active' : ''}`} onClick={onClick}>
    <svg viewBox="0 0 24 24" fill="currentColor">{icon}</svg>
    {label}
  </a>
);

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}


interface JoinedClub {
  address: string;
  name: string;
  imageUrl: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [joinedClubs, setJoinedClubs] = useState<JoinedClub[]>([]);

  useEffect(() => {
    const fetchJoinedClubs = () => {
      const clubs: JoinedClub[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('minted_')) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const { minted, name, imageUrl } = JSON.parse(value);
              if (minted) {
                const address = key.replace('minted_', '');
                clubs.push({ address, name, imageUrl });
              }
            } catch (error) {
              console.error("Error parsing localStorage value:", error);
            }
          }
        }
      }
      setJoinedClubs(clubs);
    };

    fetchJoinedClubs();
    const interval = setInterval(fetchJoinedClubs, 60000);

    return () => clearInterval(interval);
  }, []);



  const links = [
    {
      icon: (
        <path d="M9.135 20.773v-3.057c0-.78.637-1.414 1.423-1.414h2.875c.377 0 .74.15 1.006.414.267.265.417.625.417 1v3.057c-.002.325.126.637.356.867.23.23.544.36.87.36h1.962a3.46 3.46 0 002.443-1 3.41 3.41 0 001.013-2.422V9.867c0-.735-.328-1.431-.895-1.902l-6.671-5.29a3.097 3.097 0 00-3.949.072L3.467 7.965A2.474 2.474 0 002.5 9.867v8.702C2.5 20.464 4.047 22 5.956 22h1.916c.68 0 1.231-.544 1.236-1.218l.027-.009z" />
      ),
      label: 'Discover',
      key: 'discover',
    },
    {
      icon: (
        <path fillRule="evenodd" clipRule="evenodd" d="M10.835 12.007l.002.354c.012 1.404.096 2.657.242 3.451 0 .015.16.802.261 1.064.16.38.447.701.809.905a2 2 0 00.91.219c.249-.012.66-.137.954-.242l.244-.094c1.617-.642 4.707-2.74 5.891-4.024l.087-.09.39-.42c.245-.322.375-.715.375-1.138 0-.379-.116-.758-.347-1.064-.07-.099-.18-.226-.28-.334l-.379-.397c-1.305-1.321-4.129-3.175-5.593-3.79 0-.013-.91-.393-1.343-.407h-.057c-.665 0-1.286.379-1.603.991-.087.168-.17.496-.233.784l-.114.544c-.13.874-.216 2.216-.216 3.688zm-6.332-1.525C3.673 10.482 3 11.162 3 12a1.51 1.51 0 001.503 1.518l3.7-.328c.65 0 1.179-.532 1.179-1.19 0-.658-.528-1.191-1.18-1.191l-3.699-.327z" />
      ),
      label: 'Trending',
      key: 'trending',
    },
    {
      icon: (
        <path fillRule="evenodd" clipRule="evenodd" d="M12.1535 16.64L14.995 13.77C15.2822 13.47 15.2822 13 14.9851 12.71C14.698 12.42 14.2327 12.42 13.9455 12.71L12.3713 14.31V9.49C12.3713 9.07 12.0446 8.74 11.6386 8.74C11.2327 8.74 10.896 9.07 10.896 9.49V14.31L9.32178 12.71C9.03465 12.42 8.56931 12.42 8.28218 12.71C7.99505 13 7.99505 13.47 8.28218 13.77L11.1139 16.64C11.1832 16.71 11.2624 16.76 11.3515 16.8C11.4406 16.84 11.5396 16.86 11.6386 16.86C11.7376 16.86 11.8267 16.84 11.9158 16.8C12.005 16.76 12.0842 16.71 12.1535 16.64ZM19.3282 9.02561C19.5609 9.02292 19.8143 9.02 20.0446 9.02C20.302 9.02 20.5 9.22 20.5 9.47V17.51C20.5 19.99 18.5 22 16.0446 22H8.17327C5.58911 22 3.5 19.89 3.5 17.29V6.51C3.5 4.03 5.4901 2 7.96535 2H13.2525C13.5 2 13.7079 2.21 13.7079 2.46V5.68C13.7079 7.51 15.1931 9.01 17.0149 9.02C17.4333 9.02 17.8077 9.02318 18.1346 9.02595C18.3878 9.02809 18.6125 9.03 18.8069 9.03C18.9479 9.03 19.1306 9.02789 19.3282 9.02561ZM19.6045 7.5661C18.7916 7.5691 17.8322 7.5661 17.1421 7.5591C16.047 7.5591 15.145 6.6481 15.145 5.5421V2.9061C15.145 2.4751 15.6629 2.2611 15.9579 2.5721C16.7203 3.37199 17.8873 4.5978 18.8738 5.63395C19.2735 6.05379 19.6436 6.44249 19.945 6.7591C20.2342 7.0621 20.0223 7.5651 19.6045 7.5661Z" />
      ),
      label: 'Marketplace',
      key: 'marketplace',
    },
  ];

  return (
    <div className="sidebar">
      <span className="logo">S</span>
      <a className="logo-expand" href="#">💫 fanstar</a>
      <div className="divider"></div>

      <div className="side-wrapper">
        <div className="side-menu">
          {links.map(link => (
            <SidebarLink
              key={link.key}
              icon={link.icon}
              label={link.label}
              isActive={activeSection === link.key}
              onClick={() => setActiveSection(link.key)}
            />
          ))}
        </div>
        <div className="divider"></div>
        <div id="map-container">
          <div id="controls" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="sport-icons" id="sport-icons-menu" style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                className="sport-icon"
                title="Baseball"
                data-objectid="7"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fas fa-baseball" style={{ marginRight: '8px' }}></i>
                <span>Baseball</span>
              </div>
              <div
                className="sport-icon"
                title="Basketball"
                data-objectid="1"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fas fa-basketball" style={{ marginRight: '8px' }}></i>
                <span>Basketball</span>
              </div>
              <div
                className="sport-icon"
                title="Soccer"
                data-objectid="6"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fa-solid fa-futbol" style={{ marginRight: '8px' }}></i>
                <span>Soccer</span>
              </div>
              <div
                className="sport-icon"
                title="Softball"
                data-objectid="26"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fa-solid fa-baseball-bat-ball" style={{ marginRight: '8px' }}></i>
                <span>Softball</span>
              </div>
              <div
                className="sport-icon"
                title="Tennis"
                data-objectid="11"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fa-solid fa-table-tennis-paddle-ball" style={{ marginRight: '8px' }}></i>
                <span>Tennis</span>
              </div>
              <div
                className="sport-icon"
                title="Volleyball"
                data-objectid="28"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className="fas fa-volleyball" style={{ marginRight: '8px' }}></i>
                <span>Volleyball</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>


   <div className="joined-clubs">
        <h3 className="joined-clubs-title">Joined FanClubs</h3>
        {joinedClubs.length > 0 ? (
          <div className="joined-clubs-list">
            {joinedClubs.map((club) => (
              <div key={club.address} className="joined-club-item">
                <div className="joined-club-image">
                  <img src={club.imageUrl} alt={club.name} />
                </div>
                <div className="joined-club-name">{club.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-clubs-message">No clubs joined yet</p>
        )}
      </div>

      </div>
    </div>
  );
};

export default Sidebar;