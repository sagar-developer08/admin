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
import StoreDrawer from "components/drawer/StoreDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useFilter from "hooks/useFilter";
import useProductSubmit from "hooks/useProductSubmit";
import useToggleDrawer from "hooks/useToggleDrawer";
import StoreServices from "services/StoreServices";
import { showingTranslateValue } from "utils/translate";
import SettingServices from "services/SettingServices";

const EyeTestDetails = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { handleUpdate } = useToggleDrawer();
    const { lang } = useContext(SidebarContext);

    const { data, loading } = useAsync(() => StoreServices.getStoreById(id));
    const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
    const currency = globalSetting?.default_currency || "AED";

    // Function to handle edit action
    const handleEditStore = (storeId) => {
        // This will open the drawer with the store data
        handleUpdate(storeId);
    };

    return (
        <>
            <MainDrawer>
                <StoreDrawer id={id} />
            </MainDrawer>

            <PageTitle>{t("Store Details")}</PageTitle>

            {loading ? (
                <Loading loading={loading} />
            ) : (
                <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
                    <div className="flex flex-col lg:flex-row md:flex-row w-full overflow-hidden">
                        <div className="w-full flex flex-col p-5 md:p-8 text-left">
                            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 md:leading-7">
                                {data?.product_description}
                            </p>
                            
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
                                            <TableCell className="font-medium">Store Services</TableCell>
                                            <TableCell>{data?.StoreServices || "N/A"}</TableCell>
                                        </tr>
                                        <tr>
                                            <TableCell className="font-medium">
                                                Store Location
                                            </TableCell>
                                            <TableCell>{data?.StoreAddress || "N/A"}</TableCell>
                                        </tr>
                                    </tbody>
                                </Table>
                            </TableContainer>
                            
                            {/* Edit Button */}
                            <div className="mt-6">
                                <button
                                    onClick={() => handleEditStore(id)}
                                    className="cursor-pointer leading-5 transition-colors duration-150 font-medium text-sm focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300"
                                >
                                    {t("Edit Store")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EyeTestDetails;