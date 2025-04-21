// components/drawer/StoreDrawer.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoreServices from 'services/StoreServices';

const StoreDrawer = ({ id }) => {
    const { t } = useTranslation();
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            StoreServices.getStoreById(id)
                .then(res => {
                    setStoreData(res);
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
        StoreServices.updateStore(id, storeData)
            .then(res => {
                // Handle success
                console.log('Store updated successfully', res);
            })
            .catch(err => {
                // Handle error
                console.error('Error updating store', err);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoreData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('Edit Store')}</h2>
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            {t('Store Services')}
                        </label>
                        <input
                            type="text"
                            name="StoreServices"
                            value={storeData?.StoreServices || ''}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            {t('Store Address')}
                        </label>
                        <input
                            type="text"
                            name="StoreAddress"
                            value={storeData?.StoreAddress || ''}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        {t('Update Store')}
                    </button>
                </form>
            )}
        </div>
    );
};

export default StoreDrawer;