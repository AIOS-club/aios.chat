import { useRequest } from "ahooks";
import { createModel } from "hox";
// import * as Sentry from '@sentry/react';
import client, { formateFeishuData } from "../common/web-config-client";

export const useServiceConfig = (): [
  Array<{ id: string; icon: string; service: string }> | undefined,
  Error | undefined,
  Boolean
] => {
  const { data, error, loading } = useRequest(
    async () => {
      try {
        const res = await client.getFeishuConfig({
          key: "ai.os-service",
        });
        if (!res.data.data) {
          return [];
        } else {
          return (
            res.data.data
              // .filter((item: any) => item.fields["是否启用"])
              .map((item: any) => {
                return {
                  id: item.fields["ID"],
                  icon: item.fields["icon"],
                  service: item.fields["service"],
                };
              })
          );
        }
      } catch (error) {
        // Sentry.captureException(error);
        return [];
      }
    },
    { cacheKey: "ai.os-service-config", cacheTime: -1 }
  );

  return [data, error, loading];
};

export const useServiceConfigModel = createModel(useServiceConfig);
