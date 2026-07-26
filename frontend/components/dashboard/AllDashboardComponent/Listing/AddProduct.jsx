"use client";

import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import { SearchIcon } from "@/icons";
import {
  useCreateProductMutation,
  useGetAddProductConfigQuery,
  useGetSearchProductQuery,
} from "@/lib/features/addProduct/addProductApi";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const containerRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const trimmedSearch = search.trim();
  const { data: configData, isLoading: isConfigLoading } =
    useGetAddProductConfigQuery();
  const { data: searchData, isFetching: isSearching } =
    useGetSearchProductQuery(
      { search: trimmedSearch, page: 1, per_page: 20 },
      { skip: !trimmedSearch },
    );
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const categories = configData?.data?.categories || [];
  const brands = configData?.data?.brands || [];
  const products = searchData?.data?.products || [];
  const showDropdown = isFocused && trimmedSearch;
  const router = useRouter();
  const t = useT();

  // get sub category
  const getSubCategories = (categoryId) =>
    categories.find((category) => String(category.id) === String(categoryId))
      ?.children || [];

  // container blur
  const handleContainerBlur = (e) => {
    if (
      containerRef.current &&
      containerRef.current.contains(e.relatedTarget)
    ) {
      return;
    }
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  // container focus
  const handleContainerFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  };

  // toggle select
  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      if (prev[product.id]) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return {
        ...prev,
        [product.id]: {
          remoteProductId: String(product.id),
          categoryId: "",
          subcategoryId: "",
          brandId: "",
        },
      };
    });
  };

  // handle category change
  const handleCategoryChange = (productId, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        categoryId: value,
        subcategoryId: "",
      },
    }));
  };

  // handle sub category change
  const handleSubCategoryChange = (productId, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        subcategoryId: value,
      },
    }));
  };

  // handle brand change
  const handleBrandChange = (productId, value) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        brandId: value,
      },
    }));
  };

  // handle add product
  const handleAddProduct = async () => {
    const selected = Object.values(selectedProducts);

    if (!selected.length) {
      toast.error("Please select at least one product.");
      return;
    }

    const hasMissingSelections = selected.some(
      (item) => !item.categoryId || !item.subcategoryId || !item.brandId,
    );

    if (hasMissingSelections) {
      toast.error("Please select category, sub category, and brand.");
      return;
    }

    const payload = {
      remote_product_ids: selected.map((item) => item.remoteProductId),
      category_id: selected.map((item) => item.categoryId),
      subcategory_id: selected.map((item) => item.subcategoryId),
      brand_id: selected.map((item) => item.brandId),
    };

    try {
      await createProduct(payload).unwrap();
      setSelectedProducts({});
      setSearch("");
      setIsFocused(false);
      router.push("/dashboard/import-product-listings");
    } catch {}
  };

  // handle row mouse down
  const handleRowMouseDown = (e) => {
    if (
      e.target.tagName === "SELECT" ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "OPTION"
    ) {
      return;
    }
    e.preventDefault();
  };

  return (
    <div className="dashboard-top-gap">
      <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
        <p className="text-sm font-semibold text-grayish/80 mb-3">
          {t("dashboard.productName")}
        </p>

        <div
          ref={containerRef}
          onBlur={handleContainerBlur}
          onFocus={handleContainerFocus}
          className={`rounded-[10px] border transition-all duration-200 ${
            isFocused
              ? "bg-transparent border-[rgba(7,33,38,0.16)]"
              : "bg-[rgba(7,33,38,0.04)] border-[rgba(7,33,38,0.16)]"
          }`}
        >
          <div className="flex items-center gap-3 h-[52px] px-4">
            <SearchIcon className="h-4 w-4 text-[#8D999B] flex-shrink-0" />
            <input
              type="text"
              placeholder={t("dashboard.searchProducts")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="outline-none text-sm text-grayish placeholder-[#8D999B] w-full h-full bg-transparent"
            />
          </div>

          {showDropdown && (
            <div className="border border-[rgba(7,33,38,0.05)] max-h-80 overflow-y-auto m-4 mt-0 rounded-[10px] p-4.5 space-y-[6px]">
              {isSearching ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  {t("dashboard.searchingProducts")}
                </p>
              ) : products.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  {t("dashboard.noProductsFoundWithDot")}
                </p>
              ) : (
                products.map((product) => {
                  const isSelected = !!selectedProducts[product.id];
                  const entry = selectedProducts[product.id] || {};
                  const subOptions = entry.categoryId
                    ? getSubCategories(entry.categoryId)
                    : [];

                  return (
                    <div
                      key={product.id}
                      onMouseDown={handleRowMouseDown}
                      onClick={(e) => {
                        if (
                          e.target.tagName === "SELECT" ||
                          e.target.tagName === "INPUT" ||
                          e.target.tagName === "OPTION"
                        ) {
                          return;
                        }
                        toggleSelect(product);
                      }}
                      className={`flex flex-wrap items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors rounded-[12px] ${
                        isSelected
                          ? "bg-[rgba(7,33,38,0.04)]"
                          : "hover:bg-[rgba(7,33,38,0.04)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(product)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 accent-primary cursor-pointer flex-shrink-0"
                      />

                      <div className="w-10 h-10 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span
                        className={`flex-1 text-sm ${
                          isSelected
                            ? "font-medium text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {product.name}
                      </span>

                      <span className="text-sm text-gray-500 min-w-[64px]">
                        QTY : {product.stock_quantity ?? 0}
                      </span>

                      {isSelected && (
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={entry.categoryId}
                            onChange={(e) =>
                              handleCategoryChange(product.id, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-400"
                          >
                            <option value="">Add Categories</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={entry.subcategoryId}
                            onChange={(e) =>
                              handleSubCategoryChange(
                                product.id,
                                e.target.value,
                              )
                            }
                            disabled={!entry.categoryId}
                            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value="">Sub Categories</option>
                            {subOptions.map((subCategory) => (
                              <option
                                key={subCategory.id}
                                value={subCategory.id}
                              >
                                {subCategory.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={entry.brandId}
                            onChange={(e) =>
                              handleBrandChange(product.id, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-400"
                          >
                            <option value="">Brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-7.5">
        <Button
          type="button"
          variant="primary-filled"
          size="compact"
          rounded="md"
          onClick={handleAddProduct}
          disabled={
            isCreating ||
            isConfigLoading ||
            Object.keys(selectedProducts).length === 0
          }
          loading={isCreating}
        >
          {isCreating
            ? t("dashboard.importingProduct")
            : t("dashboard.importProduct")}
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;
