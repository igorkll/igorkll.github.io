const themeToggleButton = document.getElementById('theme-toggle');
const themeStylesheet = document.querySelector('link[rel="stylesheet"]');

const themes = [
    { style: 'style.css', color: '#000000' },
    { style: 'style2.css', color: '#ffffff' },
    { style: 'style3.css', color: '#054a6d' }
];

const currentTheme = localStorage.getItem('theme');
let currentThemeIndex = themes.findIndex(theme => theme.style === currentTheme);
if (currentThemeIndex === -1) currentThemeIndex = 0;

themeStylesheet.setAttribute('href', themes[currentThemeIndex].style);

let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
if (!themeColorMetaTag) {
    themeColorMetaTag = document.createElement('meta');
    themeColorMetaTag.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColorMetaTag);
}
themeColorMetaTag.setAttribute('content', themes[currentThemeIndex].color);

if (themeToggleButton !== null) {
    themeToggleButton.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        
        themeStylesheet.setAttribute('href', themes[currentThemeIndex].style);
        themeColorMetaTag.setAttribute('content', themes[currentThemeIndex].color);
        
        localStorage.setItem('theme', themes[currentThemeIndex].style);
    });
}
