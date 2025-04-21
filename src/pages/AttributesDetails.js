import {
    Badge,
    Table,
    TableCell,
    TableContainer,
    TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
//internal import
import MainDrawer from "components/drawer/MainDrawer";
import AttributeDrawer from "components/drawer/AttributeDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useToggleDrawer from "hooks/useToggleDrawer";
import BrandServices from "services/BrandServices";

const AttributesDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { handleUpdate } = useToggleDrawer();
    const { lang } = useContext(SidebarContext);
    const [refreshData, setRefreshData] = useState(false);

    const { data, loading } = useAsync(() => BrandServices.getBrandById(id), [id, refreshData]);

    // Function to handle edit action and refresh data after update
    const handleUpdateSuccess = () => {
        setRefreshData(!refreshData);
    };

    return (
        <>
            <MainDrawer>
                <AttributeDrawer id={id} onUpdate={handleUpdateSuccess} />
            </MainDrawer>

            <PageTitle>{t("Brand Details")}</PageTitle>

            {loading ? (
                <Loading loading={loading} />
            ) : (
                <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">

                    <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
                        <div className="flex-shrink-0 flex items-center justify-center h-auto ">
                            {data?.brand_logo ? (
                                <img
                                    src={data?.brand_logo}
                                    alt="product"
                                    className="h-64 w-64 object-contain"
                                />
                            ) : (
                                <img
                                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                                    alt="product"
                                />
                            )}
                        </div>
                        <div className="w-full flex flex-col p-5 md:p-8 text-left">
                            <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif dark:text-gray-400 mb-2">
                                {data?.name}
                            </h2>
                            
                            <p className="uppercase font-serif font-medium text-gray-500 dark:text-gray-400 text-sm mb-4">
                                {t("Slug")}: <span className="font-bold">{data?.slug}</span>
                            </p>
                            
                            {data?.content && (
                                <div className="mb-4">
                                    <h3 className="text-heading text-base font-semibold font-serif dark:text-gray-400 mb-2">
                                        {t("Description")}:
                                    </h3>
                                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 md:leading-7">
                                        {data?.content}
                                    </p>
                                </div>
                            )}

                            <TableContainer className="mb-8 rounded-b-lg">
                                <Table>
                                    <TableHeader>
                                        <tr>
                                            <TableCell>{t("Specification")}</TableCell>
                                            <TableCell>{t("Details")}</TableCell>
                                        </tr>
                                    </TableHeader>
                                    <tbody>
                                        <tr>
                                            <TableCell className="font-medium">Name</TableCell>
                                            <TableCell>{data?.name || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Slug</TableCell>
                                            <TableCell>{data?.slug || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Meta Description</TableCell>
                                            <TableCell>{data?.meta_description || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Meta Title</TableCell>
                                            <TableCell>{data?.meta_title || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Title</TableCell>
                                            <TableCell>{data?.title || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">Description</TableCell>
                                            <TableCell>{data?.content || "N/A"}</TableCell>
                                        </tr>
                                        {
                                            Array.isArray(data?.faqs) && data.faqs.length > 0 ? (
                                                data.faqs.map((faq, index) => (
                                                    <tr key={index}>
                                                        <TableCell className="font-medium">
                                                            FAQ {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="mb-2">
                                                                <strong>Question:</strong> {faq.question || "N/A"}
                                                            </div>
                                                            <div>
                                                                <strong>Answer:</strong> {faq.answer || "N/A"}
                                                            </div>
                                                        </TableCell>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <TableCell className="font-medium">
                                                        FAQs
                                                    </TableCell>
                                                    <TableCell>N/A</TableCell>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </TableContainer>

                            {/* Edit Button */}
                            <div className="mt-6">
                                <button
                                    onClick={() => handleUpdate(id)}
                                    className="cursor-pointer leading-5 transition-colors duration-150 font-medium text-sm focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300"
                                >
                                    {t("Edit Brand")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AttributesDetails;