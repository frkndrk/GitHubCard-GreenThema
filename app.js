const API_URL = "https://api.github.com/users/"

const form = document.getElementById("form")
const search = document.getElementById("search")
const main = document.querySelector(".main")

async function getUser(username) {
    try {
        const { data } = await axios(API_URL + username)
        createUserCard(data)
        getRepos(username)
    } catch (error) {
        if(error.response.status == 404) {
            createError("Sorry! There is no such person. :(")
        }
       
    }
}

form.addEventListener("submit", (e)=> {
    e.preventDefault()

    const searchValue = search.value
    if(searchValue)  {
        getUser(searchValue)

        search.value = ""
    }
})

function createError(msg) {
    const cardHtml = `
        <div class="user-card">
            <h2>${msg}</h2>
        </div>
    `
    main.innerHTML = cardHtml
}

function createUserCard(user) {
    const userName = user.name || user.login
    const userBio = user.bio ? `${user.bio}` : ''

    const cardHtml = `
    <div class="user-card">
        <img 
            src="${user.avatar_url}" 
            alt="${user.name}"
        />
        <h2>${userName}</h2>
        <small>@${user.login}</small>
        <div class="user-info">
            <p>
                ${userBio}
            </p>
            <ul>
                <li>
                    <i class="fa-solid fa-user-group"></i> ${user.followers} <strong>Followers</strong>
                </li>
                <li>
                    ${user.following} <strong>Following</strong>
                </li>
                <li>
                    <i class="fa-solid fa-bookmark"></i> ${user.public_repos} <strong>Repositories</strong>
                </li>
            </ul>
            <div class="repos" id="repos">
            </div>
        </div>
    </div>
    `

    main.innerHTML = cardHtml
}

async function getRepos(username) {
    try {
        const { data } = await axios(API_URL + username + "/repos")
        createRepos(data)
    } catch (error) {
        createError("Sorry! The repository couldn't find. :(")
    }
} 

function createRepos(repo) {
    const reposEl = document.getElementById("repos")

    repo.slice(0,3).forEach((repos) => {
        const reposLink = document.createElement("a")
        reposLink.href = repos.html_url
        reposLink.target = "_blank"
        reposLink.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${repos.name}`

        reposEl.appendChild(reposLink)
    })
}