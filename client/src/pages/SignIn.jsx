import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'; // Adjusted import path
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('All fields are required!'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const text = await res.text(); // Read the response as text
      const data = text ? JSON.parse(text) : {}; // Parse the text if it's not empty

      if (!res.ok || data.success === false) {
        return dispatch(signInFailure(data.message || 'Failed to sign in!'));
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      return dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'}`}>
      <div style={{ maxWidth: '36rem' }} className={`w-4/5 p-8 shadow-lg mx-auto mt-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <Label value="Your Email" className={theme === 'dark' ? 'text-gray-200' : ''} />
            <TextInput
              type="text"
              placeholder="Email"
              id="email"
              onChange={handleChange}
              className={theme === 'dark' ? 'text-gray-900' : ''}
            />
          </div>
          <div>
            <Label value="Your Password" className={theme === 'dark' ? 'text-gray-200' : ''} />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
              className={theme === 'dark' ? 'text-gray-900' : ''}
            />
          </div>
          <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : 'Sign In'}
          </Button>
          <OAuth />
        </form>
        <div className="flex gap-2 text-sm mt-2">
          <span>Don't have an account?</span>
          <Link to="/sign-up" className="text-red-500">
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
