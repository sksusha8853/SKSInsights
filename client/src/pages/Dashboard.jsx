import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import DashboardPosts from '../components/DashboardPosts';
import DashboardUsers from '../components/DashboardUsers';
import DashboardComments from '../components/DashboardComments';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState(''); // State to hold the current tab

  // Use effect to update the tab based on URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='md:w-56'>
        <DashboardSidebar />
      </div>

      {/* Content Area */}
      <div className='flex-1 p-4'>
        {tab === 'profile' && <DashboardProfile />}
        {tab === 'posts' && <DashboardPosts/>}
        {tab === 'users' && <DashboardUsers/>}
        {tab === 'comments' && <DashboardComments/>}

      </div>
    </div>
  );
}
