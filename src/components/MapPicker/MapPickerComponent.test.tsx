import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MapPickerComponent } from "./MapPickerComponent";

const googleMapSpy = vi.fn();

vi.mock("@react-google-maps/api", () => {
  return {
    LoadScript: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="load-script">{children}</div>
    ),
    GoogleMap: (props: any) => {
      googleMapSpy(props);
      return (
        <div data-testid="google-map" onClick={() => props.onClick?.(null)}>
          {props.children}
        </div>
      );
    },
    Marker: ({ position }: { position: { lat: number; lng: number } }) => (
      <div
        data-testid="marker"
        data-lat={position.lat}
        data-lng={position.lng}
      />
    ),
  };
});

describe("MapPickerComponent", () => {
  beforeEach(() => {
    googleMapSpy.mockClear();
  });

  it("renders without an initial marker", () => {
    const onLocationSelect = vi.fn();
    const { queryByTestId } = render(
      <MapPickerComponent onLocationSelect={onLocationSelect} />,
    );

    expect(queryByTestId("marker")).toBeNull();
  });

  it("renders a marker when initial coordinates are provided", () => {
    const onLocationSelect = vi.fn();
    const { getByTestId } = render(
      <MapPickerComponent
        onLocationSelect={onLocationSelect}
        initialLat={10}
        initialLng={20}
      />,
    );

    const marker = getByTestId("marker");
    expect(marker.getAttribute("data-lat")).toBe("10");
    expect(marker.getAttribute("data-lng")).toBe("20");
  });

  it("calls onLocationSelect when map is clicked", () => {
    const onLocationSelect = vi.fn();
    render(<MapPickerComponent onLocationSelect={onLocationSelect} />);

    const lastProps = googleMapSpy.mock.calls.at(-1)?.[0];
    const latLng = {
      lat: () => 1.23,
      lng: () => 4.56,
    };
    lastProps.onClick({ latLng });

    expect(onLocationSelect).toHaveBeenCalledWith(1.23, 4.56);
  });

  it("does not call onLocationSelect when click has no latLng", () => {
    const onLocationSelect = vi.fn();
    render(<MapPickerComponent onLocationSelect={onLocationSelect} />);

    const lastProps = googleMapSpy.mock.calls.at(-1)?.[0];
    lastProps.onClick({ latLng: null });

    expect(onLocationSelect).not.toHaveBeenCalled();
  });
});
