import React, { forwardRef } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as interfaces from "../../interfaces";

export const InputTelephoneIntlComponent = forwardRef<
  HTMLInputElement,
  interfaces.InputTelephoneIntlProps
>(({ onChange, onBlur, value, name, disabled }, ref) => {
  return (
    <div className="phone-input-wrapper">
      <PhoneInput
        className="text-gray border-solid border-gray border-2  rounded-lg px-2 h-10 mb-10"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        name={name}
        disabled={disabled}
        placeholder="Enter phone number"
      />
      <style jsx>{`
        .phone-input-wrapper :global(.PhoneInput) {
          outline: none !important;
        }
        .phone-input-wrapper :global(.PhoneInputInput) {
          outline: none !important;
          border: none !important;
        }
        .phone-input-wrapper :global(.PhoneInput:focus-within) {
          outline: 2px solid #f97316 !important;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
});

InputTelephoneIntlComponent.displayName = "InputTelephoneIntlComponent";
