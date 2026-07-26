"use client";

import Badge from "@/components/common/Badge";
import CommonModal from "@/components/common/CommonModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import {
  DeliveryIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/icons";
import {
  useDeleteMyProductMutation,
  useGetAllMyProductQuery,
} from "@/lib/features/addProduct/addProductApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const PER_PAGE = 8;

const MyProductListing = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const t = useT();

  const siteCurrencySymbol = useSelector(
    (state) => state?.settings?.settings?.currency_symbol,
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const { data, currentData, isLoading, isFetching } = useGetAllMyProductQuery(
    {
      search,
      page: currentPage,
      per_page: PER_PAGE,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [deleteMyProduct, { isLoading: isDeleting }] =
    useDeleteMyProductMutation();

  const showProductsLoading = isLoading || (isFetching && !currentData);
  const productData = showProductsLoading ? currentData : (currentData ?? data);

  const listings = productData?.data?.listings || [];
  const meta = productData?.meta || data?.meta || {};

  const lastPage = Math.max(
    1,
    Number(meta?.last_page) ||
      Math.ceil(
        (Number(meta?.total) || 0) / (Number(meta?.per_page) || PER_PAGE),
      ),
  );

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
      await deleteMyProduct(deleteTargetId).unwrap();
      closeDeleteModal();
    } catch {}
  };

  return (
    <div className="dashboard-top-gap">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
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

          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRTL ? "right-3.5" : "left-3.5"
            }`}
          >
            <SearchIcon className="h-4 w-4 text-[#8D999B]" />
          </div>
        </div>

        <Button
          type="button"
          variant="primary-filled"
          size="compact"
          rounded="md"
          href="/dashboard/add-product"
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          {t("dashboard.addProduct")}
        </Button>
      </div>

      <div className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-3 sm:p-5">
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[1100px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.productName"),
                      t("dashboard.category"),
                      t("dashboard.discount"),
                      t("dashboard.price"),
                      t("dashboard.quantity"),
                      t("dashboard.status"),
                      t("dashboard.action"),
                    ].map((heading, index, arr) => (
                      <th
                        key={heading}
                        className={`th-design border-b border-t border-[#CEF5CE] bg-[#F3FDF3]
                          ${
                            index === 0
                              ? isRTL
                                ? "rounded-br-[10px] rounded-tr-[10px] border-r"
                                : "rounded-bl-[10px] rounded-tl-[10px] border-l"
                              : ""
                          }
                          ${
                            index === arr.length - 1
                              ? isRTL
                                ? "rounded-bl-[10px] rounded-tl-[10px] border-l"
                                : "rounded-br-[10px] rounded-tr-[10px] border-r"
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
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingProducts")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : listings?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound
                            message={t("dashboard.noProductsFound")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    listings?.map((product, index) => (
                      <tr key={index} className="tr-design">
                        <td className="td-design max-w-[260px]">
                          <div className="min-w-0">
                            <p className="td-text truncate font-medium">
                              {product?.product_name || "N/A"}
                            </p>
                            <p className="mt-0.5 text-xs capitalize text-grayish/60">
                              {product?.type || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {product?.category?.name || "N/A"}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {siteCurrencySymbol}{" "}
                            {product?.discount_value || "N/A"}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text font-medium">
                            {siteCurrencySymbol}{" "}
                            {product?.final_price || product?.price || "0.00"}
                          </span>
                        </td>

                        <td className="td-design">
                          <span
                            className={`td-text ${
                              Number(product?.quantity) > 0
                                ? "!text-success"
                                : "!text-error"
                            }`}
                          >
                            {product?.quantity ?? 0}
                          </span>
                        </td>

                        <td className="td-design">
                          <Badge status={product?.status} />
                        </td>

                        <td className="td-design">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/listing/edit/${product?.id}`}
                              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] bg-primary/15 px-3 text-sm font-medium text-grayish transition-colors hover:bg-primary/25"
                            >
                              <EditIcon className="h-3.5 w-3.5" />
                              {t("dashboard.edit")}
                            </Link>
                            {product?.delivery_item_info?.is_deliverable ===
                              true && (
                              <Link
                                href={`/dashboard/listing/delivery-item/${product?.id}`}
                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] bg-primary/15 px-3 text-sm font-medium text-grayish transition-colors hover:bg-primary/25"
                              >
                                <DeliveryIcon className="h-3.5 w-3.5" />
                                Delivery Items
                              </Link>
                            )}

                            <button
                              type="button"
                              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] bg-[rgba(245,88,91,0.16)] px-3 text-sm font-medium text-grayish transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                              onClick={() => openDeleteModal(product.id)}
                              disabled={isDeleting}
                            >
                              <TrashIcon className="h-3.5 w-3.5 text-error" />
                              {t("dashboard.delete")}
                            </button>
                          </div>
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

export default MyProductListing;
