import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductServices from 'services/ProductServices';
import { FiUploadCloud } from 'react-icons/fi';
import { Input, Textarea, Button } from '@windmill/react-ui';
import SwitchToggle from 'components/form/SwitchToggle';

const ProductEditDrawer = ({ id, onUpdate }) => {
  const { t } = useTranslation();
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      ProductServices.getProductById(id)
        .then(res => {
          setProductData(res);
          if (res.product_images && res.product_images.length > 0) {
            setPreviewImages(res.product_images);
          }
          setIsBestSeller(res.isbest_seller || false);
          setIsNewArrival(res.isnew_arrival || false);
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
    
    // Add all text fields from productData (except those we'll handle separately)
    // and don't include product_images to avoid overwriting existing images
    Object.keys(productData).forEach(key => {
      if (key !== 'product_images' && 
          key !== 'isbest_seller' && 
          key !== 'isnew_arrival' && 
          typeof productData[key] !== 'object') {
        formData.append(key, productData[key]);
      }
    });
    
    // The controller directly sets product.product_images = req.body.product_images
    // So we need to handle this properly to prevent image loss during edits
    if (productImages.length > 0) {
      // If new images are selected, add them to FormData
      for (let i = 0; i < productImages.length; i++) {
        formData.append('product_images', productImages[i]);
      }
      // When uploading new images, we need to let the backend know
      formData.append('has_new_images', 'true');
    } else {
      // If we don't have new images, we need to preserve the existing ones
      formData.append('has_new_images', 'false');
      
        // No new images uploaded - we need to tell the backend to keep the existing images
      // Since your backend controller has: product.product_images = req.body.product_images
      // We need to prevent this line from running when no new images are uploaded
      // 
      // Add a special flag that you can check in your controller
      formData.append('skip_image_update', 'true');
    }
    
    // Add flags for best seller and new arrival - convert to PROPER boolean strings
    // Ensure these values are sent as single boolean values, not arrays
    formData.append('isbest_seller', isBestSeller === true ? 'true' : 'false');
    formData.append('isnew_arrival', isNewArrival === true ? 'true' : 'false');
    
    // Send the update request with FormData
    ProductServices.updateProduct(id, formData)
      .then(res => {
        console.log('Product updated successfully', res);
        toast.success('Product updated successfully');
        if (onUpdate) onUpdate(res);
      })
      .catch(err => {
        console.error('Error updating product', err);
        toast.error('Error updating product: ' + (err.message || 'Unknown error'));
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    
    // Create preview URLs for the images
    const previewURLs = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewURLs.push(reader.result);
        if (previewURLs.length === files.length) {
          setPreviewImages(previewURLs);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleToggleBestSeller = () => {
    setIsBestSeller(!isBestSeller);
  };

  const handleToggleNewArrival = () => {
    setIsNewArrival(!isNewArrival);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t('Edit Product')}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Product Images')}
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {previewImages && previewImages.map((image, index) => (
                <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Product ${index}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                <FiUploadCloud className="w-6 h-6" />
                <span className="mt-2 text-xs leading-normal">{t('Select Images')}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Product Name (Short)')}
            </label>
            <Input
              type="text"
              name="product_name_short"
              value={productData.product_name_short || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Product Name (Long)')}
            </label>
            <Input
              type="text"
              name="product_name_long"
              value={productData.product_name_long || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('SKU')}
            </label>
            <Input
              type="text"
              name="sku"
              value={productData.sku || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Price')}
            </label>
            <Input
              type="number"
              name="price"
              value={productData.price || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Retail Price')}
            </label>
            <Input
              type="number"
              name="retail_price"
              value={productData.retail_price || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Stock')}
            </label>
            <Input
              type="number"
              name="stock"
              value={productData.stock || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Description')}
            </label>
            <Textarea
              name="product_description"
              value={productData.product_description || ''}
              onChange={handleInputChange}
              className="w-full"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Slug')}
            </label>
            <Input
              type="text"
              name="slug"
              value={productData.slug || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Model Code')}
            </label>
            <Input
              type="text"
              name="model_code"
              value={productData.model_code || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {t('Model Name')}
            </label>
            <Input
              type="text"
              name="model_name"
              value={productData.model_name || ''}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <SwitchToggle
              id="best-seller"
              name="isbest_seller"
              handleProcess={handleToggleBestSeller}
              processOption={isBestSeller}
              label={t('Best Seller')}
            />
          </div>

          <div className="mb-4">
            <SwitchToggle
              id="new-arrival"
              name="isnew_arrival"
              handleProcess={handleToggleNewArrival}
              processOption={isNewArrival}
              label={t('New Arrival')}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {t('Update Product')}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductEditDrawer;
