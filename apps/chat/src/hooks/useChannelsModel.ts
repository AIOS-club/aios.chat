import { useRequest } from "ahooks";
import { createModel } from "hox";
// import * as Sentry from '@sentry/react';
import client, { formateFeishuData } from "../common/web-config-client";

export const useChannels = (): [
  (
    | Array<{ id: string; title: string; service: string; type: string }>
    | undefined
  ),
  Error | undefined,
  Boolean
] => {
  const { data, error, loading } = useRequest(
    async () => {
      try {
        const res = await client.getFeishuConfig({
          key: "ai.os-channels",
        });
        if (!res.data.data) {
          return [];
        } else {
          return res.data.data.map((item: any) => {
            return {
              id: item.fields["ID"],
              title: item.fields["title"],
              service: item.fields["service"],
              type: item.fields["type"],
            };
          });
        }
      } catch (error) {
        // Sentry.captureException(error);
        return [];
      }
    },
    { cacheKey: "ai.os-channels", cacheTime: -1 }
  );

  return [data, error, loading];
};

export const useChannelsModel = createModel(useChannels);
