import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Some fields are missing!');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const text = await res.text(); // Read the response as text
      const data = text ? JSON.parse(text) : {}; // Parse the text if it's not empty
      if (data.success === false) {
        setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div style={{ maxWidth: '36rem' }} className="w-4/5 bg-white p-8 shadow-lg mx-auto mt-5">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <Label value="Your Username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
            ></TextInput>
          </div>
          <div>
            <Label value="Your Email" />
            <TextInput
              type="text"
              placeholder="Email"
              id="email"
              onChange={handleChange}
            ></TextInput>
          </div>
          <div>
            <Label value="Your Password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            ></TextInput>
          </div>
          <Button gradientDuoTone="purpleToBlue" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className='pl-3'> Loading...</span>
              </>
            ) : 'Sign Up'}
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-2">
          <span>Already have an account?</span>
          <Link to="/sign-in" className="text-red-500">
            Sign In
          </Link>
        </div>
        {errorMessage && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
