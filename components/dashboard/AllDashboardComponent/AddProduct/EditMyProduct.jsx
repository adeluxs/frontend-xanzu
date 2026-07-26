"use client";
import { useT } from "@/context/TranslationContext";
import {
  useGetMySingleProductQuery,
  useUpdateProductMutation,
} from "@/lib/features/addProduct/addProductApi";
import { useParams, useRouter } from "next/navigation";
import AddProductPage, { initialProductFormData } from "./AddProductPage";
import EditProductSkeleton from "./EditProductSkeleton";

const normalizeListingAttributes = (listingAttributes = []) => {
  const groups = {};

  listingAttributes.forEach((item, index) => {
    const groupName = item.group || "";
    if (!groups[groupName]) {
      groups[groupName] = {
        id: `${groupName}-${index}`,
        group_name: groupName,
        attributes: [],
      };
    }

    groups[groupName].attributes.push({
      id: item.id ? String(item.id) : `${groupName}-attr-${index}`,
      label: item.label ?? "",
      price: item.price ?? "",
      discount_type: item.discount_type ?? "amount",
      discount_amount: item.discount_amount ?? "",
      qty: item.qty ?? "",
    });
  });

  return Object.values(groups);
};

const mapProductToFormData = (product) => ({
  category_id: product.category_id ? String(product.category_id) : "",
  subcategory_id: product.subcategory_id ? String(product.subcategory_id) : "",
  brand_id: product.brand_id ? String(product.brand_id) : "",
  type: product.type ?? "digital",
  has_attributes:
    product.has_attributes === true || product.has_attributes === 1 ? 1 : 0,
  product_name: product.product_name ?? "",
  price: product.price ?? "",
  quantity: product.quantity ?? "",
  discount_value: product.discount_value ?? "0.00",
  discount_type: product.discount_type ?? "amount",
  description: product.description ?? "",
  thumbnail: null,
  existingThumbnail: product.thumbnail_url || product.thumbnail || "",
  gallery: [],
  existingGallery: product.gallery_images || product.images || [],
  deleted_images: [],
  attribute_groups: normalizeListingAttributes(product.listing_attributes),
  delivery_method: product.delivery_method ?? "manual",
  delivery_speed: product.delivery_speed ?? "",
  delivery_speed_unit: product.delivery_speed_unit ?? "second",
  is_flash: product.is_flash ? 1 : 0,
  status: product.status ?? "active",
});

const EditMyProduct = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const t = useT();

  const {
    data: mySingleProductData,
    isLoading: isLoadSingleProduct,
    isFetching,
    isError,
  } = useGetMySingleProductQuery(id, {
    skip: !id,
  });

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const product = mySingleProductData?.data?.listing;

  const initialValues = product
    ? mapProductToFormData(product)
    : initialProductFormData;

  const handleUpdateProduct = async (formData) => {
    if (!id) throw new Error("Missing product id");
    try {
      await updateProduct({ id, data: formData }).unwrap();
    } catch (error) {
      console.error("Update product failed:", error);
      throw error;
    }
  };

  if (!id) {
    return (
      <div className="dashboard-top-gap">
        <p>{t("dashboard.invalidProductId")}</p>
      </div>
    );
  }

  if (isLoadSingleProduct || isFetching) {
    return (
      <div className="dashboard-top-gap">
        <EditProductSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="dashboard-top-gap">
        <p>{t("dashboard.unableToLoadProductData")}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-top-gap">
      <AddProductPage
        initialValues={initialValues}
        onSubmit={handleUpdateProduct}
        submitLabel={t("dashboard.updateProduct")}
        isSubmitting={isUpdating}
      />
    </div>
  );
};

export default EditMyProduct;
