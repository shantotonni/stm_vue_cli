<template>
  <div class="exam-students-container">
    <!-- Animated Background -->
    <div class="bg-pattern"></div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="title-icon">📚</div>
          <div>
            <h1 class="page-title">Exam Students</h1>
            <p class="page-subtitle">Manage and track student assignments</p>
          </div>
        </div>
        <div class="action-buttons">
          <button @click="showAssignModal = true" class="btn btn-primary">
            <span class="btn-icon">👥</span>
            <span>Assign Students</span>
            <span class="btn-shine"></span>
          </button>
          <button @click="showSeatGenerateModal = true" class="btn btn-gradient">
            <span class="btn-icon">🎯</span>
            <span>Generate Seats</span>
            <span class="btn-shine"></span>
          </button>
        </div>
      </div>

      <!-- Enhanced Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-bg-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Total Students</div>
            <div class="stat-value">{{ statistics.total }}</div>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{ width: '100%' }"></div>
            </div>
          </div>
          <div class="stat-icon">
            <div class="icon-wrapper total-icon">
              <span>👥</span>
            </div>
          </div>
        </div>

        <div class="stat-card present">
          <div class="stat-bg-icon">✅</div>
          <div class="stat-content">
            <div class="stat-label">Present</div>
            <div class="stat-value">{{ statistics.present }}</div>
            <div class="stat-bar">
              <div class="stat-bar-fill present-fill" :style="{ width: getPercentage(statistics.present) + '%' }"></div>
            </div>
          </div>
          <div class="stat-icon">
            <div class="icon-wrapper present-icon">
              <span>✓</span>
            </div>
          </div>
        </div>

        <div class="stat-card absent">
          <div class="stat-bg-icon">❌</div>
          <div class="stat-content">
            <div class="stat-label">Absent</div>
            <div class="stat-value">{{ statistics.absent }}</div>
            <div class="stat-bar">
              <div class="stat-bar-fill absent-fill" :style="{ width: getPercentage(statistics.absent) + '%' }"></div>
            </div>
          </div>
          <div class="stat-icon">
            <div class="icon-wrapper absent-icon">
              <span>✕</span>
            </div>
          </div>
        </div>

        <div class="stat-card excused">
          <div class="stat-bg-icon">📋</div>
          <div class="stat-content">
            <div class="stat-label">Excused</div>
            <div class="stat-value">{{ statistics.excused }}</div>
            <div class="stat-bar">
              <div class="stat-bar-fill excused-fill" :style="{ width: getPercentage(statistics.excused) + '%' }"></div>
            </div>
          </div>
          <div class="stat-icon">
            <div class="icon-wrapper excused-icon">
              <span>📋</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <div class="search-icon-wrapper">
          <span class="search-icon">🔍</span>
        </div>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by name or roll number..."
            class="search-input"
        />
        <div v-if="filters.search" @click="clearSearch" class="clear-search">✕</div>
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label class="filter-label">Attendance</label>
          <select v-model="filters.attendance_status" @change="fetchStudents" class="filter-select">
            <option value="">All Status</option>
            <option value="present">✓ Present</option>
            <option value="absent">✕ Absent</option>
            <option value="excused">📋 Excused</option>
          </select>
        </div>

        <div class="filter-item">
          <label class="filter-label">Eligibility</label>
          <select v-model="filters.is_eligible" @change="fetchStudents" class="filter-select">
            <option value="">All Students</option>
            <option value="1">✓ Eligible</option>
            <option value="0">✕ Not Eligible</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Enhanced Bulk Actions -->
    <transition name="slide-down">
      <div v-if="selectedStudents.length > 0" class="bulk-actions">
        <div class="bulk-info">
          <div class="bulk-count">{{ selectedStudents.length }}</div>
          <div class="bulk-text">student(s) selected</div>
        </div>
        <div class="bulk-buttons">
          <button @click="bulkUpdateAttendance('present')" class="bulk-btn success">
            <span>✓</span> Mark Present
          </button>
          <button @click="bulkUpdateAttendance('absent')" class="bulk-btn danger">
            <span>✕</span> Mark Absent
          </button>
          <button @click="bulkUpdateAttendance('excused')" class="bulk-btn warning">
            <span>📋</span> Mark Excused
          </button>
        </div>
      </div>
    </transition>

    <!-- Enhanced Students Table -->
    <div class="table-wrapper">
      <div class="table-container">
        <table class="students-table">
          <thead>
          <tr>
            <th class="checkbox-col">
              <label class="custom-checkbox">
                <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    :checked="isAllSelected"
                />
                <span class="checkmark"></span>
              </label>
            </th>
            <th>Seat No.</th>
            <th>Student Information</th>
            <th>Eligibility</th>
            <th>Attendance</th>
            <th class="actions-col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="examStudent in examStudents" :key="examStudent.id" class="table-row">
            <td class="checkbox-col">
              <label class="custom-checkbox">
                <input
                    type="checkbox"
                    :value="examStudent.id"
                    v-model="selectedStudents"
                />
                <span class="checkmark"></span>
              </label>
            </td>
            <td>
              <div v-if="editingSeat === examStudent.id" class="seat-edit">
                <input
                    v-model="examStudent.seat_number"
                    @blur="saveSeatNumber(examStudent)"
                    @keyup.enter="saveSeatNumber(examStudent)"
                    class="seat-input"
                    autofocus
                />
              </div>
              <div v-else @click="editingSeat = examStudent.id" class="seat-badge">
                <span class="seat-icon">🪑</span>
                <span>{{ examStudent.seat_number || 'Not Assigned' }}</span>
              </div>
            </td>
            <td>
              <div class="student-card">
                <div class="student-avatar">
                  {{ getInitials(examStudent.student.name) }}
                </div>
                <div class="student-info">
                  <div class="student-name">{{ examStudent.student.name }}</div>
                  <div class="student-details">
                    <span class="detail-item">
                      <span class="detail-icon">🎓</span>
                      {{ examStudent.student.roll_number }}
                    </span>
                    <span class="detail-separator">•</span>
                    <span class="detail-item">
                      <span class="detail-icon">📧</span>
                      {{ examStudent.student.email }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <button
                  @click="toggleEligibility(examStudent)"
                  :class="['status-badge', examStudent.is_eligible ? 'eligible' : 'not-eligible']"
              >
                <span class="status-icon">{{ examStudent.is_eligible ? '✓' : '✕' }}</span>
                <span>{{ examStudent.is_eligible ? 'Eligible' : 'Not Eligible' }}</span>
              </button>
            </td>
            <td>
              <select
                  v-model="examStudent.attendance_status"
                  @change="updateAttendance(examStudent)"
                  :class="['attendance-select', getAttendanceClass(examStudent.attendance_status)]"
              >
                <option value="">⏸ Not Marked</option>
                <option value="present">✓ Present</option>
                <option value="absent">✕ Absent</option>
                <option value="excused">📋 Excused</option>
              </select>
            </td>
            <td class="actions-col">
              <button @click="removeStudent(examStudent)" class="action-btn delete">
                <span>🗑️</span>
              </button>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="loading-cell">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">Loading students...</div>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && examStudents.length === 0">
            <td colspan="6" class="empty-cell">
              <div class="empty-state">
                <div class="empty-icon">📚</div>
                <div class="empty-title">No students assigned yet</div>
                <div class="empty-text">Click "Assign Students" to get started</div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="pagination-btn"
      >
        <span>←</span>
        <span>Previous</span>
      </button>
      <div class="pagination-pages">
        <span class="page-info">
          Page <strong>{{ pagination.current_page }}</strong> of <strong>{{ pagination.last_page }}</strong>
        </span>
      </div>
      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
      >
        <span>Next</span>
        <span>→</span>
      </button>
    </div>

    <!-- Enhanced Assign Students Modal -->
    <transition name="modal">
      <div v-if="showAssignModal" class="modal-overlay" @click="showAssignModal = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              <span class="modal-icon">👥</span>
              <h2>Assign Students to Exam</h2>
            </div>
            <button @click="showAssignModal = false" class="modal-close">
              <span>✕</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="option-card">
              <label class="switch-wrapper">
                <input type="checkbox" v-model="autoGenerateSeats" class="switch-input" />
                <span class="switch-slider"></span>
                <span class="switch-label">Auto-generate seat numbers</span>
              </label>
            </div>

            <div class="student-search-section">
              <div class="search-box">
                <div class="search-icon-wrapper">
                  <span class="search-icon">🔍</span>
                </div>
                <input
                    v-model="studentSearch"
                    type="text"
                    placeholder="Search students..."
                    class="search-input"
                />
              </div>

              <div class="students-list">
                <label
                    v-for="student in filteredAvailableStudents"
                    :key="student.id"
                    class="student-list-item"
                >
                  <input type="checkbox" :value="student.id" v-model="selectedToAssign" class="hidden-checkbox" />
                  <div class="student-checkbox">
                    <span class="check-icon">✓</span>
                  </div>
                  <div class="student-avatar small">
                    {{ getInitials(student.name) }}
                  </div>
                  <div class="student-info">
                    <div class="student-name">{{ student.name }}</div>
                    <div class="student-details">Roll: {{ student.roll_number }}</div>
                  </div>
                </label>
                <div v-if="filteredAvailableStudents.length === 0" class="no-results">
                  <span class="no-results-icon">😕</span>
                  <span>No students found</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showAssignModal = false" class="btn btn-secondary">
              <span>Cancel</span>
            </button>
            <button
                @click="assignStudents"
                :disabled="selectedToAssign.length === 0"
                class="btn btn-primary"
            >
              <span class="btn-icon">✓</span>
              <span>Assign {{ selectedToAssign.length }} Student(s)</span>
              <span class="btn-shine"></span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Enhanced Generate Seats Modal -->
    <transition name="modal">
      <div v-if="showSeatGenerateModal" class="modal-overlay" @click="showSeatGenerateModal = false">
        <div class="modal-container small" @click.stop>
          <div class="modal-header">
            <div class="modal-title">
              <span class="modal-icon">🎯</span>
              <h2>Generate Seat Numbers</h2>
            </div>
            <button @click="showSeatGenerateModal = false" class="modal-close">
              <span>✕</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🏷️</span>
                <span>Seat Number Prefix</span>
              </label>
              <input v-model="seatPrefix" type="text" class="form-input" placeholder="e.g., SEAT-, A-, HALL-" />
            </div>
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">🔢</span>
                <span>Start From Number</span>
              </label>
              <input v-model.number="seatStartFrom" type="number" class="form-input" min="1" />
            </div>
            <div class="preview-box">
              <div class="preview-label">Preview:</div>
              <div class="preview-samples">
                <span class="preview-sample">{{ seatPrefix }}{{ String(seatStartFrom).padStart(4, '0') }}</span>
                <span class="preview-sample">{{ seatPrefix }}{{ String(seatStartFrom + 1).padStart(4, '0') }}</span>
                <span class="preview-sample">{{ seatPrefix }}{{ String(seatStartFrom + 2).padStart(4, '0') }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showSeatGenerateModal = false" class="btn btn-secondary">
              <span>Cancel</span>
            </button>
            <button @click="generateSeats" class="btn btn-gradient">
              <span class="btn-icon">✨</span>
              <span>Generate Seats</span>
              <span class="btn-shine"></span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ExamStudents',
  props: {
    examId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      examStudents: [],
      availableStudents: [],
      statistics: {
        total: 0,
        eligible: 0,
        present: 0,
        absent: 0,
        excused: 0,
        pending: 0
      },
      filters: {
        search: '',
        attendance_status: '',
        is_eligible: ''
      },
      selectedStudents: [],
      selectedToAssign: [],
      loading: false,
      pagination: {
        current_page: 1,
        last_page: 1
      },
      showAssignModal: false,
      showSeatGenerateModal: false,
      autoGenerateSeats: true,
      seatPrefix: 'SEAT-',
      seatStartFrom: 1,
      studentSearch: '',
      editingSeat: null,
      searchTimeout: null
    };
  },
  computed: {
    isAllSelected() {
      return this.examStudents.length > 0 &&
          this.selectedStudents.length === this.examStudents.length;
    },
    filteredAvailableStudents() {
      if (!this.studentSearch) return this.availableStudents;
      const search = this.studentSearch.toLowerCase();
      return this.availableStudents.filter(student =>
          student.name.toLowerCase().includes(search) ||
          student.roll_number.toLowerCase().includes(search)
      );
    }
  },
  mounted() {
    this.fetchStudents();
    this.fetchStatistics();
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          ...this.filters
        };
        const response = await this.$api.get(`/exams/${this.examId}/students`, { params });
        this.examStudents = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page
        };
      } catch (error) {
        console.error('Error fetching students:', error);
        this.$notify({ type: 'error', message: 'Failed to load students' });
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const response = await this.$api.get(`/exams/${this.examId}/students/statistics`);
        this.statistics = response.data;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },

    async fetchAvailableStudents() {
      try {
        const response = await this.$api.get(`/exams/${this.examId}/students/available`);
        this.availableStudents = response.data;
      } catch (error) {
        console.error('Error fetching available students:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchStudents();
      }, 500);
    },

    clearSearch() {
      this.filters.search = '';
      this.fetchStudents();
    },

    async assignStudents() {
      if (this.selectedToAssign.length === 0) return;

      try {
        await this.$api.post(`/exams/${this.examId}/students/assign`, {
          student_ids: this.selectedToAssign,
          auto_generate_seats: this.autoGenerateSeats
        });

        this.showAssignModal = false;
        this.selectedToAssign = [];
        this.fetchStudents();
        this.fetchStatistics();
        this.$notify({ type: 'success', message: 'Students assigned successfully!' });
      } catch (error) {
        console.error('Error assigning students:', error);
        this.$notify({ type: 'error', message: 'Failed to assign students' });
      }
    },

    async generateSeats() {
      try {
        await this.$api.post(`/exams/${this.examId}/students/generate-seats`, {
          prefix: this.seatPrefix,
          start_from: this.seatStartFrom
        });

        this.showSeatGenerateModal = false;
        this.fetchStudents();
        this.$notify({ type: 'success', message: 'Seat numbers generated successfully!' });
      } catch (error) {
        console.error('Error generating seats:', error);
        this.$notify({ type: 'error', message: 'Failed to generate seat numbers' });
      }
    },

    async updateAttendance(examStudent) {
      try {
        await this.$api.put(`/exams/${this.examId}/students/${examStudent.id}`, {
          attendance_status: examStudent.attendance_status
        });
        this.fetchStatistics();
      } catch (error) {
        console.error('Error updating attendance:', error);
        this.$notify({ type: 'error', message: 'Failed to update attendance' });
      }
    },

    async bulkUpdateAttendance(status) {
      if (this.selectedStudents.length === 0) return;

      try {
        await this.$api.post(`/exams/${this.examId}/students/bulk-attendance`, {
          student_ids: this.selectedStudents,
          attendance_status: status
        });

        this.selectedStudents = [];
        this.fetchStudents();
        this.fetchStatistics();
        this.$notify({ type: 'success', message: 'Attendance updated successfully!' });
      } catch (error) {
        console.error('Error updating attendance:', error);
        this.$notify({ type: 'error', message: 'Failed to update attendance' });
      }
    },

    async toggleEligibility(examStudent) {
      try {
        examStudent.is_eligible = !examStudent.is_eligible;
        await this.$api.put(`/exams/${this.examId}/students/${examStudent.id}`, {
          is_eligible: examStudent.is_eligible
        });
        this.fetchStatistics();
      } catch (error) {
        console.error('Error updating eligibility:', error);
        this.$notify({ type: 'error', message: 'Failed to update eligibility' });
      }
    },

    async saveSeatNumber(examStudent) {
      try {
        await this.$api.put(`/exams/${this.examId}/students/${examStudent.id}`, {
          seat_number: examStudent.seat_number
        });
        this.editingSeat = null;
      } catch (error) {
        console.error('Error updating seat number:', error);
        this.$notify({ type: 'error', message: 'Failed to update seat number' });
      }
    },

    async removeStudent(examStudent) {
      if (!confirm(`Remove ${examStudent.student.name} from this exam?`)) return;

      try {
        await this.$api.delete(`/exams/${this.examId}/students/${examStudent.id}`);
        this.fetchStudents();
        this.fetchStatistics();
        this.$notify({ type: 'success', message: 'Student removed successfully' });
      } catch (error) {
        console.error('Error removing student:', error);
        this.$notify({ type: 'error', message: 'Failed to remove student' });
      }
    },

    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedStudents = [];
      } else {
        this.selectedStudents = this.examStudents.map(es => es.id);
      }
    },

    changePage(page) {
      this.pagination.current_page = page;
      this.fetchStudents();
    },

    getAttendanceClass(status) {
      const classes = {
        present: 'attendance-present',
        absent: 'attendance-absent',
        excused: 'attendance-excused'
      };
      return classes[status] || '';
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    },

    getPercentage(value) {
      if (this.statistics.total === 0) return 0;
      return Math.round((value / this.statistics.total) * 100);
    }
  },
  watch: {
    showAssignModal(val) {
      if (val) {
        this.fetchAvailableStudents();
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Animated Background */
.bg-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.03;
  z-index: -1;
  pointer-events: none;
}

.bg-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

/* Container */
.exam-students-container {
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: white;
  padding: 30px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 20px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #64748b;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* Enhanced Buttons */
.btn {
  position: relative;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e1;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn:hover .btn-shine {
  left: 100%;
}

.btn-icon {
  font-size: 16px;
}

/* Enhanced Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.stat-card.total {
  border-color: rgba(102, 126, 234, 0.2);
}

.stat-card.present {
  border-color: rgba(16, 185, 129, 0.2);
}

.stat-card.absent {
  border-color: rgba(239, 68, 68, 0.2);
}

.stat-card.excused {
  border-color: rgba(251, 146, 60, 0.2);
}

.stat-bg-icon {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 120px;
  opacity: 0.05;
  pointer-events: none;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 12px;
}

.stat-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.stat-bar-fill.present-fill {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.stat-bar-fill.absent-fill {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.stat-bar-fill.excused-fill {
  background: linear-gradient(90deg, #fb923c 0%, #f97316 100%);
}

.stat-icon {
  width: 64px;
  height: 64px;
}

.icon-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.icon-wrapper.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon-wrapper.present-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.icon-wrapper.absent-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.icon-wrapper.excused-icon {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: white;
}

/* Enhanced Filters */
.filters-section {
  background: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon-wrapper {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  background: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  color: #64748b;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #cbd5e1;
  transform: translateY(-50%) scale(1.1);
}

.filter-group {
  display: flex;
  gap: 16px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Enhanced Bulk Actions */
.bulk-actions {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  gap: 16px;
  flex-wrap: wrap;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.bulk-count {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.bulk-text {
  font-weight: 600;
  font-size: 15px;
}

.bulk-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.bulk-btn {
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.bulk-btn.success {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.bulk-btn.success:hover {
  background: #10b981;
  transform: translateY(-2px);
}

.bulk-btn.danger {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.bulk-btn.danger:hover {
  background: #ef4444;
  transform: translateY(-2px);
}

.bulk-btn.warning {
  background: rgba(251, 146, 60, 0.9);
  color: white;
}

.bulk-btn.warning:hover {
  background: #fb923c;
  transform: translateY(-2px);
}

/* Enhanced Table */
.table-wrapper {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-container {
  background: white;
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
  padding: 18px 20px;
  text-align: left;
  font-weight: 700;
  color: white;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s;
  background: white;
}

.table-row:hover {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%);
  transform: scale(1.002);
}

.students-table td {
  padding: 20px;
  vertical-align: middle;
}

.checkbox-col {
  width: 60px;
}

.actions-col {
  width: 80px;
  text-align: center;
}

/* Custom Checkbox */
.custom-checkbox {
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  display: block;
  width: 22px;
  height: 22px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;
}

.custom-checkbox:hover .checkmark {
  background: #e2e8f0;
  border-color: #667eea;
}

.custom-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.custom-checkbox .checkmark::after {
  content: '✓';
  position: absolute;
  display: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.custom-checkbox input:checked ~ .checkmark::after {
  display: block;
}

/* Seat Badge */
.seat-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.seat-badge:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  border-color: #667eea;
  transform: translateX(2px);
}

.seat-icon {
  font-size: 16px;
}

.seat-edit {
  position: relative;
}

.seat-input {
  padding: 10px 16px;
  border: 2px solid #667eea;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  min-width: 140px;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.seat-input:focus {
  outline: none;
}

/* Student Card */
.student-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.student-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.student-info {
  flex: 1;
}

.student-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 15px;
  margin-bottom: 4px;
}

.student-details {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.detail-icon {
  font-size: 12px;
}

.detail-separator {
  color: #cbd5e1;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 2px solid;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-badge.eligible {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #059669;
}

.status-badge.eligible:hover {
  background: rgba(16, 185, 129, 0.2);
  transform: scale(1.05);
}

.status-badge.not-eligible {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.status-badge.not-eligible:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.05);
}

.status-icon {
  font-size: 14px;
}

/* Attendance Select */
.attendance-select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  min-width: 140px;
}

.attendance-select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.attendance-present {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #059669;
}

.attendance-absent {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #dc2626;
}

.attendance-excused {
  background: rgba(251, 146, 60, 0.1);
  border-color: #fb923c;
  color: #ea580c;
}

/* Action Button */
.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1) rotate(5deg);
}

/* Loading & Empty States */
.loading-cell, .empty-cell {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.3;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.empty-text {
  font-size: 14px;
  color: #64748b;
}

/* Enhanced Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 20px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.pagination-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  color: #475569;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info {
  color: #64748b;
  font-size: 14px;
}

.page-info strong {
  color: #1e293b;
  font-weight: 700;
}

/* Enhanced Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-container.small {
  max-width: 480px;
}

.modal-header {
  padding: 28px 32px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, white 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 28px;
}

.modal-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 24px 32px;
  border-top: 2px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
}

/* Modal Animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* Form Elements */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  font-size: 14px;
}

.label-icon {
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  background: #f8fafc;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Switch Toggle */
.option-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.switch-input {
  display: none;
}

.switch-slider {
  position: relative;
  width: 52px;
  height: 28px;
  background: #cbd5e1;
  border-radius: 14px;
  transition: all 0.3s;
}

.switch-slider::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.switch-input:checked + .switch-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.switch-input:checked + .switch-slider::before {
  transform: translateX(24px);
}

.switch-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

/* Student Search Section */
.student-search-section {
  margin-top: 20px;
}

.students-list {
  max-height: 380px;
  overflow-y: auto;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  margin-top: 16px;
  background: #f8fafc;
}

.student-list-item {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  margin: 4px;
  border-radius: 12px;
}

.student-list-item:hover {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
  transform: translateX(4px);
}

.hidden-checkbox {
  display: none;
}

.student-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  transition: all 0.2s;
  flex-shrink: 0;
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s;
}

.hidden-checkbox:checked + .student-checkbox {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.hidden-checkbox:checked + .student-checkbox .check-icon {
  opacity: 1;
  transform: scale(1);
}

.no-results {
  padding: 40px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-results-icon {
  font-size: 48px;
  opacity: 0.3;
}

/* Preview Box */
.preview-box {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
}

.preview-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.preview-samples {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-sample {
  padding: 10px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 700;
  color: #475569;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-group {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }

  .bulk-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .bulk-buttons {
    flex-direction: column;
  }

  .bulk-btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: auto;
  }

  .students-table {
    min-width: 900px;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }

  .pagination-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
</style>