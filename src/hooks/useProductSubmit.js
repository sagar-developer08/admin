import combinate from "combinate";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

//internal import
import useAsync from "./useAsync";
import { SidebarContext } from "context/SidebarContext";
import AttributeServices from "services/AttributeServices";
import ProductServices from "services/ProductServices";
import CategoryServices from "services/CategoryServices";
import { notifyError, notifySuccess } from "utils/toast";
import SettingServices from "services/SettingServices";
import { showingTranslateValue } from "utils/translate";

const useProductSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);

  const { data: attribue } = useAsync(AttributeServices.getShowingAttributes);
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const { data: allCategories } = useAsync(CategoryServices.getAllCategories);

  // react ref
  const resetRef = useRef([]);
  const resetRefTwo = useRef("");

  // react hook
  const [imageUrl, setImageUrl] = useState([]);
  const [tag, setTag] = useState([]);
  const [values, setValues] = useState({});
  let [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [modelCode, setModelCode] = useState("");
  const [modelName, setModelName] = useState("");
  const [isBasicComplete, setIsBasicComplete] = useState(false);
  const [tapValue, setTapValue] = useState("Basic Info");
  const [isCombination, setIsCombination] = useState(false);
  const [attTitle, setAttTitle] = useState([]);
  const [variantTitle, setVariantTitle] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productId, setProductId] = useState("");
  const [updatedId, setUpdatedId] = useState(id);
  const [imgId, setImgId] = useState("");
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState([]);
  const [resData, setResData] = useState({});
  const [language, setLanguage] = useState(lang);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState("");

  console.log("selectedCategory::", selectedCategory);

  useEffect(() => {
    setSelectedCategory(allCategories);
  }, [allCategories]);

  // console.log(
  //   "defaultCategory",
  //   defaultCategory,
  //   "selectedCategory",
  //   selectedCategory
  // );

  // handle click
  const onCloseModal = () => setOpenModal(false);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log('data is data',data)
    try {
      setIsSubmitting(true);
      if (!imageUrl) return notifyError("Image is required!");

      if (data.retail_price < data.price) {
        setIsSubmitting(false);
        return notifyError(
          "SalePrice must be less then or equal of product price!"
        );
      }
      if (!defaultCategory[0]) {
        setIsSubmitting(false);
        return notifyError("Default Category is required!");
      }

      const updatedVariants = variants.map((v, i) => {
        const newObj = {
          ...v,
          price: Number(v?.price || 0),
          originalPrice: Number(v?.retail_price || 0),
          discount: Number(v?.discount || 0),
          quantity: Number(v?.quantity || 0),
        };
        return newObj;
      });

      setIsBasicComplete(true);
      setPrice(data.price);
      setQuantity(data.stock);
      setModelName(data.model_name);
      setModelCode(data.model_code);
      setOriginalPrice(data.retail_price);

      const productData = {
        productId: productId,
        model_code: data.model_code || "",
        model_name: data.model_name || "",
        product_name_short: data.product_name_short,
        product_name_long: data.product_name_long,
        product_description: data.product_description
          ? data.product_description
          : "",
        slug: data.slug
          ? data.slug
          : data.product_name_short.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"),
        retail_price: data.retail_price,
        product_count: data.product_count,
        categories: selectedCategory.map((item) => item._id),
        category: defaultCategory[0]._id,

        image: imageUrl,
        stock: variants?.length < 1 ? data.stock : Number(totalStock),
        tag: JSON.stringify(tag),

        prices: {
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice || 0,
          discount: Number(data.originalPrice) - Number(data.price),
        },
        isCombination: updatedVariants?.length > 0 ? isCombination : false,
        variants: isCombination ? updatedVariants : [],
      };

      // console.log("productData ===========>", productData, "data", data);
      // return setIsSubmitting(false);

      if (updatedId) {
        const res = await ProductServices.updateProduct(updatedId, productData);
        if (res) {
          if (isCombination) {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsBasicComplete(true);
            setIsSubmitting(false);
            handleProductTap("Combination", true);
          } else {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsSubmitting(false);
          }
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          closeDrawer();
        }
      } else {
        const res = await ProductServices.addProduct(productData);
        // console.log("res is ", res);
        if (isCombination) {
          setUpdatedId(res._id);
          setValue("product_name_short", res.product_name_short);
          setValue("product_name_long", res.product_name_long);
          setValue("product_description", res.product_description);
          setValue("slug", res.slug);
          setValue("retail_price", res.retail_price);
          setValue("product_count", res.product_count);
          setValue("show", res.show);
          setValue("model_name", res.model_name);
          setValue("stock", res.stock);
          setTag(JSON.parse(res.tag));
          setImageUrl(res.product_images);
          setVariants(res.variants);
          setValue("productId", res.productId);
          setProductId(res.productId);
          setOriginalPrice(res?.originalPrice);
          setPrice(res?.prices?.price);
          setModelName(res.model_name);
          setModelCode(res.model_code);
          const result = res.variants.map(
            ({
              originalPrice,
              price,
              discount,
              quantity,
              modelName,
              modelCode,
              productId,
              image,
              ...rest
            }) => rest
          );

          setVariant(result);
          setIsUpdate(true);
          setIsBasicComplete(true);
          setIsSubmitting(false);
          handleProductTap("Combination", true);
          notifySuccess("Product Added Successfully!");
        } else {
          setIsUpdate(true);
          notifySuccess("Product Added Successfully!");
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          setIsSubmitting(false);
          closeDrawer();
        }
      }
    } catch (err) {
      console.log("err", err);
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setSlug("");
      setLanguage(lang);
      setValue("language", language);
      handleProductTap("Basic Info", true);
      setResData({});
      setValue("model_code");
      setValue("product_name_short");
      setValue("slug");
      setValue("retail_price");
      setValue("product_description");
      setValue("quantity");
      setValue("stock");
      setValue("product_count");
      setValue("price");
      setValue("model_name");
      setValue("productId");

      setProductId("");
      // setValue('show');
      setImageUrl([]);
      setTag([]);
      setVariants([]);
      setVariant([]);
      setValues({});
      setTotalStock(0);
      setSelectedCategory([]);
      setDefaultCategory([]);
      if (location.pathname === "/products") {
        resetRefTwo?.current?.resetSelectedValues();
      }

      clearErrors("model_code");
      clearErrors("title");
      clearErrors("slug");
      clearErrors("retail_price");
      clearErrors("product_count");
      clearErrors("product_description");
      clearErrors("stock");
      clearErrors("quantity");
      setValue("stock", 0);
      setValue("costPrice", 0);
      setValue("price", 0);
      setValue("originalPrice", 0);
      clearErrors("show");
      clearErrors("model_name");
      setIsCombination(false);
      setIsBasicComplete(false);
      setIsSubmitting(false);
      setAttributes([]);

      setUpdatedId();
      return;
    } else {
      handleProductTap("Basic Info", true);
    }

    if (id) {
      setIsBasicComplete(true);
      (async () => {
        try {
          const res = await ProductServices.getProductById(id);

          console.log("resEdit", res.category.name);

          if (res) {
            setResData(res);
            setSlug(res?.slug);
            setUpdatedId(res?._id);
            setValue("product_name_short", res?.product_name_short);
            setValue("product_name_long", res?.product_name_long);
            setValue("product_description", res.product_description);
            setValue("retail_price", res?.retail_price);
            setValue("slug", res?.slug);
            setValue("show", res.show);
            setValue("model_code", res.model_code);
            setValue("model_name", res.model_name);
            setValue("product_count", res.product_count);
            setValue("productId", res._id);
            setValue("stock", res.stock);
            setValue("price", res?.prices?.price);
            setValue("originalPrice", res?.prices?.originalPrice);
            setProductId(res._id);
            setModelName(res.model_name);
            setModelCode(res.model_code);

            res.categories.map((category) => {
              category.name = showingTranslateValue(category?.name, lang);

              return category;
            });
            res.category.name = res?.category?.name;
            setSelectedCategory(allCategories);
            setDefaultCategory([res?.category?.name]);
            setImageUrl(res.product_images);
            setTag(JSON.parse(res.tag));
            setVariants(res.variants);
            setIsCombination(res.isCombination);
            setQuantity(res?.stock);
            setTotalStock(res.stock);
            setOriginalPrice(res?.originalPrice);
            setPrice(res?.prices?.price);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    setValue,
    isDrawerOpen,
    location.pathname,
    clearErrors,
    language,
    lang,
  ]);

  //for filter related attribute and extras for every product which need to update
  useEffect(() => {
    const result = attribue
      ?.filter((att) => att.option !== "Checkbox")
      .map((v) => {
        return {
          label: showingTranslateValue(v?.title, lang),
          value: showingTranslateValue(v?.title, lang),
        };
      });

    setAttTitle([...result]);

    const res = Object?.keys(Object.assign({}, ...variants));
    const varTitle = attribue?.filter((att) => res.includes(att._id));

    if (variants?.length > 0) {
      const totalStock = variants?.reduce((pre, acc) => pre + acc.quantity, 0);
      setTotalStock(Number(totalStock));
    }
    setVariantTitle(varTitle);
  }, [attribue, variants, language, lang]);

  //for adding attribute values
  const handleAddAtt = (v, el) => {
    const result = attribue.filter((att) => {
      const attribueTItle = showingTranslateValue(att?.title, lang);
      return v.some((item) => item.label === attribueTItle);
    });

    const attributeArray = result.map((value) => {
      const attributeTitle = showingTranslateValue(value?.title, lang);
      return {
        ...value,
        label: attributeTitle,
        value: attributeTitle,
      };
    });

    setAttributes(attributeArray);
  };

  //generate all combination combination
  const handleGenerateCombination = () => {
    if (Object.keys(values).length === 0) {
      return notifyError("Please select a variant first!");
    }

    const result = variants.filter(
      ({
        originalPrice,
        discount,
        price,
        quantity,
        model_name,
        model_code,
        productId,
        image,
        ...rest
      }) => JSON.stringify({ ...rest }) !== "{}"
    );

    // console.log("result", result);

    setVariants(result);

    const combo = combinate(values);

    combo.map((com, i) => {
      if (JSON.stringify(variant).includes(JSON.stringify(com))) {
        return setVariant((pre) => [...pre, com]);
      } else {
        const newCom = {
          ...com,

          originalPrice: originalPrice || 0,
          price: price || 0,
          quantity: Number(quantity),
          discount: Number(originalPrice - price),
          productId: productId && productId + "-" + (variants.length + i),
          modelName: modelName,
          modelCode: modelCode,
          image: imageUrl[0] || "",
        };

        setVariants((pre) => [...pre, newCom]);
        return setVariant((pre) => [...pre, com]);
      }
    });

    setValues({});

    // resetRef?.current?.map((v, i) =>
    //   resetRef?.current[i]?.resetSelectedValues()
    // );
  };

  //for clear selected combination
  const handleClearVariant = () => {
    setVariants([]);
    setVariant([]);
    setValues({});
    resetRef?.current?.map(
      async (v, i) => await resetRef?.current[i]?.resetSelectedValues()
    );

    // console.log('value', selectedList, removedItem, resetRef.current);
  };

  //for edit combination values
  const handleEditVariant = (variant) => {
    setTapValue("Combine");
  };

  //for remove combination values
  const handleRemoveVariant = (vari, ext) => {
    // console.log("handleRemoveVariant", vari, ext);
    swal({
      title: `Are you sure to delete this ${ext ? "Extra" : "combination"}!`,
      text: `(If Okay, It will be delete this ${
        ext ? "Extra" : "combination"
      })`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const result = variants.filter((v) => v !== vari);
        setVariants(result);
        // console.log("result", result);
        const {
          originalPrice,
          price,
          discount,
          quantity,
          model_name,
          model_code,
          productId,
          image,
          ...rest
        } = vari;
        const res = variant.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(rest)
        );
        setVariant(res);
        setIsBulkUpdate(true);
        // setTimeout(() => setIsBulkUpdate(false), 500);
        const timeOutId = setTimeout(() => setIsBulkUpdate(false), 500);
        return clearTimeout(timeOutId);
      }
    });
  };

  // handle notification for combination and extras
  const handleIsCombination = () => {
    if ((isCombination && variantTitle.length) > 0) {
      swal({
        title: "Are you sure to remove combination from this product!",
        text: "(It will be delete all your combination and extras)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((value) => {
        // console.log(value);
        if (value) {
          setIsCombination(!isCombination);
          setTapValue("Basic Info");
          setVariants([]);
          setVariant([]);
        }
      });
    } else {
      setIsCombination(!isCombination);
      setTapValue("Basic Info");
    }
  };

  //for select bulk action images
  const handleSelectImage = (img) => {
    if (openModal) {
      variants[imgId].image = img;
      setOpenModal(false);
    }
  };

  //for select individual combination image
  const handleSelectInlineImage = (id) => {
    setImgId(id);
    setOpenModal(!openModal);
  };

  //this for variant/combination list
  const handleSkuBarcode = (value, name, id) => {
    variants[id][name] = value;
  };

  const handleProductTap = (e, value, name) => {
    // console.log(e);

    if (value) {
      if (!value)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    } else {
      if (!isBasicComplete)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    }
    setTapValue(e);
  };

  //this one for combination list
  const handleQuantityPrice = (value, name, id, variant) => {
    // console.log("handleQuantityPrice", name, "value", value);
    if (name === "price" && Number(variant.originalPrice) < Number(value)) {
      // variants[id][name] = Number(variant.originalPrice);
      notifyError("SalePrice must be less then or equal of product price!");
      setValue("price", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    setVariants((pre) =>
      pre.map((com, i) => {
        if (i === id) {
          const updatedCom = {
            ...com,
            [name]: Math.round(value),
          };

          return updatedCom;
        }
        return com;
      })
    );

    const totalStock = variants.reduce(
      (pre, acc) => pre + Number(acc.quantity),
      0
    );
    setTotalStock(Number(totalStock));
  };

  //for change language in product drawer
  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("product_name_short", resData.product_name_short);
      setValue("product_description", resData.product_description);
    }
  };

  //for handle product slug
  const handleProductSlug = (value) => {
    // console.log("handleProductSlug", value);
    setValue("slug", value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
    setSlug(value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
  };

  return {
    tag,
    setTag,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    productId,
    onCloseModal,
    isBulkUpdate,
    globalSetting,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,
  };
};

export default useProductSubmit;
