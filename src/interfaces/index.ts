export interface LocationInputProps {
  name: string;
  type: string;
  address: string;
  telephone: string;
  coords: {
    latitude: number;
    longitude: number;
  };
}
