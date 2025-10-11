<template>
  <div class="quick-attendance">
    <div class="header">
      <div class="header-content">
        <h3>Quick Attendance</h3>
        <p class="subtitle">Tap student cards to mark attendance</p>
      </div>
      <div class="stats">
        <div class="stat-badge stat-present">
          <i class="icon-check-circle"></i>
          <span>Present: <strong>{{ presentCount }}</strong></span>
        </div>
        <div class="stat-badge stat-absent">
          <i class="icon-x-circle"></i>
          <span>Absent: <strong>{{ absentCount }}</strong></span>
        </div>
      </div>
    </div>

    <div class="search-bar">
      <div class="search-input-wrapper">
        <i class="icon-search"></i>
        <input
            type="text"
            v-model="searchQuery"
            @input="filterStudents"
            placeholder="Search by name or roll..."
            class="search-input"
        >
        <span v-if="searchQuery" @click="clearSearch" class="clear-search">
          <i class="icon-x"></i>
        </span>
      </div>
    </div>

    <div class="students-grid">
      <transition-group name="card-list" tag="div" class="grid-inner">
        <div
            v-for="student in filteredStudents"
            :key="student.id"
            :class="getStudentCardClass(student)"
            @click="toggleAttendance(student)"
        >
          <div class="card-header">
            <div class="student-avatar">
              {{ getInitials(student.student.name) }}
            </div>
            <div class="student-info">
              <div class="student-name">{{ student.student.name }}</div>
              <div class="student-meta">
                <span class="roll">Roll: {{ student.student.roll }}</span>
                <span v-if="student.seat_number" class="seat">Seat: {{ student.seat_number }}</span>
              </div>
            </div>
          </div>

          <div class="attendance-status">
            <div v-if="student.attendance_status === 'present'" class="status-badge status-present">
              <i class="icon-check"></i>
              <span>Present</span>
            </div>
            <div v-else class="status-badge status-absent">
              <i class="icon-x"></i>
              <span>Absent</span>
            </div>
          </div>

          <div v-if="changes[student.id]" class="change-indicator">
            <i class="icon-alert-circle"></i>
            <span>Unsaved</span>
          </div>
        </div>
      </transition-group>

      <div v-if="filteredStudents.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="icon-users"></i>
        </div>
        <p class="empty-title">No students found</p>
        <p class="empty-subtitle">Try adjusting your search</p>
      </div>
    </div>

    <div class="action-bar">
      <div class="action-group">
        <button @click="markAllPresent" class="btn btn-success">
          <i class="icon-check-circle"></i>
          <span>Mark All Present</span>
        </button>
        <button @click="markAllAbsent" class="btn btn-danger">
          <i class="icon-x-circle"></i>
          <span>Mark All Absent</span>
        </button>
      </div>

      <button @click="saveAttendance" class="btn btn-primary btn-save" :disabled="saving || Object.keys(changes).length === 0">
        <i v-if="!saving" class="icon-save"></i>
        <div v-else class="spinner-small"></div>
        <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
        <span v-if="Object.keys(changes).length > 0" class="badge-count">{{ Object.keys(changes).length }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickAttendance',
  props: {
    examId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      students: [],
      filteredStudents: [],
      searchQuery: '',
      saving: false,
      changes: {}
    };
  },
  computed: {
    presentCount() {
      return this.students.filter(s => s.attendance_status === 'present').length;
    },
    absentCount() {
      return this.students.filter(s => s.attendance_status === 'absent').length;
    }
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await this.$api.get('/exam-students', {
          params: {
            exam_id: this.examId,
            per_page: 1000
          }
        });
        this.students = response.data.data.data;
        this.filteredStudents = [...this.students];
      } catch (error) {
        this.$toast.error('Failed to load data');
      }
    },

    toggleAttendance(student) {
      const newStatus = student.attendance_status === 'present' ? 'absent' : 'present';
      student.attendance_status = newStatus;
      this.changes[student.id] = newStatus;
      this.$forceUpdate();
    },

    markAllPresent() {
      this.filteredStudents.forEach(student => {
        student.attendance_status = 'present';
        this.changes[student.id] = 'present';
      });
      this.$forceUpdate();
    },

    markAllAbsent() {
      this.filteredStudents.forEach(student => {
        student.attendance_status = 'absent';
        this.changes[student.id] = 'absent';
      });
      this.$forceUpdate();
    },

    async saveAttendance() {
      if (Object.keys(this.changes).length === 0) {
        this.$toast.info('No changes to save');
        return;
      }

      try {
        this.saving = true;
        const promises = Object.entries(this.changes).map(([id, status]) =>
            this.$api.patch(`/exam-students/${id}/attendance`, {
              attendance_status: status
            })
        );

        await Promise.all(promises);

        this.$toast.success(`${Object.keys(this.changes).length} students attendance saved`);
        this.changes = {};
        this.$emit('saved');
      } catch (error) {
        this.$toast.error('Failed to save attendance');
      } finally {
        this.saving = false;
      }
    },

    filterStudents() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        this.filteredStudents = [...this.students];
        return;
      }

      this.filteredStudents = this.students.filter(student =>
          student.student.name.toLowerCase().includes(query) ||
          student.student.roll.toString().includes(query) ||
          (student.seat_number && student.seat_number.includes(query))
      );
    },

    clearSearch() {
      this.searchQuery = '';
      this.filterStudents();
    },

    getStudentCardClass(student) {
      return {
        'student-card': true,
        'card-present': student.attendance_status === 'present',
        'card-absent': student.attendance_status === 'absent',
        'card-changed': this.changes[student.id] !== undefined
      };
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    }
  }
};
</script>

<style scoped>
.quick-attendance {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-badge i {
  font-size: 20px;
}

.stat-present {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.stat-absent {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

/* Search Bar */
.search-bar {
  margin-bottom: 24px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input-wrapper i.icon-search {
  position: absolute;
  left: 20px;
  color: #6c757d;
  font-size: 20px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 56px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: transparent;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #dee2e6;
  transform: scale(1.1);
}

/* Students Grid */
.students-grid {
  margin-bottom: 24px;
}

.grid-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.student-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
  position: relative;
  overflow: hidden;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-present {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #10b981;
}

.card-present::before {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

.card-absent {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #ef4444;
}

.card-absent::before {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.card-changed {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
  min-width: 0;
}

.student-name {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 16px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #6c757d;
}

.attendance-status {
  display: flex;
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge i {
  font-size: 18px;
}

.status-present {
  background: rgba(16, 185, 129, 0.2);
  color: #065f46;
}

.status-absent {
  background: rgba(239, 68, 68, 0.2);
  color: #991b1b;
}

.change-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.change-indicator i {
  font-size: 14px;
}

/* Empty State */
.empty-state {
  padding: 80px 20px;
  text-align: center;
  grid-column: 1 / -1;
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
  margin: 0;
}

/* Action Bar */
.action-bar {
  position: sticky;
  bottom: 0;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
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
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn i {
  font-size: 18px;
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

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.badge-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.spinner-small {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Card List Animation */
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .quick-attendance {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    width: 100%;
    flex-direction: column;
  }

  .stat-badge {
    justify-content: center;
  }

  .grid-inner {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-group {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>