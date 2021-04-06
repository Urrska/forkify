import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  // only update the elements that are new
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert the string object containg the elements into a documentFragment
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    // compare the current(currently rendered) elements (from the old DOM) with the new elements from the newDOM
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //update changed text
      if (
        !curEl.isEqualNode(newEl) &&
        // the first child of the element has text value --> check if it exists and if it has value
        curEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // change the atributes as well
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(att =>
          curEl.setAttribute(att.name, att.value)
        );
    });
  }

  renderError(error = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${error}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
