"use client";
import { File, X } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const FileUpload = forwardRef(function FileUpload(
  {
    accept = ".png,.jpg,.jpeg,.pdf,.doc,.docx",
    maxSizeMB = 10,
    multiple = true,
    maxFiles,
    onChange,
    onRemoveDefaultFile,
    type = "file",
    capture = "",
    className = "",
    defaultValue = [], // Array of URLs or File objects to display initially
  },
  ref,
) {
  const [attachments, setAttachments] = useState([]);
  const [defaultFiles, setDefaultFiles] = useState(defaultValue || []);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Stabilize defaultValue to prevent unnecessary re-renders
  const defaultValueJson = JSON.stringify(defaultValue || []);

  // Update default files only when content changes
  useEffect(() => {
    setDefaultFiles(JSON.parse(defaultValueJson));
  }, [defaultValueJson]);

  // Expose reset method to parent via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      setAttachments([]);
      setDefaultFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  }));

  // Handle files
  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024,
    );

    const mergedFiles = multiple
      ? [...attachments, ...validFiles]
      : validFiles.slice(0, 1);

    const updated =
      multiple && typeof maxFiles === "number"
        ? mergedFiles.slice(0, maxFiles)
        : mergedFiles;

    setAttachments(updated);

    // Clear default files when new files are uploaded
    if (validFiles.length > 0) {
      setDefaultFiles([]);
    }

    if (onChange) onChange(updated);
  };

  // Input change
  const handleFileUpload = (e) => {
    handleFiles(e.target.files);

    e.target.value = "";
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);

    // reset input for safety
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Remove file
  const removeAttachment = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
    if (onChange) onChange(updated);

    // reset input when empty
    if (updated.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove default file
  const removeDefaultFile = (index) => {
    const removedFile = defaultFiles[index];
    const updated = defaultFiles.filter((_, i) => i !== index);
    setDefaultFiles(updated);
    // Clear attachments as well to ensure clean state
    setAttachments([]);
    // Notify parent with empty array
    if (onChange) onChange([]);
    if (onRemoveDefaultFile) onRemoveDefaultFile(removedFile);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Helper to check if a string is a URL
  const isUrl = (str) => {
    if (typeof str !== "string") return false;
    return (
      str.startsWith("http://") ||
      str.startsWith("https://") ||
      str.startsWith("/")
    );
  };

  // Helper to get file name from URL or object
  const getFileNameFromUrl = (file) => {
    if (typeof file === "object" && file !== null && file.name) {
      return file.name;
    }
    const url = typeof file === "object" && file !== null ? file.url : file;
    if (typeof url !== "string") return "file";
    try {
      const urlObj = new URL(url, window.location.origin);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || "file";
    } catch {
      return "file";
    }
  };

  // Check if URI/object is an image
  const isImageUrl = (file) => {
    const url = typeof file === "object" && file !== null ? file.url : file;
    if (typeof url !== "string") return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(url);
  };

  // Check if there's any content to display
  const hasContent = attachments.length > 0 || defaultFiles.length > 0;

  return (
    <div className={`file-upload ${className}`}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-[12px] px-4 py-5 min-h-30 transition-all duration-300 hover:border-[#B2BABC] ${
          isDragging ? "border-[#B2BABC]" : "border-[#B2BABC]"
        }`}
      >
        {/* File Previews */}
        {hasContent && (
          <div className="flex flex-wrap gap-3 mt-1">
            {/* Show default files if exists and no new files uploaded */}
            {defaultFiles.length > 0 && attachments.length === 0 && (
              <>
                {defaultFiles.map((file, index) => {
                  const fileUrl =
                    typeof file === "object" && file !== null ? file.url : file;
                  const fileName = getFileNameFromUrl(file);
                  return (
                    <div
                      key={`default-${index}`}
                      className="relative flex flex-col items-center justify-center bg-gray-100 rounded-lg p-2 w-[100px]"
                    >
                      <div className="flex flex-col items-center text-center w-full">
                        {isImageUrl(file) ? (
                          <img
                            src={fileUrl}
                            alt={fileName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <File className="w-10 h-10 text-grayish/60" />
                        )}

                        <div className="text-xs text-grayish line-clamp-1 w-full mt-0.5 mb-0.5">
                          {fileName}
                        </div>

                        <span className="text-[11px] text-grayish/60">
                          Uploaded
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeDefaultFile(index)}
                        className="bg-error text-white inline-flex items-center justify-center text-sm w-5 h-5 rounded-full absolute top-[-4px] right-[-4px]"
                      >
                        <X className="w-3 h-3 text-gray-200" />
                      </button>
                    </div>
                  );
                })}
              </>
            )}

            {/* Show newly uploaded files */}
            {attachments.map((file, index) => (
              <div
                key={`new-${index}`}
                className="relative flex flex-col items-center justify-center bg-gray-100 rounded-lg p-2 w-[100px]"
              >
                <div className="flex flex-col items-center text-center w-full">
                  {file.type.includes("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <File className="w-10 h-10 text-grayish/60" />
                  )}

                  <div className="text-xs text-grayish line-clamp-1 w-full mt-0.5 mb-0.5">
                    {file.name}
                  </div>

                  <span className="text-[11px] text-grayish/60">
                    {file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${Math.round(file.size / 1024)} KB`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="bg-error text-white inline-flex items-center justify-center text-sm w-5 h-5 rounded-full absolute top-[-4px] right-[-4px]"
                >
                  <X className="w-3 h-3 text-gray-200" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        {!hasContent && (
          <div
            className={`text-center cursor-pointer ${
              isDragging ? "opacity-70" : ""
            }`}
            onClick={openFileDialog}
          >
            <div className="flex items-center justify-center mx-auto h-7.5 w-7.5 text-gray-400">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M4.58073 8.24935C3.72826 8.24935 3.30202 8.24935 2.95231 8.34305C2.00331 8.59734 1.26205 9.33859 1.00777 10.2876C0.914062 10.6373 0.914062 11.0635 0.914062 11.916V13.016C0.914062 14.5562 0.914062 15.3262 1.21379 15.9145C1.47745 16.4319 1.89814 16.8526 2.41559 17.1163C3.00385 17.416 3.77392 17.416 5.31406 17.416H13.0141C14.5542 17.416 15.3243 17.416 15.9125 17.1163C16.43 16.8526 16.8507 16.4319 17.1143 15.9145C17.4141 15.3262 17.4141 14.5562 17.4141 13.016V11.916C17.4141 11.0635 17.4141 10.6373 17.3204 10.2876C17.0661 9.33859 16.3248 8.59734 15.3758 8.34305C15.0261 8.24935 14.5999 8.24935 13.7474 8.24935M12.8307 4.58268L9.16406 0.916016M9.16406 0.916016L5.4974 4.58268M9.16406 0.916016V11.916"
                  stroke="#1F2A37"
                  strokeOpacity="0.6"
                  strokeWidth="1.83333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <span className="mt-1 block text-sm font-medium text-grayish/80">
              Drop files here or click to upload
            </span>
            <span className="mt-1 block text-xs text-grayish/60">
              PNG, JPG, PDF up to {maxSizeMB}MB each
              {typeof maxFiles === "number" ? `, max ${maxFiles} files` : ""}
            </span>
          </div>
        )}

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          id="file-upload"
          type={type}
          accept={accept}
          multiple={multiple}
          capture={capture || undefined}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
});

export default FileUpload;
