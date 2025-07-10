import type {Config} from "tailwindcss";

const config: Config = {
    // Keep the content path to ensure Tailwind scans our component files
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    // We no longer need the tailwindcss-animate plugin
    plugins: [],
};

export default config;