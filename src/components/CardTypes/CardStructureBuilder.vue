<template>
  <div class="card-structure-builder p-6">
    <loading-spinner v-if="loading" />

    <div v-else class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            :to="`/card-types/${cardId}`"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Card Type
        </router-link>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Build Card Structure</h1>
            <p class="text-gray-600 mt-1">
              {{ cardType ? cardType.card_name : '' }} - Define hierarchical structure
            </p>
          </div>

          <div class="flex gap-2">
            <button
                @click="showTemplateDialog = true"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <i class="fas fa-magic"></i>
              Use Template
            </button>
            <button
                @click="saveStructure"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <i class="fas fa-save"></i>
              Save Structure
            </button>
          </div>
        </div>
      </div>

      <!-- Info Alert -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-blue-600 mt-1"></i>
          <div>
            <h3 class="font-semibold text-blue-900">Structure Type: {{ formatStructureType(cardType?.structure_type) }}</h3>
            <p class="text-sm text-blue-800 mt-1">
                            <span v-if="cardType?.structure_type === 'item_based'">
                                Create a flat list of items (e.g., Item 1, Item 2, Item 3...)
                            </span>
              <span v-else-if="cardType?.structure_type === 'topic_based'">
                                Create topics with nested sub-topics and content items
                            </span>
              <span v-else-if="cardType?.structure_type === 'module_based'">
                                Organize content into modules with structured hierarchy
                            </span>
              <span v-else>
                                Flexible structure combining different organization methods
                            </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalItemsCount }}</p>
            </div>
            <i class="fas fa-list text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Marks</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalMarks }}</p>
            </div>
            <i class="fas fa-calculator text-green-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Root Levels</p>
              <p class="text-2xl font-bold text-gray-900">{{ structure.length }}</p>
            </div>
            <i class="fas fa-layer-group text-purple-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Max Depth</p>
              <p class="text-2xl font-bold text-gray-900">{{ maxDepth }}</p>
            </div>
            <i class="fas fa-sitemap text-orange-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Structure Tree (Left) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Structure Tree</h2>
                <button
                    @click="addRootLevel"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
                >
                  <i class="fas fa-plus"></i>
                  Add Root Level
                </button>
              </div>

              <!-- Empty State -->
              <div v-if="structure.length === 0" class="text-center py-12">
                <i class="fas fa-sitemap text-gray-400 text-5xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Structure Yet</h3>
                <p class="text-gray-600 mb-4">Start building your card structure</p>
                <button
                    @click="addRootLevel"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add First Item
                </button>
              </div>

              <!-- Tree Items -->
              <draggable
                  v-else
                  v-model="structure"
                  :options="dragOptions"
                  class="space-y-2"
                  @end="onDragEnd"
              >
                <tree-item
                    v-for="(item, index) in structure"
                    :key="item.id || item.temp_id"
                    :item="item"
                    :index="index"
                    :level="0"
                    @edit="editItem"
                    @delete="deleteItem"
                    @add-child="addChildItem"
                    @move-up="moveItemUp"
                    @move-down="moveItemDown"
                />
              </draggable>
            </div>
          </div>
        </div>

        <!-- Form Panel (Right) -->
        <div>
          <div class="bg-white rounded-lg shadow sticky top-6">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                {{ editingItem ? 'Edit Item' : 'Add New Item' }}
              </h2>

              <form @submit.prevent="saveItem" class="space-y-4">
                <!-- Level Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Level Type <span class="text-red-500">*</span>
                  </label>
                  <select
                      v-model="form.level_type"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="topic">Topic</option>
                    <option value="item">Item</option>
                    <option value="content">Content</option>
                    <option value="sub_content">Sub Content</option>
                  </select>
                </div>

                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <input
                      v-model="form.title"
                      type="text"
                      required
                      placeholder="e.g., Upper Limb, Heart, Thorax..."
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                      v-model="form.description"
                      rows="2"
                      placeholder="Brief description..."
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <!-- Max Marks -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Max Marks <span class="text-red-500">*</span>
                  </label>
                  <input
                      v-model.number="form.max_marks"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <!-- Level Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Level Number
                  </label>
                  <input
                      v-model.number="form.level_number"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p class="text-xs text-gray-500 mt-1">For reference/ordering</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-4">
                  <button
                      v-if="editingItem"
                      type="button"
                      @click="cancelEdit"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {{ editingItem ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow mt-4">
            <div class="p-6">
              <h3 class="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div class="space-y-2">
                <button
                    @click="expandAll"
                    class="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <i class="fas fa-expand-arrows-alt text-blue-600"></i>
                  Expand All
                </button>
                <button
                    @click="collapseAll"
                    class="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <i class="fas fa-compress-arrows-alt text-purple-600"></i>
                  Collapse All
                </button>
                <button
                    @click="validateStructure"
                    class="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <i class="fas fa-check-circle text-green-600"></i>
                  Validate Structure
                </button>
                <button
                    @click="clearAll"
                    class="w-full px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 text-sm flex items-center gap-2"
                >
                  <i class="fas fa-trash text-red-600"></i>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Dialog -->
    <transition name="modal">
      <div v-if="showTemplateDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-900">Choose Template</h2>
              <button
                  @click="showTemplateDialog = false"
                  class="text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                  v-for="template in templates"
                  :key="template.id"
                  @click="applyTemplate(template)"
                  class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
              >
                <div class="flex items-start gap-3">
                  <i :class="template.icon + ' text-2xl text-blue-600'"></i>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ template.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ template.description }}</p>
                    <p class="text-xs text-gray-500 mt-2">{{ template.items }} items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirm Dialog -->
    <confirm-dialog
        :show="showConfirmDialog"
        :title="confirmTitle"
        :message="confirmMessage"
        @confirm="handleConfirm"
        @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TreeItem from './TreeItem.vue'

export default {
  name: 'CardStructureBuilder',

  components: {
    draggable,
    TreeItem
  },

  data() {
    return {
      cardType: null,
      structure: [],
      loading: false,
      saving: false,
      editingItem: null,
      form: {
        level_type: 'item',
        title: '',
        description: '',
        max_marks: 0,
        level_number: 1,
        parent_id: null
      },
      dragOptions: {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost'
      },
      showTemplateDialog: false,
      showConfirmDialog: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmAction: null,
      templates: [
        {
          id: 1,
          name: 'Anatomy Dissection',
          description: 'Standard anatomy dissection items structure',
          icon: 'fas fa-user-md',
          items: 50,
          structure: this.getAnatomyTemplate()
        },
        {
          id: 2,
          name: 'Community Medicine Topics',
          description: 'Topic-based structure for community medicine',
          icon: 'fas fa-users',
          items: 30,
          structure: this.getCommunityTemplate()
        },
        {
          id: 3,
          name: 'Clinical Postings',
          description: 'Clinical rotation and posting structure',
          icon: 'fas fa-hospital',
          items: 20,
          structure: this.getClinicalTemplate()
        },
        {
          id: 4,
          name: 'Simple Item List',
          description: 'Basic flat list of items',
          icon: 'fas fa-list',
          items: 10,
          structure: this.getSimpleTemplate()
        }
      ]
    }
  },

  computed: {
    cardId() {
      return this.$route.params.id
    },

    totalItemsCount() {
      return this.countItems(this.structure)
    },

    totalMarks() {
      return this.calculateTotalMarks(this.structure)
    },

    maxDepth() {
      return this.calculateMaxDepth(this.structure, 0)
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        // Load card type
        const response = await this.$http.get(`/card-types/${this.cardId}`)
        this.cardType = response.data.data

        // Load existing structure
        const structureResponse = await this.$http.get(`/card-types/${this.cardId}/structure/tree`)
        this.structure = structureResponse.data.data.tree || []
      } catch (error) {
        this.$toast.error('Error loading data')
        this.$router.push('/card-types')
      } finally {
        this.loading = false
      }
    },

    addRootLevel() {
      this.resetForm()
      this.form.parent_id = null
    },

    addChildItem(parentItem) {
      this.resetForm()
      this.form.parent_id = parentItem.id || parentItem.temp_id
      this.form.level_type = this.getChildLevelType(parentItem.level_type)
    },

    editItem(item) {
      this.editingItem = item
      this.form = {
        level_type: item.level_type,
        title: item.title,
        description: item.description || '',
        max_marks: item.max_marks,
        level_number: item.level_number,
        parent_id: item.parent_id
      }
    },

    saveItem() {
      if (this.editingItem) {
        // Update existing item
        Object.assign(this.editingItem, this.form)
        this.$toast.success('Item updated')
        this.cancelEdit()
      } else {
        // Add new item
        const newItem = {
          ...this.form,
          temp_id: Date.now(),
          sequence: this.getNextSequence(this.form.parent_id),
          children: []
        }

        if (this.form.parent_id) {
          // Add as child
          const parent = this.findItemById(this.structure, this.form.parent_id)
          if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(newItem)
          }
        } else {
          // Add as root
          this.structure.push(newItem)
        }

        this.$toast.success('Item added')
        this.resetForm()
      }
    },

    deleteItem(item) {
      this.confirmTitle = 'Delete Item'
      this.confirmMessage = `Are you sure you want to delete "${item.title}"? This will also delete all child items.`
      this.confirmAction = () => {
        this.removeItem(this.structure, item)
        this.$toast.success('Item deleted')
      }
      this.showConfirmDialog = true
    },

    removeItem(items, itemToRemove) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === itemToRemove.id || items[i].temp_id === itemToRemove.temp_id) {
          items.splice(i, 1)
          return true
        }
        if (items[i].children) {
          if (this.removeItem(items[i].children, itemToRemove)) {
            return true
          }
        }
      }
      return false
    },

    moveItemUp(item, parentItems) {
      const index = parentItems.findIndex(i =>
          (i.id && i.id === item.id) || (i.temp_id && i.temp_id === item.temp_id)
      )
      if (index > 0) {
        const temp = parentItems[index]
        parentItems.splice(index, 1)
        parentItems.splice(index - 1, 0, temp)
      }
    },

    moveItemDown(item, parentItems) {
      const index = parentItems.findIndex(i =>
          (i.id && i.id === item.id) || (i.temp_id && i.temp_id === item.temp_id)
      )
      if (index < parentItems.length - 1) {
        const temp = parentItems[index]
        parentItems.splice(index, 1)
        parentItems.splice(index + 1, 0, temp)
      }
    },

    cancelEdit() {
      this.editingItem = null
      this.resetForm()
    },

    resetForm() {
      this.form = {
        level_type: 'item',
        title: '',
        description: '',
        max_marks: 0,
        level_number: 1,
        parent_id: null
      }
    },

    async saveStructure() {
      this.saving = true
      try {
        // Prepare structure data
        const structureData = this.prepareStructureForSave(this.structure)

        await this.$http.post(`/card-types/${this.cardId}/structure/bulk`, {
          structures: structureData
        })

        this.$toast.success('Structure saved successfully')
        this.$router.push(`/card-types/${this.cardId}`)
      } catch (error) {
        this.$toast.error('Error saving structure')
      } finally {
        this.saving = false
      }
    },

    prepareStructureForSave(items, parentId = null) {
      const result = []
      items.forEach((item, index) => {
        const data = {
          level_type: item.level_type,
          title: item.title,
          description: item.description,
          max_marks: item.max_marks,
          level_number: item.level_number,
          sequence: index + 1,
          parent_id: parentId
        }

        if (item.children && item.children.length > 0) {
          data.children = this.prepareStructureForSave(item.children, item.id || item.temp_id)
        }

        result.push(data)
      })
      return result
    },

    validateStructure() {
      const issues = []

      // Check if structure exists
      if (this.structure.length === 0) {
        issues.push('No structure defined')
      }

      // Check total marks
      if (this.cardType && Math.abs(this.totalMarks - this.cardType.total_marks) > 0.01) {
        issues.push(`Total marks (${this.totalMarks}) doesn't match card type total marks (${this.cardType.total_marks})`)
      }

      // Check for empty titles
      const hasEmptyTitles = this.checkEmptyTitles(this.structure)
      if (hasEmptyTitles) {
        issues.push('Some items have empty titles')
      }

      if (issues.length === 0) {
        this.$toast.success('Structure is valid!')
      } else {
        this.$toast.error('Validation issues found:\n' + issues.join('\n'))
      }
    },

    checkEmptyTitles(items) {
      for (const item of items) {
        if (!item.title || item.title.trim() === '') {
          return true
        }
        if (item.children && this.checkEmptyTitles(item.children)) {
          return true
        }
      }
      return false
    },

    applyTemplate(template) {
      this.confirmTitle = 'Apply Template'
      this.confirmMessage = 'This will replace your current structure. Are you sure?'
      this.confirmAction = () => {
        this.structure = JSON.parse(JSON.stringify(template.structure))
        this.$toast.success('Template applied')
        this.showTemplateDialog = false
      }
      this.showConfirmDialog = true
    },

    clearAll() {
      this.confirmTitle = 'Clear All'
      this.confirmMessage = 'This will remove all items from the structure. Are you sure?'
      this.confirmAction = () => {
        this.structure = []
        this.$toast.success('Structure cleared')
      }
      this.showConfirmDialog = true
    },

    expandAll() {
      // Implementation for expand all
      this.$toast.info('Expand all functionality')
    },

    collapseAll() {
      // Implementation for collapse all
      this.$toast.info('Collapse all functionality')
    },

    handleConfirm() {
      if (this.confirmAction) {
        this.confirmAction()
      }
      this.showConfirmDialog = false
    },

    // Helper methods
    countItems(items) {
      let count = items.length
      items.forEach(item => {
        if (item.children) {
          count += this.countItems(item.children)
        }
      })
      return count
    },

    calculateTotalMarks(items) {
      let total = 0
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          total += this.calculateTotalMarks(item.children)
        } else {
          total += parseFloat(item.max_marks) || 0
        }
      })
      return total
    },

    calculateMaxDepth(items, currentDepth) {
      if (items.length === 0) return currentDepth
      let maxDepth = currentDepth + 1
      items.forEach(item => {
        if (item.children) {
          const depth = this.calculateMaxDepth(item.children, currentDepth + 1)
          maxDepth = Math.max(maxDepth, depth)
        }
      })
      return maxDepth
    },

    findItemById(items, id) {
      for (const item of items) {
        if (item.id === id || item.temp_id === id) {
          return item
        }
        if (item.children) {
          const found = this.findItemById(item.children, id)
          if (found) return found
        }
      }
      return null
    },

    getNextSequence(parentId) {
      if (!parentId) {
        return this.structure.length + 1
      }
      const parent = this.findItemById(this.structure, parentId)
      return parent && parent.children ? parent.children.length + 1 : 1
    },

    getChildLevelType(parentType) {
      const hierarchy = {
        topic: 'content',
        content: 'sub_content',
        item: 'sub_content'
      }
      return hierarchy[parentType] || 'item'
    },

    formatStructureType(type) {
      if (!type) return ''
      return type.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    onDragEnd() {
      // Update sequences after drag
      this.updateSequences(this.structure)
    },

    updateSequences(items) {
      items.forEach((item, index) => {
        item.sequence = index + 1
        if (item.children) {
          this.updateSequences(item.children)
        }
      })
    },

    // Template generators
    getAnatomyTemplate() {
      return [
        {
          temp_id: 1,
          level_type: 'topic',
          title: 'Upper Limb',
          max_marks: 25,
          level_number: 1,
          children: [
            { temp_id: 11, level_type: 'item', title: 'Shoulder', max_marks: 5, level_number: 1 },
            { temp_id: 12, level_type: 'item', title: 'Arm', max_marks: 5, level_number: 2 },
            { temp_id: 13, level_type: 'item', title: 'Forearm', max_marks: 5, level_number: 3 },
            { temp_id: 14, level_type: 'item', title: 'Hand', max_marks: 5, level_number: 4 },
            { temp_id: 15, level_type: 'item', title: 'Axilla', max_marks: 5, level_number: 5 }
          ]
        },
        {
          temp_id: 2,
          level_type: 'topic',
          title: 'Lower Limb',
          max_marks: 25,
          level_number: 2,
          children: [
            { temp_id: 21, level_type: 'item', title: 'Hip', max_marks: 5, level_number: 1 },
            { temp_id: 22, level_type: 'item', title: 'Thigh', max_marks: 5, level_number: 2 },
            { temp_id: 23, level_type: 'item', title: 'Leg', max_marks: 5, level_number: 3 },
            { temp_id: 24, level_type: 'item', title: 'Foot', max_marks: 5, level_number: 4 },
            { temp_id: 25, level_type: 'item', title: 'Popliteal Fossa', max_marks: 5, level_number: 5 }
          ]
        }
      ]
    },

    getCommunityTemplate() {
      return [
        {
          temp_id: 1,
          level_type: 'topic',
          title: 'Epidemiology',
          max_marks: 20,
          level_number: 1,
          children: [
            { temp_id: 11, level_type: 'content', title: 'Disease Distribution', max_marks: 5, level_number: 1 },
            { temp_id: 12, level_type: 'content', title: 'Screening', max_marks: 5, level_number: 2 },
            { temp_id: 13, level_type: 'content', title: 'Surveillance', max_marks: 5, level_number: 3 },
            { temp_id: 14, level_type: 'content', title: 'Study Designs', max_marks: 5, level_number: 4 }
          ]
        }
      ]
    },

    getClinicalTemplate() {
      return [
        { temp_id: 1, level_type: 'item', title: 'Ward Posting Week 1', max_marks: 5, level_number: 1 },
        { temp_id: 2, level_type: 'item', title: 'Ward Posting Week 2', max_marks: 5, level_number: 2 },
        { temp_id: 3, level_type: 'item', title: 'OPD Posting', max_marks: 5, level_number: 3 },
        { temp_id: 4, level_type: 'item', title: 'Emergency Posting', max_marks: 5, level_number: 4 }
      ]
    },

    getSimpleTemplate() {
      return Array.from({ length: 10 }, (_, i) => ({
        temp_id: i + 1,
        level_type: 'item',
        title: `Item ${i + 1}`,
        max_marks: 10,
        level_number: i + 1
      }))
    }
  }
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}
</style>