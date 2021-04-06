import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please, try another one.';
  _successMessage = 'This is a results success!';

  _generateMarkup() {
    //I cannot just call the _generateMarkup f() because I need the data, which is passed in via render()
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
