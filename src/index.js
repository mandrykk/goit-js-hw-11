import './sass/main.scss';
import { Notify } from 'notiflix';
import searchImages from './js/apiSettings.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let searchQuery = '';
let totalHits;

searchForm.addEventListener('submit', onFormSubmit);

loadMoreButton.addEventListener('click', () => {
    searchImages(searchQuery, page).then(res => {
        renderGallery(res);

        isEndOfImg(page, totalHits);
        page += 1;
    })
});

loadMoreButton.classList.add('is-hidden');

function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value;
  loadMoreButton.classList.add('is-hidden');
  gallery.innerHTML = '';
  page = 1;

  event.target.reset();
  searchImages(searchQuery, page).then(res => {
    const imgArray = res.data.hits;
    totalHits = res.data.totalHits;

    if (imgArray.length === 0) {
      loadMoreButton.classList.add('is-hidden');
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderGallery(res);
    loadMoreButton.classList.remove('is-hidden');
    isEndOfImg(page, totalHits);
    page += 1;
  });
}

function isEndOfImg(page, totalHits) {
  if (page * 40 >= totalHits) {
    loadMoreButton.classList.add('is-hidden');
    Notify.success("We're sorry, but you've reached the end of search results.");
  }
}

function renderGallery(images) {
  const imgArray = images.data.hits;
  const elementsMarkup = imgArray
    .map(
      ({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
             <a class="gallery__item" href="${largeImageURL}">
             <img src="${webformatURL}" alt="${tags}" loading="lazy" width="350" height="225"/></a>
             <div class="info">
              <p class="info-item">
                  <b>Likes</br><span class='info-text'>${likes}</span></b>
              </p>
              <p class="info-item">
                 <b>Views</br><span class='info-text'>${views}</span></b>
              </p>
              <p class="info-item">
                 <b>Comments</br><span class='info-text'>${comments}</span></b>
              </p>
              <p class="info-item">
                 <b>Downloads</br><span class='info-text'>${downloads}</span></b>
              </p>
             </div>
         </div>`
    ).join('');
  gallery.insertAdjacentHTML('beforeend', elementsMarkup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
  lightbox.refresh();
}
