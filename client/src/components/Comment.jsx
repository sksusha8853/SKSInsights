import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import { PiHandsClappingLight } from 'react-icons/pi';
import { FaHandsClapping } from "react-icons/fa6";

export default function Comment({ comment, onApplaud, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/user/${comment.userId}`);
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          console.error('Failed to fetch user:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };
    fetchUser();
  }, [comment]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (response.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      } else {
        const data = await response.json();
        console.error('Failed to save comment:', data.message);
      }
    } catch (error) {
      console.error('Error saving comment:', error.message);
    }
  };
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ?
          (
            <>
              <Textarea
                className='mb-2'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className='flex justify-end gap-2 text-xs'>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) :
          (
            <>
              <p className='text-gray-500 pb-2'>{comment.content}</p>
              <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                <button
                  type='button'
                  onClick={() => onApplaud(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                    comment.applauds.includes(currentUser._id) &&
                    '!text-blue-500'
                    }`}
                >
                  <FaHandsClapping className='text-sm' />
                </button>
                <p className='text-gray-400'>
                  {comment.numberOfApplauds > 0 &&
                    comment.numberOfApplauds}
                </p>
                {currentUser &&
                  (currentUser._id === comment.userId) && (
                    <>
                      <button
                        type='button'
                        onClick={handleEdit}
                        className='text-gray-400 hover:text-blue-500'
                      >
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => onDelete(comment._id)}
                        className='text-gray-400 hover:text-red-500'
                      >
                        Delete
                      </button>
                    </>
                  )}
              </div>
            </>
          )}
      </div>
    </div>
  );
}