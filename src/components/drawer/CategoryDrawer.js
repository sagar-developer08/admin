import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryServices from 'services/CategoryServices';

const CategoryDrawer = ({ id, onUpdate }) => {
  const { t } = useTranslation();
  const [storeData, setStoreData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      CategoryServices.getCategoryById(id)
        .then(res => {
          setStoreData(res); // Ensure the data structure matches the state
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
    CategoryServices.updateCategory(id, storeData)
      .then(res => {
        console.log('Store updated successfully', res);
        toast.success('Store updated successfully');
        onUpdate(res); // Call onUpdate to update the parent component
      })
      .catch(err => {
        console.error('Error updating store', err);
        toast.error('Error updating store');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name.toLowerCase()]: value // Ensure keys are correctly named
    }));
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
      <h2 className="text-xl font-semibold mb-4">{t('Edit Category')}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
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
              name="description"
              value={storeData.description || ''}
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
            {t('Update Category')}
          </button>
        </form>
      )}
    </div>
  );
};

export default CategoryDrawer;