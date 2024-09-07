import React from 'react';

interface VideoProps {
  video: {
    authorImg?: string | null;
    by: string;
    name: string;
    sport?: string;
    clubAddress?: string;
    members?: string;
    mCap?: string;
    views?: string;
    date?: string;
    imageUrl?: string; 
  };
  onClick: () => void;
}

const Video: React.FC<VideoProps> = ({ video, onClick }) => {
  const isFanClub = 'clubAddress' in video;

  return (
    <div className="video anim" onClick={onClick}>
      {isFanClub ? (
        <div className="fan-club-card">
          <div 
            className="fan-club-image-container" 
            style={{
              width: 'auto',
              height: '300px',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img 
              src={video.imageUrl }
              alt="Fan Club" 
              className="fan-club-image" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                height: '300px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div className="fan-club-info">
            <div className="video-name">{video.by}</div>
            {video.sport && <div className="fan-club-sport">{video.sport}</div>}
            <div className="fan-club-team">{video.name}</div>
            <div className="video-view">
              <div>{video.views}</div> 
              <div className="fan-club-mcap">{video.date}</div> 
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="video-wrapper">
            <div className="video-by">{video.by}</div>
          </div>
          <div className="video-thumb-container" 
            style={{ margin: '10px', width: '100%', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          >
        
            <div
            style={{
              marginLeft: '-90px',
              marginTop: '-20px',
                   }}
          
            className="video-name">{video.name}</div>
          </div>


            <div 
            style={{
              margin: '20px',
            }} 
            >

          {video.sport && <div className="video-sport" >{video.sport}</div>}
        
            <div>Members: {video.views} </div>
            {video.date && <div>{video.date}</div>}
            </div>
        </>
        
      )}
    </div>
    
  );
};

export default Video;