import React from 'react'

export default function TodoList({ todos, complete, remove, key }) {
  return (
    <ul>
        {todos.map((todo, idx) => <li className='todo-li' key={key} style={todo.completed ? styles.complete : styles.incomplete}>
            <div>{todo.todo}</div>
            <div>
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