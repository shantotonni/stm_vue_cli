<template>
  <div class="enrollment-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">Student Enrollments</h1>
        <p class="page-subtitle">Manage MBBS student enrollments and subject assignments</p>
      </div>
      <button @click="openModal()" class="btn-primary">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Enrollment
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-item">
        <label>Program</label>
        <select v-model="filters.program_id" @change="loadEnrollments">
          <option value="">All Programs</option>
          <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Session</label>
        <select v-model="filters.session_id" @change="loadEnrollments">
          <option value="">All Sessions</option>
          <option v-for="s in sessions" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Status</label>
        <select v-model="filters.is_active" @change="loadEnrollments">
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <table class="data-table">
        <thead>
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Program</th>
          <th>Subjects</th>
          <th>Session</th>
          <th>Enrollment Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="8" class="text-center">Loading...</td>
        </tr>
        <tr v-else-if="enrollments.length === 0">
          <td colspan="8" class="text-center">No enrollments found</td>
        </tr>
        <tr v-else v-for="enrollment in enrollments" :key="enrollment.id">
          <td>{{ enrollment.id }}</td>
          <td>
            <div class="student-info">
              <div class="avatar">{{ getInitials(enrollment.student_name) }}</div>
              <span>{{ enrollment.student_name }}</span>
            </div>
          </td>
          <td>{{ enrollment.program_name }}</td>
          <td>
            <div class="subject-list">
              <span class="subject-badge">{{ enrollment.subject_name }}</span>
            </div>
          </td>
          <td>{{ enrollment.session_name }}</td>
          <td>{{ formatDate(enrollment.enrollment_date) }}</td>
          <td>
              <span :class="['status-badge', enrollment.is_active ? 'active' : 'inactive']">
                {{ enrollment.is_active ? 'Active' : 'Inactive' }}
              </span>
          </td>
          <td>
            <div class="action-buttons">
              <button @click="openModal(enrollment)" class="btn-icon btn-edit" title="Edit">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button @click="deleteEnrollment(enrollment.id)" class="btn-icon btn-delete" title="Delete">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2>{{ isEdit ? 'Edit Enrollment' : 'New Enrollment' }}</h2>
          <button @click="closeModal" class="btn-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Student <span class="required">*</span></label>
              <select v-model="form.student_id" required :disabled="isEdit">
                <option value="">Select Student</option>
                <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Program <span class="required">*</span></label>
              <select v-model="form.program_id" required>
                <option value="">Select Program</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Session <span class="required">*</span></label>
              <select v-model="form.session_id" required>
                <option value="">Select Session</option>
                <option v-for="se in sessions" :key="se.id" :value="se.id">{{ se.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Enrollment Date <span class="required">*</span></label>
              <input type="date" v-model="form.enrollment_date" required />
            </div>
          </div>

          <!-- Beautiful Multiple Subject Selection -->
          <div class="form-group-full">
            <div class="subjects-header">
              <label>Select Subjects <span class="required">*</span></label>
              <div class="subjects-counter">
                <span class="counter-badge">{{ form.subject_ids.length }} Selected</span>
              </div>
            </div>

            <!-- Search Subjects -->
            <div class="search-box">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                  type="text"
                  v-model="subjectSearch"
                  placeholder="Search subjects by name or year..."
                  class="search-input"
              />
              <button v-if="subjectSearch" @click="subjectSearch = ''" type="button" class="clear-search">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
              <button type="button" @click="selectAllSubjects" class="btn-quick">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Select All
              </button>
              <button type="button" @click="clearAllSubjects" class="btn-quick">
                <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Clear All
              </button>
            </div>

            <!-- Subjects Grid -->
            <div class="subjects-grid">
              <div
                  v-for="subject in filteredSubjects"
                  :key="subject.id"
                  :class="['subject-card', { 'selected': isSubjectSelected(subject.id) }]"
                  @click="toggleSubject(subject.id)"
              >
                <div class="subject-checkbox">
                  <input
                      type="checkbox"
                      :value="subject.id"
                      :checked="isSubjectSelected(subject.id)"
                      @click.stop
                      @change="toggleSubject(subject.id)"
                  />
                  <span class="checkmark">
                    <svg v-if="isSubjectSelected(subject.id)" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </div>
                <div class="subject-info">
                  <h4 class="subject-name">{{ subject.name }}</h4>
                  <div class="subject-meta">
                    <span class="year-badge">{{ subject.year_phase }}</span>
                    <span v-if="subject.code" class="code-badge">{{ subject.code }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="filteredSubjects.length === 0" class="no-results">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>No subjects found</p>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.is_active" />
              <span>Active Status</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="form.subject_ids.length === 0">
              {{ isEdit ? 'Update' : 'Enroll' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="message" class="alert-success">
      <svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      {{ message }}
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        <div class="toast-icon">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ getToastTitle(toast.type) }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button @click="toast.show = false" class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'EnrolmentPage',
  data() {
    return {
      enrollments: [],
      students: [],
      programs: [],
      sessions: [],
      subjects: [],
      showModal: false,
      isEdit: false,
      loading: false,
      message: '',
      subjectSearch: '',
      filters: {
        program_id: '',
        session_id: '',
        is_active: '',
      },
      form: {
        id: null,
        student_id: '',
        program_id: '',
        session_id: '',
        subject_ids: [],
        enrollment_date: new Date().toISOString().split('T')[0],
        is_active: true,
      },
      toast: {
        show: false,
        message: '',
        type: 'success',
      },
    };
  },
  computed: {
    filteredSubjects() {
      if (!this.subjectSearch) return this.subjects;

      const search = this.subjectSearch.toLowerCase();
      return this.subjects.filter(subject =>
          subject.name.toLowerCase().includes(search) ||
          (subject.year_phase && subject.year_phase.toLowerCase().includes(search)) ||
          (subject.code && subject.code.toLowerCase().includes(search))
      );
    }
  },
  mounted() {
    this.loadMasterData();
    this.loadEnrollments();
  },
  methods: {
    async loadMasterData() {
      try {
        const [students, programs, sessions,subjects] = await Promise.all([
          this.$api.get('/get-students'),
          this.$api.get('/get-program'),
          this.$api.get('/get-session'),
          this.$api.get('/get-subjects')
        ])
        this.students = students.data;
        this.programs = programs.data;
        this.sessions = sessions.data;
        this.subjects = subjects.data;
      } catch (error) {
        console.error('Error loading master data:', error);
      }
    },
    async loadEnrollments() {
      this.loading = true;
      try {
        const params = new URLSearchParams(this.filters);
        const response = await this.$api.get(`/enrollments?${params}`);
        this.enrollments = response.data;
      } catch (error) {
        console.error('Error loading enrollments:', error);
      } finally {
        this.loading = false;
      }
    },
    openModal(enrollment = null) {
      if (enrollment) {
        this.isEdit = true;
        this.form = {
          id: enrollment.id,
          student_id: enrollment.student_id,
          program_id: enrollment.program_id,
          session_id: enrollment.session_id,
          subject_ids: enrollment.subject_ids || [enrollment.subject_id],
          enrollment_date: enrollment.enrollment_date,
          is_active: enrollment.is_active === 1,
        };
      } else {
        this.isEdit = false;
        this.form = {
          id: null,
          student_id: '',
          program_id: '',
          session_id: '',
          subject_ids: [],
          enrollment_date: new Date().toISOString().split('T')[0],
          is_active: true,
        };
      }
      this.subjectSearch = '';
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.message = '';
      this.subjectSearch = '';
    },

    isSubjectSelected(subjectId) {
      return this.form.subject_ids.includes(subjectId);
    },

    toggleSubject(subjectId) {
      const index = this.form.subject_ids.indexOf(subjectId);
      if (index > -1) {
        this.form.subject_ids.splice(index, 1);
      } else {
        this.form.subject_ids.push(subjectId);
      }
    },

    selectAllSubjects() {
      this.form.subject_ids = this.filteredSubjects.map(s => s.id);
    },

    clearAllSubjects() {
      this.form.subject_ids = [];
    },

    async submitForm() {
      this.submitting = true;
      if (this.form.subject_ids.length === 0) {
        alert('Please select at least one subject');
        return;
      }
      try {
        if (this.isEdit) {
          await this.$api.put(`/enrollments/${this.form.id}`, this.form);
          this.showToast('Class updated successfully', 'success');
        } else {
          await this.$api.post('/enrollments/bulk-enroll', this.form);
          this.showToast('Class created successfully', 'success');
        }
        this.closeModal();
        this.loadEnrollments();
      } catch (error) {
        this.showToast(
            error.response?.data?.message || 'Failed to save class',
            'error'
        );
        console.error(error);
      } finally {
        this.submitting = false;
      }
    },
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type,
      };
      setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    },
    getToastIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle',
      };
      return icons[type] || icons.info;
    },
    getToastTitle(type) {
      const titles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Info',
      };
      return titles[type] || 'Notification';
    },

    async deleteEnrollment(id) {
      if (confirm('Are you sure you want to delete this enrollment?')) {
        try {
          const response = await this.$api.delete(`/enrollments/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            this.message = 'Enrollment deleted successfully!';
            this.loadEnrollments();

            setTimeout(() => {
              this.message = '';
            }, 3000);
          }
        } catch (error) {
          console.error('Error deleting enrollment:', error);
        }
      }
    },

    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB');
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.enrollment-container {
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: white;
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 15px;
  color: #718096;
  margin: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
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
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  transition: all 0.2s;
}

.filter-item select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Table Section */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.data-table th {
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #2d3748;
}

.data-table tbody tr {
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background-color: #f7fafc;
}

.text-center {
  text-align: center;
  color: #a0aec0;
  padding: 40px !important;
}

/* Student Info */
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

/* Badges */
.subject-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.subject-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #edf2f7;
  color: #2d3748;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.inactive {
  background: #fed7d7;
  color: #742a2a;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  min-width: 350px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 3000;
  animation: toastSlideIn 0.4s ease;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.toast-error .toast-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.toast-warning .toast-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.toast-info .toast-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  color: #718096;
}

.toast-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #2d3748;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

.btn-edit {
  background: #ebf8ff;
  color: #2c5282;
}

.btn-edit:hover {
  background: #bee3f8;
  transform: translateY(-2px);
}

.btn-delete {
  background: #fff5f5;
  color: #c53030;
}

.btn-delete:hover {
  background: #fed7d7;
  transform: translateY(-2px);
}

/* Buttons */
.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 12px 24px;
  background: #e2e8f0;
  color: #2d3748;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.icon {
  width: 20px;
  height: 20px;
}

.icon-sm {
  width: 16px;
  height: 16px;
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
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s;
}

.modal-large {
  max-width: 900px;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f7fafc;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e2e8f0;
  transform: rotate(90deg);
}

.btn-close svg {
  width: 20px;
  height: 20px;
  color: #4a5568;
}

.modal-body {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group-full {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.required {
  color: #e53e3e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Subject Selection Styles */
.subjects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subjects-header label {
  margin: 0;
}

.subjects-counter {
  display: flex;
  align-items: center;
}

.counter-badge {
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  animation: pulse 0.3s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #a0aec0;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #cbd5e0;
}

.clear-search svg {
  width: 16px;
  height: 16px;
  color: #4a5568;
}

.quick-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.btn-quick {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-quick:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f7fafc;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.subject-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.subject-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.subject-card.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.subject-checkbox {
  position: relative;
  flex-shrink: 0;
}

.subject-checkbox input[type="checkbox"] {
  width: 22px;
  height: 22px;
  cursor: pointer;
  opacity: 0;
  position: absolute;
}

.checkmark {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.subject-card.selected .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark svg {
  width: 14px;
  height: 14px;
  color: white;
}

.subject-info {
  flex: 1;
}

.subject-name {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.subject-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.year-badge {
  padding: 4px 10px;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.code-badge {
  padding: 4px 10px;
  background: #fef5e7;
  color: #d97706;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #a0aec0;
}

.no-results svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.no-results p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

/* Alert */
.alert-success {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  color: #22543d;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  animation: slideInRight 0.3s;
  border-left: 4px solid #48bb78;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.alert-icon {
  width: 24px;
  height: 24px;
  color: #48bb78;
}

/* Scrollbar Styling */
.subjects-grid::-webkit-scrollbar {
  width: 8px;
}

.subjects-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.subjects-grid::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.subjects-grid::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive */
@media (max-width: 768px) {
  .enrollment-container {
    padding: 15px;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }
}
</style>