// src/components/Posts.js
import React, { useState, useEffect } from 'react';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postCounts, setPostCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const usersResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!postsResponse.ok || !usersResponse.ok) {
          throw new Error('Network response was not ok');
        }
        
        const postsData = await postsResponse.json();
        const usersData = await usersResponse.json();

        setPosts(postsData);
        setUsers(usersData);
        countPostsByUser(postsData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countPostsByUser = (posts) => {
    const counts = posts.reduce((acc, post) => {
      acc[post.userId] = (acc[post.userId] || 0) + 1;
      return acc;
    }, {});
    setPostCounts(counts);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      <h2>Post Counts by User</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}): {postCounts[user.id] || 0} posts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
