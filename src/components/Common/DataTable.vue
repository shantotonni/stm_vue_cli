<template>
  <div class="data-table">
    <!-- Header Actions -->
    <div v-if="showFilters || $slots.actions" class="flex items-center justify-between mb-4">
      <div v-if="showFilters" class="flex-1 max-w-md">
        <div class="relative">
          <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div v-if="$slots.filters && showAdvancedFilters" class="mb-4">
      <slot name="filters"></slot>
    </div>

    <!-- Toggle Advanced Filters -->
    <div v-if="$slots.filters" class="mb-4">
      <button
          @click="showAdvancedFilters = !showAdvancedFilters"
          class="text-sm text-blue-600 hover:text-blue-800"
      >
        <i :class="showAdvancedFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="mr-2"></i>
        {{ showAdvancedFilters ? 'Hide' : 'Show' }} Advanced Filters
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th
              v-for="column in columns"
              :key="column.key"
              @click="column.sortable !== false ? handleSort(column.key) : null"
              :class="[
                                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                            ]"
          >
            <div class="flex items-center gap-2">
              <span>{{ column.label }}</span>
              <i
                  v-if="column.sortable !== false && sortBy === column.key"
                  :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"
                  class="text-blue-600"
              ></i>
              <i
                  v-else-if="column.sortable !== false"
                  class="fas fa-sort text-gray-400"
              ></i>
            </div>
          </th>
          <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-center">
            <loading-spinner />
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <i class="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
              <p class="text-gray-600 text-lg font-medium">No data found</p>
              <p class="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          </td>
        </tr>

        <!-- Data Rows -->
        <tr v-else v-for="(item, index) in items" :key="item.id || index" class="hover:bg-gray-50">
          <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
          >
            <slot :name="`cell-${column.key}`" :item="item" :index="index">
              {{ getCellValue(item, column.key) }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" :index="index"></slot>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && items.length > 0" class="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
      <div class="flex items-center gap-4">
        <div class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ pagination.from || 0 }}</span>
          to
          <span class="font-medium">{{ pagination.to || 0 }}</span>
          of
          <span class="font-medium">{{ pagination.total || 0 }}</span>
          results
        </div>

        <select
            v-model.number="perPage"
            @change="handlePerPageChange"
            class="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="10">10 per page</option>
          <option :value="25">25 per page</option>
          <option :value="50">50 per page</option>
          <option :value="100">100 per page</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
            @click="handlePageChange(1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button
            @click="handlePageChange(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-left"></i>
        </button>

        <div class="flex gap-1">
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="typeof page === 'number' ? handlePageChange(page) : null"
              :class="[
                            'px-3 py-1 border rounded',
                            page === pagination.current_page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
                            typeof page !== 'number' ? 'cursor-default' : ''
                        ]"
          >
            {{ page }}
          </button>
        </div>

        <button
            @click="handlePageChange(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-right"></i>
        </button>
        <button
            @click="handlePageChange(pagination.last_page)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',

  props: {
    columns: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    pagination: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    showFilters: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      searchQuery: '',
      sortBy: '',
      sortOrder: 'asc',
      perPage: 25,
      showAdvancedFilters: false
    }
  },

  computed: {
    visiblePages() {
      if (!this.pagination) return []

      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const pages = []

      if (last <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= last; i++) {
          pages.push(i)
        }
      } else {
        // Always show first page
        pages.push(1)

        if (current > 3) {
          pages.push('...')
        }

        // Show pages around current
        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)

        for (let i = start; i <= end; i++) {
          pages.push(i)
        }

        if (current < last - 2) {
          pages.push('...')
        }

        // Always show last page
        pages.push(last)
      }

      return pages
    }
  },

  methods: {
    handleSearch() {
      this.$emit('search', this.searchQuery)
    },

    handleSort(key) {
      if (this.sortBy === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = key
        this.sortOrder = 'asc'
      }

      this.$emit('sort', {
        key: this.sortBy,
        order: this.sortOrder
      })
    },

    handlePageChange(page) {
      this.$emit('page-change', page)
    },

    handlePerPageChange() {
      this.$emit('per-page-change', this.perPage)
    },

    getCellValue(item, key) {
      const keys = key.split('.')
      let value = item

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k]
        } else {
          return '-'
        }
      }

      return value !== null && value !== undefined ? value : '-'
    }
  }
}
</script>