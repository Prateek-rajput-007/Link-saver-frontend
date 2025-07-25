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
        const res = await axios.get('https://link-saver-backend-bi2u.onrender.com/api/bookmarks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Ensure bookmarks is an array
        setBookmarks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching bookmarks:', {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        } else {
          setBookmarks([]);
        }
      }
    };

    fetchBookmarks();
  }, [user, isAuthLoading, navigate, logout]);

  const handleAddBookmark = (bookmark, isUpdate = false) => {
    if (isUpdate && bookmark) {
      console.log('Updating bookmark:', bookmark);
      setBookmarks((prev) =>
        Array.isArray(prev)
          ? prev.map((b) => ((b._id === bookmark._id || b._id === bookmark.tempId) ? { ...bookmark, _id: bookmark._id } : b))
          : [bookmark]
      );
    } else if (bookmark) {
      console.log('Adding bookmark:', bookmark);
      setBookmarks((prev) => (Array.isArray(prev) ? [...prev, bookmark] : [bookmark]));
    } else if (bookmark?._id || bookmark?.tempId) {
      const id = bookmark._id || bookmark.tempId;
      console.log('Deleting bookmark with ID:', id);
      setBookmarks((prev) => (Array.isArray(prev) ? prev.filter((b) => b._id !== id) : []));
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
      <BookmarkList bookmarks={bookmarks} setBookmarks={setBookmarks} />
    </div>
  );
}

export default Dashboard;
