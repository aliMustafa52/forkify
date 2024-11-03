import View from './View';
import PreviewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = "We couldn't find a recipe with this name try another one";
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';
}

export default new ResultsView();
