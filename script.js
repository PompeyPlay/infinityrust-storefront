tailwind.config = {
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        // Make sure empty paragraphs take up space
                        'p:empty, p:has(:only-child:empty)': {
                            minHeight: '1em',
                            marginBottom: '1em',
                        },
                    },
                }
            }
        }
    }
}

// ========================================
// Mobile Sidebar Toggle
// ========================================

function toggleMobileSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    if (sidebar) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        } else {
            sidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Initialize mobile menu when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

function initMobileMenu() {
    // Hamburger button - use touchend for iOS
    const hamburger = document.querySelector('.ir-mobile-hamburger');
    if (hamburger) {
        // Remove any existing listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.querySelector('.ir-mobile-hamburger');
        
        newHamburger.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileSidebar();
        }, { passive: false });
        
        newHamburger.addEventListener('click', function(e) {
            if (e.detail === 0) return; // Ignore if triggered by keyboard
            e.preventDefault();
            toggleMobileSidebar();
        });
    }
    
    // Close sidebar when tapping overlay
    const overlay = document.querySelector('.ir-mobile-sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMobileSidebar();
        }, { passive: false });
        
        overlay.addEventListener('click', function() {
            toggleMobileSidebar();
        });
    }
    
    // Close button
    const closeBtn = document.querySelector('.ir-mobile-sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMobileSidebar();
        }, { passive: false });
        
        closeBtn.addEventListener('click', function() {
            toggleMobileSidebar();
        });
    }
    
    // Close sidebar when tapping nav links
    const sidebarLinks = document.querySelectorAll('.ir-mobile-nav-item');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(toggleMobileSidebar, 100);
        });
    });
}

// ========================================
// Loading Screen Functions (External Navigation Only)
// ========================================

function showLoadingScreen() {
    const loadingScreen = document.getElementById('ir-loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('ir-loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

// Show loading screen ONLY when navigating to infinityrust.net (not store.infinityrust.net)
document.addEventListener('DOMContentLoaded', function() {
    // Intercept all link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            try {
                const linkUrl = new URL(link.href);
                const currentHostname = window.location.hostname;
                
                // Only show loading screen if:
                // 1. Link goes to infinityrust.net (not store.infinityrust.net or any subdomain)
                // 2. Not opening in new tab
                // 3. Not a modal or onclick handler
                if (linkUrl.hostname === 'infinityrust.net' && 
                    currentHostname !== 'infinityrust.net' &&
                    !link.hasAttribute('target') &&
                    !link.onclick &&
                    !link.classList.contains('no-loading')) {
                    
                    // Show loading screen before navigation
                    showLoadingScreen();
                }
            } catch (err) {
                // Invalid URL, ignore
            }
        }
    });
});

const toggleDropdown = (node_id) => {
    //closeOtherDropdowns(`menu-${node_id}`);

    const el = document.getElementById(`menu-${node_id}`);
    if (el) {
        el.classList.toggle('hidden');
    }
};

const closeOtherDropdowns = (current) => {
    const els = document.getElementsByClassName('menu-dropdown');
    for (let el of els) {
        if (!el.classList.contains('hidden') && current !== el.id) {
            el.classList.add('hidden');
        }
    }
};

const closeModal = () => {
    const el = document.getElementById('modal');
    if (!el.classList.contains('hidden')) {
        el.classList.add('hidden');
    }
};

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
}

function subscribeToProduct(trial) {
    // Check if we're in a modal first
    const modal = document.getElementById('universalModal');
    const searchContext = (modal && modal.classList.contains('open')) ? modal : document;
    
    var productSlug = searchContext.querySelector("[data-product-slug]")?.getAttribute("data-product-slug");
    if (!productSlug) {
        console.error('Product slug not found');
        return;
    }
    
    var gameServerId = searchContext.querySelector('#gameServerDropdown')?.value;
    var customVariableInputs = searchContext.querySelectorAll('select[id^="customVariables"], input[id^="customVariables"]');

    const query = new URLSearchParams({
        subscription: true,
        trial
    });

    if (gameServerId) {
        query.set('gameserver_id', gameServerId);
    }
    customVariableInputs?.forEach(input => {
        query.set(`custom_variables[${input.name}]`, input.value)
    });

    const checkoutUrl = `/cart/add/${productSlug}?${query.toString()}`;
    window.location.href = checkoutUrl;
}

function addProductToCart() {
    // Check if we're in a modal first
    const modal = document.getElementById('universalModal');
    const searchContext = (modal && modal.classList.contains('open')) ? modal : document;
    
    var productSlug = searchContext.querySelector("[data-product-slug]")?.getAttribute("data-product-slug");
    if (!productSlug) {
        console.error('Product slug not found');
        return;
    }
    
    var gameServerId = searchContext.querySelector('#gameServerDropdown')?.value;
    var customVariableInputs = searchContext.querySelectorAll('select[id^="customVariables"], input[id^="customVariables"]');

    const query = new URLSearchParams();
    if (gameServerId) {
        query.set('gameserver_id', gameServerId);
    }
    customVariableInputs?.forEach(input => {
        query.set(`custom_variables[${input.name}]`, input.value)
    });

    const checkoutUrl = `/cart/add/${productSlug}?${query.toString()}`;
    window.location.href = checkoutUrl;
}

const alertEl = document.getElementById("notification-alert");
if (alertEl) {
    setTimeout(() => {
        alertEl.classList.add("opacity-0");
    }, 4000);
}

function toggleGiftActions() {
    // Check if we're in a modal first
    const modal = document.getElementById('universalModal');
    const searchContext = (modal && modal.classList.contains('open')) ? modal : document;
    
    var mainActions = searchContext.querySelector('#mainActions');
    var giftActions = searchContext.querySelector('#giftActions');

    if (mainActions && giftActions) {
        mainActions.classList.toggle('hidden');
        giftActions.classList.toggle('hidden');
    } else {
        console.error('Elements not found:', { mainActions, giftActions });
    }
}

function isValidSteamID(steamid) {
    var numericCheck = /^[0-9]+$/.test(steamid);
    var lengthCheck = steamid.length >= 16 && steamid.length <= 20;

    return numericCheck && lengthCheck;
}

function handlePurchase(platform) {
    // Check if we're in a modal first
    const modal = document.getElementById('universalModal');
    const searchContext = (modal && modal.classList.contains('open')) ? modal : document;
    
    var idInput = searchContext.querySelector('#idInput');
    if (!idInput) {
        console.error('ID input not found');
        return;
    }
    
    var id = idInput.value.trim();
    var productSlug = searchContext.querySelector("[data-product-slug]")?.getAttribute("data-product-slug");
    if (!productSlug) {
        console.error('Product slug not found');
        return;
    }
    
    var gameServerId = searchContext.querySelector('#gameServerDropdown')?.value;
    var customVariableInputs = searchContext.querySelectorAll('select[id^="customVariables"], input[id^="customVariables"]');

    const query = new URLSearchParams({
        "gift_to": id,
        "gift_platform": platform
    });

    if (!isValidSteamID(id) && platform === 'steam') {
        alert("Please enter a valid SteamID64!");
        return;
    }

    if (gameServerId) {
        query.set('gameserver_id', gameServerId);
    }
    customVariableInputs?.forEach(input => {
        query.set(`custom_variables[${input.name}]`, input.value)
    });

    var checkoutUrl = `/products/${productSlug}/checkout?${query.toString()}`;
    window.location.href = checkoutUrl;
}

// Profile Dropdown Toggle
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const container = dropdown?.parentElement;
    
    if (dropdown && container) {
        dropdown.classList.toggle('open');
        container.classList.toggle('open');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.querySelector('.ir-profile-dropdown');
    const dropdownMenu = document.getElementById('profileDropdown');
    
    if (profileDropdown && dropdownMenu && !profileDropdown.contains(event.target)) {
        dropdownMenu.classList.remove('open');
        profileDropdown.classList.remove('open');
    }
});

// Cart Modal Functions
function openCartModal() {
    fetch('/cart', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(response => response.text())
    .then(html => {
        // Parse and extract just the content, remove headers/navigation
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Remove ALL headers, navigation, footer, and particle background aggressively
        doc.querySelectorAll('header').forEach(el => el.remove());
        doc.querySelectorAll('.ir-header-new').forEach(el => el.remove());
        doc.querySelectorAll('footer').forEach(el => el.remove());
        doc.querySelectorAll('#particle-bg').forEach(el => el.remove());
        doc.querySelectorAll('.ir-nav-container').forEach(el => el.remove());
        doc.querySelectorAll('.ir-nav-content').forEach(el => el.remove());
        
        // Get the main container
        const container = doc.querySelector('.container');
        if (container) {
            // Remove the cart page title since we have it in modal header
            const cartTitle = container.querySelector('.cart-page-title');
            if (cartTitle && cartTitle.parentElement) {
                cartTitle.parentElement.remove();
            }
            
            // Get the main content column (skip sidebar)
            const mainContent = container.querySelector('.lg\\:col-span-9, .lg\\:col-span-12');
            if (mainContent) {
                console.log('Cart modal opened');
                showSimpleModal('Cart', mainContent.innerHTML);
            } else {
                // Fallback to container content
                console.log('Cart modal opened (fallback)');
                showSimpleModal('Cart', container.innerHTML);
            }
        } else {
            console.log('Cart is empty');
            showSimpleModal('Cart', '<p class="text-center text-gray-400">Cart is empty or unable to load.</p>');
        }
    })
    .catch(error => {
        console.error('Error loading cart:', error);
        alert('Failed to load cart. Please try again.');
    });
}

// Simple Modal System (no header nav bar) - for Cart only
function showSimpleModal(title, content) {
    let modal = document.getElementById('universalModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'universalModal';
        modal.className = 'ir-modal';
        modal.innerHTML = `
            <div class="ir-modal-overlay" onclick="closeUniversalModal()"></div>
            <div class="ir-modal-container">
                <div class="ir-modal-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding: 1.5rem 2rem 0 2rem;">
                        <h2 class="ir-modal-title" style="margin: 0; font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 20px rgba(126, 20, 247, 0.4)); font-family: 'Rajdhani', sans-serif; text-transform: uppercase; letter-spacing: 2px;"></h2>
                        <button class="ir-modal-close-cart" onclick="closeUniversalModal()" style="flex-shrink: 0;">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" style="display: block; margin: 0; padding: 0;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="ir-modal-body"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.querySelector('.ir-modal-title').textContent = title;
    modal.querySelector('.ir-modal-body').innerHTML = content;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeUniversalModal() {
    const modal = document.getElementById('universalModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Product Modal - Disabled, now goes to product page
function openProductModal(slug) {
    window.location.href = `/products/${slug}`;
}

// Improve product buttons with icons
function improveProductButtons(container) {
    // Find and update Subscribe button
    const subscribeBtn = container.querySelector('button[onclick*="subscribeToProduct"]');
    if (subscribeBtn && !subscribeBtn.querySelector('svg')) {
        const text = subscribeBtn.textContent;
        subscribeBtn.innerHTML = `
            <svg class="ir-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>${text}</span>
        `;
        subscribeBtn.className = 'ir-subscribe-btn';
    }
    
    // Find and update Add to Cart button
    const addToCartBtn = container.querySelector('button[onclick*="addProductToCart"]');
    if (addToCartBtn && !addToCartBtn.querySelector('svg')) {
        addToCartBtn.innerHTML = `
            <svg class="ir-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add to Cart</span>
        `;
        addToCartBtn.className = 'ir-add-cart-btn';
    }
    
    // Find and update Gift button
    const giftBtn = container.querySelector('button[onclick*="toggleGiftActions"]');
    if (giftBtn && !giftBtn.querySelector('svg')) {
        giftBtn.innerHTML = `
            <svg class="ir-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span>Gift</span>
        `;
        giftBtn.className = 'ir-gift-btn';
    }
}

// Attach event listeners for modal content
function attachModalEventListeners(productSlug) {
    const modal = document.getElementById('universalModal');
    if (!modal) return;
    
    console.log('Attaching modal event listeners...');
    
    // Find the product data element
    const productDataEl = modal.querySelector('[data-product-slug]');
    if (productDataEl) {
        console.log('Product slug found:', productDataEl.getAttribute('data-product-slug'));
    }
    
    // Find buttons and log their presence
    const subscribeBtn = modal.querySelector('button[onclick*="subscribeToProduct"]');
    const addToCartBtn = modal.querySelector('button[onclick*="addProductToCart"]');
    const giftBtn = modal.querySelector('button[onclick*="toggleGiftActions"]');
    
    if (subscribeBtn) {
        console.log('✅ Subscribe button found, onclick:', subscribeBtn.getAttribute('onclick'));
    }
    if (addToCartBtn) {
        console.log('✅ Add to cart button found, onclick:', addToCartBtn.getAttribute('onclick'));
    }
    if (giftBtn) {
        console.log('✅ Gift button found, onclick:', giftBtn.getAttribute('onclick'));
    }
    
    // The onclick attributes should work automatically because:
    // 1. Functions are globally defined
    // 2. They query the document (which includes the modal)
    // 3. The data-product-slug attribute is preserved in the modal
    
    // Test if clicking works
    if (addToCartBtn) {
        console.log('Testing if addProductToCart function exists:', typeof addProductToCart);
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeUniversalModal();
    }
});