import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                'z-dark': '#111111',
                'z-gray-dark': '#555555',
                'z-gray-light': '#F5F5F5',
                'z-border': '#EEEEEE',
                'z-bg': '#FFFFFF',
            },
            letterSpacing: {
                'mega': '.5em',
                'super': '.8em',
            }
        },
    },

    plugins: [forms],
};
