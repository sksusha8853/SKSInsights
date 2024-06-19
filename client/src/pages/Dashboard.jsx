import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';
import DashboardComments from '../components/DashboardComments';
import DashboardComponent from '../components/DashboardComponent';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashboardSidebar />
      </div>
      <div className='flex-1 p-4'>
        {tab === 'profile' && <DashboardProfile />}
        {tab === 'posts' && <DashboardPosts />}
        {tab === 'users' && <DashboardUsers />}
        {tab === 'comments' && <DashboardComments />}
        {tab === 'dashboard' && <DashboardComponent />}
      </div>
    </div>
  );
}
