<template>
  <div class="attendance-list p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <router-link
            to="/attendance/mark"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <i class="fas fa-user-check"></i>
          Mark Attendance
        </router-link>
      </div>
      <p class="text-gray-600">Track and manage student attendance records</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Classes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total_classes }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-calendar text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Present</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.present }}</p>
            <p class="text-xs text-gray-500">{{ stats.present_percentage }}%</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Absent</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.absent }}</p>
            <p class="text-xs text-gray-500">{{ stats.absent_percentage }}%</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="fas fa-times-circle text-red-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Late</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.late }}</p>
            <p class="text-xs text-gray-500">{{ stats.late_percentage }}%</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
              v-model="filters.date_range"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div v-if="filters.date_range === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
              v-model="filters.from_date"
              type="date"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div v-if="filters.date_range === 'custom'">
          <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
              v-model="filters.to_date"
              type="date"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Attendance Type</label>
          <select
              v-model="filters.attendance_type"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="lecture">Lecture</option>
            <option value="practical">Practical</option>
            <option value="tutorial">Tutorial</option>
            <option value="clinic">Clinic</option>
            <option value="seminar">Seminar</option>
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
    </div>

    <!-- Attendance Records -->
    <div class="bg-white rounded-lg shadow">
      <data-table
          :columns="columns"
          :items="attendanceRecords"
          :pagination="pagination"
          :loading="loading"
          :show-filters="true"
          @search="handleSearch"
          @sort="handleSort"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
      >
        <!-- REMOVED DUPLICATE ACTIONS SLOT (was lines 186-201) -->

        <!-- Custom Columns -->
        <template #cell-date="{ item }">
          <div>
            <p class="font-medium text-gray-900">{{ formatDate(item.attendance_date) }}</p>
            <p class="text-xs text-gray-500">{{ getDayName(item.attendance_date) }}</p>
          </div>
        </template>

        <template #cell-class_info="{ item }">
          <div>
            <p class="font-medium text-gray-900">{{ item.subject?.name || 'N/A' }}</p>
            <p class="text-xs text-gray-500">{{ formatText(item.attendance_type) }} • {{ item.class_time || 'N/A' }}</p>
          </div>
        </template>

        <template #cell-teacher="{ item }">
          <div v-if="item.teacher">
            <p class="font-medium text-gray-900">{{ item.teacher.full_name }}</p>
            <p class="text-xs text-gray-500">{{ item.teacher.designation }}</p>
          </div>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-students="{ item }">
          <div class="text-center">
            <p class="text-lg font-bold text-gray-900">{{ item.attendance_records_count || 0 }}</p>
            <p class="text-xs text-gray-500">students</p>
          </div>
        </template>

        <template #cell-summary="{ item }">
          <div class="flex gap-2">
            <div class="text-center">
              <div class="text-green-600 font-semibold">{{ item.present_count || 0 }}</div>
              <div class="text-xs text-gray-500">Present</div>
            </div>
            <div class="text-center">
              <div class="text-red-600 font-semibold">{{ item.absent_count || 0 }}</div>
              <div class="text-xs text-gray-500">Absent</div>
            </div>
            <div class="text-center">
              <div class="text-yellow-600 font-semibold">{{ item.late_count || 0 }}</div>
              <div class="text-xs text-gray-500">Late</div>
            </div>
          </div>
        </template>

        <template #cell-status="{ item }">
          <span
              :class="[
              'px-3 py-1 text-xs font-semibold rounded-full',
              item.is_finalized
                ? 'bg-purple-100 text-purple-800'
                : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ item.is_finalized ? 'Finalized' : 'Draft' }}
          </span>
        </template>

        <!-- Row Actions (only one #actions slot allowed) -->
        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <router-link
                :to="`/attendance/${item.id}`"
                class="text-blue-600 hover:text-blue-800"
                title="View Details"
            >
              <i class="fas fa-eye"></i>
            </router-link>

            <router-link
                v-if="!item.is_finalized"
                :to="`/attendance/${item.id}/edit`"
                class="text-green-600 hover:text-green-800"
                title="Edit"
            >
              <i class="fas fa-edit"></i>
            </router-link>

            <button
                v-if="!item.is_finalized"
                @click="finalizeAttendance(item)"
                class="text-purple-600 hover:text-purple-800"
                title="Finalize"
            >
              <i class="fas fa-lock"></i>
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
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This action cannot be undone."
        confirm-text="Delete"
        cancel-text="Cancel"
        variant="danger"
        @confirm="deleteRecord"
        @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AttendanceList',

  data() {
    return {
      columns: [
        { key: 'date', label: 'Date' },
        { key: 'class_info', label: 'Class Information' },
        { key: 'teacher', label: 'Teacher' },
        { key: 'students', label: 'Total Students' },
        { key: 'summary', label: 'Attendance Summary' },
        { key: 'status', label: 'Status' }
      ],
      filters: {
        date_range: 'this_week',
        from_date: '',
        to_date: '',
        attendance_type: '',
        session_id: '',
        batch_id: ''
      },
      searchQuery: '',
      sortBy: 'attendance_date',
      sortOrder: 'desc',
      showDeleteDialog: false,
      recordToDelete: null,
      sessions: [],
      batches: [],
      stats: {
        total_classes: 0,
        present: 0,
        absent: 0,
        late: 0,
        present_percentage: 0,
        absent_percentage: 0,
        late_percentage: 0
      }
    }
  },

  computed: {
    ...mapState('attendance', ['attendanceRecords', 'loading', 'pagination'])
  },

  created() {
    this.fetchData()
    this.loadFilterOptions()
    this.loadStatistics()
  },

  methods: {
    ...mapActions('attendance', ['fetchAttendanceRecords', 'deleteAttendanceRecord', 'finalizeAttendanceRecord']),

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
        await this.fetchAttendanceRecords(params)
      } catch (error) {
        this.$toast.error('Error loading attendance records')
      }
    },

    async loadFilterOptions() {
      try {
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
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    },

    async loadStatistics() {
      try {
        const response = await this.$http.get('/attendance/statistics', {
          params: this.filters
        })
        this.stats = response.data.data
      } catch (error) {
        console.error('Error loading statistics:', error)
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
      this.loadStatistics()
    },

    clearFilters() {
      this.filters = {
        date_range: 'this_week',
        from_date: '',
        to_date: '',
        attendance_type: '',
        session_id: '',
        batch_id: ''
      }
      this.fetchData()
      this.loadStatistics()
    },

    refreshData() {
      this.fetchData()
      this.loadStatistics()
      this.$toast.success('Data refreshed')
    },

    async finalizeAttendance(item) {
      try {
        await this.finalizeAttendanceRecord(item.id)
        this.$toast.success('Attendance finalized successfully')
        this.fetchData()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error finalizing attendance')
      }
    },

    confirmDelete(item) {
      this.recordToDelete = item
      this.showDeleteDialog = true
    },

    async deleteRecord() {
      if (!this.recordToDelete) return

      try {
        await this.deleteAttendanceRecord(this.recordToDelete.id)
        this.$toast.success('Attendance record deleted successfully')
        this.showDeleteDialog = false
        this.recordToDelete = null
        this.fetchData()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error deleting record')
      }
    },

    exportData() {
      this.$toast.info('Export functionality coming soon')
    },

    formatText(text) {
      if (!text) return ''
      return text.split('_').map(word =>
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
    },

    getDayName(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { weekday: 'long' })
    }
  }
}
</script>

<style scoped>
.attendance-list {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>