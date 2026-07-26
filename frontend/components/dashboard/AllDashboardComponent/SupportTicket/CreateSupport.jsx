"use client";

import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/forms/input/FileUpload";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import { LeftArrowIcon } from "@/icons";
import { useCreateSupportTicketMutation } from "@/lib/features/supportTicket/supportTicketApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateSupport = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const [createTicket, { isLoading }] = useCreateSupportTicketMutation();
  const t = useT();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", description);
    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("attachment[]", file);
      });
    }

    try {
      const response = await createTicket(formData).unwrap();
      setTitle("");
      setDescription("");
      setFiles([]);
      const uuid = response?.data?.uuid;
      if (uuid) {
        router.push(`/dashboard/support-ticket/${uuid}/support-chat`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-top-gap">
      <Link
        href="/dashboard/support-ticket"
        className="h-10 inline-flex items-center justify-center gap-1.5 text-[15px] font-medium text-grayish bg-[rgba(7,33,38,0.04)] rounded-[10px] px-5 hover:bg-gray-200"
      >
        <LeftArrowIcon className="h-4.5 w-4.5 rtl:rotate-180" />
        {t("dashboard.back")}
      </Link>

      <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5 mt-7.5">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Label htmlFor="title" required>
              {t("dashboard.title")}
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder={t("dashboard.enterTitle")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="description" required>
              {t("dashboard.message")}
            </Label>
            <TextArea
              id="description"
              name="description"
              placeholder={t("dashboard.type")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="attachment">{t("dashboard.attachments")}</Label>
            <FileUpload
              accept=".png,.jpg,.jpeg,.gif"
              maxSizeMB={2}
              multiple={true}
              onChange={(selectedFiles) => setFiles(selectedFiles || [])}
            />
          </div>

          <div className="col-span-12">
            <div className="mt-5">
              <Button
                type="submit"
                variant="primary-filled"
                size="md"
                rounded="md"
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading
                  ? t("dashboard.creating")
                  : t("dashboard.createTicket")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupport;
