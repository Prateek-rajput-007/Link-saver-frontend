import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkList from '../components/BookmarkList';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import ThemeContext from '../context/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get('https://link-saver-drab.vercel.app/api/bookmarks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Ensure response data is an array
        const data = res.data;
        if (!Array.isArray(data)) {
          console.warn('Expected array but received:', data);
          setBookmarks([]);
          setError('Invalid data format received from server');
          return;
        }

        setBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to load bookmarks';
        setError(errorMessage);
        
        if (error.response?.status === 401) {
          logout();
          navigate('/login', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, isAuthLoading, navigate, logout]);

  const handleAddBookmark = (bookmark, isUpdate = false) => {
    try {
      if (isUpdate) {
        setBookmarks((prev) =>
          prev.map((b) => (b._id === bookmark._id ? bookmark : b))
        );
      } else if (bookmark) {
        setBookmarks((prev) => [...prev, bookmark]);
      } else {
        setBookmarks((prev) => prev.filter((b) => b._id !== bookmark._id));
      }
    } catch (err) {
      console.error('Error updating bookmarks:', err);
      setError('Failed to update bookmarks');
    }
  };

  if (isAuthLoading || !user) return <LoadingSpinner />;

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const logoutBg = theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600';

  return (
    <div className={`container mx-auto p-4 min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${textColor}`}>Link Saver</h1>
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

      {isLoading ? (
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className={`p-4 mb-4 rounded-lg ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} ${textColor}`}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-sm rounded hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <BookmarkForm onAdd={handleAddBookmark} />
          <BookmarkList 
            bookmarks={bookmarks} 
            setBookmarks={setBookmarks} 
            onError={(err) => setError(err)}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
