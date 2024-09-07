import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  imageUrl?: string;
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

interface PostsProps {
  clubAddress: string;
  clubInfo?: FanClubInfo;
}

const Posts: React.FC<PostsProps> = ({ clubAddress, clubInfo }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hasPosted, setHasPosted] = useState(false);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    imageUrl: '' 
  });

  useEffect(() => {
    loadPosts();
  }, [clubAddress]);

  const loadPosts = () => {
    const storedPosts = localStorage.getItem(`posts_${clubAddress}`);
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
      setHasPosted(true);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const createdPost: Post = {
      id: Date.now().toString(),
      author: {
        name: clubInfo?.name || "Club Owner",
        avatar: clubInfo?.imageUrl || "default-avatar-url", 
      },
      title: newPost.title,
      content: newPost.content,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
      imageUrl: newPost.imageUrl,
    };

    const updatedPosts = [...posts, createdPost];
    setPosts(updatedPosts);
    localStorage.setItem(`posts_${clubAddress}`, JSON.stringify(updatedPosts));
    setShowForm(false);
    setNewPost({ title: '', content: '', imageUrl: '' });
    setHasPosted(true);
  };

  const renderPosts = () => (
    <div className="posts-container">
      <h2 className="posts-title">Fan Feed</h2>
      {!hasPosted && (
        <button onClick={() => setShowForm(true)} className="create-post-button">
          + Add Post
        </button>
      )}
      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <div className="post-header">
              <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
              <div className="post-info">
                <h3 className="author-name">{post.author.name}</h3>
                <span className="post-date">{new Date(post.date).toLocaleString()}</span>
              </div>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="Post image" className="post-image" />}
            <div className="post-footer">
              <button className="like-button">👍 {post.likes}</button>
              <button className="comment-button">💬 {post.comments}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (showForm) {
    return (
      <form onSubmit={handleCreatePost}>
        <div className='card_container'>
          <label htmlFor="title">Title</label>
          <input
            className='post_card_input'
            id="title"
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            className='post_card_input'
            style={{ height: '100px' }}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            className='post_card_input'
            type="text"
            value={newPost.imageUrl}
            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
          />
        </div>
        <button type="submit" className='create-post-button'>Create Post</button>
      </form>
    );
  }

  return posts.length > 0 ? (
    renderPosts()
  ) : (
    <button onClick={() => setShowForm(true)} className="create-post-button">
      + Add Post
    </button>
  );
};

export default Posts;