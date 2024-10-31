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
    type: z
      .string()
      .refine((value) => value === "-- Please choose an option --", {
        message: "Please select a establishment type",
      }),
    address: z.string().min(1, { message: "Required field" }),
    telephone: z
      .string({ message: "Required field" })
      .min(13, { message: "Invalid telephone number format" }),
    coords: z.object({
      latitude: z.string().min(9, { message: "Invalid latitude" }),
      longitude: z.string().min(9, { message: "Invalid longitude" }),
    }),
  })
  .required();
