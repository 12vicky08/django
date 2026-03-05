// =============================================
//  Todo Desktop — Renderer Process
//  Handles all CRUD operations with localStorage
// =============================================

const STORAGE_KEY = 'todo-desktop-data';

// State
let todos = [];
let activeFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const statsBadge = document.getElementById('stats-badge');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');

// ---- Persistence ----

function loadTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    todos = data ? JSON.parse(data) : [];
  } catch {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ---- CRUD Operations ----

function addTodo(title) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const todo = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    title: trimmed,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(todo);
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      todos = todos.filter(t => t.id !== id);
      saveTodos();
      render();
    }, 300);
  } else {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
  }
}

function clearCompleted() {
  const completedItems = document.querySelectorAll('.todo-item.completed');
  completedItems.forEach(item => item.classList.add('removing'));

  setTimeout(() => {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
  }, 300);
}

// ---- Filtering ----

function getFilteredTodos() {
  switch (activeFilter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
}

// ---- Rendering ----

function createTodoElement(todo, index) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}`;
  li.dataset.id = todo.id;
  li.style.animationDelay = `${index * 40}ms`;

  li.innerHTML = `
    <label class="todo-checkbox">
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="checkmark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
    </label>
    <span class="todo-text">${escapeHtml(todo.title)}</span>
    <span class="todo-time">${formatTime(todo.createdAt)}</span>
    <button class="delete-btn" title="Delete">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  // Events
  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => toggleTodo(todo.id));

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  return li;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const filtered = getFilteredTodos();
  const activeCount = todos.filter(t => !t.completed).length;
  const totalCount = todos.length;
  const completedCount = totalCount - activeCount;

  // Clear list
  todoList.innerHTML = '';

  // Render items
  filtered.forEach((todo, i) => {
    todoList.appendChild(createTodoElement(todo, i));
  });

  // Empty state
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    if (activeFilter === 'all') {
      emptyState.querySelector('.empty-title').textContent = 'No tasks yet';
      emptyState.querySelector('.empty-subtitle').textContent = 'Add your first todo to get started';
    } else if (activeFilter === 'active') {
      emptyState.querySelector('.empty-title').textContent = 'All done!';
      emptyState.querySelector('.empty-subtitle').textContent = 'No active tasks remaining';
    } else {
      emptyState.querySelector('.empty-title').textContent = 'Nothing completed';
      emptyState.querySelector('.empty-subtitle').textContent = 'Complete some tasks to see them here';
    }
  } else {
    emptyState.classList.add('hidden');
  }

  // Stats
  statsBadge.textContent = `${totalCount} task${totalCount !== 1 ? 's' : ''}`;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

  // Clear completed button visibility
  clearCompletedBtn.style.visibility = completedCount > 0 ? 'visible' : 'hidden';
}

// ---- Event Listeners ----

// Add todo
addBtn.addEventListener('click', () => {
  addTodo(todoInput.value);
  todoInput.value = '';
  todoInput.focus();
});

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodo(todoInput.value);
    todoInput.value = '';
  }
});

// Filter tabs
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearCompletedBtn.addEventListener('click', clearCompleted);

// ---- Initialize ----

loadTodos();
render();
