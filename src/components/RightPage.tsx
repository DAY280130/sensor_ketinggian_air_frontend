import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const levelBreakpointSchema = dataSchema.pick({
  level1Breakpoint: true,
  level2Breakpoint: true,
  level3Breakpoint: true,
});
type LevelBreakpoints = z.infer<typeof levelBreakpointSchema>;

const RightPage: React.FC = () => {
  const apiBaseUrl = useReadLocalStorage("api-url");
  const { data } = useQuery<DepthMonitorDatas & SonarMonitorDatas & LevelBreakpoints>({
    queryKey: ["right-page"],
    queryFn: async () => {
      const depthMonitorDatas = (await axios.get<DepthMonitorDatas>(`${apiBaseUrl}/depth`)).data;

      const sonarMonitorDatas = (await axios.get<SonarMonitorDatas>(`${apiBaseUrl}/sonar`)).data;

      const levelBreakpoints = (await axios.get<LevelBreakpoints>(`${apiBaseUrl}/level`)).data;

      return { ...depthMonitorDatas, ...sonarMonitorDatas, ...levelBreakpoints };
    },
    initialData: {
      sonarStatus: "inactive",
      depthStatus: "unchecked",
      depth: 0,
      level1Breakpoint: 0,
      level2Breakpoint: 0,
      level3Breakpoint: 0,
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const { sonarStatus, depth, depthStatus, level1Breakpoint, level2Breakpoint, level3Breakpoint } = data;

  const [depthButtonIsLoading, setDepthButtonIsLoading] = React.useState(false);
  const [sonarButtonIsLoading, setSonarButtonIsLoading] = React.useState(false);
  return (
    <div className="flex w-[75vw] flex-col gap-2 md:w-[30vw]">
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
      {/* <span className="w-full gap-3 rounded-md bg-accent px-3 py-2 font-semibold"></span> */}
      <Tabs defaultValue="level1" className="w-full">
        <TabsList className="mb-2 flex w-full rounded-md bg-accent px-3 py-2">
          <TabsTrigger value="level1" className="grow">
            Safe
          </TabsTrigger>
          <TabsTrigger value="level2" className="grow">
            Warn
          </TabsTrigger>
          <TabsTrigger value="level3" className="grow">
            Danger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="level1" className="m-0 flex w-full flex-col items-start gap-3 rounded-md bg-accent font-semibold data-[state=active]:px-3 data-[state=active]:py-2">
          <Label htmlFor="level-1-input" className="text-right">
            Safe Water Level Percentage
          </Label>
          <Input id="level-1-input" type="number" min={0} max={100} placeholder={level1Breakpoint.toString()} />
          <Button
            type="button"
            onClick={() => {
              const input = document.getElementById("level-1-input") as HTMLInputElement;
              const value = parseInt(input.value);
              if (value >= 0 || value <= 100) {
                axios.post(`${apiBaseUrl}/level/1`, { value });
              }
            }}
          >
            Save
          </Button>
        </TabsContent>
        <TabsContent value="level2" className="m-0 flex w-full flex-col items-start gap-3 rounded-md bg-accent font-semibold data-[state=active]:px-3 data-[state=active]:py-2">
          <Label htmlFor="level-2-input" className="text-right">
            Be Warned Water Level Percentage
          </Label>
          <Input id="level-2-input" type="number" min={0} max={100} placeholder={level2Breakpoint.toString()} />
          <Button
            type="button"
            onClick={() => {
              const input = document.getElementById("level-2-input") as HTMLInputElement;
              const value = parseInt(input.value);
              if (value >= 0 || value <= 100) {
                axios.post(`${apiBaseUrl}/level/2`, { value });
              }
            }}
          >
            Save
          </Button>
        </TabsContent>
        <TabsContent value="level3" className="m-0 flex w-full flex-col items-start gap-3 rounded-md bg-accent font-semibold data-[state=active]:px-3 data-[state=active]:py-2">
          <Label htmlFor="level-3-input" className="text-right">
            Dangerous Water Level Percentage
          </Label>
          <Input id="level-3-input" type="number" min={0} max={100} placeholder={level3Breakpoint.toString()} />
          <Button
            type="button"
            onClick={() => {
              const input = document.getElementById("level-3-input") as HTMLInputElement;
              const value = parseInt(input.value);
              if (value >= 0 || value <= 100) {
                axios.post(`${apiBaseUrl}/level/3`, { value });
              }
            }}
          >
            Save
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPage;
