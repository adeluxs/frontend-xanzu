"use client";

import FileUpload from "@/components/ui/forms/input/FileUpload";
import Label from "@/components/ui/forms/input/Label";
import { useT } from "@/context/TranslationContext";

const ImagesTabContent = ({ formData, updateField }) => {
  const t = useT();
  const getImageValue = (file) => {
    if (!file) return "";
    if (typeof file === "string") return file;
    if (typeof file === "object" && file.url) return file.url;
    return "";
  };

  const addDeletedImage = (file) => {
    const imageValue = getImageValue(file);
    if (!imageValue) return;

    const existingDeleted = Array.isArray(formData.deleted_images)
      ? formData.deleted_images
      : [];

    if (!existingDeleted.includes(imageValue)) {
      updateField("deleted_images", [...existingDeleted, imageValue]);
    }
  };

  const handleThumbnailChange = (files) => {
    updateField("thumbnail", files?.[0] || null);
  };

  const handleGalleryChange = (files) => {
    updateField("gallery", files || []);
  };

  const defaultThumbnail = formData.thumbnail
    ? [formData.thumbnail]
    : formData.existingThumbnail
      ? [formData.existingThumbnail]
      : [];

  const defaultGallery =
    formData.gallery && formData.gallery.length > 0
      ? formData.gallery
      : Array.isArray(formData.existingGallery)
        ? formData.existingGallery
        : [];

  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.08)] bg-white p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="thumbnail" required>
            {t("dashboard.thumbnail")}
          </Label>

          <FileUpload
            accept=".png,.jpg,.jpeg,.gif,.webp"
            maxSizeMB={2}
            multiple={false}
            defaultValue={defaultThumbnail}
            onChange={handleThumbnailChange}
            onRemoveDefaultFile={addDeletedImage}
          />
        </div>

        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="gallery-images">
            {t("dashboard.galleryImagesMax4")}
          </Label>

          <FileUpload
            accept=".png,.jpg,.jpeg,.gif,.webp"
            maxSizeMB={2}
            multiple
            maxFiles={4}
            defaultValue={defaultGallery}
            onChange={handleGalleryChange}
            onRemoveDefaultFile={addDeletedImage}
          />
        </div>
      </div>

      {(formData.deleted_images || []).map((image, index) => (
        <input
          key={`${image}-${index}`}
          type="hidden"
          name={`deleted_images[${index}]`}
          value={image}
          readOnly
        />
      ))}
    </div>
  );
};

export default ImagesTabContent;
