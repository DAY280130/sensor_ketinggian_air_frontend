import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dataSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useReadLocalStorage } from "usehooks-ts";
import * as z from "zod";

const depthMonitorSchema = dataSchema.pick({
  depth: true,
  depthStatus: true,
});
type DepthMonitorDatas = z.infer<typeof depthMonitorSchema>;

const sonarMonitorSchema = dataSchema.pick({ sonarStatus: true });
type SonarMonitorDatas = z.infer<typeof sonarMonitorSchema>;

const RightPage: React.FC = () => {
  const apiBaseUrl = useReadLocalStorage("api-url");
  const { data } = useQuery({
    queryKey: ["right-page"],
    queryFn: async () => {
      const depthMonitorDatas = (await axios.get<DepthMonitorDatas>(`${apiBaseUrl}/depth`)).data;

      const sonarMonitorDatas = (await axios.get<SonarMonitorDatas>(`${apiBaseUrl}/sonar`)).data;

      return { ...depthMonitorDatas, ...sonarMonitorDatas };
    },
    initialData: {
      sonarStatus: "inactive",
      depthStatus: "unchecked",
      depth: 0,
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const { sonarStatus, depth, depthStatus } = data;

  const [depthButtonIsLoading, setDepthButtonIsLoading] = React.useState(false);
  const [sonarButtonIsLoading, setSonarButtonIsLoading] = React.useState(false);
  return (
    <div className="flex w-[30vw] flex-col gap-2">
      <span className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
        <span>
          Depth :{" "}
          <span className={depthStatus === "checked" ? "text-safezone" : "text-destructive"}>
            <Badge variant={depthStatus === "checked" ? "default" : "destructive"}>{depthStatus === "checked" ? `${depth} cm` : depthStatus}</Badge>
          </span>
        </span>
        <Button
          onClick={() => {
            setDepthButtonIsLoading(true);
            axios.post(`${apiBaseUrl}/depth/check`).finally(() => setDepthButtonIsLoading(false));
          }}
          variant={depthButtonIsLoading ? "secondary" : "safezone"}
          size={"sm"}
          disabled={depthButtonIsLoading}
        >
          {depthButtonIsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </span>
      <span className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
        <span>
          Sonar :{" "}
          <span className={sonarStatus === "active" ? "text-safezone" : "text-destructive"}>
            <Badge variant={sonarStatus === "active" ? "safezone" : "destructive"}>{sonarStatus}</Badge>
          </span>
        </span>
        <Button
          onClick={() => {
            setSonarButtonIsLoading(true);
            axios.post(`${apiBaseUrl}/sonar/${sonarStatus === "active" ? "off" : "on"}`).finally(() => setSonarButtonIsLoading(false));
          }}
          variant={sonarButtonIsLoading ? "secondary" : sonarStatus === "active" ? "destructive" : "safezone"}
          size={"sm"}
          disabled={sonarButtonIsLoading}
        >
          {sonarButtonIsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : sonarStatus === "active" ? "Deactivate" : "Activate"}
        </Button>
      </span>
    </div>
  );
};

export default RightPage;
