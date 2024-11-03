import View from './View';
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _overlay = document.querySelector('.overlay');
  _formModal = document.querySelector('.add-recipe-window');
  _btnCloseModal = document.querySelector('.btn--close-modal');
  _btnOpenModal = document.querySelector('.nav__btn--add-recipe');

  _errorMessage = 'not valid ingredient format';
  _message = 'Recipe was successfully uploaded✔✔';

  constructor() {
    super();
    this._addHanlerShowWindow();
    this._addHanlerHideWindow();
  }
  _addHanlerShowWindow() {
    this._btnOpenModal.addEventListener('click', () => {
      this._formModal.classList.toggle('hidden');
      this._overlay.classList.toggle('hidden');
    });
  }

  /*
  element.addEventListener('click', function () {
    this ===  element
        }
 element.addEventListener('click', () => {
    this ===  class
        }
  */
  _toggleWindow() {
    this._formModal.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHanlerHideWindow() {
    [this._btnCloseModal, this._overlay].forEach(el =>
      el.addEventListener('click', this._toggleWindow.bind(this))
    );

    // window.addEventListener('click', e => {
    //   if (e.target === this._btnCloseModal || e.target === this._overlay) {
    //     this._formModal.classList.toggle('hidden');
    //     this._overlay.classList.toggle('hidden');
    //   }
    // });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }
}

export default new AddRecipeView();
