export const theme = {
  colors: {
    // Main colors - reduced saturation for comfort
    primary: "#5C4A3A", // Deeper, muted brown (text/icons)
    primaryLight: "#8A7366", // Lighter variant for less emphasis
    primaryDark: "#3D2F24", // Darker variant for strong emphasis

    secondary: "#8FAA7A", // Softer sage green (less vibrant)
    secondaryLight: "#A8C191", // Lighter green for hover states
    secondaryDark: "#6D8A5E", // Darker green for depth

    accent: "#E8D5C4", // Warmer beige (subtle highlights)
    accentLight: "#F5E8DC", // Very light beige for backgrounds
    accentDark: "#D4BC9F", // Darker beige for borders

    // Backgrounds - off-white instead of pure white
    background: "#F5F1ED", // Warmer off-white (easier on eyes)
    surface: "#FDFCFB", // Very soft white (not stark)

    // Status colors - muted and gentle
    error: "#C87872", // Softer terracotta red
    info: "#6B9B9E", // Muted teal (calm)
    success: "#7BA87F", // Gentle forest green
    warning: "#D4A873", // Warm ochre (less bright)
  },
  borderRadius: {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  spacing: {
    "2xs": "0.125rem", // 2px
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem", // 48px
  },
  headerHeight: "58px",
};
