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