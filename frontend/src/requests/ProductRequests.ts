import { API_URL } from './default'
import type { Material, MaterialForAdding } from './MaterialRequests'

export type Product = {
  id: number
  name: string
  value: number
}

export type ProductData = {
  id: number
  name: string
  value: number
  materials: { material: Material; quantity: number }[]
}

export default class ProductRequests {
  async addProduct(name: string, value: number, materials: MaterialForAdding[]) {
    const product = await fetch(`${API_URL}/products/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, value, materials }),
    })
    if (!product.ok) {
      console.log(product)
      return null
    }
    return product
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_URL}/products/all`)
    const data = await response.json()
    return data
  }

  async getProductById(id: number) {
    const response = await fetch(`${API_URL}/products/${id}`)
    const data = await response.json()
    return data
  }

  async updateProduct(id: number, name: string, value: number, materials: MaterialForAdding[]) {
    const product = await fetch(`${API_URL}/products/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, value, materials }),
    })
    if (!product.ok) {
      console.log(product)
      return null
    }
    return product
  }

  async deleteProduct(id: number) {
    const product = await fetch(`${API_URL}/products/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!product) {
      console.log(product)
      return null
    }
    return product
  }
}
