import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPosts();
    }, [location]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const updatedData = { ...sidebarData };
    
        switch (id) {
            case 'searchTerm':
                updatedData.searchTerm = value;
                break;
            case 'sort':
                updatedData.sort = value || 'desc';
                break;
            case 'category':
                updatedData.category = value || 'uncategorized';
                break;
            default:
                break;
        }
    
        setSidebarData(updatedData);
    };    

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        try {
            const startIndex = posts.length;
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex', startIndex);
            const searchQuery = urlParams.toString();
    
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
    
            if (!res.ok) {
                console.error('Failed to fetch more posts');
                return;
            }
    
            const data = await res.json();
    
            setPosts(prevPosts => [...prevPosts, ...data.posts]);
            setShowMore(data.posts.length === 9);
        } catch (error) {
            console.error('Error fetching more posts:', error);
        }
    };
    
    return (
        <div>
            <div className='w-full border-2 rounded-lg md:border-r p-2 border-teal-500'>
                <form className='flex flex-wrap gap-4' onSubmit={handleSubmit}>
                    <div className='flex items-center gap-2 flex-1 min-w-[200px]'>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                            className='flex-1'
                        />
                    </div>
                    <div className='flex items-center gap-2 flex-1 min-w-[150px]'>
                        <label className='font-semibold'>Sort:</label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort' className='flex-1'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2 flex-1 min-w-[200px]'>
                        <label className='font-semibold'>Category:</label>
                        <Select onChange={handleChange} value={sidebarData.category} id='category' className='flex-1'>
                            <option value="uncategorized">Select a category</option>
                            <option value="competitiveprogramming">Competitive Programming</option>
                            <option value="dsa">DSA (Data Structures and Algorithms)</option>
                            <option value="webdevelopment">Web Development</option>
                            <option value="mobiledevelopment">Mobile Development</option>
                            <option value="machinelearning">Machine Learning</option>
                            <option value="artificialintelligence">Artificial Intelligence</option>
                            <option value="datascience">Data Science</option>
                            <option value="devops">DevOps</option>
                            <option value="iot">Internet of Things (IoT)</option>
                            <option value="blockchain">Blockchain</option>
                            <option value="augmentedreality">Augmented Reality (AR)</option>
                            <option value="virtualreality">Virtual Reality (VR)</option>
                            <option value="traveling">Traveling</option>
                        </Select>
                    </div>
                    <Button type='submit' outline gradientDuoTone='purpleToBlue' className='flex-none'>
                        Apply
                    </Button>
                </form>
            </div>

            <div className='w-full '>
                <div className='w-full flex justify-center p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading &&
                        posts &&
                        posts.map((post) => <PostCard key={post._id} post={post} />)}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}