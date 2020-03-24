/* eslint-disable class-methods-use-this */
export default class Task {
  constructor(id, name, isPinned) {
    this.id = id;
    this.name = name;
    this.isPinned = isPinned;
    this.pinned = document.querySelector('ul.pinned');
    this.notPinned = document.querySelector('ul.not-pinned');
    this.render();
  }

  render() {
    const item = document.createElement('li');
    item.setAttribute('class', 'item item-style');
    item.setAttribute('id', `${this.id}`);
    item.innerText = `${this.name}`;
    item.innerHTML += '<div class="buttons">\n'
      + '  <div class="pushpin">&#128204;</div>\n'
      + '  <div class="remove">\u2716</div>\n'
      + '</div>\n';
    if (this.isPinned) {
      item.querySelector('div.remove').classList.add('hide');
      this.pinned.appendChild(item);
    } else {
      this.notPinned.appendChild(item);
    }
  }

  add(data) {
    data.push({
      id: this.id,
      name: this.name,
      isPinned: this.isPinned,
    });
    localStorage.setItem('tasks', JSON.stringify(data));
  }
}
