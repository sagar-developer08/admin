import {
  Badge,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  Modal, 
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
//internal import
import AttributeList from "components/attribute/AttributeList";
import MainDrawer from "components/drawer/MainDrawer";
import ProductEditDrawer from "components/drawer/ProductEditDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import useProductSubmit from "hooks/useProductSubmit";
import useToggleDrawer from "hooks/useToggleDrawer";
import ProductServices from "services/ProductServices";
import { showingTranslateValue } from "utils/translate";
import SettingServices from "services/SettingServices";
import ImageReorder from "components/image/ImageReorder";

const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { handleUpdate } = useToggleDrawer();
  const { lang } = useContext(SidebarContext);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [productData, setProductData] = useState(null);

  const { data, loading } = useAsync(() => ProductServices.getProductById(id));
  // console.log(data, "product-details");

  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const currency = globalSetting?.default_currency || "AED";

  // Set local product data when the API data loads
  useEffect(() => {
    if (data) {
      setProductData(data);
    }
  }, [data]);

  const toggleReorderModal = useCallback(() => {
    setIsReorderModalOpen(!isReorderModalOpen);
  }, [isReorderModalOpen]);

  const handleImagesReordered = useCallback((reorderedImages) => {
    // Update our local state instead of trying to modify useAsync data
    setProductData(prevData => ({
      ...prevData,
      product_images: reorderedImages
    }));
    toggleReorderModal();
  }, [toggleReorderModal]);

  return (
    <>
      <MainDrawer product>
        <ProductEditDrawer id={id} onUpdate={() => window.location.reload()} />
      </MainDrawer>

      <PageTitle>{t("ProductDetails")}</PageTitle>

      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
            {/* Product Image */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center h-auto">
              {productData?.product_images?.length ? (
                <>
                  <img
                    src={productData?.product_images?.[0]}
                    alt="product"
                    className="h-64 w-64"
                  />
                  {productData?.product_images?.length > 1 && (
                    <button
                      onClick={toggleReorderModal}
                      className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      {t("Reorder Images")}
                    </button>
                  )}
                </>
              ) : (
                <img
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="product"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="w-full flex flex-col p-5 md:p-8 text-left">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif dark:text-gray-400">
                {productData?.product_name_short || productData?.product_name_long}
              </h2>

              <p className="uppercase font-serif font-medium text-gray-500 dark:text-gray-400 text-sm">
                {t("Sku")}:{productData?.sku}
                <span className="font-bold text-gray-500 dark:text-gray-500">
                  {productData?.model_code}
                </span>
              </p>

              {/* Price */}
              <div className="font-serif product-price font-bold dark:text-gray-400">
                <span className="inline-block text-2xl">
                  {currency} {productData?.retail_price}
                </span>
              </div>

              {/* Category */}
              <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
                <span className="text-gray-700 dark:text-gray-400">
                  {t("Category")}:{" "}
                </span>
                {productData?.category?.name}
              </p>

              {/* Stock (Assuming stock logic needs adjustment) */}
              <div className="mb-3">
                {productData?.product_count <= 0 ? (
                  <Badge type="danger">
                    <span className="font-bold">{t("StockOut")}</span>
                  </Badge>
                ) : (
                  <Badge type="success">
                    <span className="font-bold">{t("InStock")}</span>
                  </Badge>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium pl-4">
                  {t("Quantity")}: {productData?.product_count}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 md:leading-7">
                {productData?.product_description}
              </p>
              {/*  */}
              <TableContainer className="mb-8 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>{t("Specification")}</TableCell>
                      <TableCell>{t("Details")}</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {/* Model Details */}
                    <tr>
                      <TableCell className="font-medium">Model Code</TableCell>
                      <TableCell>{productData?.model_code || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">Model Name</TableCell>
                      <TableCell>{productData?.model_name || "N/A"}</TableCell>
                    </tr>

                    {/* Color Information */}
                    <tr>
                      <TableCell className="font-medium">Color Code</TableCell>
                      <TableCell>{productData?.color_code || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">Frame Color</TableCell>
                      <TableCell>{productData?.frame_color || "N/A"}</TableCell>
                    </tr>

                    {/* Product Names */}
                    <tr>
                      <TableCell className="font-medium">
                        Product Name (Short)
                      </TableCell>
                      <TableCell>{productData?.product_name_short || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">
                        Product Name (Long)
                      </TableCell>
                      <TableCell>{productData?.product_name_long || "N/A"}</TableCell>
                    </tr>

                    {/* Frame Details */}
                    <tr>
                      <TableCell className="font-medium">Gender</TableCell>
                      <TableCell>{productData?.gender || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">
                        Frame Material
                      </TableCell>
                      <TableCell>{productData?.frame_material || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">Frame Type</TableCell>
                      <TableCell>{productData?.frame_type || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">Frame Shape</TableCell>
                      <TableCell>{productData?.frame_shape || "N/A"}</TableCell>
                    </tr>
                  </tbody>
                </Table>
              </TableContainer>
              {/* Edit Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleUpdate(id)}
                  className="cursor-pointer leading-5 transition-colors duration-150 font-medium text-sm focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300"
                >
                  {t("EditProduct")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Reorder Modal */}
      <Modal isOpen={isReorderModalOpen} onClose={toggleReorderModal} className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl">
        <ModalHeader>
          {t("Reorder Product Images")}
        </ModalHeader>
        <ModalBody>
          {productData?.product_images?.length > 0 && (
            <ImageReorder 
              productId={id} 
              images={productData.product_images} 
              onImagesReordered={handleImagesReordered} 
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button className="w-full sm:w-auto" layout="outline" onClick={toggleReorderModal}>
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProductDetails;
