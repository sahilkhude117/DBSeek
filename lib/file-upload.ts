'use client'
import axios from 'axios';
import { useState } from 'react';

export async function uploadFile(file: File) {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file); // Use the key 'file' as expected by the API

    // Make the POST request to the /api/upload endpoint
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type
      },
    });

    // Log the response from the server
    console.log('Upload successful:', response.data);
    return response.data.schema;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}