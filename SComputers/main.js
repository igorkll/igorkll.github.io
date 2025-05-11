if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js', { scope: '/SComputers/' })
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

const themeToggleButton = document.getElementById('theme-toggle');
const themeStylesheet = document.querySelector('link[rel="stylesheet"]');

const themes = [
    { style: 'style.css', color: '#626262' },
    { style: 'style2.css', color: '#313131' },
    { style: 'style3.css', color: '#0e3244' }
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

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    }, 'google_translate_element');
}

setTimeout(() => {
    setInterval(() => {
        var elements = document.querySelectorAll('.skiptranslate');
    
        elements.forEach(element => {
            if (element.classList.length === 1) {
                element.remove();
            }
        });

        var elements = document.querySelectorAll('#___gcse_0');
    
        elements.forEach(element => {
            element.style="width: 100% !important;";
        });

        var elements = document.querySelectorAll('.gsc-control-cse');
    
        elements.forEach(element => {
            element.style="background: none !important; border: none !important;";
        });
    }, 1000);
}, 500);


function loadWindow() {
    var script = document.createElement('script');
    script.async = true;
    script.src = "https://cse.google.com/cse.js?cx=319af69f537d9450e";
    document.body.insertAdjacentElement('afterbegin', script);

    var script = document.createElement('script');
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.insertAdjacentElement('afterbegin', script);

    var htmlString = `
    <div class="cool-block">
        <button class="image-button" onclick="window.history.back(); setTimeout(function() {location.reload();}, 250);">
            <img src="back.png" alt="back" />
        </button>
        <button class="image-button" onclick="window.location.href = 'index.html'">
            <img src="favicon.png" alt="SComputers" />
        </button>
        <button class="image-button" onclick="window.history.forward(); setTimeout(function() {location.reload();}, 250);">
            <img src="forward.png" alt="forward" />
        </button>
        <div class="gcse-search"></div>
        <div id="google_translate_element" style="margin-left: 15px !important; margin-right: 20px !important;"></div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', htmlString);
}

window.onload = loadWindow;