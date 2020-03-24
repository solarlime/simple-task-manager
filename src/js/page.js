/* eslint-disable class-methods-use-this */
import * as id from 'uniqid';
import Task from './task';

export default class App {
  constructor() {
    this.form = document.getElementById('form');
    this.input = document.getElementById('input');
    this.noPinned = document.querySelector('.no-pinned-tasks');
    this.noTasks = document.querySelector('.no-tasks');
    this.pinned = document.querySelector('ul.pinned');
    this.notPinned = document.querySelector('ul.not-pinned');
    this.init();
  }

  init() {
    this.form.reset();
    this.tasks = this.fetch();
    this.update();

    this.input.addEventListener('keydown', this.listenInput.bind(this));
    this.notPinned.addEventListener('click', this.listen.bind(this, 'remove', this.notPinned));
    this.notPinned.addEventListener('click', this.listen.bind(this, 'pushpin', this.notPinned));
    this.pinned.addEventListener('click', this.listen.bind(this, 'pushpin', this.pinned));
  }

  fetch() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      return tasks;
    }
    return [];
  }

  listenInput(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newTask = new Task(id(), this.input.value, false);
      newTask.add(this.tasks);
      this.form.reset();
      this.update();
    }
  }

  listen(action, list, event) {
    if (event.target.classList.contains(action)) {
      Array.from(list.children).forEach((item) => {
        if (item.contains(event.target)) {
          // eslint-disable-next-line default-case
          if (action === 'remove') {
            this.remove(item);
          }
          if ((action === 'pushpin') && (list === this.notPinned)) {
            this.pinUnpin(item, true);
          }
          if ((action === 'pushpin') && (list === this.pinned)) {
            this.pinUnpin(item, false);
          }
        }
      });
      this.update();
    }
  }

  remove(item) {
    this.tasks = this.tasks.filter((sample) => sample.id !== item.id);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  pinUnpin(item, pinState) {
    item.remove();
    this.tasks.find((sample) => sample.id === item.id).isPinned = pinState;
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  update() {
    this.clear();
    if (this.tasks) {
      if (this.tasks.find((item) => item.isPinned === true)) {
        this.noPinned.classList.add('hide');
      }
      if (this.tasks.find((item) => item.isPinned === false)) {
        this.noTasks.classList.add('hide');
      }
      this.tasks.forEach((item) => {
        // eslint-disable-next-line no-unused-vars
        const newTask = new Task(item.id, item.name, item.isPinned);
      });
    }
  }

  clear() {
    this.noPinned.classList.remove('hide');
    this.noTasks.classList.remove('hide');
    Array.from(this.pinned.children).forEach((item) => item.remove());
    Array.from(this.notPinned.children).forEach((item) => item.remove());
  }
}
