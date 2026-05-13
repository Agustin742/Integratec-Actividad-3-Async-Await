const URL = "https://jsonplaceholder.typicode.com/";
const USERS_ENDPOINT = "users";
const POST_ENDPOINT = "posts";
const $userList = document.querySelector("#userList");
const $timeInput = document.querySelector("#timeInput");
const $waitMessage = document.querySelector("#waitMessage");
const $searchButton = document.querySelector("#searchButton");
const $getPostsBtn = document.querySelector("#getPostsBtn");
const $postsList = document.querySelector("#postsList");
const $getUsersAndPostsBtn = document.querySelector("#getUsersAndPostsBtn");
const $usersAndPostsList = document.querySelector("#usersAndPostsList");
const $createPostForm = document.querySelector("#createPostForm");
const $createdPostTitle = document.querySelector("#createdPostTitle");
const $createdPostBody = document.querySelector("#createdPostBody");

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

async function getPostsById(userId) {
    try {
        const response = await fetch(`${URL}${POST_ENDPOINT}?userId=${userId}`);
        const data = await response.json();
        return data.slice(0, 5);
    } catch (error) {
        console.error(error);
    }
}

async function getFivePosts() {
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

async function createPost(postData) {
    try {
        const response = await fetch(`${URL}${POST_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
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

function generateUserAndPostHTML({ name, email, titles }) {
    const $listItem = document.createElement("li");
    const $userHeading2 = document.createElement("h2");
    const $userSpan = document.createElement("span");
    

    $userSpan.innerText = email;
    $userHeading2.innerText = name;

    $listItem.appendChild($userHeading2);
    $listItem.appendChild($userSpan);

    titles.forEach((title) => {
        const $postHeading4 = document.createElement("h4");
        $postHeading4.innerText = title;
        $listItem.appendChild($postHeading4);
    });
    
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
    const posts = await getFivePosts();
    $postsList.innerHTML = "";

    posts.forEach((post) => {
        const $postListElement = generatePostHTML({ title: post.title });

        $postsList.appendChild($postListElement);
    });
}

async function renderUsersAndPosts(event) {
    const users = await getUsers();
    $usersAndPostsList.innerHTML = ""; 
    for (const user of users) {
        const posts = await getPostsById(user.id);
        const titles = posts.map((post) => post.title);
        const $userAndPostListElement = generateUserAndPostHTML({ name: user.name, email: user.email, titles });
        $usersAndPostsList.appendChild($userAndPostListElement);
    }
}

$searchButton.addEventListener("click", renderUsers);

$getPostsBtn.addEventListener("click", renderPosts);

$getUsersAndPostsBtn.addEventListener("click", renderUsersAndPosts);

$createPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData($createPostForm);
    const postData = {
        title: formData.get("title"),
        body: formData.get("body")
    };

    const createdPost = await createPost(postData);

    if (!createdPost) {
        console.error("Failed to create post");
        return;
    }

    $createdPostTitle.textContent = `Created post with title: ${createdPost.title}`;
    $createdPostBody.textContent = `Created post with body: ${createdPost.body}`;
});