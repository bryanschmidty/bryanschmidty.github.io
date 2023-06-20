function populateFontDropdown() {
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
}

populateFontDropdown();

const itemsTable = document.getElementById("items-table");
const itemsList = document.getElementById("items-list");

function displayItems() {
    itemsList.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("items")) || [];
    const verbs = items.filter(item => item.parentId === null);

    verbs.forEach(verb => {
        const row = document.createElement("tr");
        row.setAttribute('data-verb-id', verb.id);

        const verbCell = document.createElement("td");
        verbCell.style.verticalAlign = "top";
        renderElement(verbCell, verb);
        row.appendChild(verbCell);

        const objectCell = document.createElement("td");
        objectCell.style.verticalAlign = "top";
        renderChildren(objectCell, verb.id);
        row.appendChild(objectCell);

        itemsList.appendChild(row);
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
        addChildButton.textContent = "Add Child";
        addChildButton.addEventListener("click", () => {
            addChildButton.remove();
            editChild(element, "", null);
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
            editChild(element, item.name, item.id);
        });
        elementWrapper.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            const items = JSON.parse(localStorage.getItem("items")) || [];
            const itemIndex = items.findIndex(object => object.id === item.id);
            if (itemIndex !== -1) {
                items.splice(itemIndex, 1);
                localStorage.setItem("items", JSON.stringify(items));
            }
            displayItems();
        });
        elementWrapper.appendChild(deleteButton);

        if (item.shown) {
            const resetButton = document.createElement("button");
            resetButton.textContent = "Reset";
            resetButton.addEventListener("click", () => {
                const items = JSON.parse(localStorage.getItem("items")) || [];
                const itemIndex = items.findIndex(object => object.id === item.id);
                if (itemIndex !== -1) {
                    items[itemIndex].shown = false;
                    localStorage.setItem("items", JSON.stringify(items));
                }
                displayItems();
            });
            elementWrapper.appendChild(resetButton);
        }

    }
    parentElement.appendChild(elementWrapper);
}

function renderChildren(parentElement, verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const children = items.filter(item => parseFloat(item.parentId) === verbId);

    parentElement.innerHTML = "";
    children.forEach(child => {
        renderElement(parentElement, child);
    });

    renderElement(parentElement);
}

function editChild(element, elementText, id) {
    let parentId = element.closest('tr').getAttribute('data-verb-id');
    let siblings = Array.from(element.parentNode.children);
    for(let i = 0; i < siblings.length; i++){
        if(siblings[i] !== element) {
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
        const items = JSON.parse(localStorage.getItem("items")) || [];
        if (id === null) {
            id = Date.now() + Math.random();
            items.push({ id, name: input.value, parentId });
        } else {
            const itemIndex = items.findIndex(item => item.id === id);
            items[itemIndex].name = input.value;
        }
        localStorage.setItem("items", JSON.stringify(items));
        displayItems();
    });
    element.appendChild(saveButton);

    // Put the cursor in the input box at the end of the text
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    // Add event listener for the Enter key on the input box
    input.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { // 13 is the keyCode for the Enter key
            event.preventDefault(); // Prevent the default action (form submission in this case)
            saveButton.click(); // Simulate a click on the save button
        }
    });
}


function updateElement(input, id) {
    const newValue = input.value;
    if (isVerb) {
        updateVerb(id, newValue);
    } else {
        updateChild(id, newValue, verbId);
    }
}

function updateVerb(id, newValue) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemIndex = items.findIndex(item => item.id === id);
    items[itemIndex].name = newValue;
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function updateChild(id, newValue, verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];

    if (id === null) {
        id = addChild(verbId);
    }

    const childIndex = items.findIndex(item => item.id === id);
    items[childIndex].name = newValue;

    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function addChild(verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const childId = Date.now() + Math.random();
    items.push({ id: childId, name: "", parentId: verbId });
    localStorage.setItem("items", JSON.stringify(items));
    return childId;
}

document.getElementById("add-verb").addEventListener("click", () => {
    const newRow = document.createElement("tr");

    const verbCell = document.createElement("td");
    newRow.appendChild(verbCell);

    const objectCell = document.createElement("td");
    newRow.appendChild(objectCell);

    itemsList.appendChild(newRow);

    editChild(verbCell, "", null);
});

function addVerb(verb) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const verbId = Date.now() + Math.random();
    items.push({ id: verbId, name: verb, parentId: null });
    localStorage.setItem("items", JSON.stringify(items));
    return verbId;
}

// Initial display of items
displayItems();


// canvas
let newWindowCanvas;
let newWindowCtx;
let animationInterval;
let verbs;
let children;
let currentVerbIndex;
let currentChildIndex;

function randomize() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    children = items.filter(item => item.parentId !== null && !item.shown);
    if (children.length === 0) return;

    const comboNames = children.map(child => {
        const verb = items.find(item => item.id === parseFloat(child.parentId));
        return { id: child.id, name: verb.name + ' ' + child.name };
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
    clearInterval(animationInterval);

    function animate() {
        drawText(comboNames[currentIndex].name);

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
}

function markChildAsShown(id) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const childIndex = items.findIndex(item => item.id === id);
    if (childIndex !== -1) {
        items[childIndex].shown = true;
        localStorage.setItem("items", JSON.stringify(items));
    }
    displayItems();
}

function resetChildren() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.forEach(item => {
        if (item.parentId !== null) {
            item.shown = false;
        }
    });
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

document.getElementById("randomize-button").addEventListener("click", () => {
    verbs = JSON.parse(localStorage.getItem("items")).filter(item => item.parentId === null);
    children = JSON.parse(localStorage.getItem("items")).filter(item => item.parentId !== null);
    currentVerbIndex = 0;
    currentChildIndex = 0;
    randomize();
});

document.getElementById("reset-children").addEventListener("click", resetChildren);

function openNewWindow() {
    const newWindow = window.open("", "_blank", "width=800,height=100,top=100,left=100,toolbar=no,menubar=no,location=no,status=no");
    if (!newWindow) return;

    newWindowCanvas = newWindow.document.createElement("canvas");
    newWindowCanvas.width = 800;  // set appropriate width
    newWindowCanvas.height = 100;  // set appropriate height
    newWindowCtx = newWindowCanvas.getContext("2d");
    newWindow.document.body.appendChild(newWindowCanvas);
    newWindow.document.body.style.backgroundColor = "black";
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.style.display = "flex";
    newWindow.document.body.style.justifyContent = "center";
    newWindow.document.body.style.alignItems = "center";
}

document.getElementById("open-new-window").addEventListener("click", openNewWindow);


// Add this function to update the example canvas
function updateExampleCanvas() {
    const font = document.getElementById("font-dropdown").value;
    const color = document.getElementById("color-dropdown").value;
    const size = document.getElementById("size-dropdown").value;

    const canvas = document.getElementById("example-canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Example", canvas.width / 2, canvas.height / 2);

    localStorage.setItem("fontSettings", JSON.stringify({ font, color, size }));
}

document.getElementById("font-dropdown").addEventListener("change", updateExampleCanvas);
document.getElementById("color-dropdown").addEventListener("change", updateExampleCanvas);
document.getElementById("size-dropdown").addEventListener("change", updateExampleCanvas);

function loadFontSettings() {
    const fontSettings = JSON.parse(localStorage.getItem("fontSettings"));
    if (fontSettings) {
        document.getElementById("font-dropdown").value = fontSettings.font;
        document.getElementById("color-dropdown").value = fontSettings.color;
        document.getElementById("size-dropdown").value = fontSettings.size;
        updateExampleCanvas();
    }
}

loadFontSettings();

function drawText(item) {
    const fontSettings = JSON.parse(localStorage.getItem("fontSettings"));
    const font = fontSettings.font;
    const color = fontSettings.color;
    const size = fontSettings.size;

    newWindowCtx.clearRect(0, 0, newWindowCanvas.width, newWindowCanvas.height);
    newWindowCtx.font = `${size}px ${font}`;
    newWindowCtx.fillStyle = color;
    newWindowCtx.textAlign = "center";
    newWindowCtx.textBaseline = "middle";
    newWindowCtx.fillText(item, newWindowCanvas.width / 2, newWindowCanvas.height / 2);
}