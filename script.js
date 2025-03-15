const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const angle = document.getElementById('angle');
const preview = document.getElementById('preview');
const cssOutput = document.getElementById('css-output');
const copyBtn = document.getElementById('copy-btn');

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
    }, 2000); // Reverts after 2 seconds
});

// Listen for changes
color1.addEventListener('input', updateGradient);
color2.addEventListener('input', updateGradient);
angle.addEventListener('input', updateGradient);

// Initial call to set default
updateGradient();