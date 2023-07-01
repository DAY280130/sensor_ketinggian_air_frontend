import { dataSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useReadLocalStorage } from "usehooks-ts";
import * as z from "zod";

const waterMonitorSchema = dataSchema.pick({
  waterLevel: true,
  waterStatus: true,
});
type WaterMonitorDatas = z.infer<typeof waterMonitorSchema>;

const levelBreakpointSchema = dataSchema.pick({
  level1Breakpoint: true,
  level2Breakpoint: true,
  level3Breakpoint: true,
});
type LevelBreakpoints = z.infer<typeof levelBreakpointSchema>;

const LeftPage: React.FC = () => {
  const apiBaseUrl = useReadLocalStorage<string>("api-url");
  const { data } = useQuery({
    queryKey: ["left-page"],
    queryFn: async () => {
      const waterMonitorDatas = (await axios.get<WaterMonitorDatas>(`${apiBaseUrl}/water`)).data;

      const levelBreakpoints = (await axios.get<LevelBreakpoints>(`${apiBaseUrl}/level`)).data;

      return {
        ...waterMonitorDatas,
        ...levelBreakpoints,
      };
    },
    initialData: {
      waterLevel: 0,
      waterStatus: "unchecked",
      level1Breakpoint: 0,
      level2Breakpoint: 0,
      level3Breakpoint: 0,
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const { level1Breakpoint, level2Breakpoint, level3Breakpoint, waterLevel, waterStatus } = data;

  return (
    <div className="relative flex h-[75vh] w-[75vw] flex-col justify-end rounded-b-xl border-4 border-foreground border-t-transparent md:w-[30vw]">
      <svg
        className={`relative w-full ${waterLevel <= 5 && "rounded-b-lg"}`}
        style={{ height: `${waterLevel <= 5 ? waterLevel : 5}%` }}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g>
          <use
            className="animate-wave fill-blue-300 transition-all [animation-delay:-5s] [animation-duration:20s] [transition-duration:1s]"
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
          />
          <use
            className="animate-wave fill-blue-300/70 transition-all [transition-duration:1s] [animation-delay:-2s] [animation-duration:7s]"
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
          />
          <use
            className="animate-wave fill-blue-300/50 transition-all [transition-duration:1s] [animation-delay:-3s] [animation-duration:10s]"
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
          />
          <use
            className="animate-wave fill-blue-300/30 transition-all [transition-duration:1s] [animation-delay:-4s] [animation-duration:13s]"
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
          />
        </g>
      </svg>
      <div className="w-full rounded-b-lg bg-blue-300 transition-all [transition-duration:1s]" style={{ height: `${waterLevel >= 5 ? waterLevel - 5.0 : 0.0}%` }}></div>
      <div className="absolute left-0 flex h-1 w-[125%] items-center transition-all duration-700" style={{ bottom: `${level3Breakpoint}%` }}>
        <hr className="h-1 w-[80%] bg-destructive" />
        <span
          className={cn(
            "rounded-md border-2 border-destructive px-3 py-2",
            waterStatus === "dangerous" ? "z-10 bg-destructive font-bold text-destructive-foreground" : "bg-destructive-foreground font-semibold text-destructive"
          )}
        >
          {level3Breakpoint}%
        </span>
      </div>
      <div className="absolute left-0 flex h-1 w-[125%] items-center transition-all duration-700" style={{ bottom: `${level2Breakpoint}%` }}>
        <hr className="h-1 w-[80%] bg-warning" />
        <span
          className={cn(
            "rounded-md border-2 border-warning px-3 py-2",
            waterStatus === "be warned" ? "z-10 bg-warning font-bold text-warning-foreground" : "bg-warning-foreground font-semibold text-warning"
          )}
        >
          {level2Breakpoint}%
        </span>
      </div>
      <div className="absolute left-0 flex h-1 w-[125%] items-center transition-all duration-700" style={{ bottom: `${level1Breakpoint}%` }}>
        <hr className="h-1 w-[80%] bg-safezone" />
        <span
          className={cn(
            "rounded-md border-2 border-safezone px-3 py-2",
            waterStatus === "safe" ? "z-10 bg-safezone font-bold text-safezone-foreground" : "bg-safezone-foreground font-semibold text-safezone"
          )}
        >
          {level1Breakpoint}%
        </span>
      </div>
    </div>
  );
};

export default LeftPage;
