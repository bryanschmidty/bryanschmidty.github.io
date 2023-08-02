const TIMEOUT = 0;
let busy = false;

document.addEventListener("DOMContentLoaded", function() {

    const itemsList = document.getElementById("items-list");
    const tabsContainer = document.getElementById('tabsContainer');


    //<editor-fold desc="functions">
    function populateForms() {
        const fontDropdown = document.getElementById("font-dropdown");
        const fonts = [
            "Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman",
            "Georgia", "Garamond", "Courier New", "Brush Script MT", "Lucida Sans Unicode",
            "Comic Sans MS", "Impact", "Palatino Linotype", "Arial Black", "Bookman Old Style"
        ];

        fonts.forEach(font => {
            const option = document.createElement("option");
            option.value = font;
            option.textContent = font;
            fontDropdown.appendChild(option);
        });

        // font size
        const min = 30;
        const max = 60;
        const step = 2;

        for (let i = min; i <= max; i += step) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `${i}pt`;

            document.getElementById("size-dropdown").appendChild(option);
        }

        // preview text
        document.getElementById("preview-text").value = "Example";
    }

    function handleTabClick() {
        if (this.lottery?.active) {
            const tab = document.getElementById('tabsContainer').querySelectorAll('.tab')[this.index];
            tab.innerHTML = "";

            const input = document.createElement("input");
            input.type = "text";
            input.value = this.lottery.name;
            input.addEventListener('click', e => e.stopPropagation());
            tab.appendChild(input);

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.addEventListener("click", e => {
                e.stopPropagation();
                renameLottery(this.index, input.value).then(() => displayItems());
            });
            tab.appendChild(saveButton);

            input.focus();
            input.setSelectionRange(0, input.value.length);

            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    saveButton.click();
                }
            });
        } else {
            setLotteryActive(this.index).then(() => displayItems());
        }
    }


    function displayItems() {
        // console.log(new Error().stack)
        itemsList.innerHTML = "";
        tabsContainer.innerHTML = "";
        loadingScreenOn();

        readLocal('lottery').then(lotteries => {
            let activeLottery = lotteries.findIndex(lottery => lottery.active === true);
            if (activeLottery === -1) {
                activeLottery = 0
                lotteries[activeLottery].active = true;
                writeLocal('lottery', lotteries)
            }

            lotteries.forEach((lottery, index) => {
                let tab = document.createElement('div');
                tab.classList.add('tab');
                if (lottery.active || index === activeLottery) {
                    tab.classList.add('active');
                }
                tab.textContent = lottery.name;
                tab.addEventListener('click', handleTabClick.bind({lottery, index}));

                tabsContainer.appendChild(tab);
                if (!lottery.active) {
                    return;
                }

                loadFontSettings(lottery);

                // Display content for this tab
                if (!lottery?.items) {
                    return;
                }
                const items = lottery?.items.filter(item => item.parentId === null)

                items.forEach(item => {
                    const children = lottery.items.filter(child => parseFloat(child.parentId) === item.id)

                    const row = document.createElement("tr");
                    row.setAttribute('data-verb-id', item.id);

                    const verbCell = document.createElement("td");
                    verbCell.style.verticalAlign = "top";
                    renderElement(verbCell, item);
                    row.appendChild(verbCell);

                    const objectCell = document.createElement("td");
                    objectCell.style.verticalAlign = "top";
                    renderChildren(objectCell, item.id, children);
                    row.appendChild(objectCell);

                    itemsList.appendChild(row);
                });
            });

            // Add a "+" tab to add a new tab
            let addTab = document.createElement('div');
            addTab.classList.add('tab');
            addTab.textContent = "+";
            addTab.addEventListener('click', function() {
                // For simplicity, we'll just add a dummy lottery.
                // You might want to replace this with your actual lottery creation logic.
                let lottery = {
                    name: 'New Lottery ' + (lotteries.length + 1),
                    active: false,
                    fontSettings: {
                        font: {},
                        border: {}
                    },
                    items: []
                };
                lotteries.push(lottery);
                writeLocal('lottery', lotteries).then(() => {
                    let index = lotteries.length - 1;
                    let tab = document.createElement('div');
                    tab.classList.add('tab');
                    tab.textContent = lottery.name;
                    tab.addEventListener('click', handleTabClick.bind({lottery, index}));
                    tabsContainer.insertBefore(tab, addTab);
                    tab.click();
                });
            });
            tabsContainer.appendChild(addTab);
            loadingScreenOff();
        });
    }

    function renderElement(parentElement, item) {
        const elementWrapper = document.createElement("div");
        elementWrapper.classList.add("element-wrapper");

        const element = document.createElement("div");
        element.classList.add("element");
        element.classList.add("element");
        element.setAttribute('data-child-id', item?.id);

        if (item?.name === undefined) {
            const addChildButton = document.createElement("button");
            addChildButton.textContent = "Add Sub-Item";
            addChildButton.addEventListener("click", () => {
                addChildButton.remove();
                editItem(element, "", null);
            });
            element.appendChild(addChildButton);
            elementWrapper.appendChild(element);
        } else {
            const text = document.createElement("span");
            text.textContent = item.name;
            element.appendChild(text);
            elementWrapper.appendChild(element);

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => {
                editItem(element, item.name, item.id);
            });
            elementWrapper.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => {
                deleteFromLottery(item.id).then(() => displayItems());
            });
            elementWrapper.appendChild(deleteButton);

            if (item.shown) {
                const resetButton = document.createElement("button");
                resetButton.textContent = "Reset";
                resetButton.addEventListener("click", () => {
                    resetItems(item.id).then(() => displayItems());
                });
                elementWrapper.appendChild(resetButton);
            }

        }
        parentElement.appendChild(elementWrapper);
    }

    function renderChildren(parentElement, verbId, children) {
        parentElement.innerHTML = "";
        children.forEach(child => {
            renderElement(parentElement, child);
        });

        renderElement(parentElement);
    }

    function editItem(element, elementText, id) {
        let parentId = element.closest('tr').getAttribute('data-verb-id');
        let siblings = Array.from(element.parentNode.children);
        for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] !== element) {
                siblings[i].remove();
            }
        }

        element.innerHTML = ""

        const input = document.createElement("input");
        input.type = "text";
        input.value = elementText;
        element.appendChild(input);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", () => {
            saveToLottery(id, input.value, parentId).then(() => displayItems());
        });
        element.appendChild(saveButton);

        // Put the cursor in the input box at the end of the text
        input.focus();
        input.setSelectionRange(0, input.value.length);

        // Add event listener for the Enter key on the input box
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                saveButton.click();
            }
        });
    }

    function addItem() {
        const newRow = document.createElement("tr");

        const itemCell = document.createElement("td");
        newRow.appendChild(itemCell);

        const objectCell = document.createElement("td");
        newRow.appendChild(objectCell);

        itemsList.appendChild(newRow);

        editItem(itemCell, "", null);
    }

    function randomize() {
        const json = {
            type: 'randomize',
            timestamp: new Date().getTime()
        }
        writeDB('event', json).then(() => {
            busy = true;
        });
    }
    function clearMessage() {
        const json = {
            type: 'clear',
            timestamp: new Date().getTime()
        }
        writeDB('event', json);
    }

    function markChildAsShown(id) {
        readLocal('lottery').then(lotteries => {
            const activeLottery = lotteries.find(lottery => lottery.active);
            const child = activeLottery.items.find(item => item.id === id);
            child.shown = true;
            writeLocal('lottery', lotteries).then(() => displayItems());
        })
    }

    function resetChildren() {
        readLocal("items").then(items => {
            items.forEach(item => {
                if (item.parentId !== null) {
                    item.shown = false;
                }
            });
            writeLocal("items", items).then(() => displayItems());
        })
    }

    //<editor-fold desc="old function openNewWindow">
    // function openNewWindow() {
    //     const newWindow = window.open("", "_blank", "width=800,height=100,top=100,left=100,toolbar=no,menubar=no,location=no,status=no");
    //     if (!newWindow) return;
    //
    //     newWindowCanvas = newWindow.document.createElement("canvas");
    //     newWindowCanvas.width = 800;  // set appropriate width
    //     newWindowCanvas.height = 100;  // set appropriate height
    //     newWindowCtx = newWindowCanvas.getContext("2d");
    //     newWindow.document.body.appendChild(newWindowCanvas);
    //     newWindow.document.body.style.backgroundColor = "black";
    //     newWindow.document.body.style.margin = "0";
    //     newWindow.document.body.style.display = "flex";
    //     newWindow.document.body.style.justifyContent = "center";
    //     newWindow.document.body.style.alignItems = "center";
    // }
    //
    // document.getElementById("open-new-window").addEventListener("click", openNewWindow);
    //</editor-fold>

    //<editor-fold desc="Font Settings">
    function getFontSettings() {
        const borderColorOverride = document.getElementById('border-color-override').checked;

        const borderColor = borderColorOverride
            ? document.getElementById('border-color').value
            : document.getElementById("color-selector").value;

        return {
            font: {
                font: document.getElementById("font-dropdown").value,
                color: document.getElementById("color-selector").value,
                size: document.getElementById("size-dropdown").value
            },
            border: {
                width: parseInt(document.getElementById("border-width").value) || 0,
                radius: parseInt(document.getElementById("corner-radius").value) || 0,
                colorOverride: borderColorOverride,
                color: borderColor,
                glow: document.getElementById("glow-checkbox").checked,
                fill: document.getElementById("fill-rectangle").checked
            }
        };
    }

    function updateExampleCanvas() {
        const settings = getFontSettings();

        const canvas = document.getElementById("example-canvas");
        const style = getComputedStyle(canvas.parentElement);

        canvas.width = parseInt(style.width, 10);
        canvas.height = parseInt(style.height, 10);

        // Set canvas background based on brightness
        const color = settings.border.color;
        const brightness = getBrightness(color);
        canvas.style.backgroundColor = brightness < 128 ? '#ffffff' : '#000000';

        const text = document.getElementById("preview-text").value;
        drawText(canvas, settings, text);
    }

    function getBrightness(color) {
        color = color.replace('#', '');

        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        return (299*r + 587*g + 114*b) / 1000;
    }

    function updateLotterySettings() {
        const fontSettings = getFontSettings();

        return readLocal('lottery').then(lotteries => {
            const activeLotteryID = lotteries.findIndex(lottery => lottery.active);
            if (activeLotteryID !== -1) {
                lotteries[activeLotteryID].fontSettings = fontSettings;
                return writeLocal('lottery', lotteries);
            }
        })
    }

    function loadFontSettings(lottery) {
        const fontSettings = lottery.fontSettings;
        document.getElementById("font-dropdown").value = fontSettings?.font.font || 'Arial';
        document.getElementById("color-selector").value = fontSettings?.font.color || '#ffffff';
        document.getElementById("size-dropdown").value = fontSettings?.font.size || 40;
        document.getElementById("border-width").value = fontSettings?.border?.width || '0';
        document.getElementById("corner-radius").value = fontSettings?.border?.radius || '0';
        document.getElementById("border-color-override").checked = fontSettings?.border?.colorOverride || false;
        document.getElementById("border-color").value = fontSettings?.border?.color || '#000000';
        document.getElementById("glow-checkbox").checked = fontSettings?.border?.glow || false;
        document.getElementById("fill-rectangle").checked = fontSettings?.border?.fill || false;
        updateExampleCanvas();
    }
    //</editor-fold>

    function getItemSizeInKB(item) {
        return new Blob([JSON.stringify(item)]).size / 1024;
    }

    function checkVersion() {
        return readDB('lottery')
            .then(lotteryDB => {
                let lottery = JSON.parse(localStorage.getItem('lottery'));

                if (lottery && lotteryDB) {
                    return true;
                }

                if (!lottery) {
                    let items = JSON.parse(localStorage.getItem('items'));
                    let fontSettings = JSON.parse(localStorage.getItem('fontSettings'));

                    localStorage.clear();
                    lottery = [{name: "tip 100", items, fontSettings}];
                    localStorage.setItem('lottery', JSON.stringify(lottery));
                }

                return writeDB('lottery', lottery)
                    .then(() => true)
                    .catch(err => {
                        throw err;
                    });
            })
            .catch(err => {
                throw err;
            });
    }

    function setLotteryActive(index) {
        return readLocal('lottery').then(lotteries => {
            const activeLottery = lotteries.find(lottery => lottery.active === true);
            console.log(activeLottery)
            if (activeLottery) {
                activeLottery.active = false;
            }

            console.log(index)
            lotteries[index].active = true;

            return writeLocal('lottery', lotteries);
        })
    }

    function renameLottery(index, name) {
        return readLocal('lottery').then(lotteries => {
            lotteries[index].name = name;
            return writeLocal('lottery', lotteries);
        })
    }
    //</editor-fold>

    //<editor-fold desc="event listeners">
    document.getElementById("add-verb").addEventListener("click", addItem);
    document.getElementById("randomize-button").addEventListener("click", randomize);
    document.getElementById("clear-message").addEventListener("click", clearMessage);
    document.getElementById("reset-children").addEventListener("click", resetAll);
    document.getElementById('settings').addEventListener('change', (e) => {
        // const IDs = ['font-dropdown', 'color-selector', 'size-dropdown', 'border-checkbox', 'rounded-checkbox', 'glow-checkbox'];
        // if (IDs.includes(e.target.id)) {
        // }
        updateExampleCanvas();
        updateLotterySettings();
    });
    document.getElementById('color-selector').addEventListener('input', updateExampleCanvas);
    document.getElementById('border-color').addEventListener('input', updateExampleCanvas);
    document.getElementById('preview-text').addEventListener('input', updateExampleCanvas);
    document.getElementById('preview-button').addEventListener('click', sendPreviewToOBS);
    //</editor-fold>

    //<editor-fold desc="root function calls">
    checkVersion().then(() => {
        populateForms();
        displayItems();
    }).catch(err => console.error(err))
    //</editor-fold>

    function saveToLottery(id, value, parentId) {
        return readLocal("lottery").then(lottery => {
            const activeLotteryID = lottery.findIndex(item => item.active === true);
            if (id === null) {
                id = Date.now() + Math.random();
                lottery[activeLotteryID]['items'].push({id, name: value, parentId});
            } else {
                const itemIndex = lottery[activeLotteryID]['items'].findIndex(item => item.id === id);
                lottery[activeLotteryID]['items'][itemIndex].name = value;
            }

            return writeLocal("lottery", lottery);
        }).catch(error => {
            throw error
        });
    }

    function deleteFromLottery(id) {
        return readLocal("lottery").then(lotteries => {
            const activeLotteryID = lotteries.findIndex(lottery => lottery.active);
            const itemIndex = lotteries[activeLotteryID]['items'].findIndex(item => item.id === id);
            lotteries[activeLotteryID]['items'].splice(itemIndex, 1);

            // delete children
            const children = lotteries[activeLotteryID]['items'].filter(item => parseFloat(item.parentId) === id);
            children.forEach(child => {
                const childIndex = lotteries[activeLotteryID]['items'].findIndex(item => item.id === child.id);
                lotteries[activeLotteryID]['items'].splice(childIndex, 1);
            });

            return writeLocal("lottery", lotteries);
        }).catch(error => {
            throw error
        });
    }

    function resetAll() {
        resetItems().then(() => displayItems());
    }

    function resetItems(id) {
        return readLocal("lottery").then(lotteries => {
            const activeLotteryID = lotteries.findIndex(lottery => lottery.active);
            if (typeof id === "number") {
                const itemIndex = lotteries[activeLotteryID]['items'].findIndex(item => item.id === id);
                lotteries[activeLotteryID]['items'][itemIndex].shown = false
            } else {
                lotteries[activeLotteryID]['items']
                    .filter(item => item.shown === true)
                    .forEach(item => item.shown = false)
            }

            return writeLocal("lottery", lotteries);
        }).catch(error => {
            throw error
        });
    }

    function readLocal(key) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(readDB(key));
            }, TIMEOUT);
        })
    }

    function writeLocal(key, json) {
        return new Promise((resolve, reject) => {
            localStorage.setItem(key, JSON.stringify(json))
            writeDB(key, json);
            resolve();
        });
    }

    function loadingScreenOn() {
        document.getElementById('loading-screen').style.display = 'flex';
    }

    function loadingScreenOff() {
        document.getElementById('loading-screen').style.display = 'none';
    }


    document.getElementById('toggle-settings').addEventListener('click', function() {
        var settings = document.getElementById('settingsContainer');
        if (settings.classList.contains('collapsed')) {
            settings.classList.remove('collapsed');
            this.textContent = 'Collapse display settings';
        } else {
            settings.classList.add('collapsed');
            this.textContent = 'Expand display settings';
        }
    });

    //<editor-fold desc="Read Heartbeat">
    const randomizeButton = document.querySelector('#randomize-button');
    const statusMessage = document.querySelector('#status-message');

    function checkHeartbeat() {
        readDB('heartbeat').then(heartbeat => {
            if (busy) {
                return;
            }
            if (!heartbeat) {
                randomizeButton.disabled = true;
                statusMessage.textContent = "OBS Screen not active";
                statusMessage.classList.add('warn');
            } else {
                // get current time
                const now = Date.now();

                // convert timestamp to milliseconds
                const heartbeatTimestamp = new Date(heartbeat).getTime();

                // calculate the difference in seconds
                const diffSeconds = (now - heartbeatTimestamp) / 1000;

                if (diffSeconds > 15) {
                    randomizeButton.disabled = true;
                    statusMessage.textContent = "OBS Screen not active";
                    statusMessage.classList.remove('warn');
                    statusMessage.classList.add('error');
                } else if (diffSeconds > 5) {
                    randomizeButton.disabled = true;
                    statusMessage.textContent = "OBS Screen not active";
                    statusMessage.classList.remove('error');
                    statusMessage.classList.add('warn');
                } else {
                    randomizeButton.disabled = false;
                    statusMessage.textContent = "";
                    statusMessage.classList.remove('warn', 'error');
                }
            }
        }).catch(error => {
            randomizeButton.disabled = true;
            statusMessage.textContent = "Error reading database";
            statusMessage.classList.remove('warn');
            statusMessage.classList.add('error');
        }).finally(() => {
            setTimeout(checkHeartbeat, 5000);
        });
    }
    checkHeartbeat();
    //</editor-fold>

    function sendPreviewToOBS() {
        const text = document.getElementById('preview-text').value;
        let json = {
            type: 'preview',
            text,
            timestamp: new Date().getTime()
        };
        writeDB('event', json)
    }

    // digest events
    const EVENT_TIMEOUT = 15; // minutes
    let lastEvent = new Date().getTime();
    function getEvent() {
        readDB('obsEvent')
            .then(event => {
                if (!event) {
                    return;
                }

                if (event.timestamp <= lastEvent) {
                    return;
                }
                lastEvent = event.timestamp;

                switch (event.type) {
                    case 'markChildAsShown':
                        markChildAsShown(event.id);
                        busy = false;
                        break;
                    case 'error':
                        statusMessage.textContent = event.message;
                        statusMessage.classList.remove('warn');
                        statusMessage.classList.add('error');
                        break;
                    default:
                        break;
                }
            })
            .finally(() => {
                let sinceLastEvent = (new Date().getTime() - lastEvent) / 1000 / 60;
                if (sinceLastEvent < EVENT_TIMEOUT) {
                    setTimeout(getEvent, 1000);
                } else {
                    loadingScreenOn();
                }
            })
    }
    getEvent();
});