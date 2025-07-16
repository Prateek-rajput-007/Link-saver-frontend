import { useState } from 'react';

function AuthForm({ onSubmit, buttonText }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isRegisterPage = window.location.pathname === '/register';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{buttonText}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              {buttonText}
            </button>
            {!isRegisterPage && (
              <button
                type="button"
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                onClick={() => window.location.href = '/register'}
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;