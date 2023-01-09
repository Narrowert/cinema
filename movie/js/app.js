const API_KEY = "aba0a512-17c7-44b2-a965-6e841f07ccaf";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword="

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
            ${
                movie.rating &&
                `
                <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
                `
            }
            
        </div>
        `;
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