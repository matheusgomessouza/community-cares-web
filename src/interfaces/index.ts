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

export interface GoogleAuthProps {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser: string;
  prompt: string;
}
