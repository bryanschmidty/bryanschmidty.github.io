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
    elementWrapper.style.display = "flex"; // Add display flex to keep elements on the same line

    const element = document.createElement("div");
    element.classList.add("element"); // Add a CSS class to the element div

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
    itemData.children.forEach((child) => {
        renderElement(parentElement, child.text, child.id, false);
    });

    const addChildButton = document.createElement("button");
    addChildButton.textContent = "Add Child";
    addChildButton.addEventListener("click", () => {
        const childId = addChild(verbId);
        editElement(parentElement, "", childId, false);
    });
    parentElement.appendChild(addChildButton);
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

function updateElement(input, index, id, isVerb) {
    const newValue = input.value;
    if (isVerb) {
        updateVerb(id, newValue);
    } else {
        updateChild(id, newValue);
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

function deleteElement(index, isVerb) {
    if (isVerb) {
        deleteVerb(index);
    } else {
        deleteChild(index);
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

function renderChild(parentElement, child, verbIndex, childIndex) {
    const childWrapper = document.createElement("div");
    childWrapper.style.display = "flex"; // Add display flex to keep elements on the same line

    const childElement = document.createElement("div");
    childElement.classList.add("child-element"); // Add a CSS class to the childElement div

    const childText = document.createElement("span");
    childText.textContent = child;
    childElement.appendChild(childText);

    childWrapper.appendChild(childElement);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        editChild(childElement, child, verbIndex, childIndex);
    });
    childWrapper.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteChild(verbIndex, childIndex);
    });
    childWrapper.appendChild(deleteButton);

    parentElement.appendChild(childWrapper);
}

function editChild(childElement, child, verbIndex, childIndex) {
    childElement.innerHTML = "";

    const childInput = document.createElement("input");
    childInput.type = "text";
    childInput.value = child;
    childElement.appendChild(childInput);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        saveButtonHandler(childElement, childInput, verbIndex, childIndex);
    });
    childElement.appendChild(saveButton);
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

function editItem(verbIndex, childIndex) {
    // Implement the edit functionality
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

    editElement(verbCell, "", null, true);
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