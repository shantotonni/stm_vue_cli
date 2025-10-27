<template>
  <div class="card-type-list p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold text-gray-900">Card Types</h1>
        <router-link
            to="/card-types/create"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          Create Card Type
        </router-link>
      </div>
      <p class="text-gray-600">Manage card types for different departments and years</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Cards</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-id-card text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Departments</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.departments }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <i class="fas fa-building text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">With Structure</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.withStructure }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <i class="fas fa-sitemap text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow">
      <data-table
          :columns="columns"
          :items="cardTypes"
          :pagination="pagination"
          :loading="loading"
          :show-filters="true"
          @search="handleSearch"
          @sort="handleSort"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
      >
        <!-- REMOVED DUPLICATE ACTIONS SLOT (was lines 83-91) -->

        <!-- Filters Slot -->
        <template #filters>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                  v-model="filters.department_id"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                <option
                    v-for="dept in departments"
                    :key="dept.id"
                    :value="dept.id"
                >
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                  v-model="filters.applicable_year"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                  v-model="filters.card_category"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="practical">Practical</option>
                <option value="dissection">Dissection</option>
                <option value="lab">Lab</option>
                <option value="clinical">Clinical</option>
                <option value="theory">Theory</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                  v-model="filters.is_active"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
                @click="refreshData"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                title="Refresh"
            >
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button
                @click="clearFilters"
                class="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </template>

        <!-- Custom Columns -->
        <template #cell-card_name="{ item }">
          <div>
            <router-link
                :to="`/card-types/${item.id}`"
                class="font-medium text-blue-600 hover:text-blue-800"
            >
              {{ item.card_name }}
            </router-link>
            <p class="text-xs text-gray-500">{{ item.card_code }}</p>
          </div>
        </template>

        <template #cell-department="{ item }">
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            {{ item.department.name }}
          </span>
        </template>

        <template #cell-card_category="{ item }">
          <span :class="getCategoryClass(item.card_category)">
            {{ formatCategory(item.card_category) }}
          </span>
        </template>

        <template #cell-structure_type="{ item }">
          <div class="flex items-center gap-2">
            <i :class="getStructureIcon(item.structure_type)"></i>
            {{ formatStructureType(item.structure_type) }}
          </div>
        </template>

        <template #cell-applicable_year="{ item }">
          <span class="font-medium">{{ getYearText(item.applicable_year) }}</span>
        </template>

        <template #cell-total_marks="{ item }">
          <div class="text-center">
            <div class="font-semibold">{{ item.total_marks }}</div>
            <div class="text-xs text-gray-500">Pass: {{ item.pass_marks }}</div>
          </div>
        </template>

        <template #cell-features="{ item }">
          <div class="flex gap-1">
            <span
                v-if="item.has_term_exams"
                class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                title="Has Term Exams"
            >
              <i class="fas fa-file-alt"></i> Exams
            </span>
            <span
                v-if="item.has_attendance"
                class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                title="Has Attendance"
            >
              <i class="fas fa-user-check"></i> Attendance
            </span>
            <span
                v-if="item.requires_cadaver"
                class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
                title="Requires Cadaver"
            >
              <i class="fas fa-procedures"></i> Cadaver
            </span>
          </div>
        </template>

        <template #cell-is_active="{ item }">
          <button
              @click="toggleActive(item)"
              :class="[
              'px-3 py-1 text-xs font-semibold rounded-full',
              item.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </button>
        </template>

        <!-- Row Actions (only one #actions slot allowed) -->
        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <router-link
                :to="`/card-types/${item.id}`"
                class="text-blue-600 hover:text-blue-800"
                title="View Details"
            >
              <i class="fas fa-eye"></i>
            </router-link>

            <router-link
                :to="`/card-types/${item.id}/structure`"
                class="text-purple-600 hover:text-purple-800"
                title="Edit Structure"
            >
              <i class="fas fa-sitemap"></i>
            </router-link>

            <router-link
                :to="`/card-types/${item.id}/edit`"
                class="text-green-600 hover:text-green-800"
                title="Edit"
            >
              <i class="fas fa-edit"></i>
            </router-link>

            <button
                @click="duplicateCard(item)"
                class="text-green-600 hover:text-green-800"
                title="Duplicate"
            >
              <i class="fas fa-copy"></i>
            </button>

            <button
                @click="confirmDelete(item)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </data-table>
    </div>

    <!-- Confirm Dialog -->
    <confirm-dialog
        :show="showDeleteDialog"
        title="Delete Card Type"
        message="Are you sure you want to delete this card type? This action cannot be undone."
        confirm-text="Delete"
        cancel-text="Cancel"
        variant="danger"
        @confirm="deleteCard"
        @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CardTypeList',

  data() {
    return {
      columns: [
        { key: 'card_name', label: 'Card Name' },
        { key: 'department', label: 'Department' },
        { key: 'card_category', label: 'Category' },
        { key: 'structure_type', label: 'Structure' },
        { key: 'applicable_year', label: 'Year' },
        { key: 'total_marks', label: 'Marks' },
        { key: 'features', label: 'Features' },
        { key: 'is_active', label: 'Status' }
      ],
      filters: {
        department_id: '',
        applicable_year: '',
        card_category: '',
        is_active: ''
      },
      searchQuery: '',
      sortBy: 'sequence',
      sortOrder: 'asc',
      showDeleteDialog: false,
      cardToDelete: null
    }
  },

  computed: {
    ...mapState('cardTypes', ['cardTypes', 'loading', 'pagination']),
    ...mapState(['departments']),

    stats() {
      return {
        total: this.cardTypes.length,
        active: this.cardTypes.filter(c => c.is_active).length,
        departments: [...new Set(this.cardTypes.map(c => c.department_id))].length,
        withStructure: this.cardTypes.filter(c => c.has_structure).length
      }
    }
  },

  created() {
    this.fetchData()
    this.$store.dispatch('fetchDepartments')
  },

  methods: {
    ...mapActions('cardTypes', [
      'fetchCardTypes',
      'deleteCardType',
      'toggleActive',
      'duplicateCardType'
    ]),

    async fetchData() {
      const params = {
        ...this.filters,
        search: this.searchQuery,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        page: this.pagination.current_page,
        per_page: this.pagination.per_page
      }

      try {
        await this.fetchCardTypes(params)
      } catch (error) {
        this.$toast.error('Error loading card types')
      }
    },

    handleSearch(query) {
      this.searchQuery = query
      this.pagination.current_page = 1
      this.fetchData()
    },

    handleSort({ key, order }) {
      this.sortBy = key
      this.sortOrder = order
      this.fetchData()
    },

    handlePageChange(page) {
      this.pagination.current_page = page
      this.fetchData()
    },

    handlePerPageChange(perPage) {
      this.pagination.per_page = perPage
      this.pagination.current_page = 1
      this.fetchData()
    },

    applyFilters() {
      this.pagination.current_page = 1
      this.fetchData()
    },

    clearFilters() {
      this.filters = {
        department_id: '',
        applicable_year: '',
        card_category: '',
        is_active: ''
      }
      this.fetchData()
    },

    refreshData() {
      this.fetchData()
      this.$toast.success('Data refreshed')
    },

    async toggleActive(item) {
      try {
        await this.$store.dispatch('cardTypes/toggleActive', item.id)
        this.$toast.success('Status updated successfully')
      } catch (error) {
        this.$toast.error('Error updating status')
      }
    },

    async duplicateCard(item) {
      try {
        await this.duplicateCardType(item.id)
        this.$toast.success('Card type duplicated successfully')
        this.fetchData()
      } catch (error) {
        this.$toast.error('Error duplicating card type')
      }
    },

    confirmDelete(item) {
      this.cardToDelete = item
      this.showDeleteDialog = true
    },

    async deleteCard() {
      if (!this.cardToDelete) return

      try {
        await this.deleteCardType(this.cardToDelete.id)
        this.$toast.success('Card type deleted successfully')
        this.showDeleteDialog = false
        this.cardToDelete = null
        this.fetchData()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error deleting card type')
      }
    },

    getCategoryClass(category) {
      const classes = {
        practical: 'px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
        dissection: 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
        lab: 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        clinical: 'px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800',
        theory: 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
        assessment: 'px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800'
      }
      return classes[category] || classes.practical
    },

    formatCategory(category) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    },

    getStructureIcon(type) {
      const icons = {
        item_based: 'fas fa-list text-blue-600',
        topic_based: 'fas fa-layer-group text-green-600',
        module_based: 'fas fa-cube text-purple-600',
        hybrid: 'fas fa-project-diagram text-orange-600'
      }
      return icons[type] || icons.item_based
    },

    formatStructureType(type) {
      return type.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    getYearText(year) {
      const yearMap = {
        1: '1st Year',
        2: '2nd Year',
        3: '3rd Year',
        4: '4th Year',
        5: '5th Year'
      }
      return yearMap[year] || `Year ${year}`
    }
  }
}
</script>

<style scoped>
.card-type-list {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>