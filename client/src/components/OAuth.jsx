import React from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { getAuth } from 'firebase/auth';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClickForGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            // console.log(resultsFromGoogle);
            const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoURL:resultsFromGoogle.user.photoURL, 
                }),

            })
            const data = await res.json();
            if(res.ok){
                dispatch(signInSuccess(data));
                navigate('/');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleClickForGoogle}>
            <AiFillGoogleCircle className='w-6 h-6 mr-3' /> Continue with Google
        </Button>
    )
}
