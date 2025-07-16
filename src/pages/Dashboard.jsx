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

        console.log('Fetched bookmarks:', res.data);

        // Defensive fallback
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setBookmarks(data);
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

  const handleAddBookmark = (bookmark, isUpdate = false) => {
    if (!bookmark) return;

    if (isUpdate) {
      setBookmarks((prev) =>
        prev.map((b) => (b._id === bookmark._id ? bookmark : b))
      );
    } else {
      setBookmarks((prev) => [...prev, bookmark]);
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
