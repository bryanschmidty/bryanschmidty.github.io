document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('result-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let lastItem = "";
    let lastSettings;

    function randomize() {
        readDB('lottery')
            .then(lotteries => {
                const lottery = lotteries.find(lottery => lottery.active);

                let items = lottery.items.filter(item => item.parentId !== null);
                if (items.length === 0) {
                    items = lottery.items;
                }

                items = items.filter(item => !item.shown);
                if (items.length === 0) {
                    writeDB('obsEvent', {
                        type: 'error',
                        message: 'All items have been shown',
                        timestamp: new Date().getTime()
                    })
                    return;
                }

                const comboNames = items.map(child => {
                    if (child.parentId) {
                        const verb = lottery.items.find(parent => parent.id === parseFloat(child.parentId));
                        return {id: child.id, name: verb.name + ' ' + child.name};
                    } else {
                        return {id: child.id, name: child.name};
                    }
                });

                function shuffle(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                shuffle(comboNames);

                let speed = 50;
                let slowdown = 1.1;
                const startTime = Date.now();
                let currentIndex = 0;
                let animationInterval;
                clearInterval(animationInterval);

                function animate() {
                    drawText(canvas, lottery.fontSettings, comboNames[currentIndex].name);

                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime >= 5000) {
                        clearInterval(animationInterval);
                        markChildAsShown(comboNames[currentIndex].id);
                    } else {
                        speed *= slowdown;
                        currentIndex = (currentIndex + 1) % comboNames.length;
                        clearInterval(animationInterval);
                        animationInterval = setInterval(animate, speed);
                    }
                }

                animationInterval = setInterval(animate, speed);
            })
            .catch(err => console.error(err));

    }


    function markChildAsShown(id) {
        writeDB('obsEvent', {
            type: 'markChildAsShown',
            id: id,
            timestamp: new Date().getTime()
        })
    }

    window.addEventListener('resize', function(event){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (lastItem) {
            drawText(canvas, lastSettings, lastItem);
        }
    });

    function getActiveSettings() {
        return readDB('lottery').then(lotteries => {
            const lottery = lotteries.find(lottery => lottery.active);
            if (lottery) {
                return lottery.fontSettings;
            } else {
                drawError("No active lottery");
            }

            return false;
        })
    }

    function drawError(message) {
        console.error(message);

        const settings = {
            "font": {
                "font": "Arial",
                "color": "#ff0000",
                "size": "20"
            },
            "border": {
                "width": 0,
                "radius": 20,
                "colorOverride": false,
                "color": "#ff0000",
                "glow": false,
                "fill": false
            }
        }
        drawText(canvas, settings, message)
    }

    // Update heartbeat
    function heartbeat() {
        writeDB("heartbeat", new Date().getTime())
            .catch(err => {
                drawError("Can't Connect to Database")
            })
            .finally(() => {
                setTimeout(heartbeat, 5000);
            });
    }
    heartbeat();

    // digest events
    const EVENT_TIMEOUT = 15; // minutes
    let lastEvent = new Date().getTime();
    function getEvent() {
        readDB('event')
            .then(event => {
                if (event.timestamp <= lastEvent) {
                    return;
                }
                lastEvent = event.timestamp;

                switch (event.type) {
                    case 'preview':
                        getActiveSettings().then(settings => {
                            lastSettings = settings;
                            lastItem = event.text;
                            drawText(canvas, settings, event.text)
                        }).catch(err => {
                            throw err;
                        });
                        break;
                    case 'randomize':
                        randomize();
                        break;
                    case 'clear':
                        clearCanvas(canvas);
                        break;
                    default:
                        drawError("Unknown event type");
                }
            })
            .catch(err => {
                drawError("Can't Connect to Database")
            })
            .finally(() => {
                let sinceLastEvent = (new Date().getTime() - lastEvent) / 1000 / 60;
                if (sinceLastEvent < EVENT_TIMEOUT) {
                    setTimeout(getEvent, 1000);
                } else {
                    drawError('page has timed out. please reload')
                }
            });
    }
    getEvent();
});

