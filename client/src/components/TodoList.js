import React from 'react'

export default function TodoList({ todos, complete, remove, update, change }) {
  return (
    <ul>
        {todos.map((todo, idx) => <li className='todo-li' key={todo._id}> 
            { todo.editing
                ? <input className='todo-todo' style={todo.completed ? styles.complete : styles.incomplete} onChange={change} placeholder={todo.todo} value={todo.editValue} />
                : <div className='todo-todo' style={todo.completed ? styles.complete : styles.incomplete}>{todo.todo}</div> }
            <div className='todo-button-container'>
                <button className='todo-button' onClick={update} idx={idx}>{todo.editing ? 'done' : 'edit'}</button>
                <button className='todo-button' onClick={complete} idx={idx}>{todo.completed ? 'incomplete' : 'complete'}</button>
                <button className='todo-button' onClick={remove} idx={idx}>remove</button>
            </div>
        </li>)}
    </ul>
  )
}

let styles = {
    complete: {
        color: 'green',
        textDecorationLine: 'line-through',
    },
    incomplete: {
        color: 'black',
    }
}