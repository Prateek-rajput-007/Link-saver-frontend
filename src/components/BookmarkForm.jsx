// // import { useState } from 'react';
// // import axios from 'axios';

// // function BookmarkForm({ onAdd }) {
// //   const [url, setUrl] = useState('');
// //   const [tags, setTags] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await axios.post(
// //         'http://localhost:5000/api/bookmarks',
// //         { url, tags: tags.split(',').map(tag => tag.trim()) },
// //         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
// //       );
// //       onAdd(res.data);
// //       setUrl('');
// //       setTags('');
// //     } catch (error) {
// //       console.error('Error saving bookmark:', error);
// //     }
// //   };

// //   return (
// //     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
// //       <h2 className="text-xl font-bold mb-4">Add Bookmark</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div className="mb-4">
// //           <label className="block text-sm font-medium mb-2">URL</label>
// //           <input
// //             type="url"
// //             value={url}
// //             onChange={(e) => setUrl(e.target.value)}
// //             className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
// //             required
// //           />
// //         </div>
// //         <div className="mb-4">
// //           <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
// //           <input
// //             type="text"
// //             value={tags}
// //             onChange={(e) => setTags(e.target.value)}
// //             className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
// //           />
// //         </div>
// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
// //         >
// //           Save Bookmark
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default BookmarkForm;

// import { useState, useContext } from 'react';
// import axios from 'axios';
// import ThemeContext from '../context/ThemeContext';

// function BookmarkForm({ onAdd }) {
//   const [url, setUrl] = useState('');
//   const [tags, setTags] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const { theme } = useContext(ThemeContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!url) {
//       setError('URL is required');
//       return;
//     }

//     setError('');
//     setIsSubmitting(true);

//     // Create optimistic bookmark
//     const tempId = `temp-${Date.now()}`;
//     const optimisticBookmark = {
//       _id: tempId,
//       url,
//       title: 'Fetching title...',
//       favicon: '/default-favicon.png',
//       summary: 'Fetching summary...',
//       tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//       order: 0,
//     };

//     // Add to UI immediately
//     onAdd(optimisticBookmark);

//     try {
//       const res = await axios.post(
//         'http://localhost:5000/api/bookmarks',
//         { url, tags: optimisticBookmark.tags },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );

//       // Replace optimistic bookmark with actual data
//       onAdd({ ...res.data, _id: tempId }, true);
//       setUrl('');
//       setTags('');
//     } catch (error) {
//       console.error('Error saving bookmark:', error.response?.data?.message || error.message);
//       setError(error.response?.data?.message || 'Failed to save bookmark');
//       onAdd({ _id: tempId }, false); // Remove optimistic bookmark on error
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
//   const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
//   const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
//   const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
//   const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
//   const inputText = theme === 'dark' ? 'text-white' : 'text-gray-900';
//   const inputFocus = theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500';
//   const errorColor = theme === 'dark' ? 'text-red-400' : 'text-red-500';

//   return (
//     <div className={`${cardBg} p-6 rounded-lg shadow-md mb-6 transition-colors duration-300`}>
//       <h2 className={`text-xl font-bold ${headerColor} mb-4`}>Add Bookmark</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label htmlFor="url" className={`block text-sm font-medium ${labelColor} mb-2`}>
//               URL
//             </label>
//             <input
//               id="url"
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               title="Enter a valid URL to bookmark"
//               className={`w-full p-2 border rounded-lg ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${inputFocus} transition-colors duration-300`}
//               required
//             />
//           </div>
//           <div className="flex-1">
//             <label htmlFor="tags" className={`block text-sm font-medium ${labelColor} mb-2`}>
//               Tags (comma-separated)
//             </label>
//             <input
//               id="tags"
//               type="text"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//               title="Enter tags separated by commas"
//               className={`w-full p-2 border rounded-lg ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${inputFocus} transition-colors duration-300`}
//             />
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="gradient-button text-white p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <span className="spinner border-2 border-t-white rounded-full w-4 h-4 animate-spin mr-2"></span>
//               Saving...
//             </>
//           ) : (
//             'Save Bookmark'
//           )}
//         </button>
//         {error && (
//           <p className={`${errorColor} text-sm mt-2`}>{error}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default BookmarkForm;
import { useState, useContext } from 'react';
import axios from 'axios';
import ThemeContext from '../context/ThemeContext';

function BookmarkForm({ onAdd }) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('URL is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Create optimistic bookmark
    const tempId = `temp-${Date.now()}`;
    const optimisticBookmark = {
      _id: tempId,
      url,
      title: 'Fetching title...',
      favicon: '/default-favicon.png',
      summary: 'Fetching summary...',
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      order: 0,
    };

    // Add to UI immediately
    onAdd(optimisticBookmark);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/bookmarks',
        { url, tags: optimisticBookmark.tags },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Replace optimistic bookmark with actual data
      onAdd({ ...res.data, _id: tempId }, true);
      setUrl('');
      setTags('');
    } catch (error) {
      console.error('Error saving bookmark:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Failed to save bookmark');
      onAdd({ _id: tempId }, false); // Remove optimistic bookmark on error
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const headerColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const inputText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputFocus = theme === 'dark' ? 'focus:ring-blue-400' : 'focus:ring-blue-500';
  const errorColor = theme === 'dark' ? 'text-red-400' : 'text-red-500';

  return (
    <div className={`${cardBg} p-6 rounded-lg shadow-md mb-6 transition-colors duration-300`}>
      <h2 className={`text-xl font-bold ${headerColor} mb-4`}>Add Bookmark</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="url" className={`block text-sm font-medium ${labelColor} mb-2`}>
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              title="Enter a valid URL to bookmark"
              className={`w-full p-2 border rounded-lg ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${inputFocus} transition-colors duration-300`}
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="tags" className={`block text-sm font-medium ${labelColor} mb-2`}>
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              title="Enter tags separated by commas"
              className={`w-full p-2 border rounded-lg ${inputBg} ${inputBorder} ${inputText} focus:ring-2 ${inputFocus} transition-colors duration-300`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="gradient-button text-white p-2 rounded-lg flex items-center justify-center w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner border-2 border-t-white rounded-full w-4 h-4 animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            'Save Bookmark'
          )}
        </button>
        {error && (
          <p className={`${errorColor} text-sm mt-2`}>{error}</p>
        )}
      </form>
    </div>
  );
}

export default BookmarkForm;