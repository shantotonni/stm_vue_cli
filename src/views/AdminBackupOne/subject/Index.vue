<template>
  <div class="subject-management">
    <!-- Header -->
    <div class="header-section">
      <h1 class="page-title">
        <i class="fas fa-book"></i> Subject Management
      </h1>
      <button @click="openModal()" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add New Subject
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

      <select v-model="filters.department_id" @change="loadSubjects" class="filter-select">
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
          {{ dept.name }}
        </option>
      </select>

      <select v-model="filters.year" @change="loadSubjects" class="filter-select">
        <option value="">All Years</option>
        <option value="1st">1st Year</option>
        <option value="2nd">2nd Year</option>
        <option value="3rd">3rd Year</option>
        <option value="4th">4th Year</option>
        <option value="5th">5th Year</option>
      </select>

      <select v-model="filters.is_active" @change="loadSubjects" class="filter-select">
        <option value="">All Status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Loading...
      </div>

      <table v-else class="subjects-table">
        <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Department</th>
          <th>Year</th>
          <th>Semester</th>
          <th>Credits</th>
          <th>Theory</th>
          <th>Practical</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="subjects.length === 0">
          <td colspan="10" class="no-data">No subjects found</td>
        </tr>
        <tr v-for="subject in subjects" :key="subject.id" class="table-row">
          <td><span class="status-badge status-active">{{subject.code}}</span></td>
          <td class="subject-name">{{ subject.name }}</td>
          <td>{{ subject.department ? subject.department.name : 'N/A' }}</td>
          <td>{{ subject.year }}</td>
          <td>{{ subject.semester }}</td>
          <td>{{ subject.credit_hours }}</td>
          <td>{{ subject.theory_hours }}</td>
          <td>{{ subject.practical_hours }}</td>
          <td>
              <span :class="['status-badge', subject.is_active ? 'status-active' : 'status-inactive']">
                {{ subject.is_active ? 'Active' : 'Inactive' }}
              </span>
          </td>
          <td class="actions">
            <button @click="openModal(subject)" class="btn-icon btn-edit" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteSubject(subject)" class="btn-icon btn-delete" title="Delete">
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
      </span>

      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editMode ? 'Edit Subject' : 'Add New Subject' }}</h2>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveSubject" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Subject Name <span class="required">*</span></label>
                <input v-model="form.name" type="text" class="form-control" :class="{ 'error': errors.name }" placeholder="Enter subject name"/>
                <span v-if="errors.name" class="error-text">{{ errors.name[0] }}</span>
              </div>

              <div class="form-group">
                <label>Subject Code <span class="required">*</span></label>
                <input v-model="form.code" type="text" class="form-control" :class="{ 'error': errors.code }" placeholder="e.g., CSE101"/>
                <span v-if="errors.code" class="error-text">{{ errors.code[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Program <span class="required">*</span></label>
                <select v-model="form.program_id" class="form-control" :class="{ 'error': errors.program_id }">
                  <option value="">Select Program</option>
                  <option v-for="program in programs" :key="program.id" :value="program.id">
                    {{ program.name }}
                  </option>
                </select>
                <span v-if="errors.program_id" class="error-text">{{ errors.program_id[0] }}</span>
              </div>

              <div class="form-group">
                <label>Department <span class="required">*</span></label>
                <select v-model="form.department_id" class="form-control" :class="{ 'error': errors.department_id }">
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="error-text">{{ errors.department_id[0] }}</span>
              </div>

              <div class="form-group">
                <label>Year <span class="required">*</span></label>
                <select v-model="form.year" class="form-control" :class="{ 'error': errors.year }">
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="5th">5th Year</option>
                </select>
                <span v-if="errors.year" class="error-text">{{ errors.year[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Semester <span class="required">*</span></label>
                <select v-model="form.semester" class="form-control" :class="{ 'error': errors.semester }">
                  <option value="">Select Semester</option>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                </select>
                <span v-if="errors.semester" class="error-text">{{ errors.semester[0] }}</span>
              </div>

              <div class="form-group">
                <label>Credit Hours</label>
                <input v-model.number="form.credit_hours" type="number" class="form-control" placeholder="3"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Theory Hours</label>
                <input v-model.number="form.theory_hours" type="number" class="form-control" placeholder="0"/>
              </div>

              <div class="form-group">
                <label>Practical Hours</label>
                <input v-model.number="form.practical_hours" type="number" class="form-control" placeholder="0"/>
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" class="form-control" rows="3" placeholder="Enter subject description..."></textarea>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.is_active" type="checkbox" />
                <span>Active</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <i class="fas fa-save"></i>
                {{ saving ? 'Saving...' : 'Save Subject' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Toast Notifications -->
    <transition-group name="toast-slide" tag="div" class="toast-wrapper">
      <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['modern-toast', `toast-${toast.type}`]"
      >
        <div class="toast-icon-wrapper">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ toast.message }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SubjectManagement',

  data() {
    return {
      subjects: [],
      departments: [],
      programs: [],
      loading: false,
      saving: false,
      showModal: false,
      editMode: false,
      searchTimeout: null,
      filters: {
        search: '',
        department_id: '',
        year: '',
        is_active: ''
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
        department_id: '',
        program_id: '',
        year: '',
        semester: '',
        credit_hours: 0,
        theory_hours: 0,
        practical_hours: 0,
        description: '',
        is_active: true
      },
      errors: {},
      toasts: [],
    };
  },

  mounted() {
    this.loadDepartments();
    this.loadSubjects();
    this.loadProgram();
  },

  methods: {
    async loadDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        this.showError('Failed to load departments');
      }
    },

    async loadProgram() {
      try {
        const response = await this.$api.get('/get-program');
        this.programs = response.data;
      } catch (error) {
        this.showError('Failed to load departments');
      }
    },

    async loadSubjects(page = 1) {
      this.loading = true;
      try {
        const params = {
          page: page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await this.$api.get('/subjects', { params });
        console.log(response)
        this.subjects = response.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
      } catch (error) {
        this.showError('Failed to load subjects');
      } finally {
        this.loading = false;
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadSubjects();
      }, 500);
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.loadSubjects(page);
      }
    },

    openModal(subject = null) {
      this.editMode = !!subject;
      if (subject) {
        this.form = { ...subject };
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

    resetForm() {
      this.form = {
        id: null,
        name: '',
        code: '',
        department_id: '',
        year: '',
        semester: '',
        credit_hours: 3,
        theory_hours: 0,
        practical_hours: 0,
        description: '',
        is_active: true
      };
    },

    async saveSubject() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.editMode) {
          await this.$api.put(`/subjects/${this.form.id}`, this.form);
          this.showToast('Subject updated successfully', 'success');
        } else {
          await this.$api.post('/subjects', this.form);
          this.showToast('Subject created successfully', 'success');
        }

        this.closeModal();
        this.loadSubjects(this.pagination.current_page);
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.showError('Failed to save subject');
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteSubject(subject) {
      if (!confirm(`Are you sure you want to delete "${subject.name}"?`)) {
        return;
      }

      try {
        await this.$api.delete(`/subjects/${subject.id}`);
        this.showSuccess('Subject deleted successfully');
        this.loadSubjects(this.pagination.current_page);
      } catch (error) {
        this.showError('Failed to delete subject');
      }
    },

    showToast(message, type = 'info') {
      const toast = { id: Date.now(), message, type };
      this.toasts.push(toast);
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
      }, 4000);
    },
    getToastIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
      };
      return icons[type] || icons.info;
    },

    showError(message) {
      // You can integrate with a toast.js library like vue-toastification
      // For now using alert, but replace with your preferred notification method
      alert(message);
    }
  }
};
</script>

<style scoped>
.subject-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.page-title i {
  color: #4f46e5;
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
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
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

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.subjects-table {
  width: 100%;
  border-collapse: collapse;
}

.subjects-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.subjects-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subjects-table td {
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

.subject-name {
  font-weight: 600;
  color: #1a202c;
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

.badge-year {
  background: #fef3c7;
  color: #92400e;
}

.badge-semester {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1a202c;
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
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
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
  font-size: 16px;
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

  .subjects-table {
    font-size: 12px;
  }

  .subjects-table th,
  .subjects-table td {
    padding: 12px 8px;
  }

  .page-title {
    font-size: 22px;
  }
}
</style>