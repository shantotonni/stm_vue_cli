<template>
  <div class="student-card-list p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold text-gray-900">Student Card Records</h1>
        <router-link
            to="/student-cards/assign"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <i class="fas fa-user-plus"></i>
          Assign Cards
        </router-link>
      </div>
      <p class="text-gray-600">Manage student card assignments and progress</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
            <p class="text-sm text-gray-600">Not Started</p>
            <p class="text-2xl font-bold text-gray-600">{{ stats.not_started }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-gray-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.in_progress }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <i class="fas fa-spinner text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Failed</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.failed }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="fas fa-times-circle text-red-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow">
      <data-table
          :columns="columns"
          :items="studentCards"
          :pagination="pagination"
          :loading="loading"
          :show-filters="true"
          @search="handleSearch"
          @sort="handleSort"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
      >
        <!-- REMOVED DUPLICATE ACTIONS SLOT (was lines 95-110) -->
        <!-- If your data-table component needs header actions, consider using a different slot name like #header-actions -->

        <!-- Filters Slot -->
        <template #filters>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
              <select
                  v-model="filters.card_type_id"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Card Types</option>
                <option
                    v-for="card in cardTypes"
                    :key="card.id"
                    :value="card.id"
                >
                  {{ card.card_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                  v-model="filters.status"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
              <select
                  v-model="filters.session_id"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sessions</option>
                <option
                    v-for="session in sessions"
                    :key="session.id"
                    :value="session.id"
                >
                  {{ session.session_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                  v-model="filters.batch_id"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Batches</option>
                <option
                    v-for="batch in batches"
                    :key="batch.id"
                    :value="batch.id"
                >
                  {{ batch.batch_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
                  v-model="filters.academic_year_id"
                  @change="applyFilters"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Years</option>
                <option
                    v-for="year in academicYears"
                    :key="year.id"
                    :value="year.id"
                >
                  {{ year.year_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
                @click="exportData"
                class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                title="Export"
            >
              <i class="fas fa-download"></i> Export
            </button>
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
        <template #cell-student="{ item }">
          <div>
            <p class="font-medium text-gray-900">{{ item.student.full_name }}</p>
            <p class="text-xs text-gray-500">Roll: {{ item.student.roll_no }}</p>
            <p class="text-xs text-gray-500">{{ item.student.session?.session_name }}</p>
          </div>
        </template>

        <template #cell-card_type="{ item }">
          <div>
            <p class="font-medium text-gray-900">{{ item.card_type.card_name }}</p>
            <p class="text-xs text-gray-500">{{ item.card_type.department.name }}</p>
          </div>
        </template>

        <template #cell-card_number="{ item }">
          <span v-if="item.card_number" class="font-mono text-sm">{{ item.card_number }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-progress="{ item }">
          <div class="w-full">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-600">Progress</span>
              <span class="text-xs font-semibold">{{ item.progress_percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                  :class="[
                  'h-2 rounded-full transition-all duration-300',
                  getProgressColor(item.progress_percentage)
                ]"
                  :style="{ width: item.progress_percentage + '%' }"
              ></div>
            </div>
          </div>
        </template>

        <template #cell-marks="{ item }">
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-900">
              {{ item.obtained_marks || 0 }} / {{ item.total_marks || 0 }}
            </p>
          </div>
        </template>

        <template #cell-attendance="{ item }">
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-900">
              {{ item.attendance_percentage || 0 }}%
            </p>
          </div>
        </template>

        <template #cell-status="{ item }">
          <span :class="getStatusClass(item.status)">
            {{ formatStatus(item.status) }}
          </span>
        </template>

        <template #cell-dates="{ item }">
          <div class="text-xs">
            <p class="text-gray-600">Assigned: {{ formatDate(item.assigned_date) }}</p>
            <p v-if="item.completion_date" class="text-gray-600">
              Completed: {{ formatDate(item.completion_date) }}
            </p>
          </div>
        </template>

        <!-- Row Actions (only one #actions slot allowed) -->
        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <router-link
                :to="`/student-cards/${item.id}`"
                class="text-blue-600 hover:text-blue-800"
                title="View Details"
            >
              <i class="fas fa-eye"></i>
            </router-link>
            <router-link
                :to="`/student-cards/${item.id}/edit`"
                class="text-green-600 hover:text-green-800"
                title="Edit"
            >
              <i class="fas fa-edit"></i>
            </router-link>
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
        title="Delete Student Card"
        message="Are you sure you want to delete this student card record? All progress data will be lost."
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
  name: 'StudentCardList',

  data() {
    return {
      columns: [
        { key: 'student', label: 'Student' },
        { key: 'card_type', label: 'Card Type' },
        { key: 'card_number', label: 'Card Number' },
        { key: 'progress', label: 'Progress' },
        { key: 'marks', label: 'Marks' },
        { key: 'attendance', label: 'Attendance' },
        { key: 'status', label: 'Status' },
        { key: 'dates', label: 'Dates' }
      ],
      filters: {
        card_type_id: '',
        status: '',
        session_id: '',
        batch_id: '',
        academic_year_id: ''
      },
      searchQuery: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      showDeleteDialog: false,
      cardToDelete: null,
      cardTypes: [],
      sessions: [],
      batches: [],
      academicYears: []
    }
  },

  computed: {
    ...mapState('studentCards', ['studentCards', 'loading', 'pagination']),

    stats() {
      return {
        total: this.studentCards.length,
        not_started: this.studentCards.filter(c => c.status === 'not_started').length,
        in_progress: this.studentCards.filter(c => c.status === 'in_progress').length,
        completed: this.studentCards.filter(c => c.status === 'completed').length,
        failed: this.studentCards.filter(c => c.status === 'failed').length
      }
    }
  },

  created() {
    this.fetchData()
    this.loadFilterOptions()
  },

  methods: {
    ...mapActions('studentCards', ['fetchStudentCards', 'deleteStudentCard']),

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
        await this.fetchStudentCards(params)
      } catch (error) {
        this.$toast.error('Error loading student cards')
      }
    },

    async loadFilterOptions() {
      try {
        // Load card types
        const cardTypesResponse = await this.$http.get('/card-types', {
          params: { per_page: 100, is_active: 1 }
        })
        this.cardTypes = cardTypesResponse.data.data

        // Load sessions
        const sessionsResponse = await this.$http.get('/sessions', {
          params: { per_page: 100, is_active: 1 }
        })
        this.sessions = sessionsResponse.data.data

        // Load batches
        const batchesResponse = await this.$http.get('/batches', {
          params: { per_page: 100, is_active: 1 }
        })
        this.batches = batchesResponse.data.data

        // Load academic years
        const yearsResponse = await this.$http.get('/academic-years')
        this.academicYears = yearsResponse.data.data
      } catch (error) {
        console.error('Error loading filter options:', error)
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
        card_type_id: '',
        status: '',
        session_id: '',
        batch_id: '',
        academic_year_id: ''
      }
      this.fetchData()
    },

    refreshData() {
      this.fetchData()
      this.$toast.success('Data refreshed')
    },

    confirmDelete(item) {
      this.cardToDelete = item
      this.showDeleteDialog = true
    },

    async deleteCard() {
      if (!this.cardToDelete) return

      try {
        await this.deleteStudentCard(this.cardToDelete.id)
        this.$toast.success('Student card deleted successfully')
        this.showDeleteDialog = false
        this.cardToDelete = null
        this.fetchData()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error deleting student card')
      }
    },

    exportData() {
      // Implementation for export
      this.$toast.info('Export functionality coming soon')
    },

    getProgressColor(percentage) {
      if (percentage >= 80) return 'bg-green-500'
      if (percentage >= 50) return 'bg-yellow-500'
      if (percentage >= 25) return 'bg-orange-500'
      return 'bg-red-500'
    },

    getStatusClass(status) {
      const classes = {
        not_started: 'px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
        in_progress: 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
        completed: 'px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        failed: 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
      }
      return classes[status] || classes.not_started
    },

    formatStatus(status) {
      return status.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.student-card-list {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>