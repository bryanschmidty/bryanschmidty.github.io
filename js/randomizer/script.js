const itemsTable = document.getElementById("items-table");
const itemsList = document.getElementById("items-list");

function displayItems() {
    itemsList.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.forEach((itemData, index) => {
        const row = document.createElement("tr");

        const verbCell = document.createElement("td");
        verbCell.style.verticalAlign = "top";
        renderElement(verbCell, itemData.item, itemData.id, true);
        row.appendChild(verbCell);

        const objectCell = document.createElement("td");
        objectCell.style.verticalAlign = "top";
        renderChildren(objectCell, itemData.id);
        row.appendChild(objectCell);

        itemsList.appendChild(row);
    });
}

function renderElement(parentElement, elementText, id, isVerb) {
    const elementWrapper = document.createElement("div");
    elementWrapper.classList.add("element-wrapper");

    const element = document.createElement("div");
    element.classList.add("element");

    const text = document.createElement("span");
    text.textContent = elementText;
    element.appendChild(text);

    elementWrapper.appendChild(element);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        editElement(element, elementText, id, isVerb);
    });
    elementWrapper.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteElement(id, isVerb);
    });
    elementWrapper.appendChild(deleteButton);

    parentElement.appendChild(elementWrapper);
}

function renderChildren(parentElement, verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemData = items.find(item => item.id === verbId);

    parentElement.innerHTML = "";
    itemData.children.forEach((child, childIndex) => {
        renderElement(parentElement, child.text, { verbId, childIndex }, false);
    });

    const addChildButton = document.createElement("button");
    addChildButton.textContent = "Add Child";
    addChildButton.addEventListener("click", () => {
        const childIndex = addChild(verbId);
        editChild(parentElement, "", { verbId, childIndex });
    });
    parentElement.appendChild(addChildButton);
}

function editVerb(element, elementText, id) {
    const parentElement = element.parentElement;
    parentElement.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = elementText;
    parentElement.appendChild(input);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        if (id === null) {
            addVerb(input.value);
        } else {
            updateVerb(id, input.value);
        }
        displayItems(); // Re-render everything after saving
    });
    parentElement.appendChild(saveButton);
}

function editChild(parentElement, elementText, id) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = elementText;
    parentElement.insertBefore(input, parentElement.lastChild);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        updateChild(id.verbId, id.childIndex, input.value);
        displayItems(); // Re-render everything after saving
    });
    parentElement.insertBefore(saveButton, parentElement.lastChild);
}

function editElement(element, elementText, id, isVerb) {
    const parentElement = element.parentElement;
    parentElement.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = elementText;
    parentElement.appendChild(input);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        if (isVerb && id === null) {
            addVerb(input.value);
        } else {
            updateElement(input, id, isVerb);
        }
        displayItems(); // Re-render everything after saving
    });
    parentElement.appendChild(saveButton);
}

function updateElement(input, id, isVerb) {
    const newValue = input.value;
    if (isVerb) {
        updateVerb(id, newValue);
    } else {
        updateChild(id.itemIndex, id.childIndex, newValue);
    }
}

function updateVerb(id, newValue) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemIndex = items.findIndex(item => item.id === id);
    items[itemIndex].item = newValue;
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function updateChild(childId, newValue) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    for (const item of items) {
        const childIndex = item.children.findIndex(child => child.id === childId);
        if (childIndex !== -1) {
            item.children[childIndex].text = newValue;
            break;
        }
    }
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function deleteElement(id, isVerb) {
    if (isVerb) {
        deleteVerb(id);
    } else {
        const items = JSON.parse(localStorage.getItem("items")) || [];
        let verbIndex, childIndex;
        for (let i = 0; i < items.length; i++) {
            const idx = items[i].children.findIndex(child => child.id === id);
            if (idx !== -1) {
                verbIndex = i;
                childIndex = idx;
                break;
            }
        }
        deleteChild(verbIndex, childIndex);
    }
}

function deleteVerb(index) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function deleteChild(verbIndex, childIndex) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[verbIndex].children.splice(childIndex, 1);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}


function saveButtonHandler(childElement, childInput, verbIndex, childIndex) {
    const newChild = childInput.value;
    updateChild(verbIndex, childIndex, newChild);
    renderChildren(childElement.parentElement, verbIndex);
}

function addChild(verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemIndex = items.findIndex(item => item.id === verbId);
    const childId = Date.now() + Math.random();
    items[itemIndex].children.push({ id: childId, text: "" });
    localStorage.setItem("items", JSON.stringify(items));
    return childId;
}

function addObject(verbIndex, object) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[verbIndex].children.push(object);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function deleteItem(verbIndex, childIndex) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[verbIndex].children.splice(childIndex, 1);
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

document.getElementById("add-verb").addEventListener("click", () => {
    const newRow = document.createElement("tr");

    const verbCell = document.createElement("td");
    newRow.appendChild(verbCell);

    const objectCell = document.createElement("td");
    newRow.appendChild(objectCell);

    itemsList.appendChild(newRow);

    editVerb(verbCell, "", null);
});

function addVerb(verb) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const verbId = Date.now(); // Use a timestamp as a unique identifier
    items.push({ id: verbId, item: verb, children: [] });
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
    return verbId;
}

// Initial display of items
displayItems();