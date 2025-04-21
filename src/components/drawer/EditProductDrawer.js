import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import {
  Button,
  Input,
  Label,
  Select,
  Textarea,
  ToggleSwitch,
} from "@windmill/react-ui";
import { SidebarContext } from "context/SidebarContext";
import ProductServices from "services/ProductServices";

const EditProductDrawer = ({ id }) => {
  const { t } = useTranslation();
  const { closeDrawer } = useContext(SidebarContext);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ProductServices.getProductById(id);
        if (res) {
          reset({
            product_name_short: res.product_name_short,
            product_name_long: res.product_name_long,
            product_description: res.product_description,
            sku: res.sku,
            model_code: res.model_code,
            model_name: res.model_name,
            color_code: res.color_code,
            frame_color: res.frame_color,
            gender: res.gender,
            frame_material: res.frame_material,
            frame_type: res.frame_type,
            frame_shape: res.frame_shape,
            retail_price: res.retail_price,
            product_count: res.product_count,
            is_active: res.is_active,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await ProductServices.updateProduct(id, data);
      closeDrawer();
      // You might want to add a success notification here
    } catch (err) {
      console.log(err);
      // You might want to add an error notification here
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {t("EditProduct")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Short Name */}
            <Label>
              <span>{t("ProductNameShort")}</span>
              <Input
                className="mt-1"
                {...register("product_name_short", {
                  required: "Product short name is required",
                })}
              />
              {errors.product_name_short && (
                <span className="text-red-500 text-sm">
                  {errors.product_name_short.message}
                </span>
              )}
            </Label>

            {/* Product Long Name */}
            <Label>
              <span>{t("ProductNameLong")}</span>
              <Input
                className="mt-1"
                {...register("product_name_long")}
              />
            </Label>

            {/* SKU */}
            <Label>
              <span>{t("SKU")}</span>
              <Input
                className="mt-1"
                {...register("sku", {
                  required: "SKU is required",
                })}
              />
              {errors.sku && (
                <span className="text-red-500 text-sm">
                  {errors.sku.message}
                </span>
              )}
            </Label>

            {/* Model Code */}
            <Label>
              <span>{t("ModelCode")}</span>
              <Input
                className="mt-1"
                {...register("model_code")}
              />
            </Label>

            {/* Model Name */}
            <Label>
              <span>{t("ModelName")}</span>
              <Input
                className="mt-1"
                {...register("model_name")}
              />
            </Label>

            {/* Color Code */}
            <Label>
              <span>{t("ColorCode")}</span>
              <Input
                className="mt-1"
                {...register("color_code")}
              />
            </Label>

            {/* Frame Color */}
            <Label>
              <span>{t("FrameColor")}</span>
              <Input
                className="mt-1"
                {...register("frame_color")}
              />
            </Label>

            {/* Gender */}
            <Label>
              <span>{t("Gender")}</span>
              <Select
                className="mt-1"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </Select>
            </Label>

            {/* Frame Material */}
            <Label>
              <span>{t("FrameMaterial")}</span>
              <Input
                className="mt-1"
                {...register("frame_material")}
              />
            </Label>

            {/* Frame Type */}
            <Label>
              <span>{t("FrameType")}</span>
              <Input
                className="mt-1"
                {...register("frame_type")}
              />
            </Label>

            {/* Frame Shape */}
            <Label>
              <span>{t("FrameShape")}</span>
              <Input
                className="mt-1"
                {...register("frame_shape")}
              />
            </Label>

            {/* Retail Price */}
            <Label>
              <span>{t("RetailPrice")}</span>
              <Input
                className="mt-1"
                type="number"
                step="0.01"
                {...register("retail_price", {
                  required: "Retail price is required",
                  min: {
                    value: 0,
                    message: "Price must be positive",
                  },
                })}
              />
              {errors.retail_price && (
                <span className="text-red-500 text-sm">
                  {errors.retail_price.message}
                </span>
              )}
            </Label>

            {/* Product Count */}
            <Label>
              <span>{t("Quantity")}</span>
              <Input
                className="mt-1"
                type="number"
                {...register("product_count", {
                  required: "Quantity is required",
                  min: {
                    value: 0,
                    message: "Quantity must be positive",
                  },
                })}
              />
              {errors.product_count && (
                <span className="text-red-500 text-sm">
                  {errors.product_count.message}
                </span>
              )}
            </Label>

            {/* Active Status */}
            <Label className="flex items-center mt-6">
              <ToggleSwitch
                {...register("is_active")}
              />
              <span className="ml-2">{t("Active")}</span>
            </Label>
          </div>

          {/* Description */}
          <Label className="mt-4">
            <span>{t("Description")}</span>
            <Textarea
              className="mt-1"
              rows="5"
              {...register("product_description")}
            />
          </Label>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              layout="outline"
              onClick={closeDrawer}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit">{t("UpdateProduct")}</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProductDrawer;