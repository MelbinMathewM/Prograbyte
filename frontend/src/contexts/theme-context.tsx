import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "admin-theme" | "tutor-theme" | "light-theme" | "dark-theme";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleStudentMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, role }: { children: ReactNode; role: string | null }) => {
    const [theme, setTheme] = useState<Theme>("light-theme");

    useEffect(() => {
        if (role === "admin") {
            setTheme("admin-theme");
        } else if (role === "tutor") {
            setTheme("tutor-theme");
        } else {
            setTheme("light-theme");
        }
    }, [role]);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    const toggleStudentMode = () => {
        if (role === "student") {
            setTheme((prevTheme) => (prevTheme === "light-theme" ? "dark-theme" : "light-theme"));
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleStudentMode }}>
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
