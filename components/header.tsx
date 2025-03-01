'use client'
import { Moon, Sun } from "lucide-react";
import { NewButton } from "./new-button";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export const Header = ({ handleClear } : { handleClear: () => void }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center justify-between mb-6">
            <h1
                className="text-2xl sm:text-3xl font-bold text-foreground flex items-center cursor-pointer"
                onClick={() => handleClear()}
            >
                DBSeek
            </h1>
            {/* <div  className="flex items-center justify-center space-x-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    {theme === 'dark' ? (
                        <Moon className="h-5 w-5"/>
                    ):(
                        <Sun className="h-5 w-5"/>
                    )}
                    <span>Toggle theme</span>
                </Button>
            <div className="hidden sm:block">
                <NewButton /> */}
            {/* </div> */}
            {/* </div> */}
        </div>
    )
};