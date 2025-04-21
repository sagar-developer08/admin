import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import useStoreSubmit from "hooks/useStoreSubmit";
import Title from "components/form/Title";
import LabelArea from "components/form/LabelArea";
import Uploader from "components/image-uploader/Uploader";
import InputArea from "components/form/InputArea";
import Error from "components/form/Error";
import DrawerButton from "components/form/DrawerButton";

const StoreDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
  } = useStoreSubmit(id);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateStore")}
            description={t("UpdateStoreDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddStoreTitle")}
            description={t("AddStoreDescription")}
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Store Address" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      register={register}
                      label="Store Address"
                      name="StoreAddress"
                      type="text"
                      placeholder="Store address"
                    />
                    <Error errorName={errors.StoreAddress} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Store Services" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      register={register}
                      label="Store Services"
                      name="StoreServices"
                      type="text"
                      placeholder="Store services"
                    />
                    <Error errorName={errors.StoreServices} />
                  </div>
                </div>

                {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Joining Date" />
                  <div className="col-span-8 sm:col-span-4">
                    <Input
                      onChange={(e) => setSelectedDate(e.target.value)}
                      label="Joining Date"
                      name="joiningDate"
                      value={selectedDate}
                      type="date"
                      className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                      placeholder={t("StoreJoiningDate")}
                    />
                    <Error errorName={errors.joiningDate} />
                  </div>
                </div> */}
              </div>

              <DrawerButton id={id} title="Store" />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default StoreDrawer;