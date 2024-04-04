import { URL } from "../config"

export async function fetchTodos() {
    const res = await fetch(`${URL}/todos`, [])
    if (!res.ok) {
      const message = 'error fetching todos'
      throw new Error(message)
    }
    const todos = await res.json()
    return todos
  }
  
export async function postToTodos(url='', data = {}) {
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

