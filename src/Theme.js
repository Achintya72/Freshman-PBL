import { createContext, useState } from "react";


const ThemeContext = createContext();

const themeObject = {
    typography: {
        h1: {
            'font-family': 'Poppins',
            'font-weight': '800',
            'font-size': '64'
        },
        h2: {
            'font-family': 'Poppins',
            'font-weight': '600',
            'font-size': '50'
        },
        subtitle: {
            'font-family': 'Poppins',
            'font-weight': '500',
            'font-size': '32'
        },
        button: {
            'font-family': 'Poppins',
            'font-weight': '600',
            'font-size': '20',
            'font-stretch': '12.5%'
        },
    },
    color: {
        dark: '#d74b4b',
        extraLight: '#ffe8e8',
        light: '#ff9393',
        normal: '#ff0000'
    }
};



function ThemeContextProvider({ children }) {
    const [theme, changeTheme] = useState(themeObject);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export {
    ThemeContext as default,
    ThemeContextProvider
}