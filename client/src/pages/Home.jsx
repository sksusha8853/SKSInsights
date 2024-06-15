import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div className=''>
      <div className='flex flex-col gap-6 p-20 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to SKS Insights</h1>
        <p className='text-gray-500  sm:text-sm'>
          Dive into a world of engaging articles, insightful commentary, and comprehensive analysis on a wide range of topics. At SKS Insights, we believe in the power of knowledge and the beauty of shared wisdom. Whether you're here to stay updated on the latest trends, gain deeper understanding on various subjects, or simply indulge in some quality reading, we've got you covered.
        </p>
      </div>

      <div className='max-w p-3 flex flex-col gap-8 py-2 items-center'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6 items-center'>
            <h2 className='text-2xl font-semibold text-center'>Recent Blogs</h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-blue-500 hover:underline text-center'
            >
              View all blogs
            </Link>
          </div>
        )}
      </div>
    </div>

  )
}
