import { API_URL } from './default'

export type MaterialForAdding = {
  id: number
  stock_quantity: number
}
export type Material = MaterialForAdding & {
  name: string
}

export default class MaterialRequests {
  async addMaterial(name: string, stock_quantity: number) {
    const material = await fetch(`${API_URL}/materials/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stock_quantity }),
    })
    if (!material.ok) {
      console.log(material)
      return null
    }
    return material
  }

  async getAllMaterials() {
    const response = await fetch(`${API_URL}/materials/all`)
    const data = await response.json()
    return data
  }

  async updateMaterial(id: number, name: string, stock_quantity: number) {
    const material = await fetch(`${API_URL}/materials/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, stock_quantity }),
    })
    if (!material.ok) {
      console.log(material)
      return null
    }
    return material
  }
  async deleteMaterial(id: number) {
    const material = await fetch(`${API_URL}/materials/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!material.ok) {
      console.log(material)
      return null
    }
    return material
  }
}
