import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashboardPosts() {
    const { currentUser } = useSelector(state => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            }
            else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete));
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (currentUser && currentUser.isAdmin) {
                    const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
                    const data = await res.json();
                    if (res.ok) {
                        setUserPosts(data.posts);
                        if (data.posts.length < 9) {
                            setShowMore(false);
                        }
                    } else {
                        console.log(data.message);
                    }
                }
            } catch (error) {
                console.log('Error fetching posts:', error.message);
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        if (currentUser && currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser]);

    // Loading state while fetching posts
    if (loading) {
        return <p>Loading...</p>;
    }

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);

            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);

                }
            }

        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head className=''>
                            <Table.HeadCell>Last Updated</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post) => (
                            <Table.Body className='divide-y'>
                                <Table.Row>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>

                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='fort-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {post.category}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span onClick={() => {
                                            setShowModal(true);
                                            setPostIdToDelete(post._id);
                                        }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='text-sky-500 hover:underline cursor-pointer' to={`/update-post/${post._id}`}>
                                            <span>
                                                Edit
                                            </span>
                                        </Link>
                                    </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className='w-full self-center text-teal-500 text-sm py-6'>
                                Show more...
                            </button>
                        )
                    }
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header></Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-15 w-15 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure want to delete this post?</h3>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={handleDeletePost}>
                                Yes, I'm sure.
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel.</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
