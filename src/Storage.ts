import { promises as fs } from 'fs';
import path from 'path';
import { Todo } from './Types';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path .join(DATA_DIR, 'todos.json')

// async function ensureDataDir()
async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}


// async funtion loadTodos()
export async function loadTodos(): Promise<Todo[]> {
    try{
         const raw = await fs.readFile(DATA_FILE, 'utf8');
         const parsed = JSON.parse(raw); 
         if (!Array.isArray(parsed))return [];
         return parsed as Todo[];
    } catch (err: any) {
    if (err?.code === 'ENOENT') return [];
    throw err;
  }
}

// async funtion SaveTodos()
export async function SaveTodos(todos: Todo[]): Promise<void> {
  await ensureDataDir();
  const tmp = DATA_FILE + '.tmp'; 
  try{
        await fs.writeFile(tmp, JSON.stringify(todos, null, 2), 'utf8'); //Write to temporary file first
        await fs.rename(tmp, DATA_FILE); // If successful, replace to original file
  }catch (error){
        await fs.unlink(tmp).catch(() => {});// to delet it if somthing happend
        throw error;
  }
}
