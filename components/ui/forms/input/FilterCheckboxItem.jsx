"use client";

const FilterCheckboxItem = ({ id, label, count, renderLabel }) => {
  return (
    <div className="flex gap-2 justify-between items-center custom-filter-checkbox">
      <label className="flex items-center gap-3 cursor-pointer group">
        <input type="checkbox" id={id} className="check-round sr-only" />
        <span className="checkbox-round" />

        <span className="text-sm text-grayish font-medium group-hover:text-primary transition-colors">
          {renderLabel ? renderLabel() : label}
        </span>
      </label>
      {!renderLabel && (
        <p className="text-[13px] font-medium text-grayish/60">({count})</p>
      )}
    </div>
  );
};

export default FilterCheckboxItem;
