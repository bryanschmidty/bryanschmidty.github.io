const API_KEY = 'AIzaSyA2u39mEY4II5OYM5ZoT2csROAXskTQ0n8';
let player;
let queue = [];

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    const searchInput = document.getElementById('search');
    let debounceTimeout;

    searchInput.addEventListener('keyup', event => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            const query = event.target.value.trim();

            if (query.includes('youtube.com/watch?v=')) {
                const videoId = query.split('v=')[1];
                addToQueue(videoId);
            } else {
                searchVideos(query);
            }
        }, 300);
    });

    // Load the saved queue from localStorage when the page is loaded
    const savedQueue = localStorage.getItem('queue');
    if (savedQueue) {
        queue = JSON.parse(savedQueue);
        updateQueueDisplay();
        if (queue.length > 0) {
            player.loadVideoById(queue[0]);
            player.playVideo();
        }
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        removeFromQueue(queue[0]);
        if (queue.length > 0) {
            player.loadVideoById(queue[0]);
            player.playVideo(); // Add this line to start the next video automatically
        }
    }
}

async function searchVideos(query) {
    if (!query) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }

    const maxResults = document.getElementById('max-results').value || 5;

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${query}&type=video&key=${API_KEY}`);
    const data = await response.json();
    displaySearchResults(data.items);
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';

    results.forEach(result => {
        const videoId = result.id.videoId;
        const thumbnail = result.snippet.thumbnails.default.url;
        const title = result.snippet.title;

        const div = document.createElement('div');
        div.classList.add('result');
        div.innerHTML = `
              <img src="${thumbnail}" alt="${title}">
              <p>${title}</p>
            `;

        div.addEventListener('click', () => {
            addToQueue(videoId);
        });

        container.appendChild(div);
    });
}

function addToQueue(videoId) {
    if (!queue.includes(videoId)) {
        queue.push(videoId);
    }
    updateQueueDisplay();

    if (queue.length === 1) {
        player.loadVideoById(videoId);
    }

    // Save the updated queue to localStorage
    localStorage.setItem('queue', JSON.stringify(queue));
}


function updateQueueDisplay() {
    const container = document.getElementById('queue');
    container.innerHTML = '';

    queue.forEach((videoId, index) => {
        const div = document.createElement('div');
        div.classList.add('queue-item');
        div.dataset.videoId = videoId;
        div.innerHTML = `
          <span>${index + 1}. </span>
          <iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}?controls=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <button class="remove-from-queue">Remove</button>
        `;

        div.querySelector('.remove-from-queue').addEventListener('click', () => {
            removeFromQueue(videoId);
        });

        container.appendChild(div);
    });
}

function removeFromQueue(videoId) {
    const index = queue.indexOf(videoId);
    if (index > -1) {
        queue.splice(index, 1);
    }
    updateQueueDisplay();

    // Save the updated queue to localStorage
    localStorage.setItem('queue', JSON.stringify(queue));
}