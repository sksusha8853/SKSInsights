import React from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
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
        <Navbar className='border-b-2'>
            <Link to="/" className='whitespace-nowrap self-center text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg text-white'>SKSInsights</span>
            </Link>
            <form>
                <TextInput
                    type='text'
                    placeholder='Search..'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='black' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt='user'
                                img={currentUser.profilePicture ? currentUser.profilePicture : 'default-profile.png'}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.username}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link as='div'>
                    <Link to='/' className={path === '/' ? 'active' : ''}>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link as='div'>
                    <Link to='/about' className={path === '/about' ? 'active' : ''}>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link as='div'>
                    <Link to='/projects' className={path === '/projects' ? 'active' : ''}>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
