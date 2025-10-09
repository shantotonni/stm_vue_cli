<template>
  <div class="exam-students-management">
    <!-- Header with Statistics -->
    <div class="header-section">
      <div class="page-title">
        <h2>Exam Students Management</h2>
        <p class="subtitle">Manage student assignments, attendance and seating arrangements</p>
      </div>

      <div class="statistics-cards">
        <div class="stat-card stat-total">
          <div class="stat-icon">
            <i class="icon-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Students</div>
            <div class="stat-value">{{ statistics.total }}</div>
          </div>
        </div>

        <div class="stat-card stat-present">
          <div class="stat-icon">
            <i class="icon-check-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Present</div>
            <div class="stat-value">{{ statistics.present }}</div>
          </div>
        </div>

        <div class="stat-card stat-absent">
          <div class="stat-icon">
            <i class="icon-x-circle"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Absent</div>
            <div class="stat-value">{{ statistics.absent }}</div>
          </div>
        </div>

        <div class="stat-card stat-rate">
          <div class="stat-icon">
            <i class="icon-trending-up"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Attendance Rate</div>
            <div class="stat-value">{{ statistics.attendance_percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-section">
      <div class="action-group">
        <button @click="showAssignModal = true" class="btn btn-primary">
          <i class="icon-plus"></i>
          <span>Add Students</span>
        </button>
        <button @click="showAutoAssignModal = true" class="btn btn-info">
          <i class="icon-magic"></i>
          <span>Auto Assign</span>
        </button>
        <button @click="autoAssignSeats" class="btn btn-success" :disabled="loading">
          <i class="icon-grid"></i>
          <span>Assign Seats</span>
        </button>
      </div>

      <button
          @click="bulkMarkAttendance('present')"
          class="btn btn-attendance"
          :disabled="selectedStudents.length === 0"
      >
        <i class="icon-check"></i>
        <span>Mark Present</span>
        <span v-if="selectedStudents.length > 0" class="badge-count">{{ selectedStudents.length }}</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-section">
      <div class="filter-group">
        <div class="filter-item">
          <label>Attendance Status</label>
          <select v-model="filters.attendance_status" @change="fetchStudents">
            <option value="">All Attendance</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="excused">Excused</option>
          </select>
        </div>

        <div class="filter-item">
          <label>Eligibility</label>
          <select v-model="filters.is_eligible" @change="fetchStudents">
            <option value="">All Students</option>
            <option value="1">Eligible</option>
            <option value="0">Not Eligible</option>
          </select>
        </div>

        <div class="filter-item search-box">
          <label>Search</label>
          <div class="search-input-wrapper">
            <i class="icon-search"></i>
            <input
                type="text"
                v-model="searchQuery"
                @input="searchStudents"
                placeholder="Search by name or roll..."
                class="search-input"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="students-table">
          <thead>
          <tr>
            <th class="checkbox-col">
              <label class="custom-checkbox">
                <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="allSelected"
                >
                <span class="checkmark"></span>
              </label>
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Roll</th>
            <th>Seat Number</th>
            <th>Eligibility</th>
            <th>Attendance</th>
            <th class="actions-col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="student in students" :key="student.id" class="student-row">
            <td class="checkbox-col">
              <label class="custom-checkbox">
                <input
                    type="checkbox"
                    :value="student.id"
                    v-model="selectedStudents"
                >
                <span class="checkmark"></span>
              </label>
            </td>
            <td>
              <span class="student-id">{{ student.student.id }}</span>
            </td>
            <td>
              <div class="student-name-cell">
                <span class="name">{{ student.student.name }}</span>
              </div>
            </td>
            <td>
              <span class="roll-number">{{ student.student.roll }}</span>
            </td>
            <td>
              <div class="seat-input-wrapper">
                <input
                    type="text"
                    v-model="student.seat_number"
                    @blur="updateSeat(student)"
                    class="seat-input"
                    placeholder="Not assigned"
                >
              </div>
            </td>
            <td>
                <span :class="['badge', 'badge-eligibility', student.is_eligible ? 'badge-eligible' : 'badge-not-eligible']">
                  <i :class="student.is_eligible ? 'icon-check' : 'icon-x'"></i>
                  {{ student.is_eligible ? 'Eligible' : 'Not Eligible' }}
                </span>
            </td>
            <td>
              <select
                  v-model="student.attendance_status"
                  @change="updateAttendance(student)"
                  :class="['attendance-select', `status-${student.attendance_status}`]"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="excused">Excused</option>
              </select>
            </td>
            <td class="actions-col">
              <button
                  @click="removeStudent(student.id)"
                  class="btn-icon btn-remove"
                  title="Remove Student"
              >
                <i class="icon-trash"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="students.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="icon-users"></i>
          </div>
          <p class="empty-title">No students found</p>
          <p class="empty-subtitle">Start by adding students to this exam</p>
          <button @click="showAssignModal = true" class="btn btn-primary">
            <i class="icon-plus"></i>
            <span>Add Students</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="pagination.last_page > 1">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="page-btn page-prev"
      >
        <i class="icon-chevron-left"></i>
      </button>

      <button
          @click="changePage(page)"
          v-for="page in visiblePages"
          :key="page"
          :class="['page-btn', { active: page === pagination.current_page }]"
      >
        {{ page }}
      </button>

      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="page-btn page-next"
      >
        <i class="icon-chevron-right"></i>
      </button>
    </div>

    <!-- Assign Students Modal -->
    <modal v-if="showAssignModal" @close="showAssignModal = false">
      <div class="modal-header">
        <h3>Add Students to Exam</h3>
        <p class="modal-subtitle">Select students to assign to this exam</p>
      </div>
      <div class="modal-content">
        <div class="available-students-list">
          <div v-for="student in availableStudents" :key="student.id" class="student-item">
            <label class="custom-checkbox">
              <input type="checkbox" :value="student.id" v-model="studentsToAssign">
              <span class="checkmark"></span>
            </label>
            <div class="student-details">
              <span class="student-name">{{ student.name }}</span>
              <span class="student-meta">Roll: {{ student.roll }}</span>
            </div>
          </div>
          <div v-if="availableStudents.length === 0" class="empty-list">
            <p>All students have been assigned</p>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showAssignModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="bulkAssignStudents" class="btn btn-primary" :disabled="studentsToAssign.length === 0">
            Assign {{ studentsToAssign.length }} Student{{ studentsToAssign.length !== 1 ? 's' : '' }}
          </button>
        </div>
      </div>
    </modal>

    <!-- Auto Assign Modal -->
    <modal v-if="showAutoAssignModal" @close="showAutoAssignModal = false">
      <div class="modal-header">
        <h3>Auto Assign Students</h3>
        <p class="modal-subtitle">Automatically assign all students from a class</p>
      </div>

      <div class="modal-content">
        <div class="form-group">
          <label>Select Class</label>
          <select v-model="autoAssignData.class_id" class="form-control">
            <option value="">All Classes</option>
            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
              {{ cls.name }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="showAutoAssignModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="performAutoAssign" class="btn btn-primary">
            <i class="icon-magic"></i>
            Auto Assign
          </button>
        </div>
      </div>
    </modal>

<!--    <quick-attendance v-if="tab=='attendance'" :exam-id="1"></quick-attendance>-->

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
//import Modal from './Modal.vue';
// import QuickAttendance from './QuickAttendance.vue';
import Modal from './Modal.vue';

export default {
  name: 'ExamStudents',
  components: { Modal },
  props: {
    examId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      students: [],
      availableStudents: [],
      classes: [],
      statistics: {
        total: 0,
        present: 0,
        absent: 0,
        excused: 0,
        attendance_percentage: 0
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 50
      },
      filters: {
        attendance_status: '',
        is_eligible: ''
      },
      searchQuery: '',
      selectedStudents: [],
      studentsToAssign: [],
      showAssignModal: false,
      showAutoAssignModal: false,
      autoAssignData: {
        class_id: ''
      },
      loading: false
    };
  },
  computed: {
    allSelected() {
      return this.students.length > 0 &&
          this.selectedStudents.length === this.students.length;
    },
    visiblePages() {
      const pages = [];
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;

      for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchStatistics();
    this.fetchAvailableStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        this.loading = true;
        const response = await this.$api.get('/exam-students', {
          params: {
            exam_id: this.examId,
            ...this.filters,
            page: this.pagination.current_page,
            per_page: this.pagination.per_page
          }
        });

        this.students = response.data.data.data;
        this.pagination = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page
        };
      } catch (error) {
        this.$toast.error('Failed to load data');
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const response = await this.$api.get(`/exam-students/statistics/${this.examId}`);
        this.statistics = response.data;
      } catch (error) {
        console.error('Statistics fetch error:', error);
      }
    },

    async fetchAvailableStudents() {
      try {
        console.log(this.examId)
        alert('ok');
        const response = await this.$api.get('/exam-students/available-students', {
          params: { exam_id: this.examId }
        });
        this.availableStudents = response.data.data;
      } catch (error) {
        console.error('Available students fetch error:', error);
      }
    },

    async bulkAssignStudents() {
      try {
        await this.$api.post('/exam-students/bulk-assign', {
          exam_id: this.examId,
          student_ids: this.studentsToAssign,
          is_eligible: true
        });

        this.$toast.success('Students assigned successfully');
        this.showAssignModal = false;
        this.studentsToAssign = [];
        this.fetchStudents();
        this.fetchStatistics();
        this.fetchAvailableStudents();
      } catch (error) {
        this.$toast.error('Failed to assign students');
      }
    },

    async performAutoAssign() {
      try {
        await this.$api.post('/exam-students/auto-assign', {
          exam_id: this.examId,
          ...this.autoAssignData
        });

        this.$toast.success('Students auto-assigned successfully');
        this.showAutoAssignModal = false;
        this.fetchStudents();
        this.fetchStatistics();
      } catch (error) {
        this.$toast.error('Failed to auto assign');
      }
    },

    async updateAttendance(student) {
      try {
        await this.$api.patch(`/exam-students/${student.id}/attendance`, {
          attendance_status: student.attendance_status
        });
        this.$toast.success('Attendance updated');
        this.fetchStatistics();
      } catch (error) {
        this.$toast.error('Failed to update attendance');
      }
    },

    async bulkMarkAttendance(status) {
      try {
        await this.$api.post('/exam-students/bulk-attendance', {
          ids: this.selectedStudents,
          attendance_status: status
        });
        this.$toast.success('Attendance updated');
        this.selectedStudents = [];
        this.fetchStudents();
        this.fetchStatistics();
      } catch (error) {
        this.$toast.error('Failed to update attendance');
      }
    },

    async updateSeat(student) {
      try {
        await this.$api.patch(`/exam-students/${student.id}/seat`, {
          seat_number: student.seat_number
        });
        this.$toast.success('Seat number updated');
      } catch (error) {
        this.$toast.error('Failed to update seat number');
      }
    },

    async autoAssignSeats() {
      try {
        this.loading = true;
        await this.$api.post('/exam-students/auto-assign-seats', {
          exam_id: this.examId,
          start_number: 1
        });
        this.$toast.success('Seats assigned automatically');
        this.fetchStudents();
      } catch (error) {
        this.$toast.error('Failed to assign seats');
      } finally {
        this.loading = false;
      }
    },

    async removeStudent(id) {
      if (!confirm('Are you sure you want to remove this student?')) return;

      try {
        await this.$api.delete(`/exam-students/${id}`);
        this.$toast.success('Student removed');
        this.fetchStudents();
        this.fetchStatistics();
      } catch (error) {
        this.$toast.error('Failed to remove student');
      }
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedStudents = [];
      } else {
        this.selectedStudents = this.students.map(s => s.id);
      }
    },

    changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return;
      this.pagination.current_page = page;
      this.fetchStudents();
    },

    searchStudents() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchStudents();
      }, 300);
    },

    getAttendanceClass(status) {
      return {
        'attendance-select': true,
        'present': status === 'present',
        'absent': status === 'absent',
        'excused': status === 'excused'
      };
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.exam-students-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.page-title h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

/* Statistics Cards */
.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-total .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-present .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-absent .stat-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stat-rate .stat-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

/* Action Section */
.action-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn i {
  font-size: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
}

.btn-attendance {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  position: relative;
}

.btn-attendance:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.badge-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  background: #e9ecef;
  color: #495057;
}

.btn-secondary:hover {
  background: #dee2e6;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-item select,
.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  color: #495057;
}

.filter-item select:focus,
.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-box {
  grid-column: span 1;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrapper i {
  position: absolute;
  left: 16px;
  color: #6c757d;
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.students-table th {
  padding: 16px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.students-table tbody tr {
  border-bottom: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.students-table tbody tr:hover {
  background: #f8f9fa;
}

.students-table td {
  padding: 16px;
  color: #495057;
  font-size: 14px;
}

/* Custom Checkbox */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: white;
}

.custom-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.custom-checkbox input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

/* Table Cells */
.student-id {
  font-weight: 600;
  color: #667eea;
}

.student-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.name {
  font-weight: 600;
  color: #1a1a1a;
}

.roll-number {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f3f5;
  border-radius: 6px;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
}

.seat-input-wrapper {
  position: relative;
}

.seat-input {
  width: 100%;
  max-width: 120px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

.seat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-eligible {
  background: #d1fae5;
  color: #065f46;
}

.badge-not-eligible {
  background: #fee2e2;
  color: #991b1b;
}

/* Attendance Select */
.attendance-select {
  padding: 8px 32px 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.attendance-select.status-present {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #10b981;
}

.attendance-select.status-absent {
  background-color: #fee2e2;
  color: #991b1b;
  border-color: #ef4444;
}

.attendance-select.status-excused {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #f59e0b;
}

/* Action Buttons */
.btn-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.btn-remove {
  background: #fee2e2;
  color: #dc2626;
}

.btn-remove:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-header {
  padding: 24px 24px 0;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 24px 0;
}

.modal-content {
  padding: 24px;
}

.available-students-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 24px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
}

.student-item {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
}

.student-item:last-child {
  border-bottom: none;
}

.student-item:hover {
  background: #f8f9fa;
}

.student-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-details .student-name {
  font-weight: 600;
  color: #1a1a1a;
}

.student-meta {
  font-size: 13px;
  color: #6c757d;
}

.empty-list {
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .exam-students-management {
    padding: 16px;
  }

  .statistics-cards {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
    align-items: stretch;
  }

  .action-group {
    flex-direction: column;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .table-wrapper {
    overflow-x: auto;
  }
}
</style>