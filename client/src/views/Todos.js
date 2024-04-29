import React, { useState, useRef } from 'react'

import { addTodo, updateTodos, deleteTodo } from '../services/todosRequests.js'

export default function TodoList({ todos, setTodos }) {

    let [task, setTask] = useState({
        todo: '',
        completed: false,
        editing: false,
        editValue: '',
        index: null
    })

    let changeHandler = e => setTask({...task, [e.target.attributes.indic.value]: e.target.value})

    let submitHandler = e => {
        e.preventDefault()
        if (task.todo !== '') {
          task.index = todos.length
          console.log(task)
          addTodo(task).then(()=>{
            setTodos([...todos, task])
            setTask({...task, todo: ''})
          })
        }
    }

    let completeHandler = e => {
        let updated = {}
        let completeUpdated = todos.map((todo, idx) => {
          if (idx == e.target.attributes.idx.value) {
            todo.completed = !todo.completed
            updated = todo
          }
          return todo
        })
        updateTodos([updated]).then(() => setTodos(completeUpdated))
    }

    let removeHandler = e => {
        let removeTarget = {}
        let removeUpdated = todos.filter((todo, idx) => {
          if (!(e.target.attributes.idx.value == idx)) {
            return true
          } else {
            removeTarget = todo
            return false
          }
        })
        deleteTodo(removeTarget).then(()=>setTodos(removeUpdated))
    }

    let editHandler = e => {
        let pressType = e.target.attributes.indic.value
        let edited = {}
    
        let updateEdited = todos.map((todo, idx) => {
          if (idx == e.target.attributes.idx.value) {
            todo.editing = !todo.editing
            if (pressType == 'done')
              todo.todo = task.editValue
            edited = todo
          }
          return todo
        })
        updateTodos([edited]).then(()=> {
          setTodos(updateEdited)
          setTask({...task, editValue: ''})
        })
    }

    // start -- dragging functionality
    // save reference for dragged item
    let dragItem = useRef(null)
    let dragOverItem = useRef(null)

    // handle sorting on drag and drop
    let dragSortHandler = () => {
        // copy to avoid accidentally mutating todoItems
        let _todos = [...todos]
        // create a new arr to store items that moved
        let updated = []
        // remove the dragged item
        let draggedTodo = _todos.splice(dragItem.current, 1)[0]
        // insert dragged item at hover location 
        _todos.splice(dragOverItem.current, 0, draggedTodo)
        // push all of the items which changed location to updated
        _todos.forEach((ele, idx) => {
        if (ele.index !== idx) {
            ele.index = idx
            updated.push(ele)
        }
        })    
        // reset our references for a new drag
        dragItem.current = null
        dragOverItem.current = null
        // update with our altered items, and update todoItems locally
        console.log(updated)
        updateTodos(updated).then(()=>setTodos(_todos))
    }

    // drag handlers
    let onDragStart = (e, idx) => dragItem.current = idx
    let onDragEnter = (e, idx) => dragOverItem.current = idx

    // end -- dragging functionality
      
  return (
    <div>
        <div className="input-container">
            <form onSubmit={submitHandler}>
                <input indic='todo' placeholder='todo' onChange={changeHandler} value={task.todo}/>
                <button className='todo-button' id='submit-button'>submit</button>
            </form>
        </div>
        <ul className="todo-container">
            {todos.map((todo, idx) => <li className='todo-li' key={idx} index={idx} draggable onDragStart={(e) => onDragStart(e, idx)} onDragEnter={(e) => onDragEnter(e, idx)} onDragEnd={dragSortHandler} onDragOver={(e)=>e.preventDefault()}> 
                { todo.editing 
                    ? <>
                            <input className='todo-todo' indic='editValue' style={todo.completed ? styles.complete : styles.incomplete} onChange={changeHandler} placeholder={todo.todo} value={task.editValue} />
                            <div className='todo-button-container'>
                                <button indic='cancel' className='todo-button' onClick={editHandler} idx={idx}>cancel</button>
                                <button indic='done' className='todo-button' onClick={editHandler} idx={idx}>done</button>
                            </div>
                    </>
                    : <>
                        <div className='todo-todo' style={todo.completed ? styles.complete : styles.incomplete}>{todo.todo}</div>
                        <div className='todo-button-container'>
                            <button indic='edit' className='todo-button' onClick={editHandler} idx={idx}>edit</button>
                            <button className='todo-button' onClick={completeHandler} idx={idx}>{todo.completed ? 'incomplete' : 'complete'}</button>
                            <button className='todo-button' onClick={removeHandler} idx={idx}>remove</button>
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