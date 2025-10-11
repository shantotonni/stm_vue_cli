<template>
  <div class="department-wrapper">
    <!-- Modern Header with Gradient Background -->
    <div class="page-header">
      <div class="header-background"></div>
      <div class="header-content-wrapper">
        <div class="header-left">
          <div class="icon-wrapper">
            <i class="fas fa-building"></i>
          </div>
          <div class="header-text">
            <h1 class="page-title">Department Management</h1>
            <p class="page-description">Create, manage, and organize departments</p>
          </div>
        </div>
        <button @click="openAddModal" class="add-button">
          <i class="fas fa-plus-circle"></i>
          <span>Add New</span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-container">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-all">
          <div class="stat-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Departments</p>
            <h3 class="stat-value">{{ departments.length }}</h3>
          </div>
        </div>
        <div class="stat-card stat-active">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Active</p>
            <h3 class="stat-value">{{ activeDepartments.length }}</h3>
          </div>
        </div>
        <div class="stat-card stat-inactive">
          <div class="stat-icon">
            <i class="fas fa-pause-circle"></i>
          </div>
          <div class="stat-content">
            <p class="stat-label">Inactive</p>
            <h3 class="stat-value">{{ inactiveDepartments.length }}</h3>
          </div>
        </div>
      </div>

      <!-- Filter and Search Section -->
      <div class="filter-card">
        <div class="search-wrapper">
          <div class="search-input-group">
            <i class="fas fa-search search-icon"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, code or description..."
                class="modern-search-input"
            />
            <span v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
              <i class="fas fa-times"></i>
            </span>
          </div>
        </div>
        <div class="filter-tabs">
          <button
              @click="filterStatus = 'all'"
              :class="['filter-tab', { active: filterStatus === 'all' }]"
          >
            <i class="fas fa-th"></i>
            <span>All</span>
          </button>
          <button
              @click="filterStatus = 'active'"
              :class="['filter-tab', { active: filterStatus === 'active' }]"
          >
            <i class="fas fa-check"></i>
            <span>Active</span>
          </button>
          <button
              @click="filterStatus = 'inactive'"
              :class="['filter-tab', { active: filterStatus === 'inactive' }]"
          >
            <i class="fas fa-ban"></i>
            <span>Inactive</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="modern-loader">
        <div class="loader-spinner"></div>
        <p class="loader-text">Loading departments...</p>
      </div>

      <!-- Department Cards Grid -->
      <div v-else-if="filteredDepartments.length > 0" class="dept-grid">
        <div
            v-for="dept in filteredDepartments"
            :key="dept.id"
            class="dept-card"
            :class="{ 'dept-inactive': !dept.is_active }"
        >
          <!-- Card Badge -->
          <div class="card-badge" :class="dept.is_active ? 'badge-active' : 'badge-inactive'">
            <i :class="dept.is_active ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>

          <!-- Card Header -->
          <div class="dept-header">
            <div class="dept-icon-circle">
              <i class="fas fa-building"></i>
            </div>
            <div class="dept-title-section">
              <h3 class="dept-title">{{ dept.name }}</h3>
              <span class="dept-badge">{{ dept.code }}</span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="dept-content">
            <p class="dept-desc">
              {{ dept.description || 'No description provided' }}
            </p>

            <div class="dept-info-list">
              <div class="info-item">
                <i class="fas fa-user-tie"></i>
                <span>{{ dept.head_teacher?.name || 'Not assigned' }}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(dept.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="dept-actions">
            <button @click="toggleStatus(dept)" class="action-btn action-toggle" :title="dept.is_active ? 'Deactivate' : 'Activate'">
              <i :class="dept.is_active ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
            </button>
            <button @click="openEditModal(dept)" class="action-btn action-edit" title="Edit Department">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(dept)" class="action-btn action-delete" title="Delete Department">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-card">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 class="empty-title">No Departments Found</h3>
        <p class="empty-description">
          {{ searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first department' }}
        </p>
        <button v-if="!searchQuery" @click="openAddModal" class="empty-action-btn">
          <i class="fas fa-plus"></i>
          Create Department
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modern-modal" :class="{ 'modal-show': showModal }">
          <div class="modal-header-section">
            <div class="modal-icon-wrapper" :class="isEditMode ? 'edit-mode' : 'add-mode'">
              <i :class="isEditMode ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
            </div>
            <div class="modal-title-wrapper">
              <h2 class="modal-title">{{ isEditMode ? 'Edit Department' : 'Add New Department' }}</h2>
              <p class="modal-subtitle">{{ isEditMode ? 'Update department information' : 'Fill in the details below' }}</p>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveDepartment" class="modal-form">
            <div class="form-content">
              <div class="input-group">
                <label class="input-label">
                  Department Name
                  <span class="required-star">*</span>
                </label>
                <div class="input-wrapper">
                  <i class="fas fa-building input-icon"></i>
                  <input
                      v-model="form.name"
                      type="text"
                      class="modern-input"
                      placeholder="e.g., Computer Science"
                      required
                  />
                </div>
                <span v-if="errors.name" class="input-error">{{ errors.name[0] }}</span>
              </div>

              <div class="form-grid">
                <div class="input-group">
                  <label class="input-label">
                    Department Code
                    <span class="required-star">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-code input-icon"></i>
                    <input
                        v-model="form.code"
                        type="text"
                        class="modern-input"
                        placeholder="e.g., CS"
                        maxlength="10"
                        required
                    />
                  </div>
                  <span v-if="errors.code" class="input-error">{{ errors.code[0] }}</span>
                </div>

                <div class="input-group">
                  <label class="input-label">
                    Head Teacher ID
                    <span class="required-star">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-user-tie input-icon"></i>
                    <input
                        v-model.number="form.head_teacher_id"
                        type="number"
                        class="modern-input"
                        placeholder="Teacher ID"
                        required
                    />
                  </div>
                  <span v-if="errors.head_teacher_id" class="input-error">
                    {{ errors.head_teacher_id[0] }}
                  </span>
                </div>
              </div>

              <div class="input-group">
                <label class="input-label">Description</label>
                <div class="input-wrapper">
                  <i class="fas fa-align-left input-icon textarea-icon"></i>
                  <textarea
                      v-model="form.description"
                      class="modern-textarea"
                      placeholder="Enter department description..."
                      rows="4"
                  ></textarea>
                </div>
              </div>

              <div class="input-group">
                <label class="toggle-label">
                  <input v-model="form.is_active" type="checkbox" class="toggle-checkbox" />
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">Active Status</span>
                </label>
              </div>
            </div>

            <div class="modal-footer-section">
              <button type="button" @click="closeModal" class="modal-btn btn-cancel">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="modal-btn btn-submit" :disabled="submitting">
                <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-check'"></i>
                <span>{{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
        <div class="modern-modal modal-small">
          <div class="delete-modal-header">
            <div class="delete-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 class="delete-title">Confirm Deletion</h2>
          </div>
          <div class="delete-modal-body">
            <p class="delete-message">
              Are you sure you want to delete
              <strong class="delete-name">{{ deleteTarget?.name }}</strong>?
            </p>
            <p class="delete-warning">This action cannot be undone.</p>
          </div>
          <div class="delete-modal-footer">
            <button @click="showDeleteModal = false" class="modal-btn btn-cancel">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button @click="deleteDepartment" class="modal-btn btn-delete">
              <i class="fas fa-trash-alt"></i>
              Delete
            </button>
          </div>
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
  name: 'DepartmentManagement',

  data() {
    return {
      departments: [],
      loading: false,
      searchQuery: '',
      filterStatus: 'all',
      showModal: false,
      showDeleteModal: false,
      isEditMode: false,
      submitting: false,
      deleteTarget: null,
      toasts: [],
      form: {
        id: null,
        name: '',
        code: '',
        head_teacher_id: null,
        description: '',
        is_active: true
      },
      errors: {}
    };
  },

  computed: {
    filteredDepartments() {
      let filtered = this.departments;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(dept =>
            dept.name.toLowerCase().includes(query) ||
            dept.code.toLowerCase().includes(query) ||
            (dept.description && dept.description.toLowerCase().includes(query))
        );
      }

      if (this.filterStatus === 'active') {
        filtered = filtered.filter(dept => dept.is_active);
      } else if (this.filterStatus === 'inactive') {
        filtered = filtered.filter(dept => !dept.is_active);
      }

      return filtered;
    },

    activeDepartments() {
      return this.departments.filter(dept => dept.is_active);
    },

    inactiveDepartments() {
      return this.departments.filter(dept => !dept.is_active);
    }
  },

  mounted() {
    this.fetchDepartments();
  },

  methods: {
    async fetchDepartments() {
      this.loading = true;
      try {
        const response = await this.$api.get('/departments');
        this.departments = response.data.data;
      } catch (error) {
        this.showToast('Failed to load departments', 'error');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openAddModal() {
      this.isEditMode = false;
      this.resetForm();
      this.showModal = true;
    },

    openEditModal(dept) {
      this.isEditMode = true;
      this.form = {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        head_teacher_id: dept.head_teacher_id,
        description: dept.description || '',
        is_active: dept.is_active
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      setTimeout(() => this.resetForm(), 300);
    },

    resetForm() {
      this.form = {
        id: null,
        name: '',
        code: '',
        head_teacher_id: null,
        description: '',
        is_active: true
      };
      this.errors = {};
    },

    async saveDepartment() {
      this.submitting = true;
      this.errors = {};

      try {
        if (this.isEditMode) {
          await this.$api.put(`/departments/${this.form.id}`, this.form);
          this.showToast('Department updated successfully', 'success');
        } else {
          await this.$api.post('/departments', this.form);
          this.showToast('Department created successfully', 'success');
        }
        this.closeModal();
        this.fetchDepartments();
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        }
        this.showToast('Failed to save department', 'error');
      } finally {
        this.submitting = false;
      }
    },

    confirmDelete(dept) {
      this.deleteTarget = dept;
      this.showDeleteModal = true;
    },

    async deleteDepartment() {
      try {
        await this.$api.delete(`/departments/${this.deleteTarget.id}`);
        this.showToast('Department deleted successfully', 'success');
        this.showDeleteModal = false;
        this.deleteTarget = null;
        this.fetchDepartments();
      } catch (error) {
        this.showToast('Failed to delete department', 'error');
      }
    },

    async toggleStatus(dept) {
      try {
        await this.$api.patch(`/departments/${dept.id}/toggle-status`);
        this.showToast('Status updated successfully', 'success');
        this.fetchDepartments();
      } catch (error) {
        this.showToast('Failed to update status', 'error');
      }
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
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
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.department-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding-bottom: 40px;
}

/* ==================== Header Section ==================== */
.page-header {
  position: relative;
  padding: 60px 30px 80px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
}

.header-background::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -50px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.header-content-wrapper {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-text .page-title {
  font-size: 36px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.header-text .page-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.add-button {
  padding: 14px 32px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.add-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.add-button i {
  font-size: 18px;
}

/* ==================== Content Container ==================== */
.content-container {
  max-width: 1400px;
  margin: -60px auto 0;
  padding: 0 30px;
  position: relative;
}

/* ==================== Statistics Cards ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  opacity: 0.05;
  border-radius: 50%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-all::before { background: #667eea; }
.stat-active::before { background: #10b981; }
.stat-inactive::before { background: #ef4444; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.stat-all .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-active .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-inactive .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

/* ==================== Filter Card ==================== */
.filter-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-wrapper {
  margin-bottom: 20px;
}

.search-input-group {
  position: relative;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 18px;
}

.modern-search-input {
  width: 100%;
  padding: 16px 50px 16px 55px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #f9fafb;
}

.modern-search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;
}

.clear-search:hover {
  background: #d1d5db;
  color: #374151;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 12px 24px;
  background: #f9fafb;
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
}

.filter-tab:hover {
  background: #f3f4f6;
  color: #667eea;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

/* ==================== Loading ==================== */
.modern-loader {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.loader-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-text {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

/* ==================== Department Cards ==================== */
.dept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.dept-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  border: 2px solid transparent;
}

.dept-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.dept-card.dept-inactive {
  opacity: 0.65;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  z-index: 1;
}

.badge-active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.badge-inactive {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.dept-header {
  padding: 28px 24px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  gap: 16px;
}

.dept-icon-circle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.dept-title-section {
  flex: 1;
  min-width: 0;
}

.dept-title {
  font-size: 19px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.dept-badge {
  display: inline-block;
  padding: 5px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.dept-content {
  padding: 24px;
}

.dept-desc {
  font-size: 14px;
  line-height: 1.7;
  color: #6b7280;
  margin: 0 0 20px 0;
  min-height: 60px;
}

.dept-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
}

.info-item i {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.dept-actions {
  padding: 16px 24px;
  background: #f9fafb;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.action-toggle {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #6b7280;
}

.action-toggle:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.1);
}

.action-edit {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.action-edit:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.action-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.action-delete:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
}

/* ==================== Empty State ==================== */
.empty-state-card {
  background: white;
  border-radius: 16px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #9ca3af;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.empty-action-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
}

/* ==================== Modal Styles ==================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modern-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.3s ease-out;
}

.modern-modal.modal-small {
  max-width: 450px;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header-section {
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.modal-icon-wrapper {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  flex-shrink: 0;
}

.modal-title-wrapper {
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.modal-close {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-form {
  padding: 0;
}

.form-content {
  padding: 32px;
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.required-star {
  color: #ef4444;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.textarea-icon {
  top: 18px;
  transform: none;
}

.modern-input,
.modern-textarea {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #f9fafb;
}

.modern-input:focus,
.modern-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.modern-textarea {
  resize: vertical;
  min-height: 120px;
  padding-top: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-error {
  display: block;
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
  font-weight: 500;
}

/* Custom Toggle Switch */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 54px;
  height: 28px;
  background: #d1d5db;
  border-radius: 50px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-checkbox:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(26px);
}

.toggle-text {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.modal-footer-section {
  padding: 24px 32px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 13px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-cancel:hover {
  background: #f3f4f6;
  color: #374151;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

/* Delete Modal Styles */
.delete-modal-header {
  padding: 32px;
  text-align: center;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.delete-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.delete-title {
  font-size: 24px;
  font-weight: 800;
  color: #991b1b;
  margin: 0;
}

.delete-modal-body {
  padding: 32px;
  text-align: center;
}

.delete-message {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.delete-name {
  color: #1f2937;
  font-weight: 700;
}

.delete-warning {
  font-size: 14px;
  color: #ef4444;
  margin: 0;
  font-weight: 600;
}

.delete-modal-footer {
  padding: 24px 32px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* ==================== Toast Notifications ==================== */
.toast-wrapper {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.modern-toast {
  background: white;
  border-radius: 14px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-left: 5px solid;
  min-width: 320px;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.toast-success .toast-icon-wrapper {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-error .toast-icon-wrapper {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.toast-warning .toast-icon-wrapper {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.toast-info .toast-icon-wrapper {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.toast-content {
  flex: 1;
}

.toast-message {
  font-size: 14px;
  color: #374151;
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}

/* ==================== Animations ==================== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modern-modal,
.modal-fade-leave-to .modern-modal {
  transform: scale(0.9) translateY(20px);
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-slide-enter {
  opacity: 0;
  transform: translateX(400px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

/* ==================== Responsive Design ==================== */
@media (max-width: 1024px) {
  .dept-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px 60px;
  }

  .header-text .page-title {
    font-size: 28px;
  }

  .header-text .page-description {
    font-size: 14px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    font-size: 26px;
  }

  .header-content-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .content-container {
    padding: 0 20px;
    margin-top: -40px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dept-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    flex-direction: column;
  }

  .filter-tab {
    width: 100%;
    justify-content: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .toast-wrapper {
    left: 20px;
    right: 20px;
    top: 20px;
  }

  .modern-toast {
    min-width: auto;
  }

  .modal-header-section {
    padding: 24px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-icon-wrapper {
    width: 64px;
    height: 64px;
    font-size: 30px;
  }

  .form-content {
    padding: 24px;
  }

  .modal-footer-section {
    padding: 20px 24px;
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modern-modal {
    border-radius: 0;
    max-height: 100vh;
  }

  .dept-actions {
    justify-content: center;
  }

  .empty-state-card {
    padding: 60px 30px;
  }
}

/* ==================== Scrollbar Styling ==================== */
.modern-modal::-webkit-scrollbar {
  width: 8px;
}

.modern-modal::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modern-modal::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modern-modal::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>