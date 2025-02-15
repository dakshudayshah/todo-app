import { useState } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, newText: string) => void;
    dragHandleProps?: Record<string, any>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit, dragHandleProps }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editText.trim()) {
            onEdit(todo.id, editText);
            setIsEditing(false);
        }
    };

    return (
        <li className="flex items-center gap-2 p-2 border-b group">
            <div 
                className="cursor-move px-2 py-1 hover:bg-gray-100 rounded"
                {...dragHandleProps}
            >
                ⋮⋮
            </div>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                className="w-4 h-4"
                onClick={e => e.stopPropagation()}
            />
            {isEditing ? (
                <form onSubmit={handleSubmit} className="flex-1 flex gap-2" onClick={e => e.stopPropagation()}>
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 p-1 border rounded"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => e.stopPropagation()}
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={e => e.stopPropagation()}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(false);
                            setEditText(todo.text);
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <>
                    <span 
                        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {todo.text}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(todo.id);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </>
            )}
        </li>
    );
} 