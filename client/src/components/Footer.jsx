import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsLinkedin } from 'react-icons/bs';
export default function FooterComponent() {
    return (
        <Footer container className='border border-t-8 border-blue-500'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div>
                        <Link to="/" className='whitespace-nowrap self-center text-sm 
        sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-purple-500  to-red-500 rounded-lg text-white' >SKSInsights</span>
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://saurabh8853-portfolio.vercel.app/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Portfolio
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://www.linkedin.com/in/sksusha/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    LinkedIn
                                </Footer.Link>
                                <Footer.Link href='https://github.com/sksusha8853'
                                    target='_blank'
                                    rel='noopener noreferrer'>Github</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright
                        href='#'
                        by="SKSInsights"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href='https://www.linkedin.com/in/sksusha/' icon={BsLinkedin} target='_blank' />
                        <Footer.Icon href='https://www.facebook.com/sksusha8853' icon={BsFacebook} target='_blank' />
                        <Footer.Icon href='https://www.instagram.com/sksusha8853/' icon={BsInstagram} target='_blank' />
                        <Footer.Icon href='https://github.com/sksusha8853' icon={BsGithub} target='_blank' />
                    </div>
                </div>
            </div>
        </Footer>
    );
}