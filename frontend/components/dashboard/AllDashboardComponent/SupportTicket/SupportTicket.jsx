"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { PlusIcon, SearchIcon } from "@/icons";
import { useGetSupportTicketQuery } from "@/lib/features/supportTicket/supportTicketApi";
import Link from "next/link";
import { useState } from "react";

const SupportTicket = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const t = useT();

  const { data, isLoading } = useGetSupportTicketQuery({
    status: status || "",
    search,
    page: currentPage,
  });

  const tickets = data?.data || [];
  const lastPage = data?.meta?.last_page || 1;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
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
              placeholder={t("dashboard.searchTicketId")}
              className="h-10 rounded-[10px] ltr:pl-9"
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
          <ReactSelectInput
            options={[
              { value: "Open", label: "Open" },
              { value: "Closed", label: "Closed" },
            ]}
            value={status}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
            placeholder={t("dashboard.selectStatus")}
            size="sm"
            borderRadius={10}
          />
        </div>
        <Button
          type="button"
          variant="primary-filled"
          size="compact"
          rounded="md"
          href="/dashboard/support-ticket/create-support"
          startIcon={<PlusIcon className="h-5 w-5" />}
        >
          {t("dashboard.createTicket")}
        </Button>
      </div>

      <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
        <div className="w-full overflow-x-auto">
          <table className="main-table w-full min-w-[700px]">
            <thead>
              <tr>
                {[
                  t("dashboard.description"),
                  t("dashboard.date"),
                  t("dashboard.status"),
                  t("dashboard.action"),
                ].map((heading, i, arr) => (
                  <th
                    key={heading}
                    className={`th-design bg-[#F3FDF3] border-t border-b border-[#CEF5CE]
                        ${
                          i === 0
                            ? isRTL
                              ? "border-r rounded-tr-[10px] rounded-br-[10px]"
                              : "border-l rounded-tl-[10px] rounded-bl-[10px]"
                            : ""
                        }
                        ${
                          i === arr.length - 1
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
                  <td colSpan={4} className="td-design text-center">
                    <div className="mt-6 w-full">
                      <LoadingSpinner
                        message={t("dashboard.loadingSupportTickets")}
                      />
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="td-design text-center">
                    <div className="mt-6 flex justify-center">
                      <NoDataFound
                        message={t("dashboard.noSupportTicketFound")}
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="tr-design">
                    <td className="td-design">
                      <p className="td-text font-medium">
                        <span className="font-semibold">
                          {t("dashboard.ticketId")}:
                        </span>{" "}
                        {ticket.uuid}
                      </p>
                      <p className="text-sm font-normal text-grayish/80">
                        {ticket.title}
                      </p>
                    </td>

                    <td className="td-design">
                      <p className="td-text">
                        <span className="font-semibold">
                          {t("dashboard.created")}:
                        </span>{" "}
                        {ticket.created_at}
                      </p>
                    </td>

                    <td className="td-design">
                      <Badge status={ticket.status} />
                    </td>

                    <td className="td-design">
                      <Link
                        href={`/dashboard/support-ticket/${ticket.uuid}/support-chat`}
                        className="td-text !underline font-medium !text-grayish"
                      >
                        {t("dashboard.view")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Pagination
          lastPage={lastPage}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          perPage={10}
        />
      </div>
    </div>
  );
};

export default SupportTicket;
