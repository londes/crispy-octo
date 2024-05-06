import { URL } from "../config"

export async function fetchTodos(token) {
    // we need to clean up our code after getting our middleware working
    console.log('in our fetch todos')
    const res = await fetch(`${URL}/todos`, {
        method:"GET",
        mode:"cors",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    if (!res.ok) {
      const message = 'error fetching todos'
      throw new Error(message)
    }
    const todos = await res.json()
    return todos
  }

export async function addTodo(todoData = {}) {
    try {
        const res = await postToTodos('/add', todoData)
        // handle response if needed
        return res
    } catch (error) {
        console.error('error adding todo: ', error)
        throw error;
    }
}

export async function deleteTodo(todoData = {}) {
    try {
        const res = await postToTodos(`/delete`, todoData)
        // handle response if needed
        return res
    } catch (error) {
        console.error('error removing todo: ', error)
        throw error;
    }
}

export async function updateTodos(updates = []) {
    try {
        const res = await postToTodos(`/update`, { updates })
        // handle response if needed
        return res
    } catch (error) {
        console.error('error updating todos: ', error)
        throw error;
    }
}
  
async function postToTodos(url='', data = {}) {
    const res = await fetch(`${URL}/todos${url}`, {
        method:"POST",
        mode:"cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    return res.json()
}



