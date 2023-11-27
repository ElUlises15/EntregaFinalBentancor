const baseURL = "https://api.themoviedb.org/3";
const apiKey = "985ce39bd4d17e02184e982f076a96b2"; // Reemplaza "TU_CLAVE_DE_API" con tu clave de API de TMDb
const homeContainer = document.getElementById("home");
const movieContainer = document.getElementById("movieContainer");
const favoritesContainer = document.getElementById("favoritesContainer");
const searchInput = document.getElementById("searchInput");

function getRandomMovieId() {
  return Math.floor(Math.random() * 100000) + 1;
}

async function getMovieData(movieId) {
  try {
    const response = await fetch(
      `${baseURL}/movie/${movieId}?api_key=${apiKey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener datos de la película", error);
  }
}

function createMovieCard(movie, container) {
  if (
    !movie.poster_path ||
    !movie.title ||
    !movie.release_date ||
    !movie.vote_average
  ) {
    return; // Evitar la creación de la tarjeta si falta información esencial
  }

  const card = document.createElement("div");
  card.classList.add("movie-card");

  const imageUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  const releaseDate = `Fecha de lanzamiento: ${movie.release_date}`;
  const voteAverage = `Puntuación: ${movie.vote_average}`;

  card.innerHTML = `
    <img src="${imageUrl}" alt="${movie.title}">
    <h2>${movie.title}</h2>
    <p>${releaseDate}</p>
    <p>${voteAverage}</p>
    <button class="favorite-button">${
      isFavorite(movie) ? "Eliminar de favoritos" : "Agregar a favoritos"
    }</button>
  `;

  const favoriteButton = card.querySelector(".favorite-button");
  favoriteButton.addEventListener("click", () => toggleFavorite(movie));

  container.appendChild(card);
}

function isFavorite(movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((favorite) => favorite.id === movie.id);
}

function toggleFavorite(movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const existingIndex = favorites.findIndex((fav) => fav.id === movie.id);

  if (existingIndex !== -1) {
    const removedMovie = favorites.splice(existingIndex, 1)[0]; // Eliminar la película si ya existe en favoritos
    localStorage.setItem("favorites", JSON.stringify(favorites));
    Swal.fire(`"${removedMovie.title}" eliminada de favoritos`, "", "success");
  } else {
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    Swal.fire(`"${movie.title}" agregada a favoritos`, "", "success");
  }

  loadFavoriteMovieCards();
}

function loadFavoriteMovieCards() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No tienes películas favoritas.</p>";
    return;
  }

  favorites.forEach(async (favorite) => {
    createMovieCard(favorite, favoritesContainer);
  });
}

async function loadMovieCards() {
  let loadedMovies = 0;
  const maxAttempts = 20;

  while (loadedMovies < maxAttempts) {
    const randomMovieId = getRandomMovieId();
    const movie = await getMovieData(randomMovieId);

    if (
      movie &&
      movie.poster_path &&
      movie.title &&
      movie.release_date &&
      movie.vote_average
    ) {
      createMovieCard(movie, homeContainer);
      loadedMovies++;
    }
  }
}

window.addEventListener("load", () => {
  loadMovieCards();
  loadFavoriteMovieCards();
});

async function searchMovie() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  movieContainer.innerHTML = "";

  if (searchTerm === "") {
    return;
  }

  try {
    const response = await fetch(
      `${baseURL}/search/movie?api_key=${apiKey}&query=${searchTerm}`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      data.results.forEach((movie) => {
        if (
          movie.poster_path &&
          movie.title &&
          movie.release_date &&
          movie.vote_average
        ) {
          createMovieCard(movie, movieContainer);
        }
      });
    } else {
      movieContainer.innerHTML =
        "<p>No se encontraron resultados para la película buscada.</p>";
    }
  } catch (error) {
    console.error("Error al obtener datos de la película", error);
    movieContainer.innerHTML = "<p>Error al buscar la película.</p>";
  }
}

searchInput.addEventListener("input", searchMovie);
