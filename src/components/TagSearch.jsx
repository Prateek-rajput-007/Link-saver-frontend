import { useState, useEffect } from 'react';

function TagSearch({ bookmarks, setFilteredBookmarks }) {
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Get unique tags from all bookmarks
  const allTags = [...new Set(bookmarks.flatMap((bookmark) => bookmark.tags || []))];

  // Filter bookmarks based on selected tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredBookmarks(bookmarks);
      return;
    }
    const filtered = bookmarks.filter((bookmark) =>
      bookmark.tags?.some((tag) => selectedTags.includes(tag))
    );
    setFilteredBookmarks(filtered);
  }, [selectedTags, bookmarks, setFilteredBookmarks]);

  // Handle tag input
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  // Add tags from input
  const handleAddTags = (e) => {
    e.preventDefault();
    const newTags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && allTags.includes(tag));
    if (newTags.length > 0) {
      setSelectedTags((prev) => [...new Set([...prev, ...newTags])]);
      setTagInput('');
    }
  };

  // Toggle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all selected tags
  const clearTags = () => {
    setSelectedTags([]);
    setTagInput('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Filter by Tags</h2>
      <form onSubmit={handleAddTags} className="flex gap-6 mb-6">
        <div className="flex-1">
          <label
            htmlFor="tagInput"
            className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
          >
            Enter Tags (comma-separated)
          </label>
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={handleTagInput}
            title="Enter tags separated by commas to filter bookmarks"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
          />
        </div>
        <button
          type="submit"
          className="gradient-button text-white px-6 py-3 rounded-lg transition-colors duration-300 hover:bg-blue-600 dark:hover:bg-blue-500"
        >
          Add Tags
        </button>
      </form>
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">
            Suggested Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded text-base transition-colors duration-300 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 dark:bg-blue-600 text-white'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-6">
          <p className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Selected Tags: {selectedTags.join(', ')}
          </p>
          <button
            onClick={clearTags}
            className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-base transition-colors duration-300"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default TagSearch;
