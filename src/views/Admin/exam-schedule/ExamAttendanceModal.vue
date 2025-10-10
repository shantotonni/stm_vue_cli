<template>
  <transition name="modal-fade">
    <div v-if="show && exam" class="modal-overlay" @click.self="close">
      <div class="modern-attendance-modal">
        <!-- Header -->
        <div class="modal-header-attendance">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">Attendance Management</h2>
              <p class="modal-subtitle">{{ exam.title }}</p>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-attendance">
          <!-- Statistics Cards -->
          <div class="stats-grid">
            <div class="stat-card stat-total">
              <div class="stat-icon-wrapper">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ statistics.total }}</div>
                <div class="stat-label">Total Students</div>
              </div>
              <div class="stat-trend">
                <i class="fas fa-circle"></i>
              </div>
            </div>

            <div class="stat-card stat-present">
              <div class="stat-icon-wrapper">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ statistics.present }}</div>
                <div class="stat-label">Present</div>
              </div>
              <div class="stat-trend positive">
                <i class="fas fa-arrow-up"></i>
              </div>
            </div>

            <div class="stat-card stat-absent">
              <div class="stat-icon-wrapper">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ statistics.absent }}</div>
                <div class="stat-label">Absent</div>
              </div>
              <div class="stat-trend negative">
                <i class="fas fa-arrow-down"></i>
              </div>
            </div>

            <div class="stat-card stat-percentage">
              <div class="stat-icon-wrapper">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ statistics.percentage.toFixed(1) }}%</div>
                <div class="stat-label">Attendance Rate</div>
              </div>
              <div class="progress-ring">
                <svg width="50" height="50">
                  <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="#e2e8f0"
                      stroke-width="4"
                  />
                  <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="#48c6ef"
                      stroke-width="4"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="progressOffset"
                      transform="rotate(-90 25 25)"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Actions Bar -->
          <div class="actions-bar">
            <div class="actions-left">
              <button class="action-btn btn-success" @click="markAllPresent">
                <i class="fas fa-check-double"></i>
                Mark All Present
              </button>
              <button class="action-btn btn-primary" @click="toggleBulkMode">
                <i class="fas fa-list-check"></i>
                {{ bulkMode ? 'Exit' : 'Bulk Check-in' }}
              </button>
            </div>
            <div class="actions-right">
              <button class="action-btn btn-info" @click="exportAttendance">
                <i class="fas fa-file-excel"></i>
                Export
              </button>
            </div>
          </div>

          <!-- Search and Filter Section -->
          <div class="search-filter-section">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input
                  type="text"
                  class="search-input"
                  placeholder="Search by name or student ID..."
                  v-model="searchQuery"
              >
            </div>
            <div class="filter-box">
              <i class="fas fa-filter filter-icon"></i>
              <select class="filter-select" v-model="filterStatus">
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="pending">Not Marked</option>
              </select>
            </div>
          </div>

          <!-- Bulk Mode Banner -->
          <transition name="slide-down">
            <div v-if="bulkMode" class="bulk-mode-banner">
              <div class="bulk-info">
                <i class="fas fa-info-circle"></i>
                <strong>Bulk Mode Active:</strong>
                <span class="selected-count">{{ selectedStudents.length }} students selected</span>
              </div>
              <div class="bulk-actions">
                <button class="bulk-btn btn-mark" @click="markSelectedPresent">
                  <i class="fas fa-check"></i>
                  Mark Selected Present
                </button>
                <button class="bulk-btn btn-cancel" @click="cancelBulkMode">
                  <i class="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            </div>
          </transition>

          <!-- Attendance Table -->
          <div class="attendance-table-container">
            <table class="attendance-table">
              <thead>
              <tr>
                <th v-if="bulkMode" class="checkbox-col">
                  <label class="custom-checkbox">
                    <input
                        type="checkbox"
                        @change="toggleSelectAll"
                        :checked="allSelected"
                    >
                    <span class="checkmark"></span>
                  </label>
                </th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Status</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="student in filteredStudents"
                  :key="student.id"
                  class="student-row"
                  :class="{ 'selected': selectedStudents.includes(student.id) }"
              >
                <td v-if="bulkMode" class="checkbox-col">
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
                  <span class="student-id">{{ student.student_id }}</span>
                </td>
                <td>
                  <div class="student-info">
                    <div class="student-avatar">
                      {{ getInitials(student.name) }}
                    </div>
                    <span class="student-name">{{ student.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="roll-number">{{ student.roll_number }}</span>
                </td>
                <td>
                    <span class="status-badge" :class="getStatusClass(student.attendance_status)">
                      <i class="fas" :class="getStatusIcon(student.attendance_status)"></i>
                      {{ getStatusText(student.attendance_status) }}
                    </span>
                </td>
                <td>
                  <div v-if="student.check_in_time" class="time-display">
                    <i class="fas fa-clock"></i>
                    {{ formatTime(student.check_in_time) }}
                  </div>
                  <span v-else class="no-data">-</span>
                </td>
                <td>
                  <div v-if="student.check_out_time" class="time-display">
                    <i class="fas fa-clock"></i>
                    {{ formatTime(student.check_out_time) }}
                  </div>
                  <span v-else class="no-data">-</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                        v-if="!student.check_in_time"
                        class="table-btn btn-checkin"
                        @click="markPresent(student)"
                        title="Check-in"
                    >
                      <i class="fas fa-sign-in-alt"></i>
                      Check-in
                    </button>
                    <button
                        v-if="student.check_in_time && !student.check_out_time"
                        class="table-btn btn-checkout"
                        @click="markCheckout(student)"
                        title="Check-out"
                    >
                      <i class="fas fa-sign-out-alt"></i>
                      Check-out
                    </button>
                    <button

                        class="table-btn btn-absent"
                        @click="markAbsent(student)"
                        title="Mark Absent"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredStudents.length === 0" class="empty-state">
              <i class="fas fa-users-slash"></i>
              <h3>No Students Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-attendance">
          <div class="footer-info">
            <i class="fas fa-info-circle"></i>
            Last updated: {{ getCurrentTime() }}
          </div>
          <button class="btn-close-footer" @click="close">
            <i class="fas fa-times-circle"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ExamAttendanceModal',

  props: {
    show: Boolean,
    exam: Object
  },

  data() {
    return {
      students: [],
      searchQuery: '',
      filterStatus: '',
      statistics: {
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0
      },
      bulkMode: false,
      selectedStudents: [],
      allSelected: false,
      circumference: 2 * Math.PI * 20
    };
  },

  computed: {
    filteredStudents() {
      let filtered = this.students;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.student_id.toLowerCase().includes(query)
        );
      }

      if (this.filterStatus) {
        if (this.filterStatus === 'pending') {
          filtered = filtered.filter(s => !s.attendance_status);
        } else {
          filtered = filtered.filter(s => s.attendance_status === this.filterStatus);
        }
      }

      return filtered;
    },

    progressOffset() {
      const percentage = this.statistics.percentage;
      return this.circumference - (percentage / 100) * this.circumference;
    }
  },

  watch: {
    show(val) {
      if (val && this.exam) {
        this.fetchAttendance();
      }
    }
  },

  methods: {
    // async fetchAttendance() {
    //   this.loading = true;
    //   try {
    //     // এই endpoint এখন exam_students table থেকে eligible students fetch করবে
    //     const response = await this.$api.get(`/attendance/exam/${this.exam.id}`);
    //
    //     if (response.data.success) {
    //       this.students = response.data.attendance;
    //       this.statistics = response.data.statistics;
    //
    //       // যদি কোন enrolled student না থাকে
    //       if (this.students.length === 0) {
    //         this.$toast.warning('No students enrolled in this exam');
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching attendance:', error);
    //     this.$toast.error('Failed to load attendance data');
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async fetchAttendance() {
      try {
        const response = await this.$api.get(`/attendance/exam/${this.exam.id}`);
        this.students = response.data.attendance;
        this.statistics = response.data.statistics;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        this.$toast.error('Failed to load attendance');
      }
    },

    async markPresent(student) {
      try {
        await this.$api.post('/attendance/check-in', {
          exam_id: this.exam.id,
          student_id: student.id,
        });

        this.$toast.success(`${student.name} marked present`);
        this.fetchAttendance();
      } catch (error) {
        console.error('Error marking attendance:', error);
        this.$toast.error('Failed to mark attendance');
      }
    },

    // ✅ UPDATED: Complete markAbsent function with API call
    async markAbsent(student) {
      // Confirmation dialog
      if (!confirm(`Mark ${student.name} as absent?`)) {
        return;
      }

      try {
        // API call to mark student absent
        const response = await this.$api.post('/attendance/mark-absent', {
          exam_id: this.exam.id,
          student_id: student.id
        });

        // Check response
        if (response.data.success) {
          this.$toast.success(`${student.name} marked absent`);
          // Refresh attendance list
          await this.fetchAttendance();
        } else {
          this.$toast.error(response.data.message || 'Failed to mark absent');
        }
      } catch (error) {
        console.error('Error marking absent:', error);

        // Handle different error types
        if (error.response) {
          // Server responded with error
          const message = error.response.data?.message || 'Failed to mark absent';
          this.$toast.error(message);
        } else if (error.request) {
          // Request made but no response
          this.$toast.error('No response from server');
        } else {
          // Other errors
          this.$toast.error('An error occurred');
        }
      }
    },

    // ✅ BONUS: Remove absent mark function
    async removeAbsentMark(student) {
      if (!confirm(`Remove absent mark for ${student.name}?`)) {
        return;
      }
      try {
        const response = await this.$api.post('/attendance/remove-absent', {
          exam_id: this.exam.id,
          student_id: student.id
        });

        if (response.data.success) {
          this.$toast.success(`Absent mark removed for ${student.name}`);
          await this.fetchAttendance();
        }
      } catch (error) {
        console.error('Error removing absent mark:', error);
        this.$toast.error('Failed to remove absent mark');
      }
    },

    async markCheckout(student) {
      try {
        const attendanceId = student.attendance_id || student.id;
        await this.$api.post(`/attendance/${attendanceId}/check-out`);

        this.$toast.success(`${student.name} checked out`);
        this.fetchAttendance();
      } catch (error) {
        console.error('Error marking checkout:', error);
        this.$toast.error('Failed to mark checkout');
      }
    },

    async markAllPresent() {
      if (confirm('Mark all students as present?')) {
        console.log(this.students)
        try {
          const promises = this.students.filter(s => !s.check_in_time)
              .map(s => this.markPresent(s));

          await Promise.all(promises);
          this.$toast.success('All students marked present');
        } catch (error) {
          console.error('Error marking all present:', error);
        }
      }
    },

    async markSelectedPresent() {
      try {
        const promises = this.selectedStudents.map(id => {
          const student = this.students.find(s => s.id === id);
          return this.markPresent(student);
        });

        await Promise.all(promises);
        this.cancelBulkMode();
        this.$toast.success('Selected students marked present');
      } catch (error) {
        console.error('Error:', error);
      }
    },

    toggleBulkMode() {
      this.bulkMode = !this.bulkMode;
      this.selectedStudents = [];
    },

    cancelBulkMode() {
      this.bulkMode = false;
      this.selectedStudents = [];
      this.allSelected = false;
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedStudents = [];
      } else {
        this.selectedStudents = this.filteredStudents.map(s => s.id);
      }
      this.allSelected = !this.allSelected;
    },

    getStatusClass(status) {
      const classes = {
        'present': 'status-present',
        'absent': 'status-absent',
        'excused': 'status-excused'
      };
      return classes[status] || 'status-pending';
    },

    getStatusIcon(status) {
      const icons = {
        'present': 'fa-check-circle',
        'absent': 'fa-times-circle',
        'excused': 'fa-exclamation-circle'
      };
      return icons[status] || 'fa-question-circle';
    },

    getStatusText(status) {
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Not Marked';
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },

    formatTime(time) {
      if (!time) return '';
      return new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getCurrentTime() {
      return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    exportAttendance() {
      this.$toast.info('Export feature coming soon!');
    },

    close() {
      this.cancelBulkMode();
      this.searchQuery = '';
      this.filterStatus = '';
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modern-attendance-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1400px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.4s ease-out;
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

/* Header */
.modal-header-attendance {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
  color: white;
  padding: 2rem;
  position: relative;
  border-radius: 24px 24px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.95;
  font-size: 0.95rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Body */
.modal-body-attendance {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-total::before { background: #667eea; }
.stat-present::before { background: #38ef7d; }
.stat-absent::before { background: #f5576c; }
.stat-percentage::before { background: #48c6ef; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-total .stat-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-present .stat-icon-wrapper {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-absent .stat-icon-wrapper {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.stat-percentage .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-details {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
  margin-top: 0.25rem;
}

.stat-trend {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  color: #a0aec0;
}

.stat-trend.positive { color: #38ef7d; }
.stat-trend.negative { color: #f5576c; }

.progress-ring {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

/* Actions Bar */
.actions-bar {
  background: white;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 1rem;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Search and Filter */
.search-filter-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box,
.filter-box {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-icon,
.filter-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 1rem;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Bulk Mode Banner */
.bulk-mode-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  flex-wrap: wrap;
  gap: 1rem;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selected-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
}

.bulk-btn {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-mark {
  background: white;
  color: #667eea;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.bulk-btn:hover {
  transform: scale(1.05);
}

/* Attendance Table */
.attendance-table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.attendance-table th {
  padding: 1.25rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.attendance-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f1f1;
}

.attendance-table tbody tr:hover {
  background: #f8f9fa;
  transform: scale(1.01);
}

.attendance-table tbody tr.selected {
  background: #eef2ff;
}

.attendance-table td {
  padding: 1.25rem 1rem;
  color: #4a5568;
}

.checkbox-col {
  width: 50px;
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
  background: white;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.custom-checkbox:hover .checkmark {
  border-color: #667eea;
}

.custom-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}

.custom-checkbox input:checked ~ .checkmark::after {
  content: '\f00c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
}

/* Student Info */
.student-id {
  font-weight: 700;
  color: #667eea;
  font-size: 0.9rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.student-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.student-name {
  font-weight: 600;
  color: #2d3748;
}

.roll-number {
  color: #718096;
  font-weight: 500;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-present {
  background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%);
  color: #11998e;
  border: 2px solid #38ef7d;
}

.status-absent {
  background: linear-gradient(135deg, #eb334915 0%, #f45c4315 100%);
  color: #eb3349;
  border: 2px solid #f45c43;
}

.status-excused {
  background: linear-gradient(135deg, #fad96115 0%, #f76b1c15 100%);
  color: #f76b1c;
  border: 2px solid #fad961;
}

.status-pending {
  background: #f7fafc;
  color: #a0aec0;
  border: 2px solid #cbd5e0;
}

/* Time Display */
.time-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

.time-display i {
  color: #a0aec0;
}

.no-data {
  color: #cbd5e0;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.table-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-checkin {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-checkout {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-absent {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
  padding: 0.5rem;
}

.table-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #a0aec0;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #4a5568;
  margin-bottom: 0.5rem;
}

/* Footer */
.modal-footer-attendance {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 24px 24px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
}

.footer-info i {
  color: #667eea;
}

.btn-close-footer {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  background: #e2e8f0;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-close-footer:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Scrollbar */
.modal-body-attendance::-webkit-scrollbar {
  width: 8px;
}

.modal-body-attendance::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-attendance::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modern-attendance-modal {
    max-height: 98vh;
  }

  .modal-header-attendance {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body-attendance {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-left,
  .actions-right {
    width: 100%;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .search-filter-section {
    grid-template-columns: 1fr;
  }

  .attendance-table-container {
    overflow-x: auto;
  }

  .attendance-table {
    min-width: 900px;
  }

  .bulk-mode-banner {
    flex-direction: column;
    align-items: stretch;
  }

  .bulk-actions {
    flex-direction: column;
  }

  .modal-footer-attendance {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-close-footer {
    width: 100%;
    justify-content: center;
  }
}
</style>