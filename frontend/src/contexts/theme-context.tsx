import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "light-theme" | "dark-theme";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const getDefaultTheme = (): Theme => {
        return (localStorage.getItem("theme") as Theme) || "light-theme";
    };

    const [theme, setTheme] = useState<Theme>(getDefaultTheme());

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleDarkMode = () => {
        setTheme((prevTheme) => (prevTheme === "light-theme" ? "dark-theme" : "light-theme"));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
