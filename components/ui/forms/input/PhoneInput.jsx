"use client";
import { useState } from "react";

export default function PhoneInput({
  countries,
  placeholder = "+1 (555) 000-0000",
  onChange,
  selectPosition = "start", // Default position
}) {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("+1");

  // Create a map of country codes to labels
  const countryCodes = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {},
  );

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setPhoneNumber(countryCodes[newCountry]);
    if (onChange) {
      onChange(countryCodes[newCountry]);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Dropdown at start */}
      {selectPosition === "start" && (
        <div className="absolute">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="h-full appearance-none text-sm bg-none rounded-l-lg border-0 border-r border-[#C5C5C5] bg-transparent py-4 pl-3.5 pr-8 leading-tight text-grayish focus:border-brand-300 focus:outline-hidden"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-grayish"
              >
                {country.code}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 flex items-center text-grayish pointer-events-none right-3">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`h-13 w-full ${
          selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
        } rounded-lg border border-[#C5C5C5] shadow-[2px_2px_10px_rgba(0,0,0,0.06)] bg-transparent py-3 px-4 text-sm text-grayish placeholder:text-grayish/80 focus:outline-hidden focus:border-heading/50 transition-colors duration-200 ease-in-out`}
      />

      {/* Dropdown at end */}
      {selectPosition === "end" && (
        <div className="absolute right-0">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className=" h-full appearance-none bg-none rounded-r-lg border-0 border-l border-[#C5C5C5] bg-transparent py-4 pl-3.5 pr-8 text-sm leading-tight text-grayish focus:border-brand-300 focus:outline-hidden"
          >
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.code}
                className="text-grayish"
              >
                {country.code}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 flex items-center text-grayish pointer-events-none right-3">
            <svg
              className="stroke-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
