<template>
  <div class="classroom-management">
    <!-- Header with Stats -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fas fa-door-open"></i> Classroom Management
        </h1>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="fas fa-building"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_classrooms || 0 }}</div>
              <div class="stat-label">Total Rooms</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon available">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.available_classrooms || 0 }}</div>
              <div class="stat-label">Available</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon capacity">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_capacity || 0 }}</div>
              <div class="stat-label">Total Capacity</div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add New Classroom
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by name or code..."
            class="search-input"
        />
      </div>

      <select v-model="filters.type" @change="loadClassrooms" class="filter-select">
        <option value="">All Types</option>
        <option value="lecture_hall">Lecture Hall</option>
        <option value="lab">Laboratory</option>
        <option value="seminar_room">Seminar Room</option>
        <option value="tutorial_room">Tutorial Room</option>
      </select>

      <select v-model="filters.is_available" @change="loadClassrooms" class="filter-select">
        <option value="">All Status</option>
        <option value="1">Available</option>
        <option value="0">Not Available</option>
      </select>

      <div class="capacity-filter">
        <input
            v-model.number="filters.min_capacity"
            @change="loadClassrooms"
            type="number"
            placeholder="Min Capacity"
            class="capacity-input"
        />
        <span class="separator">-</span>
        <input
            v-model.number="filters.max_capacity"
            @change="loadClassrooms"
            type="number"
            placeholder="Max"
            class="capacity-input"
        />
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Loading...
      </div>

      <table v-else class="classrooms-table">
        <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Type</th>
          <th>Capacity</th>
          <th>Equipment</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="classrooms.length === 0">
          <td colspan="7" class="no-data">
            <i class="fas fa-inbox"></i>
            <p>No classrooms found</p>
          </td>
        </tr>
        <tr v-for="classroom in classrooms" :key="classroom.id" class="table-row">
          <td>
            <span class="status-badge status-available">{{ classroom.code }}</span>
          </td>
          <td class="classroom-name">
            <i :class="getTypeIcon(classroom.type)"></i>
            {{ classroom.name }}
          </td>
          <td>
              <span :class="['status-badge status-available', 'badge-type', getTypeBadgeClass(classroom.type)]">
                {{ getTypeLabel(classroom.type) }}
              </span>
          </td>
          <td>
              <span class="capacity-badge">
                <i class="fas fa-users"></i>
                {{ classroom.capacity }}
              </span>
          </td>
          <td class="equipment-cell">
            <div v-if="classroom.equipment" class="equipment-preview">
              {{ truncateText(classroom.equipment, 30) }}
              <button
                  v-if="classroom.equipment.length > 30"
                  @click="showEquipmentModal(classroom)"
                  class="view-more-btn"
              >
                View More
              </button>
            </div>
            <span v-else class="no-equipment">-</span>
          </td>
          <td>
              <span :class="['status-badge', classroom.is_available ? 'status-available' : 'status-unavailable']">
                <i :class="classroom.is_available ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ classroom.is_available ? 'Available' : 'Not Available' }}
              </span>
          </td>
          <td class="actions">
            <button @click="openModal(classroom)" class="btn-icon btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteClassroom(classroom)" class="btn-icon btn-delete" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <span class="pagination-info">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
        <span class="total-items">({{ pagination.total }} total)</span>
      </span>

      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>
              <i :class="editMode ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editMode ? 'Edit Classroom' : 'Add New Classroom' }}
            </h2>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveClassroom" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Classroom Name <span class="required">*</span></label>
                <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    :class="{ 'error': errors.name }"
                    placeholder="e.g., Main Lecture Hall A"
                />
                <span v-if="errors.name" class="error-text">{{ errors.name[0] }}</span>
              </div>

              <div class="form-group">
                <label>Room Code <span class="required">*</span></label>
                <input
                    v-model="form.code"
                    type="text"
                    class="form-control"
                    :class="{ 'error': errors.code }"
                    placeholder="e.g., LH-A-101"
                />
                <span v-if="errors.code" class="error-text">{{ errors.code[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Room Type <span class="required">*</span></label>
                <select
                    v-model="form.type"
                    class="form-control"
                    :class="{ 'error': errors.type }"
                >
                  <option value="">Select Type</option>
                  <option value="lecture_hall">Lecture Hall</option>
                  <option value="lab">Laboratory</option>
                  <option value="seminar_room">Seminar Room</option>
                  <option value="tutorial_room">Tutorial Room</option>
                </select>
                <span v-if="errors.type" class="error-text">{{ errors.type[0] }}</span>
              </div>

              <div class="form-group">
                <label>Capacity <span class="required">*</span></label>
                <input
                    v-model.number="form.capacity"
                    type="number"
                    class="form-control"
                    :class="{ 'error': errors.capacity }"
                    placeholder="e.g., 50"
                    min="1"
                    max="1000"
                />
                <span v-if="errors.capacity" class="error-text">{{ errors.capacity[0] }}</span>
              </div>
            </div>

            <div class="form-group">
              <label>Equipment & Facilities</label>
              <textarea
                  v-model="form.equipment"
                  class="form-control"
                  rows="4"
                  placeholder="e.g., Projector, Sound System, Whiteboard, AC, WiFi..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.is_available" type="checkbox" />
                <span class="checkbox-text">
                  <i :class="form.is_available ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                  Mark as Available
                </span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
                {{ saving ? 'Saving...' : 'Save Classroom' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Equipment Details Modal -->
    <transition name="modal">
      <div v-if="isShowEquipmentModal" class="modal-overlay" @click.self="closeEquipmentModal">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>
              <i class="fas fa-tools"></i>
              Equipment Details
            </h2>
            <button @click="closeEquipmentModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="equipment-details">
              <h3>{{ selectedClassroom?.name }}</h3>
              <p class="equipment-text">{{ selectedClassroom?.equipment }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ClassroomManagement',
  data() {
    return {
      classrooms: [],
      stats: {},
      loading: false,
      saving: false,
      showModal: false,
      isShowEquipmentModal: false,
      editMode: false,
      searchTimeout: null,
      selectedClassroom: null,

      filters: {
        search: '',
        type: '',
        is_available: '',
        min_capacity: null,
        max_capacity: null
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      },

      form: {
        id: null,
        name: '',
        code: '',
        capacity: 50,
        type: '',
        equipment: '',
        is_available: true
      },

      errors: {}
    };
  },

  mounted() {
    this.loadStats();
    this.loadClassrooms();
  },

  methods: {
    async loadStats() {
      try {
        const response = await this.$api.get('/classrooms/stats');
        this.stats = response.data;
      } catch (error) {
        console.error('Failed to load stats');
      }
    },

    async loadClassrooms(page = 1) {
      this.loading = true;
      try {
        const params = {
          page: page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        // Remove null/empty values
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key];
          }
        });

        const response = await this.$api.get('/classrooms', { params });
        this.classrooms = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
      } catch (error) {
        this.showError('Failed to load classrooms');
      } finally {
        this.loading = false;
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadClassrooms();
      }, 500);
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.loadClassrooms(page);
      }
    },

    openModal(classroom = null) {
      this.editMode = !!classroom;
      if (classroom) {
        this.form = { ...classroom };
      } else {
        this.resetForm();
      }
      this.errors = {};
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
      this.errors = {};
    },

    showEquipmentModal(classroom) {
      this.selectedClassroom = classroom;
      this.isShowEquipmentModal = true;
    },

    closeEquipmentModal() {
      this.isShowEquipmentModal = false;
      this.selectedClassroom = null;
    },

    resetForm() {
      this.form = {
        id: null,
        name: '',
        code: '',
        capacity: 50,
        type: '',
        equipment: '',
        is_available: true
      };
    },

    async saveClassroom() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.editMode) {
          await this.$api.put(`/classrooms/${this.form.id}`, this.form);
          this.showSuccess('Classroom updated successfully');
        } else {
          await this.$api.post('/classrooms', this.form);
          this.showSuccess('Classroom created successfully');
        }

        this.closeModal();
        this.loadClassrooms(this.pagination.current_page);
        this.loadStats();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.showError('Failed to save classroom');
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteClassroom(classroom) {
      if (!confirm(`Are you sure you want to delete "${classroom.name}"?`)) {
        return;
      }

      try {
        await this.$api.delete(`/classrooms/${classroom.id}`);
        this.showSuccess('Classroom deleted successfully');
        this.loadClassrooms(this.pagination.current_page);
        this.loadStats();
      } catch (error) {
        this.showError('Failed to delete classroom');
      }
    },

    getTypeLabel(type) {
      const labels = {
        lecture_hall: 'Lecture Hall',
        lab: 'Laboratory',
        seminar_room: 'Seminar Room',
        tutorial_room: 'Tutorial Room'
      };
      return labels[type] || type;
    },

    getTypeIcon(type) {
      const icons = {
        lecture_hall: 'fas fa-chalkboard-teacher',
        lab: 'fas fa-flask',
        seminar_room: 'fas fa-presentation',
        tutorial_room: 'fas fa-book-reader'
      };
      return icons[type] || 'fas fa-door-open';
    },

    getTypeBadgeClass(type) {
      const classes = {
        lecture_hall: 'badge-lecture',
        lab: 'badge-lab',
        seminar_room: 'badge-seminar',
        tutorial_room: 'badge-tutorial'
      };
      return classes[type] || '';
    },

    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },

    showSuccess(message) {
      alert(message);
    },

    showError(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
.classroom-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px 0;
}

.page-title i {
  color: #667eea;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.available {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.capacity {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

/* Filters */
.filter-section {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.capacity-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.capacity-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.capacity-input:focus {
  outline: none;
  border-color: #667eea;
}

.separator {
  color: #94a3b8;
  font-weight: 600;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.classrooms-table {
  width: 100%;
  border-collapse: collapse;
}

.classrooms-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.classrooms-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.classrooms-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #475569;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.classroom-name {
  font-weight: 600;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 8px;
}

.classroom-name i {
  color: #667eea;
}

/* Badges */
.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.badge-code {
  background: #e0e7ff;
  color: #4338ca;
}

.badge-type {
  text-transform: capitalize;
}

.badge-lecture {
  background: #dbeafe;
  color: #1e40af;
}

.badge-lab {
  background: #fef3c7;
  color: #92400e;
}

.badge-seminar {
  background: #e0e7ff;
  color: #4338ca;
}

.badge-tutorial {
  background: #d1fae5;
  color: #065f46;
}

.capacity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-weight: 600;
  color: #475569;
}

.capacity-badge i {
  color: #667eea;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-available {
  background: #d1fae5;
  color: #065f46;
}

.status-unavailable {
  background: #fee2e2;
  color: #991b1b;
}

/* Equipment */
.equipment-cell {
  max-width: 200px;
}

.equipment-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.view-more-btn {
  padding: 4px 8px;
  background: #e0e7ff;
  color: #4338ca;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: #c7d2fe;
}

.no-equipment {
  color: #cbd5e1;
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-edit:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 600;
  color: #475569;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.total-items {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-small {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header h2 i {
  color: #667eea;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #fee2e2;
  color: #991b1b;
}

.modal-body {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control.error {
  border-color: #ef4444;
}

.error-text {
  display: block;
  margin-top: 4px;
  color: #ef4444;
  font-size: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  background: #f1f5f9;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #475569;
}

.checkbox-text i {
  color: #10b981;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

/* Equipment Modal */
.equipment-details h3 {
  font-size: 18px;
  color: #1a202c;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.equipment-text {
  color: #475569;
  line-height: 1.8;
  white-space: pre-line;
}

/* Loading & No Data */
.loading-spinner {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #667eea;
}

.loading-spinner i {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.no-data i {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
  color: #cbd5e1;
}

.no-data p {
  font-size: 16px;
  margin: 0;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 1024px) {
  .filter-section {
    grid-template-columns: 1fr 1fr;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .classrooms-table {
    font-size: 12px;
  }

  .classrooms-table th,
  .classrooms-table td {
    padding: 12px 8px;
  }

  .page-title {
    font-size: 22px;
  }

  .equipment-cell {
    max-width: 150px;
  }
}

</style>