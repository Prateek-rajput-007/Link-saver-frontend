// import { useEffect } from 'react';

// function ThemeToggle({ theme, setTheme }) {
//   useEffect(() => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [theme]);

//   return (
//     <button
//       onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//       className="p-2 rounded-full gradient-button text-white"
//       aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
//     >
//       {theme === 'dark' ? '☀️' : '🌙'}
//     </button>
//   );
// }

// export default ThemeToggle;

import { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full gradient-button text-white"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;