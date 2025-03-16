const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const angle = document.getElementById('angle');
const preview = document.getElementById('preview');
const cssOutput = document.getElementById('css-output');
const copyBtn = document.getElementById('copy-btn');
const animateBtn = document.getElementById('animate-btn');
const saveBtn = document.getElementById('save-btn');
const savedList = document.getElementById('saved-list');
const stripe = Stripe('pk_live_51Qs65NIdq3omUekPTTg9l4DKwXD5QSUUt0JZ11RELImqNR0wFqaVfdmQq6u3HDIJtLxw8JqEPXqFmlSFF84jVOoE00IjR3HLGD'); // Replace with your pk_ key

// Update gradient on input change
function updateGradient() {
    const gradient = `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})`;
    preview.style.background = gradient;
    cssOutput.value = `background: ${gradient};`;
    document.getElementById('angle-value').textContent = `${angle.value}°`;
}

function loadSavedGradients() {
    const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
    savedList.innerHTML = '';
    saved.forEach((gradient, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Gradient ${index + 1}</span>
            <div style="background: ${gradient};"></div>
        `;
        li.addEventListener('click', () => {
            preview.style.background = gradient;
            cssOutput.value = `background: ${gradient};`;
        });
        savedList.appendChild(li);
    });
}

saveBtn.addEventListener('click', async () => {
    const customerId = document.getElementById('customer-id').value;
    if (!customerId) {
        alert('Please subscribe to save gradients.');
        return;
    }
    const isPremium = await checkSubscription(customerId);
    if (isPremium) {
        const gradient = `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})`;
        const saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');
        saved.push(gradient);
        localStorage.setItem('savedGradients', JSON.stringify(saved));
        loadSavedGradients();
    } else {
        alert('Saving gradients is a premium feature! Unlock it for $5/month.');
    }
});

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
    gtag('event', 'click_premium_button', {
        'event_category': 'Engagement',
        'event_label': 'Go Premium Click'
    });

    stripe.redirectToCheckout({
        lineItems: [{ price: 'monthly8usd', quantity: 1 }], // Replace with your actual Price ID
        mode: 'subscription',
        successUrl: window.location.href + '?premium=success&session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: window.location.href + '?premium=cancel',
    }).then(result => {
        if (result.error) {
            alert(result.error.message);
        }
    });
});

async function checkSubscription(customerId) {
    const response = await fetch('/.netlify/functions/check-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
    });
    const data = await response.json();
    return data.isPremium;
}

async function getCustomerId(sessionId) {
    const response = await fetch('/.netlify/functions/get-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();
    return data.customerId;
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('premium') === 'success') {
    const sessionId = urlParams.get('session_id'); // Updated to match the parameter name
    if (sessionId) {
        getCustomerId(sessionId).then(customerId => {
            document.getElementById('customer-id').value = customerId;
            checkSubscription(customerId);
        });
    } else {
        alert('No session ID returned. Please try again.');
    }
}

downloadBtn.addEventListener('click', async () => {
    const customerId = document.getElementById('customer-id').value;
    if (!customerId) {
        alert('Please subscribe to download PNGs.');
        return;
    }
    const isPremium = await checkSubscription(customerId);
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

animateBtn.addEventListener('click', async () => {
    const customerId = document.getElementById('customer-id').value;
    if (!customerId) {
        alert('Please subscribe to use animations.');
        return;
    }
    const isPremium = await checkSubscription(customerId);
    if (isPremium) {
        preview.classList.toggle('animated-gradient');
    } else {
        alert('Gradient animations are a premium feature! Unlock it for $5/month.');
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

// Load saved gradients on page load
loadSavedGradients();