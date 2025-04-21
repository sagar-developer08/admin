import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductServices from 'services/ProductServices';

const ItemTypes = {
  IMAGE: 'image',
};

const DraggableImage = ({ image, index, moveImage, id }) => {
  const ref = useRef(null);
  const { t } = useTranslation();

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover: (item) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center p-4 mb-3 bg-white dark:bg-gray-800 rounded-lg border 
        ${isDragging ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200'} 
        transition-all duration-200 cursor-move`}
    >
      <div className="w-20 h-20 mr-4 flex-shrink-0 overflow-hidden rounded shadow-sm border border-gray-200">
        <img
          src={image}
          alt={`Product ${index + 1}`}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
        />
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium">
          {t('Image')} {index + 1}
          {index === 0 && (
            <span className="text-blue-500 font-semibold ml-1">({t('Main')})</span>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-1">{t('Drag to reorder')}</p>
      </div>
    </div>
  );
};

const ImageReorder = ({ productId, images, onImagesReordered }) => {
  const { t } = useTranslation();
  const [reorderedImages, setReorderedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) {
      setReorderedImages([...images]);
    }
  }, [images]);

  const moveImage = (dragIndex, hoverIndex) => {
    const newImages = [...reorderedImages];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setReorderedImages(newImages);
  };

  const handleSaveOrder = async () => {
    toast.dismiss();

    if (!productId || reorderedImages.length === 0) {
      toast.error(t('Cannot save image order. Missing product ID or images.'));
      return;
    }

    setLoading(true);
    try {
      const response = await ProductServices.reorderImages(productId, reorderedImages);
      if (response && response.message === 'Images reordered' && response.data) {
        toast.dismiss();
        toast.success(t('Image order updated successfully!'));
        if (onImagesReordered) {
          onImagesReordered(reorderedImages);
        }
      } else {
        toast.dismiss();
        toast.error(t('Server did not confirm image reordering.'));
        console.error('Unexpected API response:', response);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error reordering images:', error);
      toast.error(t('Failed to update image order. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!reorderedImages || reorderedImages.length <= 1) {
    return (
      <div className="text-sm text-gray-500 italic">
        {t('Need at least two images to reorder.')}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{t('Reorder Images')}</h3>
      <p className="text-sm text-gray-500 mb-5">
        {t('Drag images to reorder. The first image will be the main product image.')}
      </p>

      <DndProvider backend={HTML5Backend}>
        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          {reorderedImages.map((image, index) => (
            <DraggableImage
              key={index}
              id={`image-${index}`}
              image={image}
              index={index}
              moveImage={moveImage}
            />
          ))}
        </div>
      </DndProvider>

      <button
        type="button"
        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        onClick={handleSaveOrder}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {t('Saving...')}
          </>
        ) : (
          t('Save New Order')
        )}
      </button>
    </div>
  );
};

export default ImageReorder;
