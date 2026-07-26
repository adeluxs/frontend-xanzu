import { twMerge } from "tailwind-merge";

const Label = ({ htmlFor, children, className, required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        "mb-2.5 block text-sm font-semibold text-[#596A6E]",
        className,
      )}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
};

export default Label;
