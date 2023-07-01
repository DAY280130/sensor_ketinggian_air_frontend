import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Laptop2, Link2 } from "lucide-react";
import React from "react";
import { useLocalStorage, useTernaryDarkMode } from "usehooks-ts";

const TopBar: React.FC = () => {
  const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  const [apiBaseUrl, setApiBaseUrl] = useLocalStorage("api-url", "http://localhost:3000");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex justify-between bg-primary px-5 py-3 text-primary-foreground">
      <span className="text-lg font-bold md:text-3xl ">Water Level Sensor</span>
      <span className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover:bg-accent/5 hover:text-accent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0" variant={"ghost"} size={"sm"}>
              <Link2 className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Microcontroller IP Address</DialogTitle>
              <DialogDescription>Enter the Microcontroller's IP Address here to start control the water level sensor</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4">
              <Label htmlFor="api-url-input" className="text-right">
                IP
              </Label>
              <Input id="api-url-input" placeholder="http://1.1.1.1:80" defaultValue={apiBaseUrl} />
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  const input = document.getElementById("api-url-input") as HTMLInputElement;
                  setApiBaseUrl(input.value);
                  setDialogOpen(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="hover:bg-accent/5 hover:text-accent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0" variant={"ghost"} size={"sm"}>
              {isDarkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTernaryDarkMode("system")}>
              <Laptop2 className="h-5 w-5" />
              System
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTernaryDarkMode("light")}>
              <Sun className="h-5 w-5" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTernaryDarkMode("dark")}>
              <Moon className="h-5 w-5" />
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </div>
  );
};

export default TopBar;
