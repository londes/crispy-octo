import React, { useState, useRef } from 'react'

import { addTodo, updateTodos, deleteTodo } from '../services/todosRequests.js'

export default function TodoList({ todos, setTodos, user, isLoggedIn }) {

    let [task, setTask] = useState({
        todo: '',
        completed: false,
        editing: false,
        editValue: '',
        index: null,
        user_id: ''
    })

    let changeHandler = e => setTask({...task, [e.target.attributes.indic.value]: e.target.value})

    let submitHandler = e => {
        e.preventDefault()
        // if our task input is not empty, and does not match an existing todo
        if (task.todo !== '' && !todos.some(todo => task.todo == todo.todo)) {
            task.index = todos.length
            if (user && user.userId)
                task.user_id = user.userId
            // if user is logged in, post task to db
            if (isLoggedIn)
                addTodo([task]).then(res => {
                    if (res.ok)
                        setTodos([...todos, task])
                })
            // if not logged in, pull from localStorage and add task there
            else {
                setTodos([...todos, task])
            }
            setTask({...task, todo: ''})
        }
    }

    let completeHandler = e => {
        let updated = {}
        // if the index matches the selected todo, update the completed value
        let completeUpdated = todos.map((todo, idx) => {
          if (idx == e.target.attributes.idx.value) {
            todo.completed = !todo.completed
            updated = todo
          }
          return todo
        })
        // if user is logged in, update in db
        if (isLoggedIn)
            updateTodos([updated]).then(res => {
                if (res.ok)
                    setTodos(completeUpdated)
            })
        // if not logged in, update locally
        else
            setTodos(completeUpdated)
    }

    let removeHandler = e => {
        let removeTarget = {}
        // if the index of todo matches the selected for delete, remove it
        let removeUpdated = todos.filter((todo, idx) => {
          if (!(e.target.attributes.idx.value == idx)) {
            return true
          } else {
            removeTarget = todo
            return false
          }
        })
        // if logged in, update db
        if (isLoggedIn)
            deleteTodo(removeTarget).then( res =>{
                if (res.ok)
                    setTodos(removeUpdated)
            })
        // if not logged in update locally
        else
            setTodos(removeUpdated)
    }

    let editHandler = e => {
        let pressType = e.target.attributes.indic.value
        let edited = {}
        // if the index in todos matches the todo selected for edit, update edited value
        let updateEdited = todos.map((todo, idx) => {
          if (idx == e.target.attributes.idx.value) {
            todo.editing = !todo.editing
            if (pressType == 'done')
              todo.todo = task.editValue
            edited = todo
          }
          return todo
        })
        // if logged in, update db
        if (isLoggedIn)
            updateTodos([edited]).then( res => {
                if (res.ok) {
                    setTodos(updateEdited)
                    setTask({...task, editValue: ''})
                }
            })
        // if not logged in, only update locally
        else {
            setTodos(updateEdited)
            setTask({...task, editValue: ''})
        }
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
        // if logged in update with our altered items, then update locally
        if (isLoggedIn)
            updateTodos(updated).then(()=>setTodos(_todos))
        // if not logged in, just update locally
        else
            setTodos(_todos)
    }

    // drag handlers
    let onDragStart = (e, idx) => dragItem.current = idx
    let onDragEnter = (e, idx) => dragOverItem.current = idx

    // end -- dragging functionality
      
  return (
    <div>
        <div className="todo-input-container">
            <form className="todo-form" onSubmit={submitHandler}>
                <input indic='todo' placeholder='todo' onChange={changeHandler} value={task.todo}/>
                <button className='todo-button' id='submit-button'></button>
            </form>
        </div>
        <ul className="todo-container">
            {todos?.map((todo, idx) => <div className='todo-wrapper' key={idx}><li className='todo-li' key={idx} index={idx} draggable onDragStart={(e) => onDragStart(e, idx)} onDragEnter={(e) => onDragEnter(e, idx)} onDragEnd={dragSortHandler} onDragOver={(e)=>e.preventDefault()}> 
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
            </li></div>)}
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