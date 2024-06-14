import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

export default function ViewPost() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message || 'Error fetching post');
                    setLoading(false);
                    return;
                } else {
                    setPost(data.posts[0]);
                    setLoading(false);
                    setError(null);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className='p-6 mx-auto max-w-3xl min-h-screen'>
            <h1 className='text-4xl mt-10 font-serif text-center lg:text-5xl'>
                {post && post.title}
            </h1>



            <div className='flex justify-between py-3 border-b border-slate-500 w-full text-xs mt-4'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <Link
                    to={`/search?category=${post && post.category}`}
                >
                    <Button color='gray' pill size='xxs'>
                        {post && post.category}
                    </Button>
                </Link>
                <span className='italic'>
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div className='mt-8 w-full'>
                <img
                    src={post && post.image}
                    alt={post && post.title}
                    className='w-full object-cover max-h-[600px]'
                />
            </div>

            <div
                className='py-8 w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            <CommentSection postId={post._id}/>
        </main>
    );
}
