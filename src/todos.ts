import { Todo } from './Types';
import { loadTodos, SaveTodos } from './Storage';

// function for the list of todos
export async function listTodos(): Promise<Todo[]> {
    return await loadTodos();
}

// function to add a todo
export async function addTodos(text: string): Promise<Todo[]> {
    const todos: Todo[] = await loadTodos();
    const nextId = todos.reduce((m: number, t: Todo) => Math.max(m, t.id), 0) + 1;
    const newTodo : Todo = {
        id: nextId,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    await SaveTodos(todos);
    return todos;
}

// function to toggle a todo
export async function toggleTodo(id: number): Promise<Todo[] | null> {
    const todos: Todo[] = await loadTodos();
    const todo = todos.find(t => t.id === id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    await SaveTodos(todos);
    return todos;
}

// function to delete a todo
export async function removeTodo(id: number): Promise<Todo[] | boolean> {
    let todos: Todo[] = await loadTodos();
    const idx = todos.findIndex(x => x.id === id);
    if (idx === -1) return false;
    todos.splice(idx,1);
    await SaveTodos(todos);
    return todos;
}

// fnction to edit a todo
export async function editTodo(id: number, newText: string): Promise<Todo | null> {
  const todos = await loadTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;

  todo.text = newText;
  await SaveTodos(todos);
  return todo;
}

// function to clear all todos
export async function clearTodos(): Promise<void>{
    await SaveTodos([]);
}