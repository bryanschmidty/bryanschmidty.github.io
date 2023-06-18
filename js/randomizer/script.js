const itemsTable = document.getElementById("items-table");
const itemsList = document.getElementById("items-list");

function displayItems() {
    itemsList.innerHTML = "";

    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.forEach((itemData, index) => {
        const row = document.createElement("tr");

        const verbCell = document.createElement("td");
        verbCell.style.verticalAlign = "top";
        renderElement(verbCell, itemData.item, index, true);
        row.appendChild(verbCell);

        const objectCell = document.createElement("td");
        objectCell.style.verticalAlign = "top";
        renderChildren(objectCell, index);
        row.appendChild(objectCell);

        itemsList.appendChild(row);
    });
}

function renderElement(parentElement, elementText, index, isVerb) {
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
        editElement(element, elementText, index, isVerb);
    });
    elementWrapper.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        deleteElement(index, isVerb);
    });
    elementWrapper.appendChild(deleteButton);

    parentElement.appendChild(elementWrapper);
}

function renderChildren(parentElement, verbIndex) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemData = items[verbIndex];

    parentElement.innerHTML = "";
    itemData.children.forEach((child, childIndex) => {
        renderElement(parentElement, child, childIndex, false);
    });

    const addChildButton = document.createElement("button");
    addChildButton.textContent = "Add Child";
    addChildButton.addEventListener("click", () => {
        const childIndex = addChild(verbIndex);
        editElement(parentElement, "", childIndex, false);
    });
    parentElement.appendChild(addChildButton);
}

function editElement(element, elementText, index, isVerb) {
    const parentElement = element.parentElement;
    parentElement.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = elementText;
    parentElement.appendChild(input);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        if (isVerb) {
            updateElement(input, index, null, isVerb);
            renderElement(parentElement, input.value, index, isVerb);
        } else {
            const verbIndex = parentElement.parentElement.parentElement.rowIndex - 1;
            updateElement(input, verbIndex, index, isVerb);
            renderElement(parentElement, input.value, index, isVerb);
        }
    });
    parentElement.appendChild(saveButton);
}

function updateElement(input, index, childIndex, isVerb) {
    const newValue = input.value;
    if (isVerb) {
        updateVerb(index, newValue);
    } else {
        updateChild(index, childIndex, newValue);
    }
}

function updateVerb(index, newValue) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[index].item = newValue;
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

function updateChild(verbIndex, childIndex, newChild) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[verbIndex].children[childIndex] = newChild;
    localStorage.setItem("items", JSON.stringify(items));
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

function addChild(verbIndex) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items[verbIndex].children.push("");
    localStorage.setItem("items", JSON.stringify(items));
    return items[verbIndex].children.length - 1;
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

    editElement(verbCell, "", itemsList.childElementCount - 1, true);
});

function addVerb(verb, children) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.push({ item: verb, children });
    localStorage.setItem("items", JSON.stringify(items));
    displayItems();
}

// Initial display of items
displayItems();