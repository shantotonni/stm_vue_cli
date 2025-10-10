<template>
  <div class="attendance-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <h1 class="title">📝 Attendance Marking</h1>
        <p class="subtitle">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Date and Class Selection -->
    <div class="selection-card">
      <div class="form-group">
        <label class="label">
          <span class="label-icon">📅</span>
          Select Date
        </label>
        <input
            type="date"
            v-model="selectedDate"
            class="input-field"
            @change="loadStudents"
        />
      </div>

      <div class="form-group">
        <label class="label">
          <span class="label-icon">🏫</span>
          Select Class
        </label>
        <select v-model="selectedClassId" class="input-field" @change="loadStudents">
          <option value="">Choose a class...</option>
          <option v-for="classItem in todayClasses" :key="classItem.id" :value="classItem.class_id">
            {{ classItem.class_name }} - {{ classItem.subject }} ({{ classItem.time }})
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading students...</p>
    </div>

    <!-- Students List -->
    <div v-else-if="students.length > 0" class="students-section">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="stats-row">
          <div class="stat-item present">
            <span class="stat-number">{{ presentCount }}</span>
            <span class="stat-label">Present</span>
          </div>
          <div class="stat-item absent">
            <span class="stat-number">{{ absentCount }}</span>
            <span class="stat-label">Absent</span>
          </div>
          <div class="stat-item late">
            <span class="stat-number">{{ lateCount }}</span>
            <span class="stat-label">Late</span>
          </div>
          <div class="stat-item excused">
            <span class="stat-number">{{ excusedCount }}</span>
            <span class="stat-label">Excused</span>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="markAllPresent" class="btn btn-success">
            ✓ Mark All Present
          </button>
          <button @click="saveAttendance" class="btn btn-primary" :disabled="saving">
            <span v-if="saving">💾 Saving...</span>
            <span v-else>💾 Save Attendance</span>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="🔍 Search student by name or roll..."
            class="search-input"
        />
      </div>

      <!-- Students Grid -->
      <div class="students-grid">
        <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="student-card"
            :class="'status-' + student.attendance_status"
        >
          <div class="student-header">
            <div class="student-info">
              <img :src="student.photo" :alt="student.name" class="student-avatar" />
              <div class="student-details">
                <h3 class="student-name">{{ student.name }}</h3>
                <p class="student-roll">Roll: {{ student.roll_no }}</p>
              </div>
            </div>
            <div class="status-badge" :class="'badge-' + student.attendance_status">
              {{ student.attendance_status.toUpperCase() }}
            </div>
          </div>

          <div class="status-selector">
            <button
                v-for="status in statuses"
                :key="status.value"
                @click="updateStatus(student, status.value)"
                class="status-btn"
                :class="{ active: student.attendance_status === status.value }"
            >
              <span class="status-icon">{{ status.icon }}</span>
              <span class="status-text">{{ status.label }}</span>
            </button>
          </div>

          <div class="remarks-section">
            <textarea
                v-model="student.remarks"
                :placeholder="'Add remarks for ' + student.name + '...'"
                class="remarks-input"
                rows="2"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && selectedClassId" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No Students Found</h3>
      <p>There are no students enrolled in this class.</p>
    </div>

    <!-- Initial State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📚</div>
      <h3>Select a Class</h3>
      <p>Choose a class from above to start marking attendance.</p>
    </div>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast toast-success">
        ✓ {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AttendanceMarking',

  data() {
    return {
      selectedDate: new Date().toISOString().split('T')[0],
      selectedClassId: '',
      todayClasses: [],
      students: [],
      searchQuery: '',
      loading: false,
      saving: false,
      showToast: false,
      toastMessage: '',
      statuses: [
        { value: 'present', label: 'Present', icon: '✓' },
        { value: 'absent', label: 'Absent', icon: '✗' },
        { value: 'late', label: 'Late', icon: '⏰' },
        { value: 'excused', label: 'Excused', icon: '📋' }
      ]
    }
  },

  computed: {
    currentDate() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.selectedDate).toLocaleDateString('en-US', options);
    },

    filteredStudents() {
      if (!this.searchQuery) return this.students;

      const query = this.searchQuery.toLowerCase();
      return this.students.filter(student =>
          student.name.toLowerCase().includes(query) ||
          student.roll_number.toString().includes(query)
      );
    },

    presentCount() {
      return this.students.filter(s => s.attendance_status === 'present').length;
    },

    absentCount() {
      return this.students.filter(s => s.attendance_status === 'absent').length;
    },

    lateCount() {
      return this.students.filter(s => s.attendance_status === 'late').length;
    },

    excusedCount() {
      return this.students.filter(s => s.attendance_status === 'excused').length;
    }
  },

  mounted() {
    this.loadTodayClasses();
  },

  methods: {
    async loadTodayClasses() {
      try {
        const response = await this.$api.get('/attendance/today-classes');
        if (response.data.success) {
          this.todayClasses = response.data.data;
        }
      } catch (error) {
        console.error('Error loading classes:', error);
        this.showToastMessage('Error loading classes');
      }
    },

    async loadStudents() {
      alert(this.selectedClassId)
      if (!this.selectedClassId) return;

      this.loading = true;
      try {
        const response = await this.$api.get(`/attendance/class/${this.selectedClassId}/students`,
            { params: { date: this.selectedDate } }
        );

        if (response.data.success) {
          this.students = response.data.data.students;
        }
      } catch (error) {
        console.error('Error loading students:', error);
        this.showToastMessage('Error loading students');
      } finally {
        this.loading = false;
      }
    },

    updateStatus(student, status) {
      student.attendance_status = status;
    },

    markAllPresent() {
      this.students.forEach(student => {
        student.attendance_status = 'present';
      });
      this.showToastMessage('All students marked as present');
    },

    async saveAttendance() {
      if (!this.selectedClassId) {
        this.showToastMessage('Please select a class');
        return;
      }

      this.saving = true;

      try {
        const attendances = this.students.map(student => ({
          student_id: student.id,
          status: student.attendance_status,
          remarks: student.remarks || null
        }));

        const response = await this.$api.post('/attendance/save', {
          class_id: this.selectedClassId,
          date: this.selectedDate,
          attendances: attendances
        });

        if (response.data.success) {
          this.showToastMessage('Attendance saved successfully! ✓');
          await this.loadStudents(); // Reload to show updated data
        }
      } catch (error) {
        console.error('Error saving attendance:', error);
        this.showToastMessage('Error saving attendance ✗');
      } finally {
        this.saving = false;
      }
    },

    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container - Ultra Modern Gradient */
.attendance-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  position: relative;
}

.attendance-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.attendance-container > * {
  position: relative;
  z-index: 1;
}

/* Header - Glassmorphism Effect */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 28px;
  padding: 40px;
  margin-bottom: 24px;
  box-shadow:
      0 8px 32px rgba(31, 38, 135, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  text-align: center;
}

.title {
  margin: 0 0 12px 0;
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 18px;
  font-weight: 600;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

/* Selection Card - Modern Glassmorphism */
.selection-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 28px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow:
      0 8px 32px rgba(31, 38, 135, 0.12),
      0 0 0 1px rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: grid;
  gap: 24px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  .selection-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #1f2937;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.label-icon {
  font-size: 20px;
}

.input-field {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(10px);
}

.input-field:hover {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(255, 255, 255, 0.95);
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 1);
  box-shadow:
      0 0 0 4px rgba(102, 126, 234, 0.1),
      0 8px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

/* Loading State - Modern Spinner */
.loading-state {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.spinner {
  width: 64px;
  height: 64px;
  border: 5px solid rgba(102, 126, 234, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  font-size: 18px;
  font-weight: 600;
}

/* Students Section - Premium Glassmorphism */
.students-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 28px;
  padding: 32px;
  box-shadow:
      0 8px 32px rgba(31, 38, 135, 0.12),
      0 0 0 1px rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 32px;
}

/* Stats Row - Modern Cards with Depth */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  padding: 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.12),
      0 0 1px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  pointer-events: none;
}

.stat-item:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.18),
      0 0 1px rgba(0, 0, 0, 0.05);
}

.stat-item.present {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-item.absent {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stat-item.late {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-item.excused {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.stat-number {
  display: block;
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1.2px;
  opacity: 0.95;
}

/* Action Buttons - Premium Design */
.action-buttons {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .action-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

.btn {
  padding: 18px 28px;
  border: none;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 0 1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn:hover::before {
  opacity: 1;
}

.btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.18),
      0 0 1px rgba(0, 0, 0, 0.05);
}

.btn:active {
  transform: translateY(-2px) scale(0.98);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn:disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Search Bar - Modern Design */
.search-bar {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 18px 24px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 18px;
  font-size: 16px;
  font-weight: 600;
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: #1f2937;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:hover {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(255, 255, 255, 0.95);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 1);
  box-shadow:
      0 0 0 4px rgba(102, 126, 234, 0.1),
      0 8px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

/* Students Grid - Masonry Layout */
.students-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .students-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .students-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Student Card - Premium Design */
.student-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  border: 3px solid transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
}

.student-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.student-card:hover {
  transform: translateY(-6px);
  box-shadow:
      0 20px 50px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(0, 0, 0, 0.02);
}

.student-card.status-present {
  border-color: rgba(16, 185, 129, 0.4);
}

.student-card.status-present::before {
  background: linear-gradient(90deg, #10b981, #059669);
  opacity: 1;
}

.student-card.status-absent {
  border-color: rgba(239, 68, 68, 0.4);
}

.student-card.status-absent::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
  opacity: 1;
}

.student-card.status-late {
  border-color: rgba(245, 158, 11, 0.4);
}

.student-card.status-late::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
  opacity: 1;
}

.student-card.status-excused {
  border-color: rgba(139, 92, 246, 0.4);
}

.student-card.status-excused::before {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  opacity: 1;
}

/* Student Header */
.student-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 12px;
}

.student-info {
  display: flex;
  gap: 14px;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 1);
  box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.1),
      0 0 0 2px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar {
  transform: scale(1.05);
  box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.15),
      0 0 0 2px rgba(102, 126, 234, 0.2);
}

.student-details {
  flex: 1;
  min-width: 0;
}

.student-name {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.student-roll {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-present {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.badge-absent {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.badge-late {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.badge-excused {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

/* Status Selector - Modern Pills */
.status-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.status-btn {
  padding: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
}

.status-btn:hover {
  border-color: #667eea;
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.status-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px) scale(1.05);
  box-shadow:
      0 8px 20px rgba(102, 126, 234, 0.3),
      0 0 1px rgba(0, 0, 0, 0.05);
}

.status-icon {
  font-size: 18px;
}

/* Remarks Section */
.remarks-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 14px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: rgba(248, 249, 250, 0.8);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: #1f2937;
  font-weight: 500;
}

.remarks-input::placeholder {
  color: #9ca3af;
}

.remarks-input:hover {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(255, 255, 255, 0.95);
}

.remarks-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Empty State - Modern Design */
.empty-state {
  text-align: center;
  padding: 100px 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow:
      0 8px 32px rgba(31, 38, 135, 0.12),
      0 0 0 1px rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.empty-icon {
  font-size: 96px;
  margin-bottom: 24px;
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h3 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: -0.5px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 18px;
  font-weight: 500;
}

/* Toast - Premium Notification */
.toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  padding: 20px 28px;
  border-radius: 18px;
  font-weight: 700;
  box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 1000;
  backdrop-filter: blur(10px);
  font-size: 16px;
  letter-spacing: 0.3px;
}

.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Mobile Responsive - Enhanced */
@media (max-width: 768px) {
  .attendance-container {
    padding: 16px;
  }

  .header {
    padding: 28px 24px;
  }

  .title {
    font-size: 32px;
  }

  .selection-card,
  .students-section {
    padding: 24px;
  }

  .stats-row {
    gap: 12px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 11px;
  }

  .students-grid {
    gap: 20px;
  }

  .toast {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 24px 20px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  .selection-card,
  .students-section {
    padding: 20px;
  }

  .student-card {
    padding: 20px;
  }

  .student-avatar {
    width: 52px;
    height: 52px;
  }

  .student-name {
    font-size: 16px;
  }

  .stat-number {
    font-size: 24px;
  }
}

/* Print Styles */
@media print {
  .attendance-container {
    background: white;
  }

  .action-buttons,
  .toast {
    display: none;
  }
}
</style>