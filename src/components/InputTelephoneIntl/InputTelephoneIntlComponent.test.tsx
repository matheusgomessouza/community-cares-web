import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";
import { InputTelephoneIntlComponent } from "./InputTelephoneIntlComponent";

vi.mock("react-phone-number-input", () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const {
        onChange,
        onBlur,
        value,
        name,
        disabled,
        className,
        placeholder,
      } = props;
      return (
        <input
          data-testid="phone-input"
          className={className}
          value={value ?? ""}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.((e.target as HTMLInputElement).value)}
          onBlur={onBlur}
        />
      );
    },
  };
});

describe("InputTelephoneIntlComponent", () => {
  it("renders PhoneInput with provided props", () => {
    render(
      <InputTelephoneIntlComponent
        value="+1234567890"
        name="phone"
        disabled
        onChange={vi.fn()}
        onBlur={vi.fn()}
      />,
    );

    const input = screen.getByTestId("phone-input") as HTMLInputElement;
    expect(input).toHaveValue("+1234567890");
    expect(input).toHaveAttribute("name", "phone");
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("placeholder", "Enter phone number");
    expect(input.className).toContain("text-gray");
  });

  it("calls onChange and onBlur handlers", () => {
    const onChange = vi.fn();
    const onBlur = vi.fn();

    render(
      <InputTelephoneIntlComponent
        value=""
        name="phone"
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    const input = screen.getByTestId("phone-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "+15551234567" } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("+15551234567");
    expect(onBlur).toHaveBeenCalled();
  });
});
