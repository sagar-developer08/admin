import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  Badge,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
} from "@windmill/react-ui";

// Internal imports
import MainDrawer from "components/drawer/MainDrawer";
import AttributeDrawer from "components/drawer/AttributeDrawer";
import Loading from "components/preloader/Loading";
import PageTitle from "components/Typography/PageTitle";
import { SidebarContext } from "context/SidebarContext";
import useAsync from "hooks/useAsync";
import useToggleDrawer from "hooks/useToggleDrawer";
import BrandServices from "services/BrandServices";

const AttributeDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { handleUpdate } = useToggleDrawer();
  const { lang } = useContext(SidebarContext);
  const [refreshData, setRefreshData] = useState(false);

  const { data, loading } = useAsync(() => BrandServices.getBrandById(id), [id, refreshData]);

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
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center justify-center h-auto p-5">
              {data?.brand_logo ? (
                <img
                  src={data?.brand_logo}
                  alt="brand"
                  className="h-64 w-64 object-contain"
                />
              ) : (
                <div className="h-64 w-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <span className="text-gray-500">No Logo Available</span>
                </div>
              )}
            </div>

            {/* Brand Details */}
            <div className="w-full flex flex-col p-5 md:p-8 text-left">
              <h2 className="text-heading text-lg md:text-xl lg:text-2xl font-semibold font-serif dark:text-gray-400">
                {data?.name}
              </h2>

              <p className="uppercase font-serif font-medium text-gray-500 dark:text-gray-400 text-sm">
                {t("Slug")}: <span className="font-bold">{data?.slug}</span>
              </p>

              {/* Status */}
              <div className="mb-3 mt-3">
                <Badge type="success">
                  <span className="font-bold">{t("Active")}</span>
                </Badge>
              </div>

              {/* Description */}
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

              {/* Meta Information */}
              <TableContainer className="mb-8 rounded-b-lg">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>{t("Property")}</TableCell>
                      <TableCell>{t("Value")}</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    <tr>
                      <TableCell className="font-medium">{t("Title")}</TableCell>
                      <TableCell>{data?.title || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">{t("Meta Title")}</TableCell>
                      <TableCell>{data?.meta_title || "N/A"}</TableCell>
                    </tr>
                    <tr>
                      <TableCell className="font-medium">{t("Meta Description")}</TableCell>
                      <TableCell>{data?.meta_description || "N/A"}</TableCell>
                    </tr>
                  </tbody>
                </Table>
              </TableContainer>

              {/* FAQs if available */}
              {data?.faqs && data.faqs.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-heading text-base font-semibold font-serif dark:text-gray-400 mb-2">
                    {t("FAQs")}:
                  </h3>
                  <div className="space-y-4">
                    {data.faqs.map((faq, index) => (
                      <div key={index} className="border-b pb-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          {index + 1}. {faq.question}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleUpdate(id)}
                  className="cursor-pointer leading-5 transition-colors duration-150 font-medium text-sm focus:outline-none px-5 py-2 rounded-md text-white bg-green-500 border border-transparent active:bg-green-600 hover:bg-green-600 focus:ring focus:ring-purple-300"
                >
                  {t("EditBrand")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttributeDetails;
