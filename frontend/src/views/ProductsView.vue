<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import ProductRequests, { type Product, type ProductData } from '@/requests/ProductRequests'
import MaterialRequests, { type Material } from '@/requests/MaterialRequests'
import ModalComponent from '@/components/ModalComponent.vue'

const productRequests = new ProductRequests()
const materialRequests = new MaterialRequests()

const toast = useToast()

type ProductEditing = Product & {
  materials: { quantity: number; material: { id: number | string; quantity: number } }[]
}

const inputs = reactive({
  name: '',
  value: '' as number | string,
  materials: [] as { id: number | string; quantity: number }[],
})
const editing = reactive({} as ProductEditing)
const deleting = reactive({} as Product)
const data = ref({} as ProductData)
const maxUnits = computed(() => {
  if (!data.value.materials || data.value.materials.length === 0) return 0

  let maxUnitsProduced = Infinity

  for (const item of data.value.materials) {
    const stock = item.material.stock_quantity
    const needed = item.quantity

    const possibleUnits = Math.floor(stock / needed)

    if (possibleUnits < maxUnitsProduced) {
      maxUnitsProduced = possibleUnits
    }
  }

  return maxUnitsProduced === Infinity ? 0 : maxUnitsProduced
})
const products = ref([] as Product[])
const materials = ref([] as Material[])

async function setupEditing(product: Product) {
  if (deleting.id > 0) setupDeleting({ id: -1, name: '', value: 0 })
  const dt = await productRequests.getProductById(product.id)
  editing.id = dt.id
  editing.name = dt.name
  editing.value = dt.value
  editing.materials = dt.materials
}

function setupDeleting(product: Product) {
  if (editing.id > 0) setupEditing({ id: -1, name: '', value: 0 })
  deleting.id = product.id
  deleting.name = product.name
  deleting.value = product.value
}

async function showData(product: Product) {
  const dt = await productRequests.getProductById(product.id)
  data.value = dt
}

async function addProduct() {
  if (!inputs.name || !inputs.value) return toast.error('Preencha todos os campos')
  if (inputs.materials.length === 0) return toast.error('É necessário adicionar materiais')
  if (inputs.materials.filter((m) => !m.id || !m.quantity).length > 0)
    return toast.error('Preencha todos os campos para materiais')
  const product = await productRequests.addProduct(
    inputs.name,
    Number(inputs.value),
    inputs.materials.map((m) => ({ id: Number(m.id), stock_quantity: m.quantity })),
  )
  if (!product) {
    return toast.error('Erro ao adicionar produto')
  }
  inputs.name = ''
  inputs.value = ''
  inputs.materials = []
  toast.success('Produto adicionado com sucesso')
  products.value = await getAllProducts()
}

async function getAllProducts() {
  return await productRequests.getAllProducts()
}

async function updateProduct() {
  if (!editing.id || !editing.name || !editing.value) return toast.error('Preencha todos os campos')
  const product = await productRequests.updateProduct(
    editing.id,
    editing.name,
    Number(editing.value),
    editing.materials.map((m) => ({ id: Number(m.material.id), stock_quantity: m.quantity })),
  )
  if (!product) {
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
  const product = await productRequests.deleteProduct(deleting.id)
  if (!product) {
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
  const mats = await materialRequests.getAllMaterials()
  products.value = prods.sort((a, b) => (a.value > b.value ? -1 : 1)) || []
  materials.value = mats || []
})
</script>

<template>
  <div class="w-full h-full p-1">
    <div class="grid grid-cols-2 gap-1">
      <h2 class="text-neutral-400 text-center text-xl font-bold col-span-full">
        Adicionar produto
      </h2>
      <input type="text" placeholder="Digite o nome do produto" v-model="inputs.name" />
      <input type="number" placeholder="Digite o valor do produto" v-model="inputs.value" />
      <div class="col-span-full flex flex-col items-center gap-1">
        <div v-for="(mat, index) in inputs.materials" :key="index">
          <select v-model="mat.id">
            <option disabled value="">Selecione o material</option>
            <option v-for="m in materials" :key="m.id" :value="m.id">
              {{ m.name }}
            </option>
          </select>
          <input
            type="number"
            placeholder="Digite a quantidade do material"
            v-model="mat.quantity"
          />
        </div>
        <div class="flex gap-1">
          <button
            class="bg-blue-400 hover:bg-blue-300 transition cursor-pointer rounded-md px-2"
            @click="inputs.materials.push({ id: '', quantity: 0 })"
          >
            Adicionar novo material
          </button>
          <button
            class="bg-red-400 hover:bg-red-300 transition cursor-pointer rounded-md px-2"
            @click="inputs.materials.pop()"
            :disabled="inputs.materials.length == 0"
          >
            Remover ultimo material
          </button>
        </div>
      </div>
      <button
        class="col-span-full p-2 cursor-pointer bg-green-400 hover:bg-green-300 transition rounded-lg"
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
              <button
                class="px-2 cursor-pointer bg-green-300 hover:bg-green-400"
                @click="showData(product)"
              >
                Calcular
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalComponent
      v-if="editing.id > 0"
      @close="editing.id = -1"
      body-classes="flex flex-col gap-2 h-max p-1"
    >
      <div class="grid grid-cols-2 gap-1">
        <h2 class="my-3 col-span-full text-neutral-400 text-center text-xl font-bold">
          Editar produto
        </h2>
        <input type="text" placeholder="Digite o nome do produto" v-model="editing.name" />
        <input type="number" placeholder="Digite o valor do produto" v-model="editing.value" />
        <div class="col-span-full flex flex-col items-center gap-1">
          <div v-for="(mat, index) in editing.materials" :key="index">
            <select v-model="mat.material.id">
              <option disabled value="">Selecione o material</option>
              <option v-for="m in materials" :key="m.id" :value="m.id">
                {{ m.name }}
              </option>
            </select>
            <input
              type="number"
              placeholder="Digite a quantidade do material"
              v-model="mat.quantity"
            />
          </div>
          <div class="flex gap-1">
            <button
              class="bg-blue-400 hover:bg-blue-300 transition cursor-pointer rounded-md px-2"
              @click="editing.materials.push({ quantity: 0, material: { id: '', quantity: 0 } })"
            >
              Adicionar novo material
            </button>
            <button
              class="bg-red-400 hover:bg-red-300 transition cursor-pointer rounded-md px-2"
              @click="editing.materials.pop()"
              :disabled="editing.materials.length === 0"
            >
              Remover ultimo material
            </button>
          </div>
        </div>

        <button
          class="p-2 col-span-full cursor-pointer bg-blue-400 hover:bg-blue-300 transition rounded-lg"
          @click="updateProduct"
        >
          Salvar
        </button>
      </div>
    </ModalComponent>

    <ModalComponent
      v-if="deleting.id > 0"
      @close="deleting.id = -1"
      body-classes="flex flex-col h-max p-1"
    >
      <h2 class="my-3 text-red-400 text-center text-xl font-bold">Deletar produto</h2>
      <button
        class="p-2 cursor-pointer bg-gray-400 hover:bg-red-300 transition rounded-lg"
        @click="deleteProduct"
      >
        Confirmar deleção do produto:
        <span class="font-bold text-white">{{ deleting.name }}</span>
      </button>
    </ModalComponent>

    <ModalComponent v-if="data.id > 0" @close="data.id = -1" body-classes="p-1">
      <h2 class="my-3 text-neutral-400 text-center text-xl font-bold">
        Dados do produto: {{ data.name }}
      </h2>
      <table class="w-full mx-auto">
        <thead class="bg-neutral-400">
          <tr>
            <th>Material</th>
            <th>Quantidade necessária</th>
            <th>Estoque</th>
          </tr>
        </thead>
        <tbody class="bg-neutral-300 text-center">
          <tr v-for="(material, index) in data.materials" :key="index">
            <td>{{ material.material.name }}</td>
            <td>{{ material.quantity.toLocaleString('pt-BR') }}</td>
            <td>
              {{ material.material.stock_quantity.toLocaleString('pt-BR') }}
            </td>
          </tr>
        </tbody>
      </table>

      <h2 class="text-center text-xl font-bold text-blue-500">
        É possível criar {{ maxUnits }} unidades do produto
      </h2>
    </ModalComponent>
  </div>
</template>
