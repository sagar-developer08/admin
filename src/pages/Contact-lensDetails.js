import {
    Badge,
    Pagination,
    Table,
    TableCell,
    TableContainer,
    TableFooter,
    TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
//internal import
import AttributeList from "components/attribute/AttributeList";
import MainDrawer from "components/drawer/MainDrawer";
import ProductDrawer from "components/drawer/ProductDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import useProductSubmit from "hooks/useProductSubmit";
import useToggleDrawer from "hooks/useToggleDrawer";
import ContactLensServices from "services/contactlensServices";
import { showingTranslateValue } from "utils/translate";
import SettingServices from "services/SettingServices";

const ProductDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { handleUpdate } = useToggleDrawer();
    const { lang } = useContext(SidebarContext);

    const { data, loading } = useAsync(() => ContactLensServices.getContactLensById(id));
    // console.log(data, "product-details");

    const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
    const currency = globalSetting?.default_currency || "AED";

    return (
        <>
            <MainDrawer product>
                <ProductDrawer id={id} />
            </MainDrawer>

            <PageTitle>{t("ProductDetails")}</PageTitle>

            {loading ? (
                <Loading loading={loading} />
            ) : (
                <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
                    <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
                        {/* Product Image */}
                        <div className="flex-shrink-0 flex items-center justify-center h-auto">
                            {data?.product_images?.length ? (
                                <img
                                    src={data?.product_images?.[0]}
                                    alt="product"
                                    className="h-64 w-64"
                                />
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
                                {data?.product_name_short || data?.product_name_long}
                            </h2>

                            <p className="uppercase font-serif font-medium text-gray-500 dark:text-gray-400 text-sm">
                                {t("Sku")}:{data?.sku}
                                <span className="font-bold text-gray-500 dark:text-gray-500">
                                    {data?.model_code}
                                </span>
                            </p>

                            {/* Price */}
                            <div className="font-serif product-price font-bold dark:text-gray-400">
                                <span className="inline-block text-2xl">
                                    {currency} {data?.retail_price}
                                </span>
                            </div>

                            {/* Category */}
                            <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
                                <span className="text-gray-700 dark:text-gray-400">
                                    {t("Category")}:{" "}
                                </span>
                                {data?.category?.name}
                            </p>

                            {/* Stock (Assuming stock logic needs adjustment) */}
                            <div className="mb-3">
                                {data?.product_count <= 0 ? (
                                    <Badge type="danger">
                                        <span className="font-bold">{t("StockOut")}</span>
                                    </Badge>
                                ) : (
                                    <Badge type="success">
                                        <span className="font-bold">{t("InStock")}</span>
                                    </Badge>
                                )}
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium pl-4">
                                    {t("Quantity")}: {data?.product_count}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 md:leading-7">
                                {data?.product_description}
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
                                            <TableCell>{data?.model || "N/A"}</TableCell>
                                        </tr>
                                        {/* <tr>
                                            <TableCell className="font-medium">Model Name</TableCell>
                                            <TableCell>{data?.model_name || "N/A"}</TableCell>
                                        </tr> */}

                                        {/* Color Information */}
                                        <tr>
                                            <TableCell className="font-medium">Contact Lens Type Code</TableCell>
                                            <TableCell>{data?.contact_lens_type || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Frame Color</TableCell>
                                            <TableCell>{data?.frame_color || "N/A"}</TableCell>
                                        </tr>

                                        {/* Product Names */}
                                        <tr>
                                            <TableCell className="font-medium">
                                                Product Name (Short)
                                            </TableCell>
                                            <TableCell>{data?.product_name_short || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">
                                                Product Name (Long)
                                            </TableCell>
                                            <TableCell>{data?.product_name_long || "N/A"}</TableCell>
                                        </tr>

                                        {/* Frame Details */}
                                        <tr>
                                            <TableCell className="font-medium">Power</TableCell>
                                            <TableCell>{data?.power || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">
                                                Replacement
                                            </TableCell>
                                            <TableCell>{data?.replacement || "N/A"}</TableCell>
                                        </tr>
                                        {/* <tr>
                                            <TableCell className="font-medium">Frame Type</TableCell>
                                            <TableCell>{data?.frame_type || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Frame Shape</TableCell>
                                            <TableCell>{data?.frame_shape || "N/A"}</TableCell>
                                        </tr> */}
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
        </>
    );
};

export default ProductDetails;
