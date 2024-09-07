import React from 'react';
import Video from './Video/Video';
import videoData from './players.json';

interface VideoData {
  time: string;
  src: string;
  authorImg: string;
  by: string;
  sport: string;
  country: string;
  name: string;
  views: string;
  date: string;
}


interface TrendingProps {
  setSelectedVideo: (video: VideoData) => void;
}

const Trending: React.FC<TrendingProps> = () => {
  const animStyle = (delay: string) => ({
    style: { '--delay': delay } as React.CSSProperties
  });

  const topFive = [...videoData]
    .sort((a, b) => {
      const viewsA = parseInt(a.views.replace(/[^\d]/g, ''));
      const viewsB = parseInt(b.views.replace(/[^\d]/g, ''));
      return viewsB - viewsA;
    })
    .slice(0, 5);

  return (
    <div className="trending-container w-full px-4 sm:px-6 lg:px-8">

<div 
style={
  {
    position:"absolute",
    right:"50px",
    top:"170px",
  }
}
>
  <button style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"transparent", color:"white", padding:"5px 10px", margin:"10px"}}>By Nation</button>
  <button style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"transparent", color:"white", padding:"5px 10px", margin:"10px"}}>By Sport</button>
  <button style={{border:"1px solid white", borderRadius:"10px", backgroundColor:"transparent", color:"white", padding:"5px 10px", margin:"10px"}}>By League</button>

  </div>

      <div className="main-header anim text-2xl font-bold mb-4" {...animStyle('0s')}>Trending</div>
      
      <div className="small-header anim text-xl font-semibold mb-2" {...animStyle('.3s')}>Top 5 Rankings</div>
      <div className="ranking-sheet anim w-full overflow-x-auto mb-6" {...animStyle('.6s')}>
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left text-white font-bold">Rank</th>
              <th className="py-3 px-4 text-left text-white font-bold">Name</th>
              <th className="py-3 px-4 text-left text-white font-bold">Team</th>
              <th className="py-3 px-4 text-left text-white font-bold">Country</th>
              <th className="py-3 px-4 text-left text-white font-bold">Sport</th>
              <th className="py-3 px-4 text-left text-white font-bold">Views</th>
              <th className="py-3 px-4 text-left text-white font-bold">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {topFive.map((video, index) => (
              <tr key={`rank-${index}`} className="border-b border-gray-700 text-gray-300">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{video.name}</td>
                <td className="py-3 px-4">{video.by}</td>
                <td className="py-3 px-4">{video.country}</td>
                <td className="py-3 px-4">{video.sport}</td>
                <td className="py-3 px-4">{video.views}</td>
                <td className="py-3 px-4">{video.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="small-header anim text-xl font-semibold mb-2" {...animStyle('.7s')}>Most Popular</div>
      <div className="videos grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoData.map((video, index) => (
          <div className="anim" {...animStyle(`${0.9 + index * 0.1}s`)} key={`video-${index}`}>
            <Video video={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trending;