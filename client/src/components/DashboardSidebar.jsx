import { Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashboardSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
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
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      else {
        dispatch(signOutSuccess());
      }
    }
    catch (err) {
      console.log(err.message);
    }

  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"User"} labelColor='dark' as="div">
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

    </Sidebar>
  )
}
