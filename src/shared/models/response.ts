export interface CustomData {}

export type ResponseData = {
  header: ResponseHeaderData;
  data?: CustomData;
};

export type ResponseHeaderData = {
  username?: string;
};
