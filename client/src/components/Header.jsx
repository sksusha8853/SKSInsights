import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';


export default function Header() {
    const path = useLocation().pathname;
    const {currentUser} = useSelector(state=>state.user);
    const {theme} = useSelector((state)=>state.theme);
    const dispatch = useDispatch();
    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='whitespace-nowrap self-center text-sm 
        sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-purple-500  to-red-500 rounded-lg text-white' >SKSInsights</span>
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
                <Button className='w-12 h-10 hidden sm:inline' color='black' pill onClick= {()=>dispatch(toggleTheme())}>
                    
                    {theme === 'light' ? <FaSun/> : <FaMoon/>}
                </Button>
                {currentUser ? (
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label = {
                        <Avatar alt='user'
                            img = {currentUser.profilePicture}
                            rounded
                        />
                    }>
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username} </span>

                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item>Sign Out</Dropdown.Item>
                        
                    </Dropdown>
                ):(
                    <Link to='/sign-in'>
                    <Button gradientDuoTone='purpleToBlue' outline>
                        SignIn
                    </Button>
                </Link>

                )}
                
                <Navbar.Toggle/>

            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={'div'}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={'div'}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link>
                    <Link to='/projects' active={path === "/projects"} as={'div'}>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
