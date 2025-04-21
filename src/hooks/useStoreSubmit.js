import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

import { AdminContext } from "context/AdminContext";
import { SidebarContext } from "context/SidebarContext";
import StoreServices from "services/StoreServices";
import { notifyError, notifySuccess } from "utils/toast";

const useStoreSubmit = (id) => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState(lang);
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const storeData = {
        StoreAddress: data.StoreAddress,
        StoreServices: data.StoreServices,
        joiningDate: selectedDate
          ? selectedDate
          : dayjs(new Date()).format("YYYY-MM-DD"),
        lang: language,
      };

      if (id) {
        // Update existing store
        await StoreServices.updateStore(id, storeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess("Store updated successfully");
        closeDrawer();
      } else {
        // Add new store
        await StoreServices.createStore(storeData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess("Store added successfully");
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err.message : "An error occurred");
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getStoreData = async () => {
    try {
      const store = await StoreServices.getStoreById(id);
      if (store) {
        setResData(store);
        setValue("StoreAddress", store.StoreAddress);
        setValue("StoreServices", store.StoreServices);
        setSelectedDate(dayjs(store.joiningDate).format("YYYY-MM-DD"));
      }
    } catch (err) {
      notifyError(err ? err.message : "An error occurred");
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("StoreAddress", resData.StoreAddress);
      setValue("StoreServices", resData.StoreServices);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("StoreAddress");
      setValue("StoreServices");
      setValue("joiningDate");
      clearErrors("StoreAddress");
      clearErrors("StoreServices");
      clearErrors("joiningDate");
      setImageUrl("");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getStoreData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getStoreData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    handleSelectLanguage,
  };
};

export default useStoreSubmit;