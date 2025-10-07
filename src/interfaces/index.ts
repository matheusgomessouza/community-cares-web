import { z, ZodType } from "zod";
export interface LocationInputProps {
  name: string;
  type: string;
  address: string;
  telephone: string;
  coords: {
    latitude: number | string;
    longitude: number | string;
  };
}

export interface GoogleTokenAuthProps {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser: string;
  prompt: string;
}

export interface GoogleCodeAuthProps {
  authuser: string;
  code: string;
  prompt: string;
  scope: string;
}

export interface GooglePeopleAPIProps {
  resourceName: string;
  etag: string;
  names: [
    {
      metadata: {
        primary: boolean;
        source: {
          type: string;
          id: string;
        };
        sourcePrimary: boolean;
      };
      displayName: string;
      familyName: string;
      givenName: string;
      displayNameLastFirst: string;
      unstructuredName: string;
    }
  ];
  photos: [
    {
      metadata: {
        primary: boolean;
        source: {
          type: string;
          id: string;
        };
      };
      url: string;
    }
  ];
}

export interface GoogleAccessTokenProps {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: number;
}

export const LocationInputSchema: ZodType<LocationInputProps> = z
  .object({
    name: z.string().min(1, { message: "Required field" }),
    type: z.string().min(6, {
      message: "Please select a establishment type",
    }),
    address: z.string().min(1, { message: "Required field" }),
    telephone: z.string().min(1, { message: "Required field" }),
    coords: z.object({
      latitude: z.coerce
        .number({
          invalid_type_error: "Latitude must be a number",
        })
        .min(-90, { message: "Latitude must be between -90 and 90" })
        .max(90, { message: "Latitude must be between -90 and 90" }),
      longitude: z.coerce
        .number({
          invalid_type_error: "Longitude must be a number",
        })
        .min(-180, { message: "Longitude must be between -180 and 180" })
        .max(180, { message: "Longitude must be between -180 and 180" }),
    }),
  })
  .required();

export interface InputTelephoneIntlProps {
  onChange: (value: string | undefined) => void;
  onBlur: () => void;
  value: string;
  name: string;
  disabled?: boolean;
}