import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const ItemUploadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'lost', // Default to 'lost'
    title: '',
    description: '',
    category: '',
    subcategory: '',
    color: '',
    brand: '',
    model: '',
    size: '',
    material: '',
    condition: '',
    location: null,
    locationType: 'point',
    imageFile: null,
    imagePreview: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile' && key !== 'imagePreview' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image file if exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      // Send to backend
      const response = await api.post('/items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redirect to item details page or show success message
      navigate(`/items/${response.data.id}`);
    } catch (error) {
      console.error('Error uploading item:', error);
      // Handle error (show error message to user)
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Report Lost or Found Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="lost"
              checked={formData.type === 'lost'}
              onChange={handleChange}
              className="mr-2"
            />
            Lost Item
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="found"
              checked={formData.type === 'found'}
              onChange={handleChange}
              className="mr-2"
            />
            Found Item
          </label>
        </div>

        {/* Required Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category*</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Optional Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          {formData.imagePreview && (
            <div className="mt-2">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Location Selection (Placeholder for MapBox integration) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 h-48 bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-500">MapBox integration coming soon</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemUploadForm; 