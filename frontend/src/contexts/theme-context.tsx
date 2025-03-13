import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme =
  | "admin-theme"
  | "admin-dark-theme"
  | "tutor-theme"
  | "tutor-dark-theme"
  | "light-theme"
  | "dark-theme";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, role }: { children: ReactNode; role: string | null }) => {
    const getDefaultTheme = (role: string | null): Theme => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) return savedTheme;

        switch (role) {
            case "admin":
                return "admin-theme";
            case "tutor":
                return "tutor-theme";
            default:
                return "light-theme";
        }
    };

    // Initially set the theme based on role (if available)
    const [theme, setTheme] = useState<Theme>("light-theme");

    useEffect(() => {
        if (role) {
            const newTheme = getDefaultTheme(role);
            if (newTheme !== theme) {
                setTheme(newTheme);
            }
        }
    }, [role]); // Run when role updates

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleDarkMode = () => {
        setTheme((prevTheme) => {
            let newTheme: Theme;
            switch (prevTheme) {
                case "admin-theme":
                    newTheme = "admin-dark-theme";
                    break;
                case "admin-dark-theme":
                    newTheme = "admin-theme";
                    break;
                case "tutor-theme":
                    newTheme = "tutor-dark-theme";
                    break;
                case "tutor-dark-theme":
                    newTheme = "tutor-theme";
                    break;
                case "light-theme":
                    newTheme = "dark-theme";
                    break;
                case "dark-theme":
                    newTheme = "light-theme";
                    break;
                default:
                    newTheme = "light-theme";
            }
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
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
