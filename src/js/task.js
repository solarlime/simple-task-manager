/* eslint-disable class-methods-use-this */
export default class Task {
  /**
   * Определяем ключевые переменные.
   * @param id - id задачи
   * @param name - имя задачи
   * @param isPinned - состояние задачи (закреплена|не закреплена)
   */
  constructor(id, name, isPinned) {
    this.id = id;
    this.name = name;
    this.isPinned = isPinned;
    this.pinned = document.querySelector('ul.pinned');
    this.notPinned = document.querySelector('ul.not-pinned');
  }

  /**
   * Метод отрисовки новой задачи
   */
  render() {
    const item = document.createElement('li');
    item.setAttribute('class', 'item item-style');
    item.setAttribute('id', `${this.id}`);
    item.innerText = `${this.name}`;
    item.innerHTML += '<div class="buttons">\n'
      + '  <div class="pushpin" alt="Pin item">+</div>\n'
      + '  <div class="remove" alt="Remove item">×</div>\n'
      + '</div>\n';
    if (this.isPinned) {
      item.querySelector('div.remove').classList.add('hide');
      item.querySelector('div.pushpin').innerText = '–';
      item.querySelector('div.pushpin').setAttribute('alt', 'Unpin item');
      this.pinned.appendChild(item);
    } else {
      this.notPinned.appendChild(item);
    }
  }

  /**
   * Метод возвращает объект с данными задачи
   * @returns {{isPinned: boolean, name: string, id: string}}
   */
  getInfoBack() {
    return { id: this.id, name: this.name, isPinned: this.isPinned };
  }
}
