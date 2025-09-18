{
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    }, 'google_translate_element');
}

function downloadRelease(repository) {
    fetch(`https://api.github.com/repos/igorkll/${repository}/releases/latest`)
        .then(response => response.json())
        .then(data => {
            const asset = data.assets[0];
            if (asset) {
                window.location.href = asset.browser_download_url;
            } else {
                alert('There are no files available for download.');
            }
        })
        .catch(error => {
            alert('Couldn\'t get information about the release.');
        });
}

function placeSvg(url, container, color) {
    fetch(url).then(response => response.text()).then(svgText => {
        container.innerHTML = svgText;

        const svg = container.querySelector('svg');
        if (svg) {
            svg.removeAttribute('width');
            svg.removeAttribute('height');
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.display = 'block';
            svg.style.fill = color;
            svg.style.filter = 'drop-shadow(0px 0px 5px rgb(0, 0, 0))';
        }
    })
    .catch(err => console.error('SVG error:', err));
}

function getExtension(path) {
    const parts = path.split(".");
    return parts[parts.length - 1];
}

setTimeout(() => {
    setInterval(() => {
        let element = document.getElementById('google_translate_element');
        if (element != null) {
            element = element.children[0];
            if (element) {
                let children = Array.from(element.children);
                children.slice(1).forEach(child => {
                    child.remove();
                });

                let childNodes = Array.from(element.childNodes);
                childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE) {
                        child.remove();
                    }
                });

                let elements = document.querySelectorAll('.skiptranslate');
                elements.forEach(element => {
                    if (element.classList.length === 1) {
                        element.remove();
                        document.body.style.top = 0;
                    }
                });
            }
        }

        let elements = document.querySelectorAll('#___gcse_0');
        elements.forEach(element => {
            element.style="width: 100% !important;";
        });

        elements = document.querySelectorAll('.gsc-control-cse');
        elements.forEach(element => {
            element.style="background: none !important; border: none !important;";
        });
    }, 1000);
}, 100);
}