<template>
  <div class="teacher-subject-manager">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-group">
          <div class="icon-wrapper">
            <i class="fa fa-graduation-cap"></i>
          </div>
          <div>
            <h1>Teacher Subject Management</h1>
            <p class="subtitle">Assign and manage subjects for teachers</p>
          </div>
        </div>
        <button @click="showAssignModal = true" class="btn btn-primary">
          <i class="fa fa-plus-circle"></i>
          <span>Assign Subject</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ teachers.length }}</div>
          <div class="stat-label">Total Teachers</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-book"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ subjects.length }}</div>
          <div class="stat-label">Total Subjects</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fa fa-link"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ assignments.total || 0 }}</div>
          <div class="stat-label">Assignments</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fa fa-calendar"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sessions.length }}</div>
          <div class="stat-label">Active Sessions</div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filter-card">
      <div class="filter-header">
        <h3><i class="fa fa-filter"></i> Filters</h3>
        <button @click="clearFilters" class="btn-clear">
          <i class="fa fa-times-circle"></i> Clear All
        </button>
      </div>
      <div class="filter-grid">
        <div class="filter-item">
          <label><i class="fa fa-user"></i> Teacher</label>
          <select v-model="filters.teacher_id" @change="loadAssignments" class="select-modern">
            <option value="">All Teachers</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-book"></i> Subject</label>
          <select v-model="filters.subject_id" @change="loadAssignments" class="select-modern">
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-clock-o"></i> Session</label>
          <select v-model="filters.session_id" @change="loadAssignments" class="select-modern">
            <option value="">All Sessions</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-calendar-check-o"></i> Academic Year</label>
          <input
              v-model="filters.academic_year"
              @input="loadAssignments"
              placeholder="e.g., 2024-2025"
              class="input-modern"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading assignments...</p>
    </div>

    <!-- Assignments Table -->
    <div v-else class="table-card">
      <div class="table-header">
        <h3><i class="fa fa-list"></i> Subject Assignments</h3>
        <div class="table-actions">
          <span class="result-count">{{ assignments.total || 0 }} results</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-user"></i> Teacher</th>
            <th><i class="fa fa-book"></i> Subject</th>
            <th><i class="fa fa-clock-o"></i> Session</th>
            <th><i class="fa fa-calendar"></i> Academic Year</th>
            <th><i class="fa fa-star"></i> Coordinator</th>
            <th><i class="fa fa-check-circle"></i> Primary</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!assignments.data || assignments.data.length === 0">
            <td colspan="7" class="no-data">
              <i class="fa fa-inbox"></i>
              <p>No assignments found</p>
            </td>
          </tr>
          <tr v-for="assignment in assignments.data" :key="assignment.id" class="table-row">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ getInitials(assignment.teacher.name) }}</div>
                <span class="user-name">{{ assignment.teacher.name }}</span>
              </div>
            </td>
            <td>
              <span class="subject-tag">{{ assignment.subject.name }}</span>
            </td>
            <td>
              <span class="session-badge">{{ assignment.session.name }}</span>
            </td>
            <td>{{ assignment.academic_year }}</td>
            <td>
                <span v-if="assignment.is_coordinator" class="status-badge success">
                  <i class="fa fa-check"></i> Yes
                </span>
              <span v-else class="status-badge neutral">
                  <i class="fa fa-minus"></i> No
                </span>
            </td>
            <td>
                <span v-if="assignment.is_primary" class="status-badge primary">
                  <i class="fa fa-check"></i> Yes
                </span>
              <span v-else class="status-badge neutral">
                  <i class="fa fa-minus"></i> No
                </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editAssignment(assignment)" class="btn-action edit" title="Edit">
                  <i class="fa fa-edit"></i>
                </button>
                <button @click="deleteAssignment(assignment.id)" class="btn-action delete" title="Delete">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="assignments.last_page > 1" class="pagination-wrapper">
        <button
            @click="changePage(assignments.current_page - 1)"
            :disabled="assignments.current_page === 1"
            class="btn-pagination"
        >
          <i class="fa fa-chevron-left"></i> Previous
        </button>
        <div class="page-numbers">
          <span class="page-current">{{ assignments.current_page }}</span>
          <span class="page-separator">/</span>
          <span class="page-total">{{ assignments.last_page }}</span>
        </div>
        <button
            @click="changePage(assignments.current_page + 1)"
            :disabled="assignments.current_page === assignments.last_page"
            class="btn-pagination"
        >
          Next <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Assign/Edit Modal -->
    <transition name="modal">
      <div v-if="showAssignModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title">
              <i class="fa" :class="editMode ? 'fa-edit' : 'fa-plus-circle'"></i>
              <h3>{{ editMode ? 'Edit Assignment' : 'Assign Subject' }}</h3>
            </div>
            <button @click="closeModal" class="btn-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveAssignment">
              <div class="form-row">
                <div class="form-group full-width">
                  <label class="form-label required">
                    <i class="fa fa-user"></i> Teacher
                  </label>
                  <select v-model="form.teacher_id" required class="form-input">
                    <option value="">Select Teacher</option>
                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                      {{ teacher.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group full-width">
                <label class="form-label required">
                  <i class="fa fa-book"></i> Subject(s)
                </label>

                <!-- Multiple Subject Selection for New Assignment -->
                <div v-if="!editMode" class="subjects-grid">
                  <label
                      v-for="subject in subjects"
                      :key="subject.id"
                      class="subject-checkbox"
                      :class="{ active: form.subject_ids.includes(subject.id) }"
                  >
                    <input type="checkbox" :value="subject.id" v-model="form.subject_ids" />
                    <span class="checkmark"></span>
                    <span class="subject-name">{{ subject.name }}</span>
                  </label>
                </div>

                <!-- Single Subject for Edit Mode -->
                <select v-else v-model="form.subject_id" required class="form-input">
                  <option value="">Select Subject</option>
                  <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                    {{ subject.name }}
                  </option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">
                    <i class="fa fa-clock-o"></i> Session
                  </label>
                  <select v-model="form.session_id" required class="form-input">
                    <option value="">Select Session</option>
                    <option v-for="session in sessions" :key="session.id" :value="session.id">
                      {{ session.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label required">
                    <i class="fa fa-calendar"></i> Academic Year
                  </label>
                  <input
                      v-model="form.academic_year"
                      type="text"
                      placeholder="2024-2025"
                      required
                      class="form-input"
                  />
                </div>
              </div>

              <div class="form-group full-width">
                <div class="toggle-group">
                  <label class="toggle-label">
                    <input type="checkbox" v-model="form.is_coordinator" class="toggle-input" />
                    <span class="toggle-slider"></span>
                    <span class="toggle-text">
                      <i class="fa fa-star"></i> Subject Coordinator
                    </span>
                  </label>

                  <label class="toggle-label">
                    <input type="checkbox" v-model="form.is_primary" class="toggle-input" />
                    <span class="toggle-slider"></span>
                    <span class="toggle-text">
                      <i class="fa fa-check-circle"></i> Primary Teacher
                    </span>
                  </label>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" @click="closeModal" class="btn btn-secondary">
                  <i class="fa fa-times"></i> Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  <i class="fa" :class="submitting ? 'fa-spinner fa-spin' : 'fa-check'"></i>
                  <span>{{ submitting ? 'Saving...' : 'Save Assignment' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TeacherSubjectManager',

  data() {
    return {
      assignments: {
        data: [],
        current_page: 1,
        last_page: 1,
        total: 0,
      },
      teachers: [],
      subjects: [],
      sessions: [],
      filters: {
        teacher_id: '',
        subject_id: '',
        session_id: '',
        academic_year: '',
      },
      showAssignModal: false,
      editMode: false,
      loading: false,
      submitting: false,
      form: {
        teacher_id: '',
        subject_id: '',
        subject_ids: [],
        session_id: '',
        academic_year: '',
        is_coordinator: false,
        is_primary: false,
      },
      editingId: null,
    };
  },

  mounted() {
    this.loadFormData();
    this.loadAssignments();
  },

  methods: {
    getInitials(name) {
      return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },

    async loadFormData() {
      try {
        const response = await this.$api.get('/teacher-subjects/create');
        this.teachers = response.data.teachers;
        this.subjects = response.data.subjects;
        this.sessions = response.data.sessions;
      } catch (error) {
        console.error('Error loading form data:', error);
        this.$toast?.error('Failed to load form data');
      }
    },

    async loadAssignments(page = 1) {
      this.loading = true;
      try {
        const params = { ...this.filters, page };
        const response = await this.$api.get('/teacher-subjects', { params });
        this.assignments = response.data;
      } catch (error) {
        console.error('Error loading assignments:', error);
        this.$toast?.error('Failed to load assignments');
      } finally {
        this.loading = false;
      }
    },

    async saveAssignment() {
      this.submitting = true;
      try {
        if (this.editMode) {
          await this.$api.put(`/teacher-subjects/${this.editingId}`, this.form);
          this.$toast?.success('Assignment updated successfully');
        } else {
          if (this.form.subject_ids.length > 0) {
            await this.$api.post('/teacher-subjects/bulk-assign', this.form);
          } else {
            await this.$api.post('/api/teacher-subjects', this.form);
          }
          this.$toast?.success('Subject(s) assigned successfully');
        }
        this.closeModal();
        this.loadAssignments();
      } catch (error) {
        console.error('Error saving assignment:', error);
        if (error.response && error.response.status === 409) {
          this.$toast?.error('This assignment already exists');
        } else if (error.response && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          this.$toast?.error(errors[0]);
        } else {
          this.$toast?.error('Failed to save assignment');
        }
      } finally {
        this.submitting = false;
      }
    },

    editAssignment(assignment) {
      this.editMode = true;
      this.editingId = assignment.id;
      this.form = {
        teacher_id: assignment.teacher_id,
        subject_id: assignment.subject_id,
        subject_ids: [],
        session_id: assignment.session_id,
        academic_year: assignment.academic_year,
        is_coordinator: assignment.is_coordinator,
        is_primary: assignment.is_primary,
      };
      this.showAssignModal = true;
    },

    async deleteAssignment(id) {
      if (!confirm('Are you sure you want to delete this assignment?')) {
        return;
      }

      try {
        await this.$api.delete(`/teacher-subjects/${id}`);
        this.$toast?.success('Assignment deleted successfully');
        this.loadAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        this.$toast?.error('Failed to delete assignment');
      }
    },

    closeModal() {
      this.showAssignModal = false;
      this.editMode = false;
      this.editingId = null;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        teacher_id: '',
        subject_id: '',
        subject_ids: [],
        session_id: '',
        academic_year: '',
        is_coordinator: false,
        is_primary: false,
      };
    },

    clearFilters() {
      this.filters = {
        teacher_id: '',
        subject_id: '',
        session_id: '',
        academic_year: '',
      };
      this.loadAssignments();
    },

    changePage(page) {
      if (page >= 1 && page <= this.assignments.last_page) {
        this.loadAssignments(page);
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.teacher-subject-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Section */
.header-section {
  margin-bottom: 30px;
}

.header-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.title-group {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.header-content h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 5px;
}

.subtitle {
  color: #718096;
  font-size: 14px;
}

/* Stats Cards */
.stats-container {
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
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
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

.stat-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.green { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
.stat-icon.purple { background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%); }
.stat-icon.orange { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); }

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  margin-top: 5px;
}

/* Filter Card */
.filter-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  font-size: 18px;
  color: #2d3748;
}

.filter-header h3 i {
  color: #667eea;
  margin-right: 10px;
}

.btn-clear {
  background: #fed7d7;
  color: #c53030;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #fc8181;
  color: white;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.filter-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.filter-item label i {
  color: #667eea;
  margin-right: 5px;
}

.select-modern,
.input-modern {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
}

.select-modern:focus,
.input-modern:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Loading */
.loading-container {
  background: white;
  border-radius: 20px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #718096;
  font-size: 16px;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.table-header {
  padding: 25px 30px;
  border-bottom: 2px solid #f7fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  font-size: 18px;
  color: #2d3748;
}

.table-header h3 i {
  color: #667eea;
  margin-right: 10px;
}

.result-count {
  font-size: 13px;
  color: #718096;
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 8px;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead th {
  background: #f7fafc;
  padding: 16px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.modern-table thead th i {
  color: #667eea;
  margin-right: 8px;
}

.modern-table tbody td {
  padding: 20px;
  border-bottom: 1px solid #f7fafc;
  color: #2d3748;
  font-size: 14px;
}

.table-row {
  transition: all 0.3s;
}

.table-row:hover {
  background: #f7fafc;
}

.no-data {
  text-align: center;
  padding: 60px 20px !important;
  color: #a0aec0;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.no-data p {
  font-size: 16px;
  margin: 0;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-weight: 500;
  color: #2d3748;
}

/* Tags and Badges */
.subject-tag {
  background: #e6fffa;
  color: #047857;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.session-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge i {
  font-size: 11px;
}

.status-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.primary {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.neutral {
  background: #f3f4f6;
  color: #6b7280;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-action.edit {
  background: #e0e7ff;
  color: #4338ca;
}

.btn-action.edit:hover {
  background: #4338ca;
  color: white;
  transform: scale(1.1);
}

.btn-action.delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-action.delete:hover {
  background: #dc2626;
  color: white;
  transform: scale(1.1);
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-top: 2px solid #f7fafc;
}

.btn-pagination {
  background: white;
  border: 2px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.page-current {
  color: #667eea;
  font-size: 18px;
}

.page-separator {
  color: #cbd5e0;
}

.page-total {
  color: #a0aec0;
  font-size: 16px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
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
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 2px solid #f7fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-title i {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.modal-title h3 {
  font-size: 20px;
  color: #2d3748;
  margin: 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  background: #f7fafc;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #718096;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-body {
  padding: 30px;
}

/* Form */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: '*';
  color: #dc2626;
  margin-left: 4px;
}

.form-label i {
  color: #667eea;
  margin-right: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Subject Checkbox Grid */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
}

.subject-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.subject-checkbox:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.subject-checkbox.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.subject-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.subject-checkbox.active .checkmark {
  background: white;
  border-color: white;
  position: relative;
}

.subject-checkbox.active .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #667eea;
  font-weight: bold;
}

.subject-name {
  font-size: 13px;
  font-weight: 500;
}

/* Toggle Switches */
.toggle-group {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  width: 50px;
  height: 28px;
  background: #cbd5e0;
  border-radius: 14px;
  position: relative;
  transition: all 0.3s;
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
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.toggle-text {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.toggle-text i {
  color: #667eea;
  margin-right: 5px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 25px;
  border-top: 2px solid #f7fafc;
  margin-top: 25px;
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .teacher-subject-manager {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .modern-table {
    min-width: 900px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
  }

  .toggle-group {
    flex-direction: column;
    gap: 15px;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f7fafc;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #667eea;
}
</style>