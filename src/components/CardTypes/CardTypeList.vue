<template>
  <div class="card-type-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-id-card"></i>
            Card Types Management
          </h1>
          <p class="page-subtitle">Manage card types for different departments and academic years</p>
        </div>
        <router-link to="/card-types/create" class="btn-primary">
          <i class="fas fa-plus"></i>
          Create Card Type
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue">
          <i class="fas fa-id-card"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-value">{{ stats.total }}</h3>
          <p class="stat-label">Total Cards</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-green">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-value">{{ stats.active }}</h3>
          <p class="stat-label">Active Cards</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-purple">
          <i class="fas fa-building"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-value">{{ stats.departments }}</h3>
          <p class="stat-label">Departments</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon bg-orange">
          <i class="fas fa-sitemap"></i>
        </div>
        <div class="stat-details">
          <h3 class="stat-value">{{ stats.withStructure }}</h3>
          <p class="stat-label">With Structure</p>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="content-card">
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
        <!-- Filters Slot -->
        <template #filters>
          <div class="filters-wrapper">
            <div class="filters-row">
              <div class="filter-item">
                <label>Department</label>
                <select v-model="filters.department_id" @change="applyFilters">
                  <option value="">All Departments</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>

              <div class="filter-item">
                <label>Year</label>
                <select v-model="filters.applicable_year" @change="applyFilters">
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>

              <div class="filter-item">
                <label>Category</label>
                <select v-model="filters.card_category" @change="applyFilters">
                  <option value="">All Categories</option>
                  <option value="practical">Practical</option>
                  <option value="dissection">Dissection</option>
                  <option value="lab">Lab</option>
                  <option value="clinical">Clinical</option>
                  <option value="theory">Theory</option>
                  <option value="assessment">Assessment</option>
                </select>
              </div>

              <div class="filter-item">
                <label>Status</label>
                <select v-model="filters.is_active" @change="applyFilters">
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div class="filter-item filter-actions-item">
                <label>&nbsp;</label>
                <div class="action-buttons-group">
                  <button @click="applyFilters" class="btn-apply">
                    <i class="fas fa-search"></i> Apply
                  </button>
                  <button @click="clearFilters" class="btn-clear">
                    <i class="fas fa-times"></i> Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Custom Columns -->
        <template #cell-card_name="{ item }">
          <div class="name-cell">
            <router-link
                :to="`/card-types/${item.id}`"
                class="name-link"
            >
              {{ item.card_name }}
            </router-link>
            <span class="code-text">{{ item.card_code }}</span>
          </div>
        </template>

        <template #cell-department="{ item }">
          <span class="badge badge-purple">
            {{ item.department.name }}
          </span>
        </template>

        <template #cell-card_category="{ item }">
          <span :class="getCategoryClass(item.card_category)">
            {{ formatCategory(item.card_category) }}
          </span>
        </template>

        <template #cell-structure_type="{ item }">
          <div class="structure-info">
            <i :class="getStructureIcon(item.structure_type)"></i>
            {{ formatStructureType(item.structure_type) }}
          </div>
        </template>

        <template #cell-applicable_year="{ item }">
          <span class="year-badge">
            {{ getYearText(item.applicable_year) }}
          </span>
        </template>

        <template #cell-total_marks="{ item }">
          <div class="marks-info">
            <div class="total-marks">{{ item.total_marks }}</div>
            <div class="pass-marks">Pass: {{ item.pass_marks }}</div>
          </div>
        </template>

        <template #cell-features="{ item }">
          <div class="features-tags">
            <span
                v-if="item.has_term_exams"
                class="feature-tag tag-blue"
                title="Has Term Exams"
            >
              <i class="fas fa-file-alt"></i>
              Exams
            </span>
            <span
                v-if="item.has_attendance"
                class="feature-tag tag-green"
                title="Has Attendance"
            >
              <i class="fas fa-user-check"></i>
              Attendance
            </span>
            <span
                v-if="item.requires_cadaver"
                class="feature-tag tag-red"
                title="Requires Cadaver"
            >
              <i class="fas fa-procedures"></i>
              Cadaver
            </span>
          </div>
        </template>

        <template #cell-is_active="{ item }">
          <button
              @click="toggleActive(item)"
              :class="['toggle-status', item.is_active ? 'active' : 'inactive']"
          >
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </button>
        </template>

        <template #cell-actions="{ item }">
          <div class="action-btns">
            <button
                @click="$router.push(`/card-types/${item.id}`)"
                class="action-btn btn-view"
                title="View"
            >
              <i class="fas fa-eye"></i>
            </button>

            <button
                @click="$router.push(`/card-types/${item.id}/edit`)"
                class="action-btn btn-edit"
                title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>

            <button
                @click="duplicateCard(item)"
                class="action-btn btn-copy"
                title="Duplicate"
            >
              <i class="fas fa-copy"></i>
            </button>

            <button
                @click="confirmDelete(item)"
                class="action-btn btn-delete"
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
        practical: 'badge badge-blue',
        dissection: 'badge badge-red',
        lab: 'badge badge-green',
        clinical: 'badge badge-purple',
        theory: 'badge badge-yellow',
        assessment: 'badge badge-pink'
      }
      return classes[category] || classes.practical
    },

    formatCategory(category) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    },

    getStructureIcon(type) {
      const icons = {
        item_based: 'fas fa-list text-blue',
        topic_based: 'fas fa-layer-group text-green',
        module_based: 'fas fa-cube text-purple',
        hybrid: 'fas fa-project-diagram text-orange'
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
/* ==========================================
   Base Styles
   ========================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.card-type-list {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ==========================================
   Page Header
   ========================================== */
.page-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #4299e1;
}

.page-subtitle {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

/* ==========================================
   Primary Button
   ========================================== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(66, 153, 225, 0.2);
}

.btn-primary:hover {
  background-color: #3182ce;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 153, 225, 0.3);
}

/* ==========================================
   Stats Cards
   ========================================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.bg-blue {
  background-color: #4299e1;
}

.stat-icon.bg-green {
  background-color: #48bb78;
}

.stat-icon.bg-purple {
  background-color: #9f7aea;
}

.stat-icon.bg-orange {
  background-color: #ed8936;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

/* ==========================================
   Content Card
   ========================================== */
.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-card >>> table {
  width: 100%;
  border-collapse: collapse;
}

.content-card >>> thead th {
  background-color: #f8fafc;
  padding: 14px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.content-card >>> tbody td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.content-card >>> tbody tr:hover {
  background-color: #f8fafc;
}

.content-card >>> tbody tr:last-child td {
  border-bottom: none;
}

/* ==========================================
   Filters Section
   ========================================== */
.filters-wrapper {
  padding: 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.filters-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 180px;
}

.filter-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}

.filter-item select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  color: #2d3748;
  background-color: white;
  transition: all 0.2s ease;
  cursor: pointer;
}

.filter-item select:hover {
  border-color: #a0aec0;
}

.filter-item select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.filter-actions-item {
  flex: 0 0 auto;
  min-width: auto;
}

.action-buttons-group {
  display: flex;
  gap: 8px;
}

.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-apply:hover {
  background-color: #3182ce;
}

.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background-color: white;
  color: #718096;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background-color: #f7fafc;
  color: #e53e3e;
  border-color: #e53e3e;
}

/* ==========================================
   Table Cell Styles
   ========================================== */
.name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
}

.name-link:hover {
  color: #1e40af;
}

.code-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
}

/* ==========================================
   Badges
   ========================================== */
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.badge-purple {
  background-color: #ede9fe;
  color: #6b21a8;
}

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-red {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-green {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-yellow {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-pink {
  background-color: #fce7f3;
  color: #831843;
}

/* ==========================================
   Structure Info
   ========================================== */
.structure-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.text-blue { color: #2563eb; }
.text-green { color: #16a34a; }
.text-purple { color: #7c3aed; }
.text-orange { color: #ea580c; }

/* ==========================================
   Year Badge
   ========================================== */
.year-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e0f2fe;
  color: #075985;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* ==========================================
   Marks Info
   ========================================== */
.marks-info {
  text-align: center;
}

.total-marks {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.pass-marks {
  font-size: 11px;
  color: #64748b;
}

/* ==========================================
   Features Tags
   ========================================== */
.features-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.tag-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.tag-green {
  background-color: #d1fae5;
  color: #065f46;
}

.tag-red {
  background-color: #fee2e2;
  color: #991b1b;
}

/* ==========================================
   Toggle Status Button
   ========================================== */
.toggle-status {
  padding: 5px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-status.active {
  background-color: #d1fae5;
  color: #065f46;
}

.toggle-status.active:hover {
  background-color: #a7f3d0;
}

.toggle-status.inactive {
  background-color: #f1f5f9;
  color: #64748b;
}

.toggle-status.inactive:hover {
  background-color: #e2e8f0;
}

/* ==========================================
   Action Buttons
   ========================================== */
.action-btns {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.btn-view {
  background-color: #dbeafe;
  color: #1e40af;
}

.btn-view:hover {
  background-color: #bfdbfe;
}

.btn-edit {
  background-color: #d1fae5;
  color: #065f46;
}

.btn-edit:hover {
  background-color: #a7f3d0;
}

.btn-copy {
  background-color: #fed7aa;
  color: #92400e;
}

.btn-copy:hover {
  background-color: #fdba74;
}

.btn-delete {
  background-color: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background-color: #fecaca;
}

/* ==========================================
   Responsive Design
   ========================================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    min-width: 100%;
  }

  .filter-actions-item {
    flex: 1;
  }

  .action-buttons-group {
    width: 100%;
  }

  .btn-apply,
  .btn-clear {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .card-type-list {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-wrapper {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .card-type-list {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .features-tags {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-btns {
    gap: 4px;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}

/* ==========================================
   Print Styles
   ========================================== */
@media print {
  .btn-primary,
  .action-btns,
  .filter-actions {
    display: none !important;
  }

  .card-type-list {
    background: white;
    padding: 0;
  }

  .stat-card,
  .content-card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }
}
</style>