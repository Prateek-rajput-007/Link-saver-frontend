

import { useState, useContext } from 'react';
import axios from 'axios';
import ThemeContext from '../context/ThemeContext';

function BookmarkCard({ bookmark, onDelete, onDragStart, onDragOver, onDrop }) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://link-saver-backend-bi2u.onrender.com/api/bookmarks/${bookmark._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      onDelete(bookmark._id);
    } catch (error) {
      console.error('Error deleting bookmark:', error.response?.data?.message || error.message);
      alert('Failed to delete bookmark');
    }
  };

  const toggleSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const linkColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const buttonColor = theme === 'dark' ? 'text-blue-400' : 'text-blue-500';
  const deleteColor = theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600';
  const tagBg = theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100';
  const tagText = theme === 'dark' ? 'text-blue-200' : 'text-blue-800';
  const dropdownBg = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  return (
    <div
      className={`bookmark-card ${cardBg} p-4 rounded-lg shadow-md mb-4 relative transition-colors duration-300`}
      draggable
      onDragStart={(e) => onDragStart(e, bookmark._id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, bookmark._id)}
    >
      <div className="flex items-center">
        <img
          src={bookmark.favicon}
          alt="Favicon"
          className="w-6 h-6 mr-3"
          onError={(e) => (e.target.src = '/default-favicon.png')}
        />
        <div className="flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg font-semibold ${linkColor} hover:underline`}
          >
            {bookmark.title}
          </a>
          <div className="relative">
            <p className={`${textColor} mt-1`}>
              {bookmark.summary?.slice(0, 200)}
              {bookmark.summary?.length > 200 && !isSummaryOpen && '...'}
            </p>
            {bookmark.summary?.length > 200 && (
              <button
                onClick={toggleSummary}
                className={`${buttonColor} hover:underline text-sm mt-1`}
              >
                {isSummaryOpen ? 'Show less' : 'Show more'}
              </button>
            )}
            {isSummaryOpen && (
              <div className={`absolute z-10 summary-dropdown border ${dropdownBg} rounded-lg p-3 mt-2 w-full shadow-lg transition-colors duration-300`}>
                <p className={`${textColor}`}>
                  {bookmark.summary?.slice(0, 800)}
                  {bookmark.summary?.length > 800 && '...'}
                </p>
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {bookmark.tags?.map((tag) => (
              <span
                key={tag}
                className={`${tagBg} ${tagText} text-sm px-2 py-1 rounded transition-colors duration-300`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`ml-4 ${deleteColor}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookmarkCard;
