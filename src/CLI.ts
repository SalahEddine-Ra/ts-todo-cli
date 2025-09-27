import { Command } from 'commander';
import * as todoLogic from './todos';
import { cyan, green, red, bold } from 'colorette';
import { Console } from 'console';

const program = new Command();

program
    .name('todo')
    .description('Simple todo CLI (data stored in ./data/todos.json)')
    .version('0.1.0');


// display the list of the todos
program 
    .command('list')
    .description('List all todos')
    .action(async () => {
        try{
            const allTodos = todoLogic.listTodos();
            if ((await allTodos).length === 0) {
                console.log(cyan('No todos found!'));
            }
            for (const todo of await allTodos) {
                const mark = todo.completed? green('[x]') : red('[ ]');
                console.log(`${mark} ${bold(String(todo.id))}: ${todo.text}`);
            }
        }catch(error){
            console.error(`Eroor listing todos : ${error}`);
        }
});


// Add a todo to the list
program 
    .command('add <text...>')
    .description('Add a todo (text can be multiple words)')
    .action(async (textParts: string[]) => {
        try {
            const text = textParts.join(' ');
            const todos = await todoLogic.addTodos(text);
            for (const td of todos) {
                console.log(green(`Added: ${td.id}: ${td.text}`));
            }
        } catch (error) {
            console.error(red(`Error adding todo: ${error}`));
        }
    });


// toggle todo
program
    .command('toggle <id>')
    .description('Toggle completed state by id')
    .action(async (idStr: string) =>{
        try{
            const id = Number(idStr);
            if (Number.isNaN(id)){
                console.error(red('Invalid id!'));
                return;
            }
            const res = await todoLogic.toggleTodo(id);
            if (!res || res.length === 0){
                console.error(red('Todo not found!'))
            }else{
                for (const todo of res) {
                    console.log(green(`${todo.id} -> completed: ${todo.completed}`));
                }
            }
    }catch (error) {
      console.error(red('Error toggling todo:'), error);
    }
});


// remove todo
program 
    .command('remove <id>')
    .description('Remove a todo by id')
    .action(async(idStr: string) =>{
        try{
            const id = Number(idStr);
            if (Number.isNaN(id)){console.error(red('Invalid Id!'))};
            const removed = await todoLogic.removeTodo(id);
            console.log(removed? green('Todo has been removed'): red('Todo not Found!'));
        }catch(error){
            console.error(red(`Error removing todo : ${error}`))
        }
});

// editing todo
program
    .command('edit <id> <newText...>')
    .description('Edit a todo by id')
    .action(async(idStr: string, text: string[]) =>{
        try{
            const id = Number(idStr);
            const newText = text.join(' ');
            if (Number.isNaN(id)){console.error('Invalid Id!')};
            const edited = await todoLogic.editTodo(id, newText);
            console.log(edited? green('Todo has been edited!'): red('Todo not found!'));
        }catch(error){
            console.error(red(`Error editing todo : ${error}`))
        } 
    })

// clear all todos
program
    .command('clear')
    .description('Clear all todos')
    .action(async() =>{
        try{
            const todos = await todoLogic.listTodos();
            if (todos.length === 0){
                console.log(cyan('No todos to clear!'));
                return;
            }else{
                todoLogic.clearTodos();
                console.log(green('All todos have been cleared!'));
            }
        }catch(error){
            console.error(red(`Error clearing todos : ${error}`))
        }
    });

// run the program with the given args
program.parseAsync(process.argv).catch(err => {
  console.error(err);
  process.exit(1);
});