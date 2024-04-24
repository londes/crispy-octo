import { URL } from "../config"

export async function fetchUsers() {
    const res = await fetch(`${URL}/user`, [])
    if (!res.ok) {
      const message = 'error fetching users'
      throw new Error(message)
    }
    const users = await res.json()
    return users
}

export async function addUser(userData = {}) {
    try {
        const res = await postToUsers('/register', userData)
        // handle response if needed
        return res
    } catch (error) {
        console.error('error adding todo: ', error)
        throw error;
    }
}

// export async function deleteTodo(todoData = {}) {
//     try {
//         const res = await postToTodos(`/delete`, todoData)
//         // handle response if needed
//         return res
//     } catch (error) {
//         console.error('error removing todo: ', error)
//         throw error;
//     }
// }

// export async function updateTodos(updates = []) {
//     try {
//         const res = await postToTodos(`/update`, { updates })
//         // handle response if needed
//         return res
//     } catch (error) {
//         console.error('error updating todos: ', error)
//         throw error;
//     }
// }
  
export async function postToUsers(url='', data = {}) {
    const res = await fetch(`${URL}/user${url}`, {
        method:"POST",
        mode:"cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    return res.json()
}

