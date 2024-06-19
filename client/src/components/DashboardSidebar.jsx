import { Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiArrowSmRight, HiChartPie, HiDocument, HiDocumentText, HiUser, HiUserCircle, HiUserGroup } from 'react-icons/hi';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaComment } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { FaPen } from 'react-icons/fa';

export default function DashboardSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/user/signout', {
        method: 'POST',
      });

      if (response.ok) {
        dispatch(signOutSuccess());
      } else {
        const data = await response.json();
        console.error('Failed to sign out:', data.message);
      }
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=dashboard'>
              <Sidebar.Item
                active={tab === 'dashboard' || !tab}
                icon={MdDashboard}
                as='div'>
                Dashboard
              </Sidebar.Item>
            </Link>)}

          {currentUser.isAdmin && (
            <Link to='/create-post'>
              <Sidebar.Item
                active={tab === 'create-post'}
                icon={FaPen}
                as='div'>
                Write Blog
              </Sidebar.Item>
            </Link>)}

          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUserCircle} label={currentUser.isAdmin ? 'Admin' : "User"} labelColor='dark' as="div">
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiUserGroup}
                as='div'>
                Users
              </Sidebar.Item>
            </Link>)}

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'>
                Blogs
              </Sidebar.Item>
            </Link>)}

          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={FaComment}
                as='div'>
                Comments
              </Sidebar.Item>
            </Link>)}

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
