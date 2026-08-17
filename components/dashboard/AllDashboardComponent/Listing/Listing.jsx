"use client";
import CommonModal from "@/components/common/CommonModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { PlusIcon, RatingStarIcon, SearchIcon, TrashIcon } from "@/icons";
import {
  useDeleteProductMutation,
  useGetAddProductConfigQuery,
  useGetAllProductQuery,
} from "@/lib/features/addProduct/addProductApi";
import { useState } from "react";
import { normalizeMediaSource } from "@/utils/media";

const PER_PAGE = 20;

const Listing = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const t = useT();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: configData, isLoading: isConfigLoading } =
    useGetAddProductConfigQuery();
  const { data, currentData, isLoading, isFetching } = useGetAllProductQuery(
    {
      search,
      page: currentPage,
      per_page: PER_PAGE,
      category_id: category,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const showProductsLoading = isLoading || (isFetching && !currentData);
  const productData = showProductsLoading ? currentData : (currentData ?? data);
  const products = productData?.data?.products || [];
  const meta = productData?.meta || data?.meta || {};
  const lastPage = Math.max(
    1,
    Math.ceil(
      (Number(meta?.total) || 0) / (Number(meta?.per_page) || PER_PAGE),
    ),
  );
  const categoryOptions = [
    { value: "", label: t("dashboard.allCategories") },
    ...(configData?.data?.categories || []).map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
  ];

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteProduct(deleteTargetId).unwrap();
      closeDeleteModal();
    } catch {}
  };

  return (
    <div className="dashboard-top-gap">
      <div className="flex justify-between items-center gap-3 flex-wrap mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              id="search"
              name="search"
              placeholder={t("dashboard.searchProducts")}
              className="h-10 rounded-[10px] rtl:pr-9 ltr:pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-3.5">
              <SearchIcon className="h-4 w-4 text-[#8D999B]" />
            </div>
          </div>
          <div>
            <ReactSelectInput
              options={categoryOptions}
              value={category}
              onChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
              placeholder={t("dashboard.selectCategory")}
              size="sm"
              borderRadius={10}
              loading={isConfigLoading}
            />
          </div>
        </div>
        <div>
          <Button
            type="button"
            variant="primary-filled"
            size="compact"
            rounded="md"
            href="/dashboard/import-product"
            startIcon={<PlusIcon className="h-5 w-5" />}
          >
            {t("dashboard.importProduct")}
          </Button>
        </div>
      </div>

      <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[1400px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.productName"),
                      t("dashboard.date"),
                      t("dashboard.typeText"),
                      t("dashboard.amount"),
                      t("dashboard.stock"),
                      t("dashboard.category"),
                      t("dashboard.rating"),
                      t("dashboard.action"),
                    ].map((heading, index, arr) => (
                      <th
                        key={heading}
                        className={`th-design bg-[#F3FDF3] border-t border-b border-[#CEF5CE]
                            ${
                              index === 0
                                ? isRTL
                                  ? "border-r rounded-tr-[10px] rounded-br-[10px]"
                                  : "border-l rounded-tl-[10px] rounded-bl-[10px]"
                                : ""
                            }
                            ${
                              index === arr.length - 1
                                ? isRTL
                                  ? "border-l rounded-tl-[10px] rounded-bl-[10px]"
                                  : "border-r rounded-tr-[10px] rounded-br-[10px]"
                                : ""
                            }
                          `}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="table-body">
                  {showProductsLoading ? (
                    <tr>
                      <td colSpan={8} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingProducts")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound
                            message={t("dashboard.noProductsFound")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="tr-design">
                        <td className="td-design max-w-[200px]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-[22px] h-[22px] shrink-0">
                              {product.image ? (
                                <img
                                  src={normalizeMediaSource(product.image)}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="h-full w-full rounded bg-grayish/10" />
                              )}
                            </div>
                            <span className="td-text">{product.name}</span>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{product.date}</span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{product.type}</span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{product.amount}</span>
                        </td>

                        <td className="td-design">
                          <span
                            className={`td-text ${
                              product.stock ? "!text-success" : "!text-error"
                            }`}
                          >
                            {product.stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{product.category}</span>
                        </td>

                        <td className="td-design">
                          <div className="flex items-center gap-1.5">
                            <RatingStarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="td-text">
                              {Number(product.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="td-design">
                          <button
                            type="button"
                            className="flex h-7.5 items-center justify-center gap-1.5 rounded-[6px] bg-[rgba(245,88,91,0.16)] px-3 text-sm font-medium text-grayish transition-colors hover:bg-red-200"
                            onClick={() => openDeleteModal(product.id)}
                          >
                            <TrashIcon className="h-3.5 w-3.5 text-error" />
                            {t("dashboard.delete")}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Pagination
          lastPage={lastPage}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
        />
      </div>

      <CommonModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        title={t("dashboard.areYouSure")}
        subtitle={t("dashboard.doYouWantToDeleteThisItem")}
        width="max-w-sm"
        bodyClassName="mt-4"
        footerClassName="mt-6"
      >
        <div className="mt-7.5">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary-outline"
              size="compact"
              rounded="sm"
              className="w-full"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              {t("dashboard.cancel")}
            </Button>
            <Button
              type="button"
              variant="danger-filled"
              size="compact"
              rounded="sm"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
              loading={isDeleting}
            >
              {isDeleting ? t("dashboard.deleting") : t("dashboard.delete")}
            </Button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default Listing;
