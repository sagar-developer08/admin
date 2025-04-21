import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestimonialServices from 'services/TestimonialServices';

const TestimonilasDrawer = ({ id, onUpdate }) => {
    const { t } = useTranslation();
    const [storeData, setStoreData] = useState({ name: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            TestimonialServices.getTestimonialsById(id)
                .then(res => {
                    setStoreData(res.data); // Ensure the data structure matches the state
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
        // Handle form submission to update store
        TestimonialServices.updateTestimonials(id, storeData)
            .then(res => {
                // Handle success
                console.log('Store updated successfully', res);
                toast.success('Store updated successfully');
                onUpdate(res); // Call onUpdate to update the parent component
            })
            .catch(err => {
                // Handle error
                console.error('Error updating store', err);
                toast.error('Error updating store');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to ${value}`); // Debugging log
        setStoreData(prev => ({
            ...prev,
            [name.toLowerCase()]: value // Ensure keys are correctly named
        }));
        console.log(storeData); // Debugging log
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('Edit Testimonilas')}</h2>

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
                            {t('Message')}
                        </label>
                        <input
                            type="textarea"
                            name="message"
                            value={storeData.message || ''}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {t('Update Testimonilas')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default TestimonilasDrawer;