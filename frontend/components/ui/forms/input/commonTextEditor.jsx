"use client";

import $ from "jquery";
import { useEffect, useMemo, useRef, useState } from "react";
import SummernoteLite from "react-summernote-lite";

const DEFAULT_TOOLBAR = [
  ["style", ["style"]],
  ["font", ["bold", "italic", "underline", "clear"]],
  ["para", ["ul", "ol", "paragraph"]],
  ["insert", ["link", "picture"]],
  ["view", ["codeview"]],
];

const CommonTextEditor = ({
  id = "common-text-editor",
  value = "",
  onChange,
  placeholder = "Write something...",
  height = 260,
  toolbar,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);
  const initialValueRef = useRef(value || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$ = window.$ || $;
      window.jQuery = window.jQuery || $;
      setIsClient(true);
    }
  }, []);

  const normalizeValue = (contents) => {
    if (contents == null) return "";
    if (typeof contents === "string") return contents;
    if (typeof contents === "object") {
      if (typeof contents.html === "function") return contents.html();
      if (typeof contents.text === "function") return contents.text();
      return contents.toString();
    }
    return String(contents);
  };

  const handleChange = (contents) => {
    onChange?.(normalizeValue(contents));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!editorRef.current) return;
    setIsFocused(false);

    try {
      const editorValue = editorRef.current.summernote("code");
      onChange?.(normalizeValue(editorValue));
    } catch (error) {
      console.error("Summernote value read failed:", error);
    }
  };

  useEffect(() => {
    if (!isClient || !editorRef.current || isFocused) return;

    try {
      const currentValue = editorRef.current.summernote("code");
      if (currentValue !== value) {
        editorRef.current.summernote("code", value || "");
      }
    } catch (error) {
      console.error("Summernote sync failed:", error);
    }
  }, [value, isClient, isFocused]);

  const callbacks = useMemo(
    () => ({
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onImageUpload: (files) => {
        if (!files || !files.length) return;

        files.forEach((file) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            const imageUrl = event.target?.result;
            if (!imageUrl || !editorRef.current) return;

            editorRef.current.summernote("insertImage", imageUrl, file.name);
            const updatedValue = editorRef.current.summernote("code");
            onChange?.(normalizeValue(updatedValue));
          };

          reader.readAsDataURL(file);
        });
      },
      onDialogShown: () => {
        const $modal = window.$(".note-modal:visible");

        if ($modal.find(".custom-close-btn").length) return;

        const $closeBtn = window.$(`
            <button class="custom-close-btn flex items-center justify-center 
              absolute top-3 right-3 w-8 h-8 
              rounded-full bg-white shadow-md border border-gray-200 
              text-gray-600 hover:text-black hover:bg-gray-100 
              transition">
              ✕
            </button>
          `);

        $closeBtn.on("click", () => {
          try {
            $modal.modal("hide");
          } catch (e) {
            $modal.hide();
            window.$(".modal-backdrop").remove();
          }
        });

        $modal.css("position", "relative");
        $modal.find(".modal-content").addClass("pt-6");
        $modal.append($closeBtn);
      },
    }),
    [handleBlur, handleChange, id, onChange],
  );

  if (!isClient) {
    return (
      <div className="h-40 rounded-[10px] border border-grayish/16 bg-gray-50" />
    );
  }

  return (
    <SummernoteLite
      ref={editorRef}
      defaultCodeValue={initialValueRef.current}
      placeholder={placeholder}
      height={height}
      dialogsInBody={true}
      toolbar={toolbar || DEFAULT_TOOLBAR}
      callbacks={callbacks}
      useDiv={true}
    />
  );
};

export default CommonTextEditor;
