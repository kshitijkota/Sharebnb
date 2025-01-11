// src/lib/utils.ts

// Utility function to conditionally join class names
export const cn = (...classes: (string | undefined | false)[]): string => {
    return classes.filter(Boolean).join(" ");
};
