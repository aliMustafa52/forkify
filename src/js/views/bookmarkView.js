import PreviewView from './previewView.js';
class BookmarkView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';

  addHanlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
