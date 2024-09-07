import React, { useState, useEffect } from 'react';

interface StoredItem {
  id: string;
  club: string;
  clubImage: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'sold';
}

interface Item {
  key: string;
  image: string;
  price: number;
  title: string;
  description: string;
  clubName: string;
  clubImage: string;
  status: 'available' | 'sold';
}

interface EventTicket {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  imageUrl: string;
  club: string;
  clubImage: string;
  status: 'available' | 'sold';
}


const animStyle = (delay: string) => ({
  style: { '--delay': delay } as React.CSSProperties
});

const ItemCard: React.FC<{ item: Item; isFeatured?: boolean; index: number }> = ({ item, isFeatured = false, index }) => {
  const { image, price, title, description, clubName, clubImage, status } = item;
  
  const cardClass = isFeatured ? 'item-card featured' : 'item-card';

  return (
    <div className={`${cardClass} anim`} {...animStyle(`${0.3 + index * 0.1}s`)}
    style={{ marginRight: '30px' }} 
    >
      <div className="item-image">
        <img src={image} alt={title} />
      </div>
      <div className="item-details" style={{ margin: '20px' }}>
        <h3 className="item-title">{title}</h3>
        <p className="item-description">{description}</p>
        <div className="artist-info">
          <img src={clubImage} alt={clubName} />
          <span>{clubName}</span>
        </div>
        <div className="bid-info">
          <div>
            <p>Price</p>
            <p>{price} $FNS</p>
          </div>
          <div>
            {status === 'available' ? (
              <button className="buy-button" style={{ marginRight: '0px', width: '100px' }}>Buy</button>
            ) : (
              <button className="sold-button" disabled>Sold</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventTicketCard: React.FC<{ event: EventTicket; index: number }> = ({ event, index }) => {
  const { title, description, date, price, imageUrl, club, clubImage, status } = event;

  return (
    <div 
   
    className="item-card anim" {...animStyle(`${0.3 + index * 0.1}s`)}>
      <div className="item-image">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
      </div>
      <div className="item-details p-4">
        <h3 className="item-title text-xl font-bold mb-2">{title}</h3>
        <p className="item-description text-sm mb-2">{description}</p>
        <p className="item-date text-sm text-gray-600 mb-2">{date}</p>
        <div className="club-info flex items-center mb-2">
          <img src={clubImage} alt={club} className="w-8 h-8 rounded-full mr-2" />
          <span className="text-sm font-semibold">{club}</span>
        </div>
        <div className="price-info flex justify-between items-center"
        style={{ marginTop: '-20px' }}>
          <div> 
            <p className="text-sm text-gray-600">{price} $FNS</p>
          </div>
          <div>
       
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedItems: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItemsFromLocalStorage = () => {
      const items: Item[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('artifacts_')) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsedItems: StoredItem[] = JSON.parse(value);
              items.push(...parsedItems.map(item => ({
                key: item.id,
                image: item.imageUrl,
                price: item.price,
                title: item.name,
                description: item.description,
                clubName: item.club,
                clubImage: item.clubImage,
                status: item.status
              })));
            } catch (error) {
              console.error('Error parsing item from localStorage:', error);
            }
          }
        }
      }
      return items;
    };

    const items = fetchItemsFromLocalStorage();
    setFeaturedItems(items);
  }, []);

  return (
    <div className="featured-items">
      {featuredItems.map((item, index) => (
        <ItemCard key={item.key} item={item} isFeatured={true} index={index} />
      ))}
    </div>
  );
};



const EventTickets: React.FC = () => {
  const [eventTickets, setEventTickets] = useState<EventTicket[]>([]);

  useEffect(() => {
    const fetchEventsFromLocalStorage = () => {
      const events: EventTicket[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('events_')) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsedEvents: EventTicket[] = JSON.parse(value);
              events.push(...parsedEvents);
            } catch (error) {
              console.error('Error parsing events from localStorage:', error);
            }
          }
        }
      }
      return events;
    };

    const events = fetchEventsFromLocalStorage();
    setEventTickets(events.slice(0, 4)); 
  }, []);

  return (
    <div className="event-tickets-container">
      {eventTickets.map((event, index) => (
        <EventTicketCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};

const Marketplace: React.FC = () => {
  return (
    <div className="marketplace">
      <h2 className="anim" {...animStyle('0s')}>Featured</h2>
      <div className="featured-items-container">
        <FeaturedItems />
      </div>
      <h2 className="anim" {...animStyle('0.2s')}>Event Tickets</h2>
      <div className="event-tickets-container">
        <EventTickets />
      </div>
    </div>
  );
};

export default Marketplace;