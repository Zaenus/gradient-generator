const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const angle = document.getElementById('angle');
const preview = document.getElementById('preview');
const cssOutput = document.getElementById('css-output');
const copyBtn = document.getElementById('copy-btn');
const stripe = Stripe('pk_live_51Qs65NIdq3omUekPTTg9l4DKwXD5QSUUt0JZ11RELImqNR0wFqaVfdmQq6u3HDIJtLxw8JqEPXqFmlSFF84jVOoE00IjR3HLGD'); // Replace with your pk_ key

// Update gradient on input change
function updateGradient() {
    const gradient = `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})`;
    preview.style.background = gradient;
    cssOutput.value = `background: ${gradient};`;
    document.getElementById('angle-value').textContent = `${angle.value}°`;
}

// Copy CSS to clipboard
copyBtn.addEventListener('click', () => {
    cssOutput.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = 'Copy CSS';
    }, 2000);
    gtag('event', 'copy_css', {
        'event_category': 'Engagement',
        'event_label': 'Copy CSS Click'
    });
});
const downloadBtn = document.getElementById('download-btn');

downloadBtn.addEventListener('click', () => {
    const isPremium = false; // Placeholder—later tied to payment
    if (isPremium) {
        html2canvas(document.getElementById('preview')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'gradient.png';
            link.click();
        });
    } else {
        alert('Download PNG is a premium feature! Unlock it for $5/month.');
    }
});

const premiumBtn = document.getElementById('premium-btn');

premiumBtn.addEventListener('click', () => {
    // Track the click event
    gtag('event', 'click_premium_button', {
        'event_category': 'Engagement',
        'event_label': 'Go Premium Click'
    });

    stripe.redirectToCheckout({
        lineItems: [{ price: 'monthly8usd', quantity: 1 }], // Your Price ID
        mode: 'subscription',
        successUrl: window.location.href + '?premium=success',
        cancelUrl: window.location.href + '?premium=cancel',
    }).then(result => {
        if (result.error) {
            alert(result.error.message);
        }
    });
});

// Temporary premium check with localStorage
function isPremiumUser() {
    return localStorage.getItem('isPremium') === 'true';
}

downloadBtn.addEventListener('click', () => {
    if (isPremiumUser()) {
        html2canvas(document.getElementById('preview')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'gradient.png';
            link.click();
        });
    } else {
        alert('Download PNG is a premium feature! Unlock it for $5/month.');
    }
});

// Check URL for success (temporary)
if (window.location.search.includes('premium=success')) {
    localStorage.setItem('isPremium', 'true');
    alert('Thanks for going premium! You can now download PNGs.');
}
// Listen for changes
color1.addEventListener('input', updateGradient);
color2.addEventListener('input', updateGradient);
angle.addEventListener('input', updateGradient);

// Initial call to set default
updateGradient();