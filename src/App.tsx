import { useState, useEffect, useRef } from 'react'
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import { 
    arrayMove, 
    SortableContext, 
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { TodoForm } from './components/TodoForm'
import { SortableTodoItem } from './components/SortableTodoItem'
import { Todo } from './types/Todo'
import './App.css'

function App() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addTodo = (text: string) => {
        setTodos([
            ...todos,
            {
                id: Date.now(),
                text,
                completed: false
            }
        ]);
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const editTodo = (id: number, newText: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: newText } : todo
        ));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            setTodos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4 text-white">Todo List</h1>
                <TodoForm onAdd={addTodo} />
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={todos}
                        strategy={verticalListSortingStrategy}
                    >
                        <ul className="border rounded divide-y bg-white">
                            {todos.map(todo => (
                                <SortableTodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={toggleTodo}
                                    onDelete={deleteTodo}
                                    onEdit={editTodo}
                                />
                            ))}
                        </ul>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

export default App
