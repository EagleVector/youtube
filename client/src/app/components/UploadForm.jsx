'use client'
import React, { useState } from 'react'
import axios from "axios";

const UploadForm = () => {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('filename', selectedFile.name);
      const initializeRes = await axios.post('http://localhost:8000/upload/initialize',
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { uploadId } = initializeRes.data;
      console.log('Upload Id is: ', uploadId);

      const chunkSize = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);

      let start = 0;
      const uploadPromises = [];


      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;

        const chunkFormData = new FormData();
        chunkFormData.append('filename', selectedFile.name);
        chunkFormData.append('chunk', chunk);
        chunkFormData.append('totalChunks', totalChunks);
        chunkFormData.append('chunkIndex', chunkIndex);
        chunkFormData.append('uploadId', uploadId)

        const uploadPromise =  axios.post('http://localhost:8000/upload', chunkFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      const completeRes = await axios.post('http://localhost:8000/upload/complete', {
        filename: selectedFile.name,
        totalChunks: totalChunks,
        uploadId: uploadId
      });

      console.log(completeRes.data);
    } catch (error) {
      console.log('Error Uploading File: ', error);
    }
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   handleFileUpload(selectedFile);
  // };

  // const handleFileUpload = async (file) => {
  //   try {

  //     const chunkSize = 2 * 1024 * 1024;
  //     const totalChunks = Math.ceil(file.size/chunkSize);
  //     console.log(file.size);
  //     console.log(chunkSize);
  //     console.log(totalChunks);

  //     let start = 0;

  //     for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
  //       const chunk = file.slice(start, start + chunkSize);
  //       start += chunkSize;

  //       const formData = new FormData();
  //       formData.append('filename', file.name);
  //       formData.append('chunk', chunk);
  //       formData.append('totalChunks', totalChunks);
  //       formData.append('chunkIndex', chunkIndex);

  //       console.log(chunkIndex, '-------', chunk);

  //       console.log('Uploading Chunk ', chunkIndex + 1, ' of ', totalChunks);

  //       console.log('Going to Upload File to Server');
  //       const res = await axios.post('http://localhost:8000/upload', 
  //       formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       });
  //       console.log(res.data);
  //     }
  
  //   } catch (error) {
  //     console.error('Error Uploading File: ', error);
  //   }
  // };

  return (
    <div className='m-10'>
     <form encType="multipart/form-data">
       <input type="file" name="file" onChange={handleFileChange} />
       <button
         type="button"
         onClick={handleUpload}
         className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
       >
         Upload
       </button>
     </form>
   </div>

  )
}

export default UploadForm;