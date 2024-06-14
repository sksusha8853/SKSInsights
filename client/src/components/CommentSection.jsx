import { Button, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert } from 'flowbite-react';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
      }
      else {


      }

    }
    catch (error) {
      setCommentError(error.message);
    }

  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {
        currentUser ? (
          <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
            <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500'>
              @{currentUser.username}
            </Link>
          </div>

        ) : (
          <div className='text-sm text-green-700 my-5 flex gap-1'>
            You must be signed in to comment.
            <Link className='text-blue-500 hover:underline' to='/sign-in'>
              Sign In
            </Link>
          </div>

        )
      }

      {
        currentUser && (
          <form onSubmit={handleSubmit} className='border border-teal-500 rounded-tl-3xl rounded-br-3xl p-3'>
            <Textarea
              placeholder='What is your thoughts?'
              rows='3'
              maxLength='300'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className='flex justify-between items-center mt-5'>
              <p className='text-gray-500 text-sm'>{300 - comment.length} characters remaining</p>
              <Button gradientDuoTone='purpleToBlue' type='submit'>
                Submit
              </Button>
            </div>
            {commentError && <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>}
          </form>

        )
      }
    </div>
  )
}
