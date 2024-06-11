import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
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
                    <FileInput type='file' accept='image/*' />
                    <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline > Upload Image</Button>

                </div>
                <ReactQuill theme='snow' placeholder='Write Something...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone='purpleToBlue'>
                    Publish
                </Button>
            </form>

        </div>
    )
}
