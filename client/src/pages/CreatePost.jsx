import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageFileUploadError('Please select an image.');
                return;
            }
            setImageFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name; // Changed from `imageFile.name` to `file.name`
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file); // Changed from `imageFile` to `file`

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError('File must be an image and less than 2MB.');
                    setImageFileUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileUploadError(null);
                        setImageFileUploadProgress(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        }
        catch (error) {
            setImageFileUploadError('Image upload failed.');
            setImageFileUploadProgress(null);
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>
                Create a post
            </h1>
            <form className='flex flex-col gap-5'>
                <div className='flex flex-col gap-5'>
                    <TextInput id='title' type='text' placeholder='Title' required />
                    <Select>
                        <option value="uncategorized">Select a category</option>
                        <option value="competitiveprogramming">Competitive Programming</option>
                        <option value="dsa">DSA (Data Structures and Algorithms)</option>
                        <option value="webdevelopment">Web Development</option>
                        <option value="mobiledevelopment">Mobile Development</option>
                        <option value="machinelearning">Machine Learning</option>
                        <option value="artificialintelligence">Artificial Intelligence</option>
                        <option value="datascience">Data Science</option>
                        <option value="devops">DevOps</option>
                        <option value="iot">Internet of Things (IoT)</option>
                        <option value="blockchain">Blockchain</option>
                        <option value="augmentedreality">Augmented Reality (AR)</option>
                        <option value="virtualreality">Virtual Reality (VR)</option>
                        <option value="traveling">Traveling</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-400 p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageFileUploadProgress} >
                        {
                            imageFileUploadProgress ?
                                (<div className='w-12 h-12'>
                                    <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress || 0}%`} />
                                </div>)
                                : ('Upload Image')
                        }
                    </Button>
                </div>
                {imageFileUploadError && (
                    <Alert color='failure' className='mt-4'>
                        {imageFileUploadError}
                    </Alert>
                )}
                {formData.image && (
                    <img
                    src={formData.image}
                    alt='image'
                    className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill theme='snow' placeholder='Write Something...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone='purpleToBlue'>
                    Publish
                </Button>
            </form>
        </div>
    )
}
