import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import ThemeContext from '../context/ThemeContext';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const { theme } = useContext(ThemeContext);
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get('https://link-saver-drab.vercel.app/api/bookmarks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBookmarks(res.data);
        setFilteredBookmarks(res.data); // Initialize filteredBookmarks
      } catch (error) {
        console.error('Error fetching bookmarks:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      }
    };

    fetchBookmarks();
  }, [user, isAuthLoading, navigate, logout]);

  // Filter bookmarks based on tag search
  useEffect(() => {
    if (!tagSearch.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }
    const searchTerms = tagSearch
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);
    const filtered = bookmarks.filter((bookmark) =>
      bookmark.tags?.some((tag) => searchTerms.some((term) => tag.toLowerCase().includes(term)))
    );
    setFilteredBookmarks(filtered);
  }, [tagSearch, bookmarks]);

  const handleAddBookmark = (bookmark, isUpdate = false) => {
    if (isUpdate) {
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bookmark._id ? bookmark : b))
      );
      setFilteredBookmarks((prev) =>
        prev.map((b) => (b._id === bookmark._id ? bookmark : b))
      );
    } else if (bookmark) {
      setBookmarks((prev) => [...prev, bookmark]);
      setFilteredBookmarks((prev) => [...prev, bookmark]);
    } else {
      setBookmarks((prev) => prev.filter((b) => b._id !== bookmark._id));
      setFilteredBookmarks((prev) => prev.filter((b) => b._id !== bookmark._id));
    }
  };

  if (isAuthLoading || !user) return null;

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const logoutBg = theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600';

  return (
    <div className={`container mx-auto p-4 min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${headerColor}`}>Link Saver</h1>
        <div className="flex gap-4">
          <ThemeToggle />
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className={`${logoutBg} text-white p-2 rounded-lg transition-colors duration-300`}
          >
            Logout
          </button>
        </div>
      </div>
      <BookmarkForm onAdd={handleAddBookmark} />
      <div>
        <div className="mb-4">
          <label
            htmlFor="tagSearch"
            className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
          >
            Search Tags (comma-separated)
          </label>
          <input
            id="tagSearch"
            type="text"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            title="Enter tags separated by commas to filter bookmarks"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
            placeholder="e.g., AI, Tech"
          />
        </div>
        <BookmarkList bookmarks={filteredBookmarks} setBookmarks={setFilteredBookmarks} />
      </div>
    </div>
  );
}

export default Dashboard;
