import icons from 'url:../../img/icons.svg'; // in Parcel 2 this is the syntax for all static assets (media)
import previewView from './previewView.js';
import View from './View.js';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet, find a delicious recipe and bookmark it.';
  _successMessage = 'This is a bookmark success!';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //I cannot just call the _generateMarkup f() because I need the data, which is passed in via render()
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
