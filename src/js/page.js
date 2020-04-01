/* eslint-disable class-methods-use-this */
import * as id from 'uniqid';
import Task from './task';

/**
 * Простое приложение для управления задачами.
 * Задачи можно добавлять, удалять, закреплять.
 * Реализован поиск задач по списку незакреплённых.
 * Хранение осуществляется в localStorage
 */
export default class App {
  /**
   * Начальная точка работы приложения.
   * Определяем ключевые переменные.
   */
  constructor() {
    this.form = document.getElementById('form');
    this.input = document.getElementById('input');
    this.noPinned = document.querySelector('.no-pinned-tasks');
    this.noTasks = document.querySelector('.no-tasks');
    this.pinned = document.querySelector('ul.pinned');
    this.notPinned = document.querySelector('ul.not-pinned');
    this.init();
  }

  /**
   * Иниццализируем массив задач. Обновляем
   * страницу для последующей отрисовки.
   * Добавляем обработчики событий
   */
  init() {
    this.tasks = this.fetch();
    this.update();
    this.input.addEventListener('input', this.listenInput.bind(this));
    this.input.addEventListener('keydown', this.listenInputEnter.bind(this));
    this.notPinned.addEventListener('click', this.listen.bind(this, 'remove', this.notPinned));
    this.notPinned.addEventListener('click', this.listen.bind(this, 'pushpin', this.notPinned));
    this.pinned.addEventListener('click', this.listen.bind(this, 'pushpin', this.pinned));
  }

  /**
   * Получаем список задач, хранящийся в виде массива объектов
   * в localStorage (в виде строки). В случае, если localStorage
   * пуст, возвращаем пустой массив
   * @returns {[]}
   */
  fetch() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      return tasks;
    }
    return [];
  }

  /**
   * Обработчик события на ввод строки поиска. При каждом изменении идёт
   * проверка на наличие среди незакреплённых задач. В случае отсутствия
   * совпадений появляется модальное окно с соответствующим сообщением
   * @param event
   */
  listenInput(event) {
    document.querySelector('div.modal-1').classList.add('hide');
    Array.from(this.notPinned.children)
      .filter((item) => {
        if (item.innerText.toLowerCase().includes(event.target.value.toLowerCase())) {
          item.classList.remove('hide');
        }
        return !item.innerText.toLowerCase().includes(event.target.value.toLowerCase());
      }).forEach((item) => item.classList.add('hide'));
    if ((Array.from(this.notPinned.children).length === Array.from(this.notPinned.querySelectorAll('li.hide')).length) && (event.target.value)) {
      document.querySelector('div.modal-1').classList.remove('hide');
    }
  }

  /**
   * Обработчик события на добавление новой задачи. Строка очищается
   * от лишних пробелов. Создаётся и добавляется новая задача. В случае,
   * если строка после очистки пуста, появляется модальное окно
   * с соответствующим сообщением
   * @param event
   */
  listenInputEnter(event) {
    document.querySelector('div.modal-2').classList.add('hide');
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.input.value.trim()) {
        // eslint-disable-next-line no-unused-vars
        const newTask = new Task(id(), this.input.value, false);
        this.add(newTask.getInfoBack());
      } else {
        document.querySelector('div.modal-2').classList.remove('hide');
      }
      this.update();
    }
  }

  /**
   * Обработчик события на кнопки действий: удалить задачу,
   * закрепить и открепить задачу. Вызывает соответствующие методы
   * @param action - удалить, закрепить или открепить задачу
   * @param list - целевой список (закреплённые|незакреплённые)
   * @param event
   */
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

  /**
   * Метод добавляет в localStorage новую задачу
   * @param data - Объект вида { id, name, isPinned }
   */
  add(data) {
    this.tasks.push(data);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * Метод удаляет нужную задачу, производя поиск по id задачи
   * @param item - элемент списка незакреплённых задач
   */
  remove(item) {
    this.tasks = this.tasks.filter((sample) => sample.id !== item.id);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * Метод закрепляет и открепляет нужную задачу, производя поиск по isPinned
   * @param item - элемент списка задач
   * @param pinState - состояние задачи (pinned: true|unpinned: false)
   */
  pinUnpin(item, pinState) {
    item.remove();
    this.tasks.find((sample) => sample.id === item.id).isPinned = pinState;
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  /**
   * Метод обновления страницы.
   * Вызывает метод очистки страницы
   * Вызывает метод отрисовки задач из списка.
   */
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
        const newTask = new Task(item.id, item.name, item.isPinned);
        newTask.render();
      });
    }
  }

  /**
   * Метод очистки страницы
   * Устанавливает изначальное состояние для модальных окон и формы.
   */
  clear() {
    this.form.reset();
    this.noPinned.classList.remove('hide');
    this.noTasks.classList.remove('hide');
    document.querySelector('div.modal-1').classList.add('hide');
    Array.from(this.pinned.children).forEach((item) => item.remove());
    Array.from(this.notPinned.children).forEach((item) => item.remove());
  }
}
