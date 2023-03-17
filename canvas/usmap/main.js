// main.js
const canvas = document.getElementById('usMap');
const ctx = canvas.getContext('2d');
const loadingBar = document.getElementById("loadingBar");

// Define the state URLs and product images
const stateData = {
    'al': { productImage: 'https://prod-images.fashionphile.com/thumb/b713786128d688d8217defae11099ad2/7ee383063ad2ebc3b931b993b857347b.jpg' },
    'ak': { productImage: 'https://prod-images.fashionphile.com/thumb/363c4cbfc1688478931c7472649fcab5/b8f1e0abc51fff36bd95a765cf635482.jpg' },
    'az': { productImage: 'https://prod-images.fashionphile.com/thumb/471f15253b786830f2663a973f40820e/ad159369cb171f6044425191258e03f8.jpg' },
    'ar': { productImage: 'https://prod-images.fashionphile.com/thumb/a499882c866e3cc293d3fbbe7f00f703/72bc9ba5877e38e73a4d2182de866c98.jpg' },
    'ca': { productImage: 'https://prod-images.fashionphile.com/thumb/a1584e52d0f58c33dd321204b3d94026/e39b45fb1b1905f6e0fea0eba6e0c288.jpg' },
    'co': { productImage: 'https://prod-images.fashionphile.com/thumb/d05b9222f2a254da3b751d3b127b5942/d9fc3cd3fd02bf022bb273032da5d8ee.jpg' },
    'ct': { productImage: 'https://prod-images.fashionphile.com/thumb/983f67408e7c9af042762da0010d30a5/001172be7e02feac5078a65512efe1ee.jpg' },
    'de': { productImage: 'https://prod-images.fashionphile.com/thumb/f3982519b1e51fdab61be720ce2f03c3/68ae79aa1ad6376666bf63633950bc64.jpg' },
    'fl': { productImage: 'https://prod-images.fashionphile.com/thumb/0775a3adcb017039b29c1d30f11f8aa0/0cb6bbd1f34dae35ae78853a0f576480.jpg' },
    'ga': { productImage: 'https://prod-images.fashionphile.com/thumb/7c05ab4dbaa5e746fdc892c96b9e4321/20223724d5555ef5b1fcfc7cd0b26efc.jpg' },
    'hi': { productImage: 'https://prod-images.fashionphile.com/thumb/aa74cdfe3815df58da19dc2298514ccd/5e429968e339c25d465e674693b5a4f0.jpg' },
    'id': { productImage: 'https://prod-images.fashionphile.com/thumb/286ab45485045170e23ca83602976639/8928a1251d2deee4575f7ac67547e756.jpg' },
    'il': { productImage: 'https://prod-images.fashionphile.com/thumb/265f662658f0020f1ddb48e3c1210688/c7d067ff7d3484ba40583a7ca41f098c.jpg' },
    'in': { productImage: 'https://prod-images.fashionphile.com/thumb/a654df3c7e60d37dea6043aa553a9ba2/dc254d6af819c8bcc83c9ceb1ad432dc.jpg' },
    'ia': { productImage: 'https://prod-images.fashionphile.com/thumb/08e14774554352f49c12b490a64a0b0c/ff9754dff997333dbb5e273612944015.jpg' },
    'ks': { productImage: 'https://prod-images.fashionphile.com/thumb/74ecc27cc11b8f99a5c80b30adb1c3d4/2f22b14e1819d4a16f7865e0e40b605f.jpg' },
    'ky': { productImage: 'https://prod-images.fashionphile.com/thumb/6f40d8122b9fc8ba215aa775ab2c125d/25091f855792a2cd6c93c03a900d3675.jpg' },
    'la': { productImage: 'https://prod-images.fashionphile.com/thumb/0775a3adcb017039b29c1d30f11f8aa0/0cb6bbd1f34dae35ae78853a0f576480.jpg' },
    'me': { productImage: 'https://prod-images.fashionphile.com/thumb/fe0ab1b153b5bc64484b4471b82adfaa/5a82f02160723ebbd62da601d620fb31.jpg' },
    'md': { productImage: 'https://prod-images.fashionphile.com/thumb/363c4cbfc1688478931c7472649fcab5/8db7b2870384453d83a0ced197c4a3cd.jpg' },
    'ma': { productImage: 'https://prod-images.fashionphile.com/thumb/2a960936f1555bc3b09dbe180d8bda54/c7e5b5272e17d9434164c645a93fad60.jpg' },
    'mi': { productImage: 'https://prod-images.fashionphile.com/thumb/b68d03f44f2cdf86dc037e414129e51f/8bd7ccef7c548d3a6a89235769e3fdd3.jpg' },
    'mn': { productImage: 'https://prod-images.fashionphile.com/thumb/f9db164c0bda9b97ee3ee75cc0ce4487/e1a1e5273641806f05828454861d84fd.jpg' },
    'ms': { productImage: 'https://prod-images.fashionphile.com/thumb/56de7aae3c4fa96b0b5c70f4a8a39515/4dcc195833a2455b329d8de067d7f5e5.jpg' },
    'mo': { productImage: 'https://prod-images.fashionphile.com/thumb/29603180b42861d550bb8e832d1c684b/76cda9e405bb5b744dfaa986da730867.jpg' },
    'mt': { productImage: 'https://prod-images.fashionphile.com/thumb/a5b216825f5b278e1d6cceb7e5f77636/e01723a8977dd68d9d8c73a7bf7170d5.jpg' },
    'ne': { productImage: 'https://prod-images.fashionphile.com/thumb/dda037054e7b1c3173a7c02fd8e0fdd3/b4a22c987b10c5c5c0aebf07d8930e7a.jpg' },
    'nv': { productImage: 'https://prod-images.fashionphile.com/thumb/ab164439af3a919d2eed981d34a9ead0/21f721fd886d3a38d1d2c4a4a3bd18ce.jpg' },
    'nh': { productImage: 'https://prod-images.fashionphile.com/thumb/83915c04e7e04f257192e3a256e84f44/498abc4743678df3d02f1e85ba49a9ca.jpg' },
    'nj': { productImage: 'https://prod-images.fashionphile.com/thumb/78bb0795aba3365165f017711d1bf2c6/ed880bb3c3ad9e487c9976a585ff0929.jpg' },
    'nm': { productImage: 'https://prod-images.fashionphile.com/thumb/2784d22b31f1893d04b63504737017d2/680c91140f5bcf399a79a58db5d37749.jpg' },
    'ny': { productImage: 'https://prod-images.fashionphile.com/thumb/0775a3adcb017039b29c1d30f11f8aa0/0cb6bbd1f34dae35ae78853a0f576480.jpg' },
    'nc': { productImage: 'https://prod-images.fashionphile.com/thumb/7c0159da6ebdbb832323487e258d4e63/4c97abfe72cec68817a91129e40d3df3.jpg' },
    'nd': { productImage: 'https://prod-images.fashionphile.com/thumb/5ceaff32a5c0143716e0ef6da4593e66/9b1c3a6849bd2ff8f38f478052e28d1c.jpg' },
    'oh': { productImage: 'https://prod-images.fashionphile.com/thumb/f3982519b1e51fdab61be720ce2f03c3/3d278c61e75af99e9ed122a48d550396.jpg' },
    'ok': { productImage: 'https://prod-images.fashionphile.com/thumb/ca9d1aee09057fb77fbad67b58830cdb/a0a18b82d9483f10847d320e850bbbb9.jpg' },
    'or': { productImage: 'https://prod-images.fashionphile.com/thumb/91311887b259446a23a938b8019874d5/60e6d25f298743eba18690c5c392af61.jpg' },
    'pa': { productImage: 'https://prod-images.fashionphile.com/thumb/b82cc22574ec757915fd5bcb7778bd1a/8a9b74ce10e858ef8f6ca3b4e600c3aa.jpg' },
    'ri': { productImage: 'https://prod-images.fashionphile.com/thumb/7c05ab4dbaa5e746fdc892c96b9e4321/0a25b382aa08a6e6a557fb38a1efdcbd.jpg' },
    'sc': { productImage: 'https://prod-images.fashionphile.com/thumb/3ae202e156aeb86fcb81afca4687af36/4c9ecfa96558796b410b0418eb09c13a.jpg' },
    'sd': { productImage: 'https://prod-images.fashionphile.com/thumb/c499a62b104696e5a6d851daf34f9a52/8326a0a59cd4a0f6b8d7c0382495c89e.jpg' },
    'tn': { productImage: 'https://prod-images.fashionphile.com/thumb/75fae465f5f810178d8aa5071aeaea98/885e786f12cc6d44a9a46485a4f7a97b.jpg' },
    'tx': { productImage: 'https://prod-images.fashionphile.com/thumb/7bd59f55c0b76d4fa85ad2ca634fdfdb/9571f1ebb8c92b71cbdf049cf01ae483.jpg' },
    'ut': { productImage: 'https://prod-images.fashionphile.com/thumb/0775a3adcb017039b29c1d30f11f8aa0/0cb6bbd1f34dae35ae78853a0f576480.jpg' },
    'vt': { productImage: 'https://prod-images.fashionphile.com/thumb/7ee8223dad7e0df38f52487b163934ba/b65c8ec247389c43a3af010dcf922aac.jpg' },
    'va': { productImage: 'https://prod-images.fashionphile.com/thumb/363c4cbfc1688478931c7472649fcab5/4c82491290ff3dee9145e762ab1e1dd7.jpg' },
    'wa': { productImage: 'https://prod-images.fashionphile.com/thumb/735abb9e9ff1bb717a02457e33e7168f/6d00cbe7240fa61c3834c64251b57fd9.jpg' },
    'wv': { productImage: 'https://prod-images.fashionphile.com/thumb/f0db0fb092a72eac9bcd824c6186963a/62309ab5cfbb5f19c8b90c317bf19e8f.jpg' },
    'wi': { productImage: 'https://prod-images.fashionphile.com/thumb/6444ac9f95b3c368392735bfe9271ffa/2d93c974eab0d1a0a5abecd8ba84e1cb.jpg' },
    'wy': { productImage: 'https://prod-images.fashionphile.com/thumb/bc6c06a3dca5270bc2c00fbbaf1df13d/a13a88be40ba55046869dfcf4f92acb7.jpg' }
};

function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    usMapData.forEach((state) => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        const path = new Path2D(state.path);
        ctx.stroke(path);
        state.path2D = path;
    });
}
//
// function drawImage(imageUrl) {
//     const img = new Image();
//     img.src = imageUrl;
//     img.onload = () => {
//         const x = (canvas.width - img.width) / 2;
//         const y = canvas.height - 300;
//         ctx.drawImage(img, x, y);
//     };
// }
function drawImage(image, x, y) {
    const radius = 50;
    // Draw a thick black circle border
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw the point at the bottom of the circle
    const angle = Math.PI / 6; // 30 degrees
    const tangentX1 = x + radius * Math.sin(angle);
    const tangentY1 = y + radius * Math.cos(angle);
    const tangentX2 = x - radius * Math.sin(angle);
    const tangentY2 = y + radius * Math.cos(angle);

    ctx.beginPath();
    ctx.moveTo(tangentX1, tangentY1);
    ctx.lineTo(x, y + radius + 20);
    ctx.lineTo(tangentX2, tangentY2);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
        image,
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
    );

    ctx.restore();
}


let currentHoveredState = null;

function handleMouseOver(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    let newHoveredState = null;

    usMapData.forEach((state) => {
        if (ctx.isPointInPath(state.path2D, x, y)) {
            newHoveredState = state.name;
        }
    });

    if (newHoveredState !== currentHoveredState) {
        drawMap(); // Redraw the map to clear previous hover effects
        currentHoveredState = newHoveredState;

        if (currentHoveredState) {
            const hoveredStateData = usMapData.find(state => state.name === currentHoveredState);
            ctx.beginPath();
            ctx.strokeStyle = "pink";
            ctx.lineWidth = 2;
            ctx.stroke(hoveredStateData.path2D);

            const imageX = hoveredStateData.centroid[0];
            const imageY = hoveredStateData.centroid[1] - 75; // Offset the image above the state centroid
            const image = stateData[currentHoveredState].image;
            drawImage(image, imageX, imageY);
        }
    }
}

function setupEventListeners() {
    canvas.addEventListener("mousemove", handleMouseOver);
}

async function preloadImages() {
    const totalImages = Object.keys(stateData).length;
    let loadedImages = 0;

    const imagePromises = Object.entries(stateData).map(async ([state, data]) => {
        const image = new Image();
        image.src = data.productImage;

        return new Promise((resolve) => {
            image.onload = () => {
                loadedImages++;
                const progress = (loadedImages / totalImages) * 100;
                loadingBar.style.width = `${progress}%`;

                stateData[state].image = image;
                resolve();
            };
        });
    });

    await Promise.all(imagePromises);
}


async function init() {
    await preloadImages();
    loadingBar.remove()
    drawMap();
    setupEventListeners();
}

init();