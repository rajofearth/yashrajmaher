"use client";

import { createContext, useContext, useEffect, useState } from "react";
import * as React from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => null });

const themeOptions = ["light", "dark", "system"];

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "yashraj-theme" }) {
	const [theme, setTheme] = useState(defaultTheme);

	useEffect(() => {
		const savedTheme = localStorage.getItem(storageKey);

		if (savedTheme && themeOptions.includes(savedTheme)) {
			setTheme(savedTheme);
		} else if (defaultTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			setTheme(systemTheme);
		}
	}, [defaultTheme, storageKey]);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			root.classList.add(systemTheme);

			// Also update data-theme attribute for better compatibility
			root.setAttribute("data-theme", systemTheme);
		} else {
			root.classList.add(theme);
			root.setAttribute("data-theme", theme);
		}

		localStorage.setItem(storageKey, theme);
	}, [theme, storageKey]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			if (theme === "system") {
				const systemTheme = mediaQuery.matches ? "dark" : "light";
				const root = window.document.documentElement;
				root.classList.remove("light", "dark");
				root.classList.add(systemTheme);
				root.setAttribute("data-theme", systemTheme);
			}
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const value = {
		theme,
		setTheme: newTheme => {
			if (themeOptions.includes(newTheme)) {
				setTheme(newTheme);
			}
		},
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
