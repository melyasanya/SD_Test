const addButton = document.querySelector(".formBtn");
const inputField = document.querySelector('input[type="text"]');
const listBox = document.querySelector(".listbox");
const deleteButton = document.querySelector(".deleteBtn");
const sortByNameButton = document.querySelector(".nameSortBtn");
const sortByValueButton = document.querySelector(".valueSortBtn");
const xmlButton = document.querySelector(".xmlBtn");

// Helpers function

function saveToLocalStorage() {
  const items = Array.from(listBox.querySelectorAll(".listbox > div"));
  const serializedItems = items.map((item) => item.innerHTML);
  localStorage.setItem("listItems", JSON.stringify(serializedItems));
}

function loadFromLocalStorage() {
  const serializedItems = localStorage.getItem("listItems");
  if (serializedItems) {
    const items = JSON.parse(serializedItems);
    items.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.classList.add("listEl");
      listItem.innerHTML = item;
      listBox.appendChild(listItem);
    });
  }
}

function validateInput(input) {
  const regex = /^[a-zA-Z0-9]+\s*=\s*[a-zA-Z0-9]+$/;

  return regex.test(input);
}

// Event handlers

const handleSubmit = (e) => {
  e.preventDefault();
  const inputValue = inputField.value.trim();

  if (validateInput(inputValue)) {
    const [name, value] = inputValue.split("=").map((part) => part.trim());
    const listItem = document.createElement("div");
    listItem.classList.add("listEl");
    listItem.innerHTML = `
    <input type="checkbox" class="deleteCheckbox">
    <span>${name}=${value}</span>
`;
    listBox.appendChild(listItem);

    saveToLocalStorage();

    inputField.value = "";
  } else {
    alert("Invalid input format. Please enter in the format: <name> = <value>");
  }
};

const handleDelete = () => {
  const selectedItems = document.querySelectorAll(".deleteCheckbox:checked");

  selectedItems.forEach((item) => {
    item.parentElement.remove();
  });

  saveToLocalStorage();
};

const handleSortByName = () => {
  const items = Array.from(listBox.querySelectorAll(".listbox > div"));
  const sortedItems = items.sort((a, b) => {
    const nameA = a.textContent.split("=")[0].trim();
    const nameB = b.textContent.split("=")[0].trim();
    return nameA.localeCompare(nameB);
  });
  listBox.innerHTML = "";
  sortedItems.forEach((item) => listBox.appendChild(item));

  saveToLocalStorage();
};

const handleSortByValue = () => {
  const items = Array.from(listBox.querySelectorAll(".listbox > div"));
  const sortedItems = items.sort((a, b) => {
    const valueA = a.textContent.split("=")[1].trim();
    const valueB = b.textContent.split("=")[1].trim();
    return valueA.localeCompare(valueB);
  });

  listBox.innerHTML = "";
  sortedItems.forEach((item) => listBox.appendChild(item));

  saveToLocalStorage();
};

const handleXml = () => {
  const xmlDoc = document.implementation.createDocument(null, "data");

  const listItems = document.querySelectorAll(".listbox > div");

  listItems.forEach((item) => {
    const nameValue = item.textContent.split("=");
    const name = nameValue[0].trim();
    const value = nameValue[1].trim();

    const xmlItem = xmlDoc.createElement("item");
    const xmlName = xmlDoc.createElement("name");
    const xmlValue = xmlDoc.createElement("value");

    xmlName.textContent = name;
    xmlValue.textContent = value;

    xmlItem.appendChild(xmlName);
    xmlItem.appendChild(xmlValue);
    xmlDoc.documentElement.appendChild(xmlItem);
  });

  const xmlString = new XMLSerializer().serializeToString(xmlDoc);

  alert(xmlString);
};

// Event listeners

addButton.addEventListener("click", handleSubmit);
deleteButton.addEventListener("click", handleDelete);
sortByNameButton.addEventListener("click", handleSortByName);
sortByValueButton.addEventListener("click", handleSortByValue);
xmlButton.addEventListener("click", handleXml);

loadFromLocalStorage();
