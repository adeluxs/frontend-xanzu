"use client";
import CommonModal from "@/components/common/CommonModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { EditIcon, PlusIcon, TrashIcon } from "@/icons";
import {
  useDeleteWithdrawAccountMutation,
  useGetWithdrawAccountsQuery,
} from "@/lib/features/withdraw/withdrawApi";
import { formatDate } from "@/utils/utils";
import { isRemoteMediaSource, normalizeMediaSource } from "@/utils/media";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const WithdrawAccount = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useT();

  const { data: withdrawAccountsData, isLoading } = useGetWithdrawAccountsQuery(
    { page: currentPage },
  );
  const [deleteWithdrawAccount, { isLoading: isDeleting }] =
    useDeleteWithdrawAccountMutation();

  const accounts = withdrawAccountsData?.data || [];
  const lastPage = withdrawAccountsData?.meta?.last_page || 1;

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
    const result = await deleteWithdrawAccount({
      id: deleteTargetId,
      _method: "DELETE",
    });
    closeDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-end items-end gap-3 flex-wrap mb-6">
        <Button
          type="button"
          variant="primary-filled"
          size="compact"
          rounded="md"
          href="/dashboard/withdraw/withdraw-account/add-withdraw-account"
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          {t("dashboard.addAccount")}
        </Button>
      </div>

      <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[900px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.slNo"),
                      t("dashboard.createdTime"),
                      t("dashboard.methodName"),
                      t("dashboard.gateway"),
                      t("dashboard.currency"),
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingWithdrawAccount")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : accounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound
                            message={t("dashboard.noWithdrawAccountFound")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account, index) => (
                      <tr key={account.id} className="tr-design">
                        <td className="td-design">
                          <span className="td-text">
                            # {(currentPage - 1) * 10 + index + 1}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {formatDate(account?.created_at)}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {account?.method_name}
                          </span>
                        </td>

                        <td className="td-design">
                          <div className="flex items-center gap-2">
                            {account.method?.icon && (
                              <Image
                                src={normalizeMediaSource(account?.method?.icon)}
                                alt={account?.method?.name}
                                width={24}
                                height={24}
                                unoptimized={isRemoteMediaSource(
                                  normalizeMediaSource(account?.method?.icon),
                                )}
                                className="w-6 h-6 object-contain rounded"
                              />
                            )}
                            <span className="td-text">
                              {account.method?.name}
                            </span>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{account?.currency}</span>
                        </td>

                        <td className="td-design">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/dashboard/withdraw/withdraw-account/${account?.id}/edit-withdraw-account`}
                              className="flex items-center h-7.5 w-7.5 justify-center rounded-[6px] bg-[rgba(7,33,38,0.08)] text-grayish text-sm font-medium transition-colors hover:bg-[rgba(7,33,38,0.2)]"
                            >
                              <EditIcon />
                            </Link>
                            <button
                              type="button"
                              className="flex items-center h-7.5 w-7.5 justify-center rounded-[6px] bg-[rgba(245,88,91,0.16)] text-error text-sm font-medium transition-colors hover:bg-red-200"
                              onClick={() => openDeleteModal(account?.id)}
                            >
                              <TrashIcon className="h-5 w-5" />
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
          perPage={10}
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
            >
              {t("dashboard.cancel")}
            </Button>
            <Button
              type="button"
              variant="danger-filled"
              size="compact"
              rounded="sm"
              className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
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

export default WithdrawAccount;
