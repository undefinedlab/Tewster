import React, { useState, useEffect } from 'react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  price: number;
  supply: number;
  availablePlaces: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface EventsProps {
  clubAddress: string;
}

const Events: React.FC<EventsProps> = ({ clubAddress }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    date: '', 
    description: '', 
    imageUrl: '',
    price: '',
    supply: '',
    availablePlaces: '',
    status: 'upcoming' as const
  });

  useEffect(() => {
    loadEvents();
  }, [clubAddress]);

  const loadEvents = () => {
    const storedEvents = localStorage.getItem(`events_${clubAddress}`);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const createdEvent: EventItem = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      description: newEvent.description,
      imageUrl: newEvent.imageUrl, 
      price: parseFloat(newEvent.price),
      supply: parseInt(newEvent.supply),
      availablePlaces: parseInt(newEvent.availablePlaces),
      status: newEvent.status
    };

    const updatedEvents = [...events, createdEvent];
    setEvents(updatedEvents);
    localStorage.setItem(`events_${clubAddress}`, JSON.stringify(updatedEvents));
    setShowForm(false);
    setNewEvent({ 
      title: '', 
      date: '', 
      description: '', 
      imageUrl: '', 
      price: '', 
      supply: '',
      availablePlaces: '',
      status: 'upcoming'
    });
  };

  if (events.length > 0) {
    return (
      <div className="events-container">
        <h2 className="events-title">Upcoming Events</h2>
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-item">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-date">Date: {event.date}</p>
              <p className="event-description">{event.description}</p>
              <p className="event-price">Price: {event.price} FNS</p>
              <p className="event-places">Available Places: {event.availablePlaces}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleCreateEvent}>
        <div className='card_container'>
          <label htmlFor="title">Event Name</label>
          <input
            className='post_card_input'
            id="title"
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            className='post_card_input'
            id="date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className='post_card_input'
            style={{ height: '100px' }}
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
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
            value={newEvent.price}
            onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
            required
          />
        </div>
   
        <div>
          <label htmlFor="availablePlaces">Available Places</label>
          <input
            className='post_card_input'
            id="availablePlaces"
            type="number"
            value={newEvent.availablePlaces}
            onChange={(e) => setNewEvent({ ...newEvent, availablePlaces: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            className='post_card_input'
            id="status"
            value={newEvent.status}
            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' })}
            required
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            className='post_card_input'
            type="text"
            value={newEvent.imageUrl}
            onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
          />
        </div>
        <button type="submit" className='create-post-button'>Create Event</button>
      </form>
    );
  }

  return (
    <button onClick={() => setShowForm(true)} className="create-post-button">
      + Add Event
    </button>
  );
};

export default Events;