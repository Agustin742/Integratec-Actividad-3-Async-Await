const URL = "https://jsonplaceholder.typicode.com/users";
const $userList = document.querySelector("#userList");
const $timeInput = document.querySelector("#timeInput");
const $waitMessage = document.querySelector("#waitMessage");
const $searchButton = document.querySelector("#searchButton");

async function getUsersWithTime(time) {
    const parsedTime = Number(time);

    if (isNaN(parsedTime)) {
        $waitMessage.textContent = "Please enter a valid number";
        return;
    }

    $waitMessage.textContent = `Waiting for ${parsedTime} seconds...`;

    await new Promise((resolve) => {
        setTimeout(resolve, parsedTime * 1000);
    });

    const users = await getUsers();

    $waitMessage.textContent = "";

    return users;
}


// Devuelve un List Item con el email y el nombre
function generateUserHTML({ email, name }) {
    const $listItem = document.createElement("li");
    const $userHeading2 = document.createElement("h2");
    const $userSpan = document.createElement("span");

    $userSpan.innerText = email;
    $userHeading2.innerText = name;

    $listItem.appendChild($userHeading2);
    $listItem.appendChild($userSpan);

    return $listItem;
}

// Devuelve Usuarios [{}, {}]
async function getUsers() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Function de filtro de usuarios
function filterUsers(query, users) {
    return users.filter((user) => user.name.includes(query));
}

// Renderiza todos los usuarios
async function renderUsers(event) {
    const users = await getUsersWithTime($timeInput.value);
    $userList.innerHTML = "";

    users.forEach((user) => {
        const { name, email } = user;
        const $userListElement = generateUserHTML({ name, email });

        $userList.appendChild($userListElement);
    });
}


$searchButton.addEventListener("click", renderUsers);