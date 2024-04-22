import React from 'react'

export default function TodoList({ submit, task, todos, complete, remove, edit, change, dragStart, dragEnter, dragEnd }) {
  return (
    <div>
        <div className="input-container">
            <form onSubmit={submit}>
                <input indic='todo' placeholder='todo' onChange={change} value={task.todo}/>
                <button>submit</button>
            </form>
        </div>
        <ul>
            {todos.map((todo, idx) => <li className='todo-li' key={idx} index={idx} draggable onDragStart={(e) => dragStart(e, idx)} onDragEnter={(e) => dragEnter(e, idx)} onDragEnd={dragEnd} onDragOver={(e)=>e.preventDefault()}> 
                { todo.editing 
                    ? <>
                            <input className='todo-todo' indic='editValue' style={todo.completed ? styles.complete : styles.incomplete} onChange={change} placeholder={todo.todo} value={task.editValue} />
                            <div className='todo-button-container'>
                                <button indic='cancel' className='todo-button' onClick={edit} idx={idx}>cancel</button>
                                <button indic='done' className='todo-button' onClick={edit} idx={idx}>done</button>
                            </div>
                    </>
                    : <>
                        <div className='todo-todo' style={todo.completed ? styles.complete : styles.incomplete}>{todo.todo}</div>
                        <div className='todo-button-container'>
                            <button indic='edit' className='todo-button' onClick={edit} idx={idx}>edit</button>
                            <button className='todo-button' onClick={complete} idx={idx}>{todo.completed ? 'incomplete' : 'complete'}</button>
                            <button className='todo-button' onClick={remove} idx={idx}>remove</button>
                        </div>
                    </>
                }
            </li>)}
        </ul>
    </div>
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