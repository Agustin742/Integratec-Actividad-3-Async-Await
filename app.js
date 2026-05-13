const URL = "https://jsonplaceholder.typicode.com/";
const USERS_ENDPOINT = "users";
const POST_ENDPOINT = "posts";
const $userList = document.querySelector("#userList");
const $timeInput = document.querySelector("#timeInput");
const $waitMessage = document.querySelector("#waitMessage");
const $searchButton = document.querySelector("#searchButton");
const $getPostsBtn = document.querySelector("#getPostsBtn");
const $postsList = document.querySelector("#postsList");

// Devuelve Usuarios [{}, {}]
async function getUsers() {
    try {
        const response = await fetch(`${URL}${USERS_ENDPOINT}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function getPosts() {
    try {
        const response = await fetch(`${URL}${POST_ENDPOINT}`);
        const data = await response.json();
        return data.slice(0, 5);;
    } catch (error) {
        console.error(error);
    }
}

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

function generatePostHTML({ title }) {
    const $listItem = document.createElement("li");
    const $postHeading2 = document.createElement("h3");

    $postHeading2.innerText = title;

    $listItem.appendChild($postHeading2);

    return $listItem;
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

async function renderPosts(event) {
    const posts = await getPosts();
    $postsList.innerHTML = "";

    posts.forEach((post) => {
        const $postListElement = generatePostHTML({ title: post.title });

        $postsList.appendChild($postListElement);
    });
}
    
$searchButton.addEventListener("click", renderUsers);

$getPostsBtn.addEventListener("click", renderPosts);