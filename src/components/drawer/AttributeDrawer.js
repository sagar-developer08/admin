import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BrandServices from 'services/BrandServices';
import { FiUploadCloud } from 'react-icons/fi';

const AttributeDrawer = ({ id, onUpdate }) => {
  const { t } = useTranslation();
  const [storeData, setStoreData] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      BrandServices.getBrandById(id)
        .then(res => {
          setStoreData(res); // Ensure the data structure matches the state
          if (res.brand_logo) {
            setPreviewLogo(res.brand_logo);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all text fields from storeData
    Object.keys(storeData).forEach(key => {
      if (key !== 'brand_logo' && typeof storeData[key] !== 'object') {
        formData.append(key, storeData[key]);
      }
    });
    
    // Add brand logo if a new one was selected
    if (brandLogo) {
      formData.append('brand_logo', brandLogo);
    }
    
    // Send the update request with FormData
    BrandServices.updateBrand(id, formData)
      .then(res => {
        console.log('Brand updated successfully', res);
        toast.success('Brand updated successfully');
        if (onUpdate) onUpdate(res); // Call onUpdate to update the parent component
      })
      .catch(err => {
        console.error('Error updating brand', err);
        toast.error('Error updating brand: ' + (err.message || 'Unknown error'));
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name.toLowerCase()]: value // Ensure keys are correctly named
    }));
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrandLogo(file);
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaqChange = (index, key, value) => {
    const updatedFaqs = [...storeData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [key]: value };
    setStoreData(prev => ({
      ...prev,
      faqs: updatedFaqs
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t('Edit Brand')}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Brand Logo')}
            </label>
            <div className="flex items-center space-x-4">
              {previewLogo && (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <img 
                    src={previewLogo} 
                    alt="Brand Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                <FiUploadCloud className="w-6 h-6" />
                <span className="mt-2 text-xs leading-normal">{t('Select Logo')}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Name')}
            </label>
            <input
              type="text"
              name="name"
              value={storeData.name || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Meta Title')}
            </label>
            <input
              type="text"
              name="meta_title"
              value={storeData.meta_title || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Meta Description')}
            </label>
            <textarea
              name="meta_description"
              value={storeData.meta_description || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Title')}
            </label>
            <input
              type="text"
              name="title"
              value={storeData.title || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Description')}
            </label>
            <textarea
              name="content"
              value={storeData.content || ''}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('FAQs')}
            </label>
            {Array.isArray(storeData.faqs) && storeData.faqs.length > 0 ? (
              storeData.faqs.map((faq, index) => (
                <div key={index} className="mb-4">
                  <div className="mb-2">
                    <strong>{t('Question')} {index + 1}:</strong>
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div>
                    <strong>{t('Answer')} {index + 1}:</strong>
                    <textarea
                      value={faq.answer || ''}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>N/A</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {t('Update Brand')}
          </button>
        </form>
      )}
    </div>
  );
};

export default AttributeDrawer;