if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js', { scope: '/betterAPI/' })
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    }, 'google_translate_element');
}

setTimeout(() => {
    setInterval(() => {
        var element = document.getElementById('google_translate_element');
        if (element != null) {
            element = element.children[0];
            if (element) {
                const children = Array.from(element.children);
                children.slice(1).forEach(child => {
                    child.remove();
                });

                const childNodes = Array.from(element.childNodes);
                childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.remove();
                    }
                });

                var elements = document.querySelectorAll('.skiptranslate');
                elements.forEach(element => {
                    if (element.classList.length === 1) {
                        element.remove();
                        document.body.style.top = 0;
                    }
                });
            }
        }

        var elements = document.querySelectorAll('#___gcse_0');
    
        elements.forEach(element => {
            element.style="width: 100% !important;";
        });

        var elements = document.querySelectorAll('.gsc-control-cse');
    
        elements.forEach(element => {
            element.style="background: none !important; border: none !important;";
        });
    }, 1000);
}, 100);