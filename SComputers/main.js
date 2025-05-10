const themeToggleButton = document.getElementById('theme-toggle');
const themeStylesheet = document.querySelector('link[rel="stylesheet"]');

const themes = [
    { style: 'style.css', color: '#a3a3a3' },
    { style: 'style2.css', color: '#c0c0c0' },
    { style: 'style3.css', color: '#13425a' }
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

function loadWindow() {
    var script = document.createElement('script');
    script.async = true;
    script.src = "https://cse.google.com/cse.js?cx=319af69f537d9450e";
    document.body.insertAdjacentElement('afterbegin', script);

    var htmlString = `
    <div class="cool-block">
        <button class="image-button" onclick="window.history.back();">
            <img src="back.png" alt="back" />
        </button>
        <button class="image-button" onclick="window.location.href = 'index.html'">
            <img src="favicon.png" alt="SComputers" />
        </button>
        <button class="image-button" onclick="window.history.forward();">
            <img src="forward.png" alt="forward" />
        </button>
        <div class="gcse-search"></div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', htmlString);
}

window.onload = loadWindow;