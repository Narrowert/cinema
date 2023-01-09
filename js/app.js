const API_KEY = "aba0a512-17c7-44b2-a965-6e841f07ccaf";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="
const API_URL_FILM_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovies(API_URL_POPULAR);

async function getMovies(url){
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        }
    })
    const respData = await resp.json();

    showMovies(respData);
}

function getClassByRate(vote){
    if (vote >= 7) {
        return "green";
    } else if (vote > 5) {
        return "orange";
    } else {
        return "red";
    }
}

function showMovies(data){
    const moviesEl = document.querySelector(".movies");

    //очистка предыдущих
    document.querySelector(".movies").innerHTML = "";

    data.films.forEach(movie => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
            <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}" class="movie__cover">
            <div class="movie__cover--dark"></div>
        </div>
        <div class="movie__info">
            <p class="movie__title">${movie.nameRu}</p>
            <div class="movie__category">${movie.genres.map(
                (genre) => ` ${(genre.genre)}`
            )}</div>
            ${movie.rating != null ? `<div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>` : ''}    
        </div>
        `;
        movieEl.addEventListener("click", ()=> openModal(movie.filmId));
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector("form");
const search = document.querySelector(".input__search");

form.addEventListener("submit", (e)=> {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);

        search.value = "";
    }
})

// Modal 
const modalEl = document.querySelector(".modal");

async function openModal(id){
    const resp = await fetch(API_URL_FILM_MOVIE_DETAILS + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        }
    });
    const respData = await resp.json();

    modalEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");

    modalEl.innerHTML = `
        <div class="modal__card">
            <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
            <h2>
                <span class="modal__movie-title">${respData.nameRu}</span>
                <span class="modal__movie-release-year">Год - ${respData.year}</span>
            </h2>
            <ul class="modal__movie-info">
                <div class="loader"></div>
                <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
                ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
                <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
                <li class="modal__movie-overview">Описание: ${respData.description}</li>
            </ul>
            <button type="button" class="modal__button-close">Закрыть</button>
        </div>
    `

    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => closeModal())
}

function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl){
        closeModal();
    }
})

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 27){
        closeModal();
    }
})