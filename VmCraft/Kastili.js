
export function attachScrollboxPadding(container) {
    function checkScrollbar() {
        const hasScrollbar = container.scrollHeight > container.clientHeight;
        container.classList.toggle('has-scrollbar', hasScrollbar);
    }
    
    checkScrollbar();
    window.addEventListener('resize', checkScrollbar);
    
    const observer = new MutationObserver(checkScrollbar);
    observer.observe(container, { childList: true, subtree: true });
}
