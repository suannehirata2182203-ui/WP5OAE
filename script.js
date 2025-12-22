document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initCookieBanner();
    initBurgerMenu();
    initSmoothScroll();
    initFormValidation();
});

function initPageLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;
    
    var hideLoader = function() {
        loader.classList.add('hidden');
    };
    
    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 300);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hideLoader, 300);
        });
    }
    
    window.addEventListener('pageshow', function(event) {
        loader.classList.add('hidden');
    });
    
    window.addEventListener('popstate', function() {
        loader.classList.add('hidden');
    });
    
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            loader.classList.add('hidden');
        }
    });
    
    var links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        if (!href) continue;
        
        var isInternalLink = (link.hostname === window.location.hostname || link.hostname === '') && 
            !href.startsWith('#') &&
            href !== '' &&
            !link.getAttribute('target') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.startsWith('javascript:');
            
        if (isInternalLink) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                loader.classList.remove('hidden');
                var destination = this.getAttribute('href');
                setTimeout(function() {
                    window.location.href = destination;
                }, 400);
            });
        }
    }
}

function initCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    var settingsBtn = document.getElementById('cookieSettings');
    var saveBtn = document.getElementById('cookieSave');
    var settingsPanel = document.getElementById('cookieSettingsPanel');
    var analyticsCookies = document.getElementById('analyticsCookies');
    var marketingCookies = document.getElementById('marketingCookies');
    
    var currentPath = window.location.pathname;
    var currentFile = currentPath.split('/').pop() || 'home.html';
    var isHomePage = currentFile === '' || 
                     currentFile === 'home.html' || 
                     currentFile === 'index.html' ||
                     currentPath === '/' ||
                     currentPath.endsWith('/');
    
    var cookieConsent = localStorage.getItem('cookieConsent');
    
    if (isHomePage && !cookieConsent) {
        setTimeout(function() {
            banner.classList.add('visible');
            banner.classList.remove('hidden');
        }, 1500);
    } else {
        banner.classList.add('hidden');
        banner.classList.remove('visible');
    }
    
    function setCookiePreferences(preferences) {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }
    
    function hideBanner() {
        banner.classList.remove('visible');
        banner.classList.add('hidden');
    }
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setCookiePreferences({
                essential: true,
                analytics: true,
                marketing: true
            });
            hideBanner();
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setCookiePreferences({
                essential: true,
                analytics: false,
                marketing: false
            });
            hideBanner();
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (settingsPanel) {
                settingsPanel.classList.toggle('visible');
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setCookiePreferences({
                essential: true,
                analytics: analyticsCookies ? analyticsCookies.checked : false,
                marketing: marketingCookies ? marketingCookies.checked : false
            });
            hideBanner();
        });
    }
}

function initBurgerMenu() {
    var burgerBtn = document.getElementById('burgerMenu');
    var mobileMenu = document.getElementById('mobileMenu');
    
    if (!burgerBtn || !mobileMenu) return;
    
    burgerBtn.addEventListener('click', function() {
        var isOpen = this.classList.toggle('active');
        mobileMenu.classList.toggle('visible');
        this.setAttribute('aria-expanded', isOpen.toString());
        mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    var menuLinks = mobileMenu.querySelectorAll('a');
    for (var i = 0; i < menuLinks.length; i++) {
        menuLinks[i].addEventListener('click', function() {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('visible');
            burgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('visible')) {
            burgerBtn.classList.remove('active');
            mobileMenu.classList.remove('visible');
            burgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    });
}

function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

function initFormValidation() {
    var form = document.querySelector('.contact-form form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var nameInput = form.querySelector('input[name="name"]');
        var emailInput = form.querySelector('input[name="email"]');
        var messageInput = form.querySelector('textarea[name="message"]');
        
        var isValid = true;
        
        if (nameInput && !nameInput.value.trim()) {
            showError(nameInput, 'Please enter your name');
            isValid = false;
        } else if (nameInput) {
            clearError(nameInput);
        }
        
        if (emailInput && !isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else if (emailInput) {
            clearError(emailInput);
        }
        
        if (messageInput && !messageInput.value.trim()) {
            showError(messageInput, 'Please enter your message');
            isValid = false;
        } else if (messageInput) {
            clearError(messageInput);
        }
        
        if (isValid) {
            var submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                
                setTimeout(function() {
                    form.reset();
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        }
    });
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showError(input, message) {
        var formGroup = input.closest('.form-group');
        var errorEl = formGroup.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.style.color = '#e74c3c';
            errorEl.style.fontSize = '13px';
            errorEl.style.marginTop = '6px';
            errorEl.style.display = 'block';
            formGroup.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.style.borderColor = '#e74c3c';
    }
    
    function clearError(input) {
        var formGroup = input.closest('.form-group');
        var errorEl = formGroup.querySelector('.error-message');
        
        if (errorEl) {
            errorEl.remove();
        }
        input.style.borderColor = '';
    }
}