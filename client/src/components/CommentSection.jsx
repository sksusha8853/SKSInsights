import { Alert, Button, Modal, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaComment } from 'react-icons/fa';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length > 200) {
      setCommentError('Comment is too long. Maximum length is 200 characters.');
      return;
    }

    try {
      const response = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      } else {
        setCommentError(data.message || 'Failed to create comment.');
      }
    } catch (error) {
      setCommentError('Error: ' + error.message);
    }
  };


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getPostComments/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };
    fetchComments();
  }, [postId]);

  const handleApplaud = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const response = await fetch(`/api/comment/applaudComment/${commentId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, applauds: data.applauds, numberOfApplauds: data.applauds.length }
              : comment
          )
        );
      } else {
        console.error('Failed to applaud comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error applauding comment:', error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);

    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    try {
      const response = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } else {
        console.error('Failed to delete comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-tl-3xl rounded-br-3xl p-3'
        >
          <Textarea
            placeholder='What are your thoughts?'
            rows='3'
            maxLength='250'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {250 - comment.length} characters remaining
            </p>
            <Button gradientDuoTone='purpleToBlue' type='submit' >
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-l my-5 flex items-center gap-1'>
            <p><FaComment /> </p>
            <p>{comments.length}</p>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onApplaud={handleApplaud}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure.
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel.
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}