import axios, { AxiosInstance } from "axios";

interface ConfigFields {
  key: string;
  value: string;
}

interface Data<T> {
  recordId: string;
  fields: T;
}

export const formateFeishuData = (data: Array<Data<ConfigFields>>) => {
  const result: { [key: string]: string } = {};
  data.forEach(({ fields }) => {
    const { key, value } = fields;
    if (!key) return;
    result[key] = value;
  });
  return result;
};

export class WebConfigClient {
  baseURL: string;
  instance: AxiosInstance;
  constructor({ baseURL = "/biz/web-config" }) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getFeishuConfig(params: { url?: string; key?: string }) {
    return this.instance.get("/feishu-config", {
      params,
    });
  }
}
console.log(
  "process.env.NEXT_PUBLIC_ANALYTICS_ID",
  process.env.NEXT_PUBLIC_ANALYTICS_ID
);
const ENV = process.env.NEXT_PUBLIC_ANALYTICS_ID;

const client = new WebConfigClient({
  baseURL:
    ENV === "prod"
      ? "https://prod.pandateacher.com/biz/web-config"
      : "/biz/web-config",
  // baseURL: ENV === "prod" ? "https://config.aioschat.com" : "/",
  // baseURL: 'https://prod.pandateacher.com/biz/web-config',
});

export default client;
