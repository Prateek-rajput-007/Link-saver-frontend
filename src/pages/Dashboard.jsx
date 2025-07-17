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
        // Ensure bookmarks is an array
        const fetchedBookmarks = Array.isArray(res.data) ? res.data : [];
        setBookmarks(fetchedBookmarks);
        setFilteredBookmarks(fetchedBookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        } else {
          setBookmarks([]);
          setFilteredBookmarks([]);
        }
      }
    };

    fetchBookmarks();
  }, [user, isAuthLoading, navigate, logout]);

  // Filter bookmarks based on tag search
  useEffect(() => {
    if (!Array.isArray(bookmarks)) {
      console.error('Bookmarks is not an array:', bookmarks);
      setFilteredBookmarks([]);
      return;
    }
    if (!tagSearch.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }
    const searchTerms = tagSearch
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);
    const filtered = bookmarks.filter((bookmark) => {
      const tags = Array.isArray(bookmark.tags) ? bookmark.tags : [];
      return tags.some((tag) => searchTerms.some((term) => tag.toLowerCase().includes(term)));
    });
    setFilteredBookmarks(filtered);
  }, [tagSearch, bookmarks]);

  const handleAddBookmark = (bookmark, isUpdate = false) => {
    if (isUpdate && bookmark) {
      console.log('Updating bookmark:', bookmark);
      setBookmarks((prev) =>
        Array.isArray(prev)
          ? prev.map((b) => ((b._id === bookmark._id || b._id === bookmark.tempId) ? { ...bookmark, _id: bookmark._id } : b))
          : [bookmark]
      );
      setFilteredBookmarks((prev) =>
        Array.isArray(prev)
          ? prev.map((b) => ((b._id === bookmark._id || b._id === bookmark.tempId) ? { ...bookmark, _id: bookmark._id } : b))
          : [bookmark]
      );
    } else if (bookmark) {
      console.log('Adding bookmark:', bookmark);
      setBookmarks((prev) => (Array.isArray(prev) ? [...prev, bookmark] : [bookmark]));
      // Only add to filteredBookmarks if it matches the current tag filter
      const searchTerms = tagSearch
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag);
      const bookmarkTags = Array.isArray(bookmark.tags) ? bookmark.tags : [];
      const matchesFilter =
        !searchTerms.length ||
        bookmarkTags.some((tag) => searchTerms.some((term) => tag.toLowerCase().includes(term)));
      if (matchesFilter) {
        setFilteredBookmarks((prev) => (Array.isArray(prev) ? [...prev, bookmark] : [bookmark]));
      }
    } else if (bookmark?._id || bookmark?.tempId) {
      // Handle delete case
      const id = bookmark._id || bookmark.tempId;
      console.log('Deleting bookmark with ID:', id);
      setBookmarks((prev) => (Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []));
      setFilteredBookmarks((prev) => (Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []));
    }
  };

  if (isAuthLoading || !user) return null;

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const logoutBg = theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

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
            className={`block text-base font-medium ${labelColor} mb-2 transition-colors duration-300`}
          >
            Search Tags (comma-separated)
          </label>
          <input
            id="tagSearch"
            type="text"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            title="Enter tags separated by commas to filter bookmarks"
            className={`w-full p-3 border rounded-lg ${inputBg} text-base focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            placeholder="e.g., AI, Tech"
          />
        </div>
        <BookmarkList bookmarks={filteredBookmarks} setBookmarks={setFilteredBookmarks} />
      </div>
    </div>
  );
}

export default Dashboard;
