export interface MyRequest {
  base: string;
  date: string;
  motd: {
    msg: string;
    url: string;
  };
  rates: {
    [key: string]: number;
  };
  success: boolean;
}