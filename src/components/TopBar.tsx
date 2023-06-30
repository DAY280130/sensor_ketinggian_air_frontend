import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, Laptop2 } from "lucide-react";
import React from "react";

type ThemeList = "light" | "dark";

const TopBar: React.FC = () => {
  const [systemTheme, setSystemTheme] = React.useState<ThemeList>(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  });
  const [theme, setTheme] = React.useState<ThemeList | "system">(!localStorage.theme ? "system" : localStorage.theme);

  React.useEffect(() => {
    if (theme === "dark" || theme === "light") {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      localStorage.removeItem("theme");
      if (systemTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, systemTheme]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      if (e.matches) {
        setSystemTheme("dark");
      } else {
        setSystemTheme("light");
      }
    });
  }, []);

  return (
    <div className="flex justify-between bg-primary px-5 py-3 text-primary-foreground">
      <span className="text-3xl font-bold ">Sensor Ketinggian Air</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="hover:bg-accent/5 hover:text-accent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0" variant={"ghost"} size={"sm"}>
            {theme === "dark" ? (
              <Moon className="h-6 w-6" />
            ) : theme === "light" ? (
              <Sun className="h-6 w-6" />
            ) : systemTheme === "dark" ? (
              <Moon className="h-6 w-6" />
            ) : (
              <Sun className="h-6 w-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTheme("system")}>
            <Laptop2 className="h-5 w-5" />
            System
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTheme("light")}>
            <Sun className="h-5 w-5" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => setTheme("dark")}>
            <Moon className="h-5 w-5" />
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopBar;
