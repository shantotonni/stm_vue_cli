<!-- resources/js/components/CadaverManagement.vue -->
<template>
  <div class="cadaver-management">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-left">
        <h2 class="page-title">Cadaver Management</h2>
        <p class="page-subtitle">Manage and track cadaver inventory</p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <i class="fas fa-plus"></i> Add New Cadaver
      </button>
    </div>

    <!-- Filter & Search Section -->
    <div class="filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
            type="text"
            v-model="filters.search"
            @input="searchCadavers"
            placeholder="Search by cadaver number, location..."
        />
      </div>

      <div class="filter-controls">
        <select v-model="filters.is_available" @change="fetchCadavers" class="filter-select">
          <option value="">All Status</option>
          <option value="1">Available</option>
          <option value="0">Not Available</option>
        </select>

        <select v-model="filters.gender" @change="fetchCadavers" class="filter-select">
          <option value="">All Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="unknown">Unknown</option>
        </select>

        <select v-model="filters.condition_status" @change="fetchCadavers" class="filter-select">
          <option value="">All Conditions</option>
          <option value="good">Good</option>
          <option value="average">Average</option>
          <option value="poor">Poor</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card available">
        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
        <div class="stat-info">
          <h3>{{ statistics.available }}</h3>
          <p>Available</p>
        </div>
      </div>
      <div class="stat-card total">
        <div class="stat-icon"><i class="fas fa-box"></i></div>
        <div class="stat-info">
          <h3>{{ statistics.total }}</h3>
          <p>Total Cadavers</p>
        </div>
      </div>
      <div class="stat-card good">
        <div class="stat-icon"><i class="fas fa-heart"></i></div>
        <div class="stat-info">
          <h3>{{ statistics.good_condition }}</h3>
          <p>Good Condition</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading cadavers...</p>
    </div>

    <!-- Cadaver Cards Grid -->
    <div v-else-if="cadavers.length > 0" class="cadavers-grid">
      <div
          v-for="cadaver in cadavers"
          :key="cadaver.id"
          class="cadaver-card"
          :class="{ 'unavailable': !cadaver.is_available }"
      >
        <div class="card-header">
          <div class="card-number">
            <i class="fas fa-hashtag"></i>
            {{ cadaver.cadaver_number }}
          </div>
          <span
              class="availability-badge"
              :class="cadaver.is_available ? 'available' : 'unavailable'"
          >
            {{ cadaver.is_available ? 'Available' : 'Not Available' }}
          </span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <div class="info-item">
              <i class="fas fa-building"></i>
              <span>{{ cadaver.department ? cadaver.department.name : 'N/A' }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <i class="fas fa-venus-mars"></i>
              <span class="capitalize">{{ cadaver.gender }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-calendar"></i>
              <span>{{ formatDate(cadaver.received_date) }}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ cadaver.location || 'No location' }}</span>
            </div>
          </div>

          <div class="condition-row">
            <span class="condition-label">Condition:</span>
            <span
                class="condition-badge"
                :class="cadaver.condition_status"
            >
              {{ cadaver.condition_status }}
            </span>
          </div>

          <div v-if="cadaver.notes" class="notes-section">
            <i class="fas fa-sticky-note"></i>
            <p>{{ truncateText(cadaver.notes, 80) }}</p>
          </div>
        </div>

        <div class="card-footer">
          <button @click="viewCadaver(cadaver)" class="btn-view" title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button @click="editCadaver(cadaver)" class="btn-edit" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="confirmDelete(cadaver)" class="btn-delete" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="fas fa-inbox"></i>
      <h3>No cadavers found</h3>
      <p>Start by adding a new cadaver to the system</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="page-btn"
      >
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <span class="page-info">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </span>
      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="page-btn"
      >
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Cadaver' : 'Add New Cadaver' }}</h3>
          <button @click="closeModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveCadaver">
            <div class="form-row">
              <div class="form-group">
                <label>Cadaver Number <span class="required">*</span></label>
                <input
                    type="text"
                    v-model="form.cadaver_number"
                    placeholder="Enter cadaver number"
                    required
                />
                <span v-if="errors.cadaver_number" class="error-text">
                  {{ errors.cadaver_number[0] }}
                </span>
              </div>

              <div class="form-group">
                <label>Department <span class="required">*</span></label>
                <select v-model="form.department_id" required>
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="error-text">
                  {{ errors.department_id[0] }}
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Gender <span class="required">*</span></label>
                <select v-model="form.gender" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
                <span v-if="errors.gender" class="error-text">
                  {{ errors.gender[0] }}
                </span>
              </div>

              <div class="form-group">
                <label>Received Date</label>
                <input type="date" v-model="form.received_date" />
                <span v-if="errors.received_date" class="error-text">
                  {{ errors.received_date[0] }}
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Condition Status <span class="required">*</span></label>
                <select v-model="form.condition_status" required>
                  <option value="">Select Condition</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
                <span v-if="errors.condition_status" class="error-text">
                  {{ errors.condition_status[0] }}
                </span>
              </div>

              <div class="form-group">
                <label>Location</label>
                <input
                    type="text"
                    v-model="form.location"
                    placeholder="Enter location"
                />
                <span v-if="errors.location" class="error-text">
                  {{ errors.location[0] }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.is_available" />
                <span>Available for use</span>
              </label>
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea
                  v-model="form.notes"
                  rows="4"
                  placeholder="Enter any additional notes..."
              ></textarea>
              <span v-if="errors.notes" class="error-text">
                {{ errors.notes[0] }}
              </span>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal">
        <div class="modal-header">
          <h3>Cadaver Details</h3>
          <button @click="closeViewModal" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Cadaver Number</label>
              <p>{{ viewData.cadaver_number }}</p>
            </div>
            <div class="detail-item">
              <label>Department</label>
              <p>{{ viewData.department ? viewData.department.name : 'N/A' }}</p>
            </div>
            <div class="detail-item">
              <label>Gender</label>
              <p class="capitalize">{{ viewData.gender }}</p>
            </div>
            <div class="detail-item">
              <label>Received Date</label>
              <p>{{ formatDate(viewData.received_date) }}</p>
            </div>
            <div class="detail-item">
              <label>Condition Status</label>
              <p>
                <span class="condition-badge" :class="viewData.condition_status">
                  {{ viewData.condition_status }}
                </span>
              </p>
            </div>
            <div class="detail-item">
              <label>Location</label>
              <p>{{ viewData.location || 'N/A' }}</p>
            </div>
            <div class="detail-item">
              <label>Availability</label>
              <p>
                <span
                    class="availability-badge"
                    :class="viewData.is_available ? 'available' : 'unavailable'"
                >
                  {{ viewData.is_available ? 'Available' : 'Not Available' }}
                </span>
              </p>
            </div>
            <div class="detail-item full-width">
              <label>Notes</label>
              <p>{{ viewData.notes || 'No notes available' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-container delete-modal">
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button @click="showDeleteModal = false" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete cadaver <strong>{{ deleteItem.cadaver_number }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          <button @click="deleteCadaver" class="btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CadaverManagement',
  data() {
    return {
      cadavers: [],
      departments: [],
      loading: false,
      saving: false,
      deleting: false,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      searchTimeout: null,
      filters: {
        search: '',
        is_available: '',
        gender: '',
        condition_status: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
      },
      statistics: {
        total: 0,
        available: 0,
        good_condition: 0
      },
      form: {
        cadaver_number: '',
        department_id: '',
        gender: '',
        received_date: '',
        condition_status: '',
        location: '',
        is_available: true,
        notes: ''
      },
      viewData: {},
      deleteItem: {},
      errors: {}
    };
  },
  mounted() {
    this.fetchCadavers();
    this.fetchDepartments();
  },
  methods: {
    async fetchCadavers(page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          ...this.filters
        };
        const response = await this.$api.get('/cadavers', { params });
        this.cadavers = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
        this.calculateStatistics();
      } catch (error) {
        console.error('Error fetching cadavers:', error);
        this.$toast.error('Failed to load cadavers');
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$api.get('/cadavers/departments/list');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    searchCadavers() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchCadavers();
      }, 500);
    },

    calculateStatistics() {
      this.statistics.total = this.pagination.total;
      this.statistics.available = this.cadavers.filter(c => c.is_available).length;
      this.statistics.good_condition = this.cadavers.filter(c => c.condition_status === 'good').length;
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    editCadaver(cadaver) {
      this.isEditing = true;
      this.form = {
        id: cadaver.id,
        cadaver_number: cadaver.cadaver_number,
        department_id: cadaver.department_id,
        gender: cadaver.gender,
        received_date: cadaver.received_date,
        condition_status: cadaver.condition_status,
        location: cadaver.location,
        is_available: cadaver.is_available,
        notes: cadaver.notes
      };
      this.showModal = true;
    },

    viewCadaver(cadaver) {
      this.viewData = cadaver;
      this.showViewModal = true;
    },

    async saveCadaver() {
      this.saving = true;
      this.errors = {};
      try {
        if (this.isEditing) {
          await this.$api.put(`/cadavers/${this.form.id}`, this.form);
          this.$toast.success('Cadaver updated successfully');
        } else {
          await this.$api.post('/cadavers', this.form);
          this.$toast.success('Cadaver created successfully');
        }
        this.closeModal();
        this.fetchCadavers();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
        this.$toast.error('Failed to save cadaver');
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(cadaver) {
      this.deleteItem = cadaver;
      this.showDeleteModal = true;
    },

    async deleteCadaver() {
      this.deleting = true;
      try {
        await this.$api.delete(`/cadavers/${this.deleteItem.id}`);
        this.$toast.success('Cadaver deleted successfully');
        this.showDeleteModal = false;
        this.fetchCadavers();
      } catch (error) {
        console.error('Error deleting cadaver:', error);
        this.$toast.error('Failed to delete cadaver');
      } finally {
        this.deleting = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    closeViewModal() {
      this.showViewModal = false;
      this.viewData = {};
    },

    resetForm() {
      this.form = {
        cadaver_number: '',
        department_id: '',
        gender: '',
        received_date: '',
        condition_status: '',
        location: '',
        is_available: true,
        notes: ''
      };
      this.errors = {};
    },

    changePage(page) {
      this.fetchCadavers(page);
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.cadaver-management {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #718096;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card.available .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.good .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-info p {
  color: #718096;
  font-size: 0.9rem;
}

/* Cadavers Grid */
.cadavers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cadaver-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.cadaver-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.cadaver-card.unavailable {
  opacity: 0.7;
  background: #f7fafc;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-number {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.availability-badge {
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.availability-badge.available {
  background: #48bb78;
  color: white;
}

.availability-badge.unavailable {
  background: #f56565;
  color: white;
}

.card-body {
  padding: 1.25rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
  flex: 1;
}

.info-item i {
  color: #667eea;
  width: 16px;
}

.capitalize {
  text-transform: capitalize;
}

.condition-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.condition-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.condition-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.condition-badge.good {
  background: #c6f6d5;
  color: #22543d;
}

.condition-badge.average {
  background: #feebc8;
  color: #7c2d12;
}

.condition-badge.poor {
  background: #fed7d7;
  color: #742a2a;
}

.notes-section {
  background: #f7fafc;
  padding: 0.85rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.notes-section i {
  color: #667eea;
  margin-top: 0.2rem;
}

.notes-section p {
  color: #4a5568;
  font-size: 0.85rem;
  line-height: 1.5;
  flex: 1;
}

.card-footer {
  padding: 1rem 1.25rem;
  background: #f7fafc;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  border-top: 1px solid #e2e8f0;
}

.btn-view,
.btn-edit,
.btn-delete {
  padding: 0.5rem 0.85rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view {
  background: #4299e1;
  color: white;
}

.btn-view:hover {
  background: #3182ce;
  transform: scale(1.05);
}

.btn-edit {
  background: #48bb78;
  color: white;
}

.btn-edit:hover {
  background: #38a169;
  transform: scale(1.05);
}

.btn-delete {
  background: #f56565;
  color: white;
}

.btn-delete:hover {
  background: #e53e3e;
  transform: scale(1.05);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #4a5568;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 600;
  font-size: 0.9rem;
}

.required {
  color: #f56565;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 10px;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-label span {
  font-weight: 500;
  color: #2d3748;
}

.error-text {
  color: #f56565;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  margin-top: 1.5rem;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.btn-danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.4);
}

/* View Modal */
.view-modal {
  max-width: 600px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
}

.detail-item p {
  color: #2d3748;
  font-size: 1rem;
  font-weight: 500;
}

/* Delete Modal */
.delete-modal {
  max-width: 450px;
}

.delete-modal .modal-body p {
  margin-bottom: 1rem;
  color: #4a5568;
  line-height: 1.6;
}

.warning-text {
  color: #f56565;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .cadaver-management {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-section {
    flex-direction: column;
  }

  .cadavers-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>