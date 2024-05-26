import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div style={{ maxWidth: '36rem' }} className="w-4/5 bg-white p-8 shadow-lg mx-auto mt-5">
        <form className="flex flex-col gap-5">
          <div>
            <Label value="Your Username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
            ></TextInput>
          </div>
          <div>
            <Label value="Your Email" />
            <TextInput
              type="text"
              placeholder="Email"
              id="email"
            ></TextInput>
          </div>
          <div>
            <Label value="Your Password" />
            <TextInput
              type="password"
              placeholder="Password"
              id="password"
            ></TextInput>
          </div>
          <Button gradientDuoTone="purpleToBlue" type="submit">
            Sign Up
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-2">
          <span>Already have an account?</span>
          <Link to="sign-in" className="text-red-500">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
