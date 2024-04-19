import { useUploads } from '@/contexts/UploadsContext';
import { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messageColor, setMessageColor] = useState<string>('');
    const { fetchUploads } = useUploads(); // Ensure this line is added if not already present

    const displayMessage = (msg: string, color: string) => {
        setMessage(msg);
        setMessageColor(color);
        setTimeout(() => {
            setMessage('');
            setMessageColor('');
        }, 3000);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            displayMessage('Please select a file first!', 'red');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                displayMessage('File uploaded successfully!', 'green');
                setFile(null); 
                fetchUploads(); // Fetch uploads for today's date
            } else {
                displayMessage('Failed to upload file.', 'red');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            displayMessage('Error uploading file.', 'red');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg mb-10">
            <h2>Rechnungen hochladen:</h2>
            <input type="file" onChange={handleFileChange} className="my-2 p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Upload</button>
            {message && <div style={{color: messageColor}} className="mt-2">{message}</div>}
        </form>
    );
};

export default FileUpload;

