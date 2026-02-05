<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
type Material = {
  id: number
  name: string
  stock_quantity: number
}
const toast = useToast()

const apiUrl = import.meta.env.VITE_API_URL
const inputs = reactive({ name: '', stock_quantity: '' as number | string })
const editing = reactive({} as Material)
const deleting = reactive({} as Material)
const materials = ref([] as Material[])

function setupEditing(material: Material) {
  if (deleting.id > 0) setupDeleting({ id: -1, name: '', stock_quantity: 0 })
  editing.id = material.id
  editing.name = material.name
  editing.stock_quantity = material.stock_quantity
}

function setupDeleting(material: Material) {
  if (editing.id > 0) setupEditing({ id: -1, name: '', stock_quantity: 0 })
  deleting.id = material.id
  deleting.name = material.name
  deleting.stock_quantity = material.stock_quantity
}

async function addMaterial() {
  if (!inputs.name || !inputs.stock_quantity) return toast.error('Preencha todos os campos')
  const material = await fetch(`${apiUrl}/materials/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  })
  if (!material.ok) {
    console.log(material)
    return toast.error('Erro ao adicionar material')
  }
  inputs.name = ''
  inputs.stock_quantity = ''
  toast.success('Material adicionado com sucesso')
  materials.value = await getAllMaterials()
}

async function getAllMaterials() {
  const response = await fetch(`${apiUrl}/materials/all`)
  const data = await response.json()
  return data
}

async function updateMaterial() {
  if (!editing.id || !editing.name || !editing.stock_quantity)
    return toast.error('Preencha todos os campos')
  const material = await fetch(`${apiUrl}/materials/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editing),
  })
  if (!material.ok) {
    console.log(material)
    return toast.error('Erro ao atualizar material')
  }
  toast.success('Material atualizado com sucesso')
  materials.value = await getAllMaterials()
  editing.id = -1
  editing.name = ''
  editing.stock_quantity = 0
}
async function deleteMaterial() {
  if (!deleting.id) return toast.error('Preencha todos os campos')
  const material = await fetch(`${apiUrl}/materials/delete/${deleting.id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: deleting.id }),
  })
  if (!material.ok) {
    console.log(material)
    return toast.error('Erro ao deletar material')
  }
  toast.success('Material deletado com sucesso')
  materials.value = await getAllMaterials()
  deleting.id = -1
  deleting.name = ''
  deleting.stock_quantity = 0
}

onMounted(async () => {
  const mats = await getAllMaterials()
  materials.value = mats || []
})
</script>

<template>
  <div class="w-full h-full p-1">
    <div class="grid grid-cols-[40%_40%_1fr] gap-x-1">
      <h2 class="text-neutral-400 text-center text-xl font-bold col-span-full">
        Adicionar material
      </h2>
      <input type="text" placeholder="Digite o nome do material" v-model="inputs.name" />
      <input
        type="number"
        placeholder="Digite o estoque do material"
        v-model="inputs.stock_quantity"
      />
      <button
        class="p-2 cursor-pointer bg-green-400 hover:bg-green-300 transition rounded-lg"
        @click="addMaterial"
      >
        Adicionar
      </button>
    </div>

    <div v-if="materials.length">
      <h2 class="my-3 text-neutral-400 text-center text-xl font-bold">Materiais cadastrados</h2>
      <table class="w-4/5 mx-auto">
        <thead class="bg-neutral-400">
          <tr>
            <th>Nome</th>
            <th>Quantidade em estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody class="bg-neutral-300 text-center">
          <tr v-for="material in materials" :key="material.id">
            <td>{{ material.name }}</td>
            <td>{{ material.stock_quantity.toLocaleString('pt-BR') }}</td>
            <td class="w-50">
              <button
                class="px-2 cursor-pointer bg-blue-300 hover:bg-blue-400"
                @click="setupEditing(material)"
              >
                Editar
              </button>
              <button
                class="px-2 cursor-pointer bg-red-300 hover:bg-red-400"
                @click="setupDeleting(material)"
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
        @click="setupEditing({ id: -1, name: '', stock_quantity: 0 })"
      >
        Cancelar
      </button>
      <h2 class="my-3 text-neutral-400 text-center text-xl font-bold">Editar material</h2>
      <input type="text" placeholder="Digite o nome do material" v-model="editing.name" />
      <input
        type="number"
        placeholder="Digite o estoque do material"
        v-model="editing.stock_quantity"
      />
      <button
        class="p-2 cursor-pointer bg-blue-400 hover:bg-blue-300 transition rounded-lg"
        @click="updateMaterial"
      >
        Salvar
      </button>
    </div>

    <div v-if="deleting.id > 0" class="flex flex-col relative">
      <button
        class="absolute right-0 top-4 text-neutral-400 hover:text-red-400 hover:underline cursor-pointer"
        @click="setupDeleting({ id: -1, name: '', stock_quantity: 0 })"
      >
        Cancelar
      </button>
      <h2 class="my-3 text-red-400 text-center text-xl font-bold">Deletar material</h2>
      <button
        class="p-2 cursor-pointer bg-gray-400 hover:bg-red-300 transition rounded-lg"
        @click="deleteMaterial"
      >
        Confirmar deleção do material:
        <span class="font-bold text-white">{{ deleting.name }}</span>
      </button>
    </div>
  </div>
</template>
