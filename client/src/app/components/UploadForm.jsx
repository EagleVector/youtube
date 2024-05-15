'use client'
import React, { useState } from 'react'
import axios from "axios";

const UploadForm = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('Going to Upload File to Server');
      const res = await axios.post('http://localhost:8000/upload', 
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(res.data);
  
    } catch (error) {
      console.error('Error Uploading File: ', error);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Choose File
          </label>
          <input 
            id="file"
            type="file" 
            onChange={handleFileChange} 
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadForm;