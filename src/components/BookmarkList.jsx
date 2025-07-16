// // import { useState } from 'react';
// // import axios from 'axios';
// // import BookmarkCard from './BookmarkCard';

// // function BookmarkList({ bookmarks, setBookmarks }) {
// //   const [draggedId, setDraggedId] = useState(null);

// //   const handleDragStart = (e, id) => {
// //     setDraggedId(id);
// //     e.dataTransfer.setData('text/plain', id);
// //   };

// //   const handleDragOver = (e) => {
// //     e.preventDefault();
// //   };

// //   const handleDrop = async (e, dropId) => {
// //     e.preventDefault();
// //     if (draggedId === dropId) return;

// //     const newBookmarks = [...bookmarks];
// //     const draggedIndex = newBookmarks.findIndex((b) => b._id === draggedId);
// //     const dropIndex = newBookmarks.findIndex((b) => b._id === dropId);
// //     const [draggedBookmark] = newBookmarks.splice(draggedIndex, 1);
// //     newBookmarks.splice(dropIndex, 0, draggedBookmark);

// //     setBookmarks(newBookmarks);

// //     try {
// //       await axios.put(
// //         'http://localhost:5000/api/bookmarks/order',
// //         { bookmarks: newBookmarks.map((b, index) => ({ _id: b._id, order: index })) },
// //         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
// //       );
// //     } catch (error) {
// //       console.error('Error updating bookmark order:', error.response?.data?.message || error.message);
// //       alert('Failed to update bookmark order');
// //     }
// //   };

// //   const handleDelete = (id) => {
// //     setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
// //   };

// //   return (
// //     <div className="mt-6">
// //       {bookmarks.length === 0 ? (
// //         <p className="text-gray-500 dark:text-gray-400">No bookmarks yet.</p>
// //       ) : (
// //         bookmarks.map((bookmark) => (
// //           <BookmarkCard
// //             key={bookmark._id}
// //             bookmark={bookmark}
// //             onDelete={handleDelete}
// //             onDragStart={handleDragStart}
// //             onDragOver={handleDragOver}
// //             onDrop={handleDrop}
// //           />
// //         ))
// //       )}
// //     </div>
// //   );
// // }

// // export default BookmarkList;

// import { useContext } from 'react';
// import axios from 'axios';
// import BookmarkCard from './BookmarkCard';
// import ThemeContext from '../context/ThemeContext';

// function BookmarkList({ bookmarks, setBookmarks }) {
//   const { theme } = useContext(ThemeContext);

//   const handleDelete = (id) => {
//     setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
//   };

//   const handleDragStart = (e, id) => {
//     e.dataTransfer.setData('text/plain', id);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (e, dropId) => {
//     e.preventDefault();
//     const draggedId = e.dataTransfer.getData('text/plain');
//     if (draggedId === dropId) return;

//     const newBookmarks = [...bookmarks];
//     const draggedIndex = newBookmarks.findIndex((b) => b._id === draggedId);
//     const dropIndex = newBookmarks.findIndex((b) => b._id === dropId);
//     const [draggedBookmark] = newBookmarks.splice(draggedIndex, 1);
//     newBookmarks.splice(dropIndex, 0, draggedBookmark);

//     setBookmarks(newBookmarks);

//     try {
//       await axios.put(
//         'http://localhost:5000/api/bookmarks/order',
//         { bookmarks: newBookmarks.map((b, index) => ({ _id: b._id, order: index })) },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//     } catch (error) {
//       console.error('Error updating bookmark order:', error.response?.data?.message || error.message);
//       alert('Failed to update bookmark order');
//     }
//   };

//   const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
//   const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
//   const emptyTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

//   return (
//     <div className={`${cardBg} p-6 rounded-lg shadow-md transition-colors duration-300`}>
//       <h2 className={`text-xl font-bold ${headerColor} mb-4`}>Bookmarks</h2>
//       {bookmarks.length === 0 ? (
//         <p className={`${emptyTextColor}`}>No bookmarks yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {bookmarks.map((bookmark) => (
//             <BookmarkCard
//               key={bookmark._id}
//               bookmark={bookmark}
//               onDelete={handleDelete}
//               onDragStart={handleDragStart}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default BookmarkList;


import { useContext } from 'react';
import axios from 'axios';
import BookmarkCard from './BookmarkCard';
import ThemeContext from '../context/ThemeContext';

function BookmarkList({ bookmarks, setBookmarks }) {
  const { theme } = useContext(ThemeContext);

  const handleDelete = (id) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark._id !== id));
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, dropId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === dropId) return;

    const newBookmarks = [...bookmarks];
    const draggedIndex = newBookmarks.findIndex((b) => b._id === draggedId);
    const dropIndex = newBookmarks.findIndex((b) => b._id === dropId);
    const [draggedBookmark] = newBookmarks.splice(draggedIndex, 1);
    newBookmarks.splice(dropIndex, 0, draggedBookmark);

    setBookmarks(newBookmarks);

    try {
      await axios.put(
        'http://localhost:5000/api/bookmarks/order',
        { bookmarks: newBookmarks.map((b, index) => ({ _id: b._id, order: index })) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (error) {
      console.error('Error updating bookmark order:', error.response?.data?.message || error.message);
      alert('Failed to update bookmark order');
    }
  };

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const emptyTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${cardBg} p-6 rounded-lg shadow-md transition-colors duration-300`}>
      <h2 className={`text-xl font-bold ${headerColor} mb-4`}>Bookmarks</h2>
      {bookmarks.length === 0 ? (
        <p className={`${emptyTextColor}`}>No bookmarks yet.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              onDelete={handleDelete}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkList;