import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './use-cases';


const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel:'#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos)
        updatePendingCount();
    }
    
    const updatePendingCount = () =>{
        renderPending(ElementIDs.PendingCountLabel);
    }
    //Cuando la funcion App se llama    
    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app)
        displayTodos()
    })();

    //Referencias HTML
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const TodoListUL = document.querySelector(ElementIDs.TodoList);
    const clearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
    const filtersLIS = document.querySelectorAll(ElementIDs.TodoFilters);

    //listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13 ) return;
        if(event.target.value.trim().lenght === 0 ) return;

        //agregar un todo
        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    TodoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    TodoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy'
        const element = event.target.closest('[data-id]')
        
        if(!element || !isDestroyElement) return;

        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    });

    clearCompletedButton.addEventListener('click', (event) => {
        todoStore.deleteCompleted();
        displayTodos();
    })

    filtersLIS.forEach(element => {
        element.addEventListener('click', (element)=> {
            filtersLIS.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected')
            switch (element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;
                default:
                    throw new Error(`Unkown element`)
            }
            displayTodos();
        })
    })
}