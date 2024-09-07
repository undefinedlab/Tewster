import React, { useState, useEffect } from 'react';
import './styles.scss';

interface Poll {
  id: string;
  question: string;
  votes: {
    yes: number;
    no: number;
  };
}

const Votes: React.FC<{ clubAddress: string }> = ({ clubAddress }) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    loadPoll();
  }, [clubAddress]);

  const loadPoll = () => {
    const storedPoll = localStorage.getItem(`poll_${clubAddress}`);
    if (storedPoll) {
      setPoll(JSON.parse(storedPoll));
    } else {
      setPoll(null);
    }
  };

  const savePoll = (updatedPoll: Poll) => {
    localStorage.setItem(`poll_${clubAddress}`, JSON.stringify(updatedPoll));
    setPoll(updatedPoll);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoll: Poll = {
      id: Date.now().toString(),
      question: newQuestion,
      votes: { yes: 0, no: 0 }
    };
    savePoll(newPoll);
    setShowForm(false);
    setNewQuestion('');
  };

  const handleVote = (voteType: 'yes' | 'no') => {
    if (poll) {
      const updatedPoll = {
        ...poll,
        votes: {
          ...poll.votes,
          [voteType]: poll.votes[voteType] + 1
        }
      };
      savePoll(updatedPoll);
    }
  };

  const calculatePercentage = (yes: number, no: number): { yes: number, no: number } => {
    const total = yes + no;
    return {
      yes: total === 0 ? 0 : Math.round((yes / total) * 100),
      no: total === 0 ? 0 : Math.round((no / total) * 100)
    };
  };

  return (
    <div className="chat">
      <div className="chat-header anim">
        Daily Vote
        <span>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.212 7.762c0 2.644-2.163 4.763-4.863 4.763-2.698 0-4.863-2.119-4.863-4.763C4.486 5.12 6.651 3 9.35 3c2.7 0 4.863 2.119 4.863 4.762zM2 17.917c0-2.447 3.386-3.06 7.35-3.06 3.985 0 7.349.634 7.349 3.083 0 2.448-3.386 3.06-7.35 3.06C5.364 21 2 20.367 2 17.917zM16.173 7.85a6.368 6.368 0 01-1.137 3.646c-.075.107-.008.252.123.275.182.03.369.048.56.052 1.898.048 3.601-1.148 4.072-2.95.697-2.675-1.35-5.077-3.957-5.077a4.16 4.16 0 00-.818.082c-.036.008-.075.025-.095.055-.025.04-.007.09.019.124a6.414 6.414 0 011.233 3.793zm3.144 5.853c1.276.245 2.115.742 2.462 1.467a2.107 2.107 0 010 1.878c-.531 1.123-2.245 1.485-2.912 1.578a.207.207 0 01-.234-.232c.34-3.113-2.367-4.588-3.067-4.927-.03-.017-.036-.04-.034-.055.002-.01.015-.025.038-.028 1.515-.028 3.145.176 3.747.32z" />
          </svg>
          {poll ? 1 : 0}
        </span>
      </div>

      {!poll && !showForm && (
        <button className='create-poool-button' onClick={() => setShowForm(true)}>+ Add Poll</button>
      )}

      {showForm && (
        <form onSubmit={handleCreatePoll}>
        
          <input
            type="text"
            className='post_card_input'

            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
          <button className='create-poool-button' type="submit">Create Poll</button>
        </form>
      )}

      {poll && (
        <div className="poll">
          <div className="question">
            <p>{poll.question}</p>
          </div>
          <div className="poll-content">
            <div className="ans1">
              <h4 className="percentage-1">{calculatePercentage(poll.votes.yes, poll.votes.no).yes}%</h4>
              <div 
                className="line1 bar" 
                style={{ width: `${calculatePercentage(poll.votes.yes, poll.votes.no).yes}%` }}
              ></div>
              <h3 className="ans-text" onClick={() => handleVote('yes')}>YES</h3>
            </div>
            <div className="ans2">
              <h4 className="percentage-2">{calculatePercentage(poll.votes.yes, poll.votes.no).no}%</h4>
              <div 
                className="line2 bar" 
                style={{ width: `${calculatePercentage(poll.votes.yes, poll.votes.no).no}%` }}
              ></div>
              <h3 className="ans-text" onClick={() => handleVote('no')}>NO</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Votes;