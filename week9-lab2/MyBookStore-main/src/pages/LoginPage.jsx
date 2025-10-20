import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/outline';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // small client-side delay to simulate auth request
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Validate credentials (local / demo only)
      if (username === 'bookstoreadmin' && password === 'ManageBook68') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/store-manager/all-books');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-viridian-600 to-green-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center">
            <LockClosedIcon className="h-10 w-10 text-viridian-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            เข้าสู่ระบบ BackOffice
          </h2>
          <p className="mt-2 text-center text-sm text-viridian-100">
            สำหรับผู้ดูแลระบบเท่านั้น
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300
                    rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-viridian-500 focus:border-viridian-500"
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300
                    rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-viridian-500 focus:border-viridian-500"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-3 px-4 border border-transparent
                  rounded-lg shadow-sm text-sm font-medium text-white bg-viridian-600
                  hover:bg-viridian-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                  focus:ring-viridian-500 transition-colors duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : null}
                {loading ? 'กำลังยืนยัน...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-white hover:text-viridian-100 transition-colors">
            ← กลับสู่หน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
