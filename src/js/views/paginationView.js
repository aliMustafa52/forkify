import View from './View';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(+btn.dataset.page);
    });
  }
  _generateMarkup() {
    const searchObject = this._data;
    const numOfPages = Math.ceil(
      searchObject.results.length / searchObject.resultsPerPage
    );
    // first page and there're other pages
    if (searchObject.pageNumber === 1 && numOfPages > 1) {
      return `
          <button class="btn--inline pagination__btn--next" data-page=${
            searchObject.pageNumber + 1
          }>
            <span>page ${searchObject.pageNumber + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
    // first page and there're no other pages
    else if (searchObject.pageNumber === 1 && numOfPages === 1) {
      return '';
    }
    // last page
    else if (searchObject.pageNumber === numOfPages) {
      return `
        <button class="btn--inline pagination__btn--prev" data-page=${
          searchObject.pageNumber - 1
        }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${searchObject.pageNumber - 1}</span>
          </button>
        `;
    }
    //normal page
    else {
      return `
          <button class="btn--inline pagination__btn--next" data-page=${
            searchObject.pageNumber + 1
          }>
            <span>page ${searchObject.pageNumber + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
           <button class="btn--inline pagination__btn--prev" data-page=${
             searchObject.pageNumber - 1
           }>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${searchObject.pageNumber - 1}</span>
          </button>
        `;
    }
  }
}

export default new PaginationView();
