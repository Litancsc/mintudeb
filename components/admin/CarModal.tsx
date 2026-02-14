'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Car {
  _id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  seats: number;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  mainImage: string;
  images: string[];
  description: string;
  features: string[];
  available: boolean;
  mileage: string;
  color: string;
  licensePlate: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

interface CarModalProps {
  car: Car | null;
  onClose: () => void;
  onSave: (car: Car) => void;
}

const CarModal = ({ car, onClose, onSave }: CarModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Car>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Economy',
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    mainImage: '',
    images: [],
    description: '',
    features: [],
    available: true,
    mileage: '',
    color: '',
    licensePlate: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        type: car.type || 'Economy',
        seats: car.seats || 5,
        transmission: car.transmission || 'Automatic',
        fuelType: car.fuelType || 'Petrol',
        pricePerDay: car.pricePerDay || 0,
        pricePerWeek: car.pricePerWeek || 0,
        pricePerMonth: car.pricePerMonth || 0,
        mainImage: car.mainImage || '',
        images: car.images || [],
        description: car.description || '',
        features: car.features || [],
        available: car.available ?? true,
        mileage: car.mileage || '',
        color: car.color || '',
        licensePlate: car.licensePlate || '',
        metaTitle: car.metaTitle || '',
        metaDescription: car.metaDescription || '',
        metaKeywords: car.metaKeywords || [],
      });
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      });
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setFormData({
        ...formData,
        metaKeywords: [...formData.metaKeywords, newKeyword.trim()],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setFormData({
      ...formData,
      metaKeywords: formData.metaKeywords.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name || !formData.brand || !formData.model || !formData.mainImage || !formData.description) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const url = car ? `/api/cars/${car._id}` : '/api/cars';
      const method = car ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedCar = await response.json();
        toast.success(car ? 'Car updated successfully' : 'Car created successfully');
        onSave(savedCar);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save car');
      }
    } catch {
      toast.error('Error saving car');
    } finally {
      setIsSubmitting(false);
    }
  };

  const carTypes = ['Economy', 'Luxury', 'SUV', 'Sports', 'Van', 'Electric'];
  const transmissionTypes = ['Automatic', 'Manual'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            {car ? 'Edit Car' : 'Add New Car'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Car Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Mercedes-Benz S-Class"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Mercedes-Benz"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., S-Class"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {carTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Black"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g., 15,000 km"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="e.g., ABC-1234"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    min="2"
                    max="15"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {transmissionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Day ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Week ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    value={formData.pricePerWeek}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Month ($)
                  </label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={formData.pricePerMonth}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Images</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleChange}
                  placeholder="https://example.com/car-image.jpg"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/car-image.jpg"
                    className="input-field flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="btn-primary"
                  >
                    <FaPlus />
                  </button>
                </div>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1 text-sm text-gray-600 truncate">{image}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Description</h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the car..."
                rows={4}
                className="input-field resize-none"
                required
              />
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Features</h3>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g., Air Conditioning, GPS Navigation"
                  className="input-field flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn-primary"
                >
                  <FaPlus />
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="badge badge-gold flex items-center space-x-2"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO Settings */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    placeholder="Leave blank for auto-generation"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    placeholder="Leave blank for auto-generation"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="e.g., luxury car rental"
                      className="input-field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="btn-primary"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  {formData.metaKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.metaKeywords.map((keyword, index) => (
                        <div
                          key={index}
                          className="badge badge-gold flex items-center space-x-2"
                        >
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="w-5 h-5 text-gold focus:ring-gold border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as available for booking
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner mr-2" />
                  Saving...
                </>
              ) : (
                car ? 'Update Car' : 'Create Car'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarModal;
