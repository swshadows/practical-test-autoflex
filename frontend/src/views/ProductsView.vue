<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
type Product = {
  id: number
  name: string
  value: number
}
const toast = useToast()

const apiUrl = import.meta.env.VITE_API_URL
const inputs = reactive({ name: '', value: '' as number | string })
const editing = reactive({} as Product)
const deleting = reactive({} as Product)
const products = ref([] as Product[])

function setupEditing(product: Product) {
  if (deleting.id > 0) setupDeleting({ id: -1, name: '', value: 0 })
  editing.id = product.id
  editing.name = product.name
  editing.value = product.value
}

function setupDeleting(product: Product) {
  if (editing.id > 0) setupEditing({ id: -1, name: '', value: 0 })
  deleting.id = product.id
  deleting.name = product.name
  deleting.value = product.value
}

async function addProduct() {
  if (!inputs.name || !inputs.value) return toast.error('Preencha todos os campos')
  const product = await fetch(`${apiUrl}/products/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  })
  if (!product.ok) {
    console.log(product)
    return toast.error('Erro ao adicionar produto')
  }
  inputs.name = ''
  inputs.value = ''
  toast.success('Produto adicionado com sucesso')
  products.value = await getAllProducts()
}

async function getAllProducts() {
  const response = await fetch(`${apiUrl}/products/all`)
  const data = await response.json()
  return data
}

async function updateProduct() {
  if (!editing.id || !editing.name || !editing.value) return toast.error('Preencha todos os campos')
  const product = await fetch(`${apiUrl}/products/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editing),
  })
  if (!product.ok) {
    console.log(product)
    return toast.error('Erro ao atualizar produto')
  }
  toast.success('Produto atualizado com sucesso')
  products.value = await getAllProducts()
  editing.id = -1
  editing.name = ''
  editing.value = 0
}
async function deleteProduct() {
  if (!deleting.id) return toast.error('Preencha todos os campos')
  const product = await fetch(`${apiUrl}/products/delete/${deleting.id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: deleting.id }),
  })
  if (!product.ok) {
    console.log(product)
    return toast.error('Erro ao deletar produto')
  }
  toast.success('Produto deletado com sucesso')
  products.value = await getAllProducts()
  deleting.id = -1
  deleting.name = ''
  deleting.value = 0
}

onMounted(async () => {
  const prods = await getAllProducts()
  products.value = prods || []
})
</script>

<template>
  <div class="w-full h-full p-1">
    <div class="grid grid-cols-[40%_40%_1fr] gap-x-1">
      <h2 class="text-neutral-400 text-center text-xl font-bold col-span-full">
        Adicionar produto
      </h2>
      <input type="text" placeholder="Digite o nome do produto" v-model="inputs.name" />
      <input type="number" placeholder="Digite o valor do produto" v-model="inputs.value" />
      <button
        class="p-2 cursor-pointer bg-green-400 hover:bg-green-300 transition rounded-lg"
        @click="addProduct"
      >
        Adicionar
      </button>
    </div>

    <div v-if="products.length">
      <h2 class="my-3 text-neutral-400 text-center text-xl font-bold">Produtos cadastrados</h2>
      <table class="w-4/5 mx-auto">
        <thead class="bg-neutral-400">
          <tr>
            <th>Nome</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody class="bg-neutral-300 text-center">
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>
              {{ product.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </td>
            <td class="w-50">
              <button
                class="px-2 cursor-pointer bg-blue-300 hover:bg-blue-400"
                @click="setupEditing(product)"
              >
                Editar
              </button>
              <button
                class="px-2 cursor-pointer bg-red-300 hover:bg-red-400"
                @click="setupDeleting(product)"
              >
                Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editing.id > 0" class="flex flex-col gap-2 relative">
      <button
        class="absolute right-0 top-4 text-neutral-400 hover:text-red-400 hover:underline cursor-pointer"
        @click="setupEditing({ id: -1, name: '', value: 0 })"
      >
        Cancelar
      </button>
      <h2 class="my-3 text-neutral-400 text-center text-xl font-bold">Editar produto</h2>
      <input type="text" placeholder="Digite o nome do produto" v-model="editing.name" />
      <input type="number" placeholder="Digite o valor do produto" v-model="editing.value" />
      <button
        class="p-2 cursor-pointer bg-blue-400 hover:bg-blue-300 transition rounded-lg"
        @click="updateProduct"
      >
        Salvar
      </button>
    </div>

    <div v-if="deleting.id > 0" class="flex flex-col relative">
      <button
        class="absolute right-0 top-4 text-neutral-400 hover:text-red-400 hover:underline cursor-pointer"
        @click="setupDeleting({ id: -1, name: '', value: 0 })"
      >
        Cancelar
      </button>
      <h2 class="my-3 text-red-400 text-center text-xl font-bold">Deletar produto</h2>
      <button
        class="p-2 cursor-pointer bg-gray-400 hover:bg-red-300 transition rounded-lg"
        @click="deleteProduct"
      >
        Confirmar deleção do produto:
        <span class="font-bold text-white">{{ deleting.name }}</span>
      </button>
    </div>
  </div>
</template>
