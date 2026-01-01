// 1. SELECTORS
const startBtn = document.getElementById('start-btn');
const toBowsBtn = document.getElementById('to-bows-btn');
const backToFlowersBtn = document.getElementById('back-to-flowers-btn');
const clearBtn = document.getElementById('clear-btn');
const downloadBtn = document.getElementById('download-btn');

const landingScreen = document.getElementById('landing-screen');
const mainApp = document.getElementById('main-app');
const flowerScreen = document.getElementById('flower-selection-screen');
const bowScreen = document.getElementById('bow-selection-screen');
const bouquetDisplay = document.getElementById('bouquet-display');

// 2. STATE
let bouquet = [];

// PETALS
const petalImages = [
    'assets/icons/petal_1.png',
    'assets/icons/petal_2.png'
];

function launchPetals() {
    const container = document.getElementById('petal-container');
    const petalCount = 250;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';

        // Random petal image
        const img = petalImages[Math.floor(Math.random() * petalImages.length)];
        petal.style.backgroundImage = `url(${img})`;

        //SIZE
        const isFront = Math.random() > 0.4;
        const size = isFront
            ? Math.random() * 25 + 70   // 70–95px
            : Math.random() * 20 + 45;  // 45–65px

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.opacity = isFront ? 0.9 : 0.6;

        // START FROM TOP ONLY
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.top = '-80px';

        // GENTLE HORIZONTAL DRIFT
        const driftX = Math.random() * 240 - 120; // -80px → +80px
        petal.style.setProperty('--driftX', `${driftX}px`);

        // ROTATION
        petal.style.setProperty('--rotate', `${Math.random() * 720 - 360}deg`);

        // TIMING
        const fallDuration = Math.random() * 4 + 7; // 5–8s
        petal.style.animationDuration = `${fallDuration}s, 2.5s`;
        petal.style.animationDelay = `${Math.random()}s`;

        container.appendChild(petal);

        //CLEANUP
        setTimeout(() => petal.remove(), fallDuration * 1000 + 1000);
    }
}


// 3. SCREEN SWITCHING
startBtn.addEventListener('click', () => {
    launchPetals();
    landingScreen.classList.add('hidden');
    mainApp.classList.remove('hidden');
});

toBowsBtn.addEventListener('click', () => {
    flowerScreen.classList.add('hidden');
    bowScreen.classList.remove('hidden');
});

backToFlowersBtn.addEventListener('click', () => {
    bowScreen.classList.add('hidden');
    flowerScreen.classList.remove('hidden');
});

// 4. FLOWER ADDITION
document.querySelectorAll('.pixel-art').forEach(flower => {
    flower.addEventListener('click', () => {
        bouquet.push(flower.src);
        renderBouquet();
    });
});

function renderBouquet() {
    document.querySelectorAll('.added-flower').forEach(f => f.remove());

    const total = bouquet.length;
    if (total === 0) return;

    const spacing = 20;

    bouquet.forEach((flowerSrc, index) => {
        const newFlower = document.createElement('img');
        newFlower.src = flowerSrc;
        newFlower.classList.add('added-flower');

        const xOffset = (index - (total - 1) / 2) * spacing;
        const rotation = xOffset * 0.8;

        newFlower.style.transform = `translateX(calc(${xOffset}px - 50%)) rotate(${rotation}deg)`;

        bouquetDisplay.appendChild(newFlower);
    });
}

// 5. BOW SELECTION
document.querySelectorAll('.pixel-art-bow').forEach(bow => {
    bow.addEventListener('click', () => {
        const existingBow = document.querySelector('.added-bow');
        if (existingBow) existingBow.remove();

        const newBow = document.createElement('img');
        newBow.src = bow.src;
        newBow.classList.add('added-bow');
        bouquetDisplay.appendChild(newBow);
    });
});

// 6. RESET - Preserves static vase
clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.added-flower, .added-bow').forEach(el => el.remove());
    bouquet = [];
});

// 7. DOWNLOAD
downloadBtn.addEventListener('click', async () => {
    try {
        // 1. Get the actual dimensions without borders
        const width = bouquetDisplay.clientWidth; // clientWidth ignores borders
        const height = bouquetDisplay.clientHeight;

        // 2. Capture using specific dimensions to crop the border out
        const dataUrl = await htmlToImage.toPng(bouquetDisplay, {
            backgroundColor: '#f9e4e4',
            pixelRatio: 2,
            width: width,
            height: height,
            style: {
                border: '0',
                borderRadius: '0',
                margin: '0',
                left: '0',
                top: '0',
                transform: 'none'
            }
        });

        const link = document.createElement('a');
        link.download = 'my-bouquet.png';
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Download failed:', err);
    }
});