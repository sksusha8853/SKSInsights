import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';

export default function Header() {
    const path = useLocation().pathname;
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get('searchTerm');
        if (searchTermFromURL) {
            setSearchTerm(searchTermFromURL);
        }
    }, [location.search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchString = urlParams.toString();
        navigate(`/search?${searchString}`);
    };

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <Navbar className="border-b-2">
            <Link to="/" className="whitespace-nowrap self-center text-sm sm:text-xl font-semibold dark:text-white">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg text-white">
                    SKSInsights
                </span>
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    placeholder="Search.."
                    icon={AiOutlineSearch}
                    className=" lg:inline"

                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <div className="flex gap-2 md:order-2">
                <Button className="w-12 h-10 " color="black" pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="user"
                                img={currentUser.profilePicture ? currentUser.profilePicture : 'default-profile.png'}
                                rounded
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">@{currentUser.username}</span>
                        </Dropdown.Header>

                        {
                            currentUser.isAdmin ? (
                                <Link to={'/dashboard?tab=dashboard'}>
                                    <Dropdown.Item>Dashboard</Dropdown.Item>
                                </Link>
                            ) :
                                (<Link to={'/dashboard?tab=profile'}>
                                    <Dropdown.Item>Profile</Dropdown.Item>
                                </Link>)
                        }
                        <Dropdown.Divider />

                        {
                            currentUser.isAdmin && (
                                <>
                                    <Link to={'/create-post'}>
                                        <Dropdown.Item>Write Blog</Dropdown.Item>
                                    </Link>
                                    <Dropdown.Divider />
                                </>
                            )
                        }


                        <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/sign-in">
                        <Button gradientDuoTone="purpleToBlue" outline>
                            Sign In
                        </Button>
                    </Link>
                )}

            </div>
        </Navbar>
    );
}
