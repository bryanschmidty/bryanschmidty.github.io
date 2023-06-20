// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("config-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

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
        renderElement(verbCell, verb.name, verb.id, true);
        row.appendChild(verbCell);

        const objectCell = document.createElement("td");
        objectCell.style.verticalAlign = "top";
        renderChildren(objectCell, verb.id);
        row.appendChild(objectCell);

        itemsList.appendChild(row);
    });
}

function renderElement(parentElement, elementText, id, isVerb) {
    const elementWrapper = document.createElement("div");
    elementWrapper.classList.add("element-wrapper");

    const element = document.createElement("div");
    element.classList.add("element");

    if (elementText === undefined) {
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
        text.textContent = elementText;
        element.appendChild(text);
        elementWrapper.appendChild(element);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            editChild(element, elementText, id);
        });
        elementWrapper.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteElement(id, isVerb);
        });
        elementWrapper.appendChild(deleteButton);

    }
    parentElement.appendChild(elementWrapper);
}

function renderChildren(parentElement, verbId) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const children = items.filter(item => item.parentId == verbId);
    console.log(verbId, children)

    parentElement.innerHTML = "";
    children.forEach(child => {
        console.log(child)
        renderElement(parentElement, child.name, child.id, false);
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

function deleteElement(id, isVerb) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        localStorage.setItem("items", JSON.stringify(items));
    }
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