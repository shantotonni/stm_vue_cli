<template>
  <div class="card-structure-levels">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-sitemap"></i>
          </div>
          <div>
            <h1>Card Structure Levels</h1>
            <p class="subtitle">Manage hierarchical card structure levels efficiently</p>
          </div>
        </div>
        <router-link to="/card-structure-levels/create" class="btn-add">
          <i class="fa fa-plus-circle"></i>
          <span>New Structure Level</span>
        </router-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards" v-if="statistics">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-layer-group"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.total_levels || 0 }}</h3>
          <p>Total Levels</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.active_levels || 0 }}</h3>
          <p>Active Levels</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fa fa-star"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.total_marks || 0 }}</h3>
          <p>Total Marks</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fa fa-id-card"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.card_types_count || 0 }}</h3>
          <p>Card Types</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fa fa-search search-icon"></i>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by title, level number..."
            class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-id-card"></i> Card Type</label>
          <select v-model="filters.card_type_id" @change="loadLevels" class="filter-select">
            <option value="">All Card Types</option>
            <option v-for="type in cardTypes" :key="type.id" :value="type.id">
              {{ type.card_name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-tag"></i> Level Type</label>
          <select v-model="filters.level_type" @change="loadLevels" class="filter-select">
            <option value="">All Level Types</option>
            <option value="topic">Topic</option>
            <option value="item">Item</option>
            <option value="content">Content</option>
            <option value="sub_content">Sub Content</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-toggle-on"></i> Status</label>
          <select v-model="filters.is_active" @change="loadLevels" class="filter-select">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div class="filter-item">
          <button @click="clearFilters" class="btn-clear">
            <i class="fa fa-sync-alt"></i>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Table Card -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-hashtag"></i> Level #</th>
            <th><i class="fa fa-heading"></i> Title</th>
            <th><i class="fa fa-tag"></i> Type</th>
            <th><i class="fa fa-id-card"></i> Card Type</th>
            <th><i class="fa fa-sitemap"></i> Parent</th>
            <th><i class="fa fa-star"></i> Max Marks</th>
            <th><i class="fa fa-sort-numeric-up"></i> Sequence</th>
            <th><i class="fa fa-toggle-on"></i> Status</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="9" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading structure levels...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="levels.length === 0">
            <td colspan="9" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-inbox"></i>
                <p>No structure levels found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="level in levels" :key="level.id" class="table-row">
            <td><span class="id-badge">{{ level.level_number }}</span></td>
            <td>
              <div class="level-name-cell">
                <span class="name">{{ level.title }}</span>
              </div>
            </td>
            <td>
                <span class="type-badge" :class="getTypeBadgeClass(level.level_type)">
                  {{ formatLevelType(level.level_type) }}
                </span>
            </td>
            <td>
                <span class="card-type-badge">
                  {{ level.card_type ? level.card_type.name : 'N/A' }}
                </span>
            </td>
            <td class="parent-text">
                <span class="parent-badge">
                  {{ level.parent ? level.parent.title : 'Root' }}
                </span>
            </td>
            <td>
                <span class="marks-badge">
                  <i class="fa fa-star"></i> {{ level.max_marks || 0 }}
                </span>
            </td>
            <td>
              <span class="sequence-badge">{{ level.sequence }}</span>
            </td>
            <td>
              <button
                  @click="toggleStatus(level)"
                  :class="['status-toggle', level.is_active ? 'is-active' : 'is-inactive']"
                  :title="level.is_active ? 'Active' : 'Inactive'"
              >
                <i :class="level.is_active ? 'fa fa-toggle-on' : 'fa fa-toggle-off'"></i>
                {{ level.is_active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td>
              <div class="action-buttons">
                <router-link
                    :to="`/card-structure-levels/${level.id}`"
                    class="btn-action btn-view"
                    title="View"
                >
                  <i class="fa fa-eye"></i>
                </router-link>
                <router-link
                    :to="`/card-structure-levels/${level.id}/edit`"
                    class="btn-action btn-edit"
                    title="Edit"
                >
                  <i class="fa fa-edit"></i>
                </router-link>
                <button
                    @click="confirmDelete(level)"
                    class="btn-action btn-delete"
                    title="Delete"
                >
                  <i class="fa fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination -->
      <div class="pagination-wrapper" v-if="pagination.total > 0">
        <div class="pagination-info">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} levels
        </div>
        <div class="pagination-controls">
          <button
              @click="changePage(1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
              title="First Page"
          >
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
          >
            <i class="fa fa-angle-left"></i>
          </button>

          <div class="page-numbers">
            <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="['page-number', { active: page === pagination.current_page }]"
                :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>

          <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
          >
            <i class="fa fa-angle-right"></i>
          </button>
          <button
              @click="changePage(pagination.last_page)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
              title="Last Page"
          >
            <i class="fa fa-angle-double-right"></i>
          </button>
        </div>
        <div class="per-page-selector">
          <select v-model="pagination.per_page" @change="loadLevels" class="per-page-select">
            <option value="10">10 / page</option>
            <option value="15">15 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <transition name="modal-fade">
      <div v-if="deleteModal.show" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container small-modal">
          <div class="modal-header danger">
            <div class="modal-title">
              <i class="fa fa-exclamation-triangle"></i>
              <h2>Confirm Delete</h2>
            </div>
            <button @click="closeDeleteModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-form" v-if="deleteModal.level">
            <div class="delete-warning">
              <i class="fa fa-exclamation-circle"></i>
              <p>Are you sure you want to delete this structure level?</p>
              <div class="delete-info">
                <strong>{{ deleteModal.level.title }}</strong>
                <small>Level #{{ deleteModal.level.level_number }}</small>
              </div>
              <p class="warning-text">This action cannot be undone!</p>
            </div>

            <div class="modal-actions">
              <button @click="closeDeleteModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button @click="deleteLevel" class="btn-delete-confirm" :disabled="deleting">
                <i :class="deleting ? 'fa fa-spinner fa-spin' : 'fa fa-trash-alt'"></i>
                <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '@/plugins/card';
import cardTypeService from '../Admin/card-type/cardTypeService';

export default {
  name: 'CardStructureLevelList',
  data() {
    return {
      levels: [],
      cardTypes: [],
      statistics: null,
      loading: false,
      deleting: false,
      filters: {
        card_type_id: '',
        level_type: '',
        is_active: '',
        search: '',
        sort_by: 'sequence',
        sort_order: 'asc'
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      },
      deleteModal: {
        show: false,
        level: null
      },
      searchTimeout: null
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      const currentPage = this.pagination.current_page;
      const lastPage = this.pagination.last_page;
      const delta = 2;

      let start = Math.max(1, currentPage - delta);
      let end = Math.min(lastPage, currentPage + delta);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < lastPage) {
        if (end < lastPage - 1) pages.push('...');
        pages.push(lastPage);
      }

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    }
  },
  mounted() {
    this.loadCardTypes();
    this.loadLevels();
    //this.loadStatistics();
  },
  methods: {
    async loadCardTypes() {
      try {
        const response = await cardTypeService.getAll({ per_page: 100 });
        this.cardTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card types:', error);
      }
    },

    async loadLevels() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.cardStructureLevels.getAll(params);
        this.levels = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load structure levels',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },

    async loadStatistics() {
      try {
        const response = await api.cardStructureLevels.getStatistics();
        this.statistics = response.data;
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.loadLevels();
      }, 500);
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadLevels();
      }
    },

    clearFilters() {
      this.filters = {
        card_type_id: '',
        level_type: '',
        is_active: '',
        search: '',
        sort_by: 'sequence',
        sort_order: 'asc'
      };
      this.pagination.current_page = 1;
      this.loadLevels();
    },

    confirmDelete(level) {
      this.deleteModal = { show: true, level: level };
    },

    async deleteLevel() {
      this.deleting = true;
      try {
        await api.cardStructureLevels.delete(this.deleteModal.level.id);
        this.$root.$emit('show-notification', {
          message: 'Structure level deleted successfully',
          type: 'success'
        });
        this.closeDeleteModal();
        this.loadLevels();
        this.loadStatistics();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to delete level',
          type: 'danger'
        });
      } finally {
        this.deleting = false;
      }
    },

    async toggleStatus(level) {
      try {
        const response = await api.cardStructureLevels.toggleActive(level.id);
        level.is_active = response.data.is_active;
        this.$root.$emit('show-notification', {
          message: 'Status updated successfully',
          type: 'success'
        });
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to update status',
          type: 'danger'
        });
      }
    },

    closeDeleteModal() {
      this.deleteModal = {
        show: false,
        level: null
      };
    },

    formatLevelType(type) {
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    getTypeBadgeClass(type) {
      const classes = {
        topic: 'type-topic',
        item: 'type-item',
        content: 'type-content',
        sub_content: 'type-sub'
      };
      return classes[type] || '';
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.card-structure-levels {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Modern Header with Gradient */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.title-section h1 {
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin: 5px 0 0 0;
}

.btn-add {
  padding: 15px 30px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info h3 {
  font-size: 36px;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: #718096;
  margin: 5px 0 0 0;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.filter-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.filter-item label i {
  color: #667eea;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-clear {
  width: 100%;
  padding: 12px 16px;
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Modern Table Card */
.table-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.modern-table th {
  padding: 18px 15px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody tr:hover {
  background: #f7fafc;
}

.modern-table td {
  padding: 18px 15px;
  font-size: 14px;
  color: #2d3748;
}

/* Loading & Empty States */
.loading-cell,
.empty-cell {
  text-align: center;
  padding: 60px 20px !important;
}

.loading-spinner,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #718096;
}

.loading-spinner i,
.empty-state i {
  font-size: 48px;
  opacity: 0.3;
}

/* Table Cell Styles */
.id-badge {
  display: inline-block;
  padding: 8px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  min-width: 45px;
  text-align: center;
}

.level-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.level-name-cell .name {
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
}

.type-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.type-badge.type-topic {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge.type-item {
  background: #d1fae5;
  color: #065f46;
}

.type-badge.type-content {
  background: #fef3c7;
  color: #92400e;
}

.type-badge.type-sub {
  background: #f3e8ff;
  color: #6b21a8;
}

.card-type-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #e6fffa;
  color: #047857;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.parent-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #f7fafc;
  color: #718096;
  border-radius: 8px;
  font-size: 13px;
  font-style: italic;
}

.marks-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.marks-badge i {
  font-size: 12px;
}

.sequence-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.status-toggle {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.status-toggle.is-active {
  background: #d1fae5;
  color: #065f46;
}

.status-toggle.is-inactive {
  background: #e2e8f0;
  color: #4a5568;
}

.status-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-action.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-action.btn-view:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.btn-action.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-action.btn-edit:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-2px);
}

.btn-action.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action.btn-delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

/* Modern Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  gap: 15px;
  flex-wrap: wrap;
}

.pagination-info {
  color: #4a5568;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-number:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.page-number:disabled {
  cursor: default;
  border-color: transparent;
}

.per-page-selector select {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.per-page-selector select:focus {
  outline: none;
  border-color: #667eea;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-container.small-modal {
  max-width: 500px;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.modal-header.danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.modal-title i {
  font-size: 28px;
}

.modal-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

/* Delete Warning */
.delete-warning {
  text-align: center;
  padding: 20px;
}

.delete-warning > i {
  font-size: 64px;
  color: #e74c3c;
  margin-bottom: 20px;
  display: block;
}

.delete-warning p {
  font-size: 16px;
  color: #2d3748;
  margin: 15px 0;
}

.delete-info {
  padding: 20px;
  background: #fee2e2;
  border-radius: 12px;
  margin: 20px 0;
}

.delete-info strong {
  display: block;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 5px;
}

.delete-info small {
  font-size: 14px;
  color: #991b1b;
}

.warning-text {
  font-weight: 600;
  color: #e74c3c;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-delete-confirm {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-delete-confirm {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.btn-delete-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .card-structure-levels {
    padding: 20px 15px;
  }

  .header-section {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .title-section h1 {
    font-size: 26px;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .table-card {
    margin: 0 -20px;
    border-radius: 0;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }

  .pagination-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-delete-confirm {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .card-structure-levels {
    padding: 15px 10px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .stat-card {
    padding: 15px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

/* Scrollbar Styling */
.table-wrapper::-webkit-scrollbar,
.modal-container::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.table-wrapper::-webkit-scrollbar-track,
.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb,
.modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover,
.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>