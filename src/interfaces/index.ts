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
