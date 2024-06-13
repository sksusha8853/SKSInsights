import { Button, Table } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Modal } from 'flowbite-react';
import {FaCheck, FaTimes} from 'react-icons/fa';

export default function DashboardUsers() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const handleDeleteUser = async () => {
        setShowModal(false);
        // Implement deletion logic here
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (currentUser && currentUser.isAdmin) {
                    const res = await fetch(`/api/user/getusers`);
                    if (res.ok) {
                        const data = await res.json();
                        setUsers(data.users);
                        if (data.users.length < 9) {
                            setShowMore(false);
                        }
                    } else {
                        const data = await res.json();
                        console.log(data.message);
                    }
                }
            } catch (error) {
                console.log('Error fetching users:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser && currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(prevUsers => [...prevUsers, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            } else {
                const data = await res.json();
                console.log(data.message);
            }
        } catch (error) {
            console.log('Error fetching more users:', error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Is Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body >
                            {users.map(user => (
                                <Table.Row key={user._id}>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.username}
                                            className='w-10 h-10 object-cover rounded-full bg-gray-500'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className='text-red-500'/>)}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && (
                        <button
                            className='w-full self-center text-teal-500 text-sm py-6'
                            onClick={handleShowMore}
                        >
                            Show more...
                        </button>
                    )}
                </>
            ) : (
                <p>No users found!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-15 w-15 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-300'>Are you sure you want to delete this user?</h3>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={handleDeleteUser}>
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
