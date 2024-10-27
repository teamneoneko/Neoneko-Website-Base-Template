document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('mobile-menu');
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('mobile-menu-close');
    closeButton.innerHTML = '×';
    mobileMenu.appendChild(closeButton);
    
    // Clone main menu items and preserve the structure
    const mainMenu = document.querySelector('.menu');
    const menuItems = mainMenu.cloneNode(true);
    mobileMenu.appendChild(menuItems);
    
    // Add mobile theme selector after the menu
    const mobileThemeSelector = document.createElement('div');
    mobileThemeSelector.classList.add('mobile-theme-selector');
    mobileThemeSelector.innerHTML = `
        <select aria-label="Theme Selector">
            <option value="main-site" data-theme="main-site">Main Site Theme</option>
            <option value="halloween" data-theme="halloween">Halloween Theme</option>
            <option value="light" data-theme="light">Light Theme</option>
            <option value="dark" data-theme="dark">Dark Theme</option>
            <option value="high-contrast" data-theme="high-contrast">High Contrast</option>
            <option value="forest" data-theme="forest">Forest Theme</option>
            <option value="mint" data-theme="mint">Mint Theme</option>
            <option value="cyberpunk" data-theme="cyberpunk">Cyberpunk Theme</option>
        </select>
    `;    
    mobileMenu.appendChild(mobileThemeSelector);
    
    // Add to DOM
    document.body.appendChild(mobileMenu);
    
    // Event Listeners
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    closeButton.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
    
    // Handle submenu toggles
    const submenus = mobileMenu.querySelectorAll('.has-submenu');
    submenus.forEach(submenu => {
        const link = submenu.querySelector('a');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            submenu.classList.toggle('open');
        });
    });
});
