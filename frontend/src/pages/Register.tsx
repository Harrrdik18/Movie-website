import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { registerUser, clearError } from '../redux/slices/userSlice';
import { selectIsAuthenticated, selectUserLoading, selectUserError } from '../redux/selectors/userSelectors';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  const displayError = error || validationError;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="border border-[#2a2a2a] p-8 lg:p-10">
          <h2 className="font-serif text-3xl text-[#f5f5f1] mb-8">Create Account</h2>

          {displayError && (
            <div className="mb-6 p-3 border border-[#c9774d]/30 bg-[#c9774d]/5">
              <span className="text-sm text-[#c9774d]">{displayError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c9774d] transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c9774d] transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c9774d] transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-[#2a2a2a] px-4 py-3 text-[#f5f5f1] text-sm placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#c9774d] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[#c9774d] text-[#c9774d] py-3 text-sm uppercase tracking-[0.15em] hover:bg-[#c9774d] hover:text-[#0a0a0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#9ca3af]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#f5f5f1] hover:text-[#c9774d] transition-colors underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
