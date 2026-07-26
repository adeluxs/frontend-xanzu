"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import {
  AttachmentsIcon,
  LeftArrowIcon,
  SendIcon,
  SupportTeamIcon,
} from "@/icons";
import {
  useCloseTicketMutation,
  useGetSingleSupportTicketQuery,
  useReplySupportTicketMutation,
} from "@/lib/features/supportTicket/supportTicketApi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const SupportChat = () => {
  const params = useParams();
  const uuid = params.id;
  const router = useRouter();

  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const t = useT();

  const { data: ticketData, isLoading } = useGetSingleSupportTicketQuery(
    { uuid },
    { skip: !uuid },
  );

  const ticket = ticketData?.data?.ticket;
  const messageList = ticketData?.data?.messages ?? [];

  const [replySupportTicket, { isLoading: isSending }] =
    useReplySupportTicketMutation();

  const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) {
      toast.error("Please enter a message");
      return;
    }

    const formData = new FormData();
    formData.append("message", newMessage);
    attachments.forEach((item) => {
      formData.append("attachments[]", item.file);
    });

    await replySupportTicket({
      uuid,
      formData,
      onSuccess: () => {
        setNewMessage("");
        setAttachments([]);
      },
    });
  };

  const handleCloseTicket = async () => {
    await closeTicket({ uuid });
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((f) => f.id !== id));
  };

  const AttachmentList = ({ urls = [], align = "start" }) => (
    <div
      className={`flex mt-3 ${align === "end" ? "justify-end" : "justify-start"}`}
    >
      <div className="space-y-1">
        {urls.map((url, i) => {
          const name = url.split("/").pop();
          const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url);
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              {isImage ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-white/60 rounded px-1.5 py-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-green-600"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                    <span className="text-xs truncate max-w-[120px]">
                      {name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  <span className="text-xs truncate max-w-[140px]">{name}</span>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <LoadingSpinner fullScreen message={t("dashboard.loadingSupportChat")} />
    );
  }

  return (
    <div className="dashboard-top-gap">
      <Link
        href="/dashboard/support-ticket"
        className="h-10 inline-flex items-center justify-center gap-1.5 text-[15px] font-medium text-grayish bg-[rgba(7,33,38,0.04)] rounded-[10px] px-5 hover:bg-gray-200"
      >
        <LeftArrowIcon className="h-4.5 w-4.5 rtl:rotate-180" />
        {t("dashboard.back")}
      </Link>
      <div className="mt-5 sm:mt-7.5">
        <div className="flex flex-wrap gap-3 items-center justify-between p-4 rounded-[16px] bg-[rgba(68,241,166,0.10)] mb-7.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-grayish/60">
              {ticket?.title}
            </span>
            <span className="text-sm text-grayish/60">|</span>
            <span className="text-sm font-bold text-grayish">
              #{ticket?.uuid}
            </span>
          </div>

          {ticket?.status === "Open" && (
            <button
              onClick={handleCloseTicket}
              disabled={isClosing}
              className="px-5 h-[36px] flex justify-center items-center bg-error hover:bg-red-600 text-white text-sm font-semibold rounded-[10px] transition-colors disabled:opacity-60"
            >
              {isClosing ? t("dashboard.closing") : t("dashboard.close")}
            </button>
          )}
        </div>

        <div className="flex-1 h-[calc(100vh-450px)] overflow-y-auto p-5 sm:p-7.5 space-y-5 bg-white border border-[rgba(7,33,38,0.16)] rounded-[16px] no-scrollbar">
          {ticket && (
            <div className="flex justify-end">
              <div className="max-w-[95%] md:max-w-[55%]">
                <div className="bg-[#88E788] text-grayish text-base rounded-[14px] rtl:rounded-bl-none ltr:rounded-br-none p-4 leading-relaxed">
                  {ticket.message}
                  {ticket.attachments?.length > 0 && (
                    <AttachmentList urls={ticket.attachments} align="end" />
                  )}
                </div>
              </div>
            </div>
          )}

          {messageList.map((msg) => {
            const isUser = msg.is_admin === false;

            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[95%] md:max-w-[55%] space-y-1.5 flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`text-grayish text-base rounded-[14px] p-4 leading-relaxed w-full ${
                      isUser
                        ? "bg-[#88E788] text-grayish rtl:rounded-bl-none ltr:rounded-br-none"
                        : "bg-[#F5F6F6] text-grayish/70 rtl:rounded-br-none ltr:rounded-bl-none font-normal"
                    }`}
                  >
                    {msg.message}
                    {msg.attachments?.length > 0 && (
                      <AttachmentList
                        urls={msg.attachments}
                        align={isUser ? "end" : "start"}
                      />
                    )}
                  </div>

                  {/* Sender label (support only) */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <SupportTeamIcon className="h-5 sm:h-7.5 w-5 sm:w-7.5" />
                      <span className="text-grayish font-medium text-sm">
                        {t("dashboard.supportTeam")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {attachments.length > 0 && (
          <div className="px-5 py-2 flex gap-2 flex-wrap bg-gray-50 mt-2 rounded-[10px] mb-[-20px]">
            {attachments.map((att) => (
              <div key={att.id} className="relative group">
                {att.preview ? (
                  <img
                    src={att.preview}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-gray-400"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {ticket?.status === "Open" && (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full mt-5 sm:mt-7.5">
            <div className="flex items-center gap-3 bg-[#F5F6F6] rounded-full h-[52px] px-5 border border-[#F5F6F6] focus-within:border-grayish/40 focus-within:bg-white transition-all w-full">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSendMessage()
                }
                className="flex-1 bg-transparent text-sm text-grayish placeholder-grayish/60 outline-none"
                placeholder={t("dashboard.typeMessage")}
              />

              <input
                type="file"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <button
                onClick={handleUploadClick}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <AttachmentsIcon className="h-5 w-5" />
              </button>
            </div>

            <Button
              type="button"
              variant="primary-filled"
              size="compact"
              rounded="md"
              endIcon={<SendIcon className="h-3 w-3 rtl:rotate-180" />}
              onClick={handleSendMessage}
              disabled={isSending}
              loading={isSending}
              className="h-[52px] rounded-full !px-7.5"
            >
              {isSending ? t("dashboard.sending") : t("dashboard.send")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
