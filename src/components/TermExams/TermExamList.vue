<template>
  <div class="term-exam-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Term Examinations</h1>
          <p class="page-subtitle">Manage term examinations and results</p>
        </div>
        <router-link to="/term-exams/create" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          <span>Add Term Exam</span>
        </router-link>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-blue">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Total Exams</p>
            <p class="stat-value">{{ stats.total_exams }}</p>
          </div>
          <div class="stat-icon">
            <i class="fas fa-file-alt"></i>
          </div>
        </div>
      </div>

      <div class="stat-card stat-yellow">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Scheduled</p>
            <p class="stat-value">{{ stats.scheduled }}</p>
          </div>
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
        </div>
      </div>

      <div class="stat-card stat-green">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Completed</p>
            <p class="stat-value">{{ stats.completed }}</p>
          </div>
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-content">
          <div class="stat-info">
            <p class="stat-label">Total Students</p>
            <p class="stat-value">{{ stats.total_students }}</p>
          </div>
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label class="filter-label">Card Type</label>
          <select
              v-model="filters.card_type_id"
              @change="applyFilters"
              class="filter-select"
          >
            <option value="">All Card Types</option>
            <option
                v-for="cardType in cardTypes"
                :key="cardType.id"
                :value="cardType.id"
            >
              {{ cardType.card_name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Academic Year</label>
          <select
              v-model="filters.academic_year_id"
              @change="applyFilters"
              class="filter-select"
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

        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select
              v-model="filters.status"
              @change="applyFilters"
              class="filter-select"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="filter-group filter-actions">
          <label class="filter-label">&nbsp;</label>
          <button @click="clearFilters" class="btn btn-secondary btn-block">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Term Exams List -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-actions">
          <button @click="exportData" class="btn btn-icon" title="Export">
            <i class="fas fa-download"></i>
          </button>
          <button @click="refreshData" class="btn btn-icon" title="Refresh">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <data-table
          :columns="columns"
          :items="termExams"
          :pagination="pagination"
          :loading="loading"
          :show-filters="true"
          @search="handleSearch"
          @sort="handleSort"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
      >
        <!-- REMOVED DUPLICATE ACTIONS SLOT (was lines 156-163) -->

        <!-- Custom Columns -->
        <template #cell-exam_info="{ item }">
          <div class="exam-info">
            <p class="exam-name">{{ item.term_name }}</p>
            <p class="exam-type">{{ item.card_type.card_name }}</p>
          </div>
        </template>

        <template #cell-schedule="{ item }">
          <div class="schedule-info">
            <p class="schedule-date">{{ formatDate(item.exam_date) }}</p>
            <p class="schedule-time">{{ item.start_time }} - {{ item.end_time }}</p>
          </div>
        </template>

        <template #cell-marks="{ item }">
          <div class="marks-info">
            <p class="marks-total">{{ item.total_marks }}</p>
            <p class="marks-pass">Pass: {{ item.pass_marks }}</p>
          </div>
        </template>

        <template #cell-students="{ item }">
          <div class="students-info">
            <p class="students-count">{{ item.results_count || 0 }}</p>
            <p class="students-label">students</p>
          </div>
        </template>

        <template #cell-status="{ item }">
          <span :class="['status-badge', 'status-' + item.status]">
            {{ formatText(item.status) }}
          </span>
        </template>

        <!-- Actions Column (Row Actions) -->
        <template #actions="{ item }">
          <div class="action-buttons">
            <router-link
                :to="`/term-exams/${item.id}`"
                class="action-btn action-view"
                title="View Details"
            >
              <i class="fas fa-eye"></i>
            </router-link>

            <router-link
                :to="`/term-exams/${item.id}/edit`"
                class="action-btn action-edit"
                title="Edit"
            >
              <i class="fas fa-edit"></i>
            </router-link>

            <router-link
                :to="`/term-exams/${item.id}/results`"
                class="action-btn action-results"
                title="Manage Results"
            >
              <i class="fas fa-chart-bar"></i>
            </router-link>

            <button
                @click="confirmDelete(item)"
                class="action-btn action-delete"
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
        title="Delete Term Exam"
        message="Are you sure you want to delete this term exam? All associated results will also be deleted."
        confirm-text="Delete"
        cancel-text="Cancel"
        variant="danger"
        @confirm="deleteExam"
        @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TermExamList',

  data() {
    return {
      columns: [
        { key: 'exam_info', label: 'Exam Information' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'marks', label: 'Marks' },
        { key: 'students', label: 'Students' },
        { key: 'status', label: 'Status' }
      ],
      filters: {
        card_type_id: '',
        academic_year_id: '',
        status: ''
      },
      searchQuery: '',
      sortBy: 'exam_date',
      sortOrder: 'desc',
      showDeleteDialog: false,
      examToDelete: null,
      cardTypes: [],
      academicYears: [],
      stats: {
        total_exams: 0,
        scheduled: 0,
        completed: 0,
        total_students: 0
      }
    }
  },

  computed: {
    ...mapState('termExams', ['termExams', 'loading', 'pagination'])
  },

  created() {
    this.fetchData()
    this.loadFilterOptions()
    this.loadStatistics()
  },

  methods: {
    ...mapActions('termExams', ['fetchTermExams', 'deleteTermExam']),

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
        await this.fetchTermExams(params)
      } catch (error) {
        this.$toast.error('Error loading term exams')
      }
    },

    async loadFilterOptions() {
      try {
        const cardTypesResponse = await this.$http.get('/card-types', {
          params: { per_page: 100, is_active: 1, has_term_exams: 1 }
        })
        this.cardTypes = cardTypesResponse.data.data

        const yearsResponse = await this.$http.get('/academic-years')
        this.academicYears = yearsResponse.data.data
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    },

    async loadStatistics() {
      try {
        const response = await this.$http.get('/term-exams/statistics', {
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

    handleSort({ column, order }) {
      this.sortBy = column
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
        card_type_id: '',
        academic_year_id: '',
        status: ''
      }
      this.applyFilters()
    },

    confirmDelete(item) {
      this.examToDelete = item
      this.showDeleteDialog = true
    },

    async deleteExam() {
      try {
        await this.deleteTermExam(this.examToDelete.id)
        this.$toast.success('Term exam deleted successfully')
        this.showDeleteDialog = false
        this.examToDelete = null
        this.fetchData()
        this.loadStatistics()
      } catch (error) {
        this.$toast.error('Error deleting term exam')
      }
    },

    refreshData() {
      this.fetchData()
      this.loadStatistics()
    },

    exportData() {
      // Implement export functionality
      this.$toast.info('Export functionality coming soon')
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatText(text) {
      if (!text) return ''
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  }
}
</script>

<style scoped>
/* Your existing styles remain the same... */
/* I've kept the structure but removed the CSS for brevity in this response */
</style>