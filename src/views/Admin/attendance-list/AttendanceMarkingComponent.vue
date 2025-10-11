<template>
  <div class="attendance-container">
    <!-- Header Section -->
    <div class="header-sticky">
      <div class="header-card">
        <div class="class-info">
          <h2>{{ classInfo.topic || 'Mark Attendance' }}</h2>
          <div class="info-badges">
            <span class="badge badge-primary">{{ classInfo.subject }}</span>
            <span class="badge badge-warning">{{ classInfo.department }}</span>
            <span class="badge badge-info">{{ classInfo.class_date }}</span>
          </div>
        </div>

        <!-- Search and Actions -->
        <div class="action-bar">
          <div class="search-box">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name or roll number..."
                class="search-input"
            />
            <i class="icon-search">🔍</i>
          </div>

          <button
              @click="markAllPresent"
              :disabled="isMarkingAll"
              class="btn btn-primary"
          >
            <span v-if="!isMarkingAll">✅ Mark All Present</span>
            <span v-else>⏳ Marking...</span>
          </button>
        </div>

        <!-- Summary Stats -->
        <div class="summary-grid" v-if="students.length > 0">
          <div class="stat-card">
            <div class="stat-value">{{ markedCount }}</div>
            <div class="stat-label">Marked</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ students.length }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-card stat-success">
            <div class="stat-value">{{ presentCount }}</div>
            <div class="stat-label">Present</div>
          </div>
          <div class="stat-card stat-danger">
            <div class="stat-value">{{ absentCount }}</div>
            <div class="stat-label">Absent</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading students...</p>
    </div>

    <!-- Students Grid -->
    <div v-else-if="filteredStudents.length > 0" class="students-grid">
      <div
          v-for="student in filteredStudents"
          :key="student.id"
          class="student-card"
          :class="{ 'marked': student.is_marked }"
      >
        <div class="student-header">
          <div class="student-avatar">
            <img v-if="student.photo_url" :src="student.photo_url" :alt="student.full_name" />
            <div v-else class="avatar-placeholder">
              {{ student.full_name.charAt(0) }}
            </div>
          </div>

          <div class="student-info">
            <h3>{{ student.full_name }}</h3>
            <p class="roll-number">Roll: {{ student.roll_number }}</p>
            <span class="dept-badge">{{ student.department }}</span>
          </div>
        </div>

        <!-- Attendance Buttons -->
        <div class="attendance-actions">
          <button
              @click="markAttendance(student, 'present')"
              :class="['btn-status', 'btn-present', { 'active': student.attendance_status === 'present' }]"
              :disabled="isSaving"
          >
            ✅ Present
          </button>

          <button
              @click="markAttendance(student, 'absent')"
              :class="['btn-status', 'btn-absent', { 'active': student.attendance_status === 'absent' }]"
              :disabled="isSaving"
          >
            ❌ Absent
          </button>

          <button
              @click="markAttendance(student, 'late')"
              :class="['btn-status', 'btn-late', { 'active': student.attendance_status === 'late' }]"
              :disabled="isSaving"
          >
            ⏰ Late
          </button>

          <button
              @click="markAttendance(student, 'excused')"
              :class="['btn-status', 'btn-excused', { 'active': student.attendance_status === 'excused' }]"
              :disabled="isSaving"
          >
            📝 Excused
          </button>
        </div>

        <!-- Remarks -->
        <div class="remarks-section">
          <textarea
              v-model="student.remarks"
              placeholder="Add remarks (optional)..."
              rows="2"
              class="remarks-input"
              :disabled="isSaving"
          ></textarea>
        </div>

        <!-- Status Indicator -->
        <div v-if="student.is_marked" class="marked-badge">
          <span>✓ Marked as {{ student.attendance_status }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && students.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>No Students Found</h3>
      <p>There are no students enrolled in this class</p>
    </div>

    <!-- Submit Button (Fixed Bottom) -->
    <div v-if="students.length > 0" class="submit-footer">
      <button
          @click="submitAttendance"
          :disabled="markedCount === 0 || isSaving"
          class="btn btn-submit"
      >
        <span v-if="!isSaving">
          📤 Submit Attendance ({{ markedCount }}/{{ students.length }})
        </span>
        <span v-else>
          ⏳ Submitting...
        </span>
      </button>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        <div class="toast-content">
          <span class="toast-icon">{{ toast.type === 'success' ? '✅' : '❌' }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </div>
    </transition>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="modal-content" @click.stop>
        <h3>⚠️ Confirm Submission</h3>
        <p>Are you sure you want to submit attendance for {{ markedCount }} students?</p>
        <div class="modal-actions">
          <button @click="showConfirmModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="confirmSubmit" class="btn btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceMarkingComponent',

  props: {
    classId: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      loading: false,
      isSaving: false,
      isMarkingAll: false,
      searchQuery: '',
      classInfo: {},
      students: [],
      showConfirmModal: false,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
    };
  },

  computed: {
    filteredStudents() {
      if (!this.searchQuery) {
        return this.students;
      }
      const query = this.searchQuery.toLowerCase();
      return this.students.filter(student =>
          student.full_name.toLowerCase().includes(query) ||
          student.roll_number.toLowerCase().includes(query)
      );
    },

    markedCount() {
      return this.students.filter(s => s.attendance_status).length;
    },

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

    // API call to fetch students
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await this.$api.get(`/attendance/class/${this.classId}/students`);
        this.classInfo = response.data.data.class;
        this.students = response.data.data.students.map(student => ({
          ...student,
          remarks: ''
        }));
      } catch (error) {
        this.showToast('Failed to load students', 'error');
        console.error('Error fetching students:', error);
      } finally {
        this.loading = false;
      }
    },

    // Mark attendance for a student
    markAttendance(student, status) {
      student.attendance_status = status;
      student.is_marked = true;
    },

    // Mark all students as present
    async markAllPresent() {
      this.isMarkingAll = true;
      try {
        const response = await this.$api.post(`/attendance/class/${this.classId}/mark-all-present`,);
        console.log(response)
        this.showToast('All students marked as present!', 'success');
        this.fetchStudents(); // Reload data
      } catch (error) {
        this.showToast('Failed to mark all present', 'error');
        console.error('Error marking all present:', error);
      } finally {
        this.isMarkingAll = false;
      }
    },

    // Show confirmation modal
    submitAttendance() {
      if (this.markedCount === 0) {
        this.showToast('Please mark at least one student', 'error');
        return;
      }
      this.showConfirmModal = true;
    },

    // Confirm and submit attendance
    async confirmSubmit() {
      this.showConfirmModal = false;
      this.isSaving = true;

      try {
        // Prepare attendance data
        const markedStudents = this.students
            .filter(s => s.attendance_status)
            .map(s => ({
              student_id: s.id,
              attendance_status: s.attendance_status,
              remarks: s.remarks || null
            }));

        const response = await this.$api.post(`/attendance/mark-bulk`, {
              class_id: this.classId,
              attendance: markedStudents
            }
        );

        this.showToast(
            `Attendance submitted successfully! (${response.data.data.saved_count} saved)`,
            'success'
        );

        // Reload data after 1 second
        setTimeout(() => {
          this.fetchStudents();
        }, 1000);

      } catch (error) {
        this.showToast('Failed to submit attendance', 'error');
        console.error('Error submitting attendance:', error);
      } finally {
        this.isSaving = false;
      }
    },

    // Show toast notification
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      };

      setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.attendance-container {
  padding-bottom: 100px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* Header Section */
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
}

.header-card {
  padding: 20px;
  background: white;
}

.class-info h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.info-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge-primary { background: #667eea; }
.badge-warning { background: #f6ad55; }
.badge-info { background: #4299e1; }

/* Action Bar */
.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.icon-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e0;
}

/* Summary Stats */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  padding-top: 15px;
  border-top: 2px solid #f7fafc;
}

.stat-card {
  text-align: center;
  padding: 12px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #cbd5e0;
}

.stat-card.stat-success {
  border-left-color: #48bb78;
  background: #f0fff4;
}

.stat-card.stat-danger {
  border-left-color: #f56565;
  background: #fff5f5;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 13px;
  color: #718096;
  margin-top: 4px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Students Grid */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px;
}

.student-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.student-card.marked {
  border-color: #48bb78;
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.2);
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.student-header {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  align-items: center;
}

.student-avatar {
  flex-shrink: 0;
}

.student-avatar img,
.avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.student-info {
  flex: 1;
}

.student-info h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
}

.roll-number {
  margin: 0 0 8px 0;
  color: #718096;
  font-size: 14px;
}

.dept-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #edf2f7;
  border-radius: 12px;
  font-size: 12px;
  color: #4a5568;
  font-weight: 600;
}

/* Attendance Actions */
.attendance-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.btn-status {
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-status:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-present {
  color: #48bb78;
}

.btn-present.active {
  background: #48bb78;
  color: white;
  border-color: #48bb78;
}

.btn-absent {
  color: #f56565;
}

.btn-absent.active {
  background: #f56565;
  color: white;
  border-color: #f56565;
}

.btn-late {
  color: #ed8936;
}

.btn-late.active {
  background: #ed8936;
  color: white;
  border-color: #ed8936;
}

.btn-excused {
  color: #4299e1;
}

.btn-excused.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

/* Remarks */
.remarks-section {
  margin-bottom: 12px;
}

.remarks-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.remarks-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Marked Badge */
.marked-badge {
  text-align: center;
  padding: 8px;
  background: #f0fff4;
  border-radius: 8px;
  color: #48bb78;
  font-size: 13px;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

/* Submit Footer */
.submit-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background: white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  z-index: 99;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.4);
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  color: white;
  font-weight: 600;
  min-width: 300px;
}

.toast-success {
  background: #48bb78;
}

.toast-error {
  background: #f56565;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-icon {
  font-size: 20px;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s;
}

.toast-enter, .toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
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
  z-index: 1001;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin: 0 0 15px 0;
  font-size: 22px;
  color: #2d3748;
}

.modal-content p {
  margin: 0 0 25px 0;
  color: #4a5568;
  font-size: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .action-bar {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .attendance-actions {
    grid-template-columns: 1fr;
  }

  .class-info h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .header-card {
    padding: 15px;
  }

  .summary-grid {
    gap: 8px;
  }

  .stat-value {
    font-size: 22px;
  }

  .toast {
    min-width: auto;
    left: 20px;
    right: 20px;
  }
}
</style>