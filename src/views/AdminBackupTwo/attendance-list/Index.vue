<template>
  <div class="attendance-app">
    <!-- Animated Background -->
    <div class="bg-particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <div class="container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-glow"></div>
        <div class="hero-wrapper">
          <div class="hero-icon-box">
            <i class="icon-doc">📝</i>
            <div class="icon-pulse"></div>
            <div class="icon-pulse pulse-delay"></div>
          </div>
          <div class="hero-text-box">
            <h1 class="hero-heading">Student Attendance</h1>
            <p class="hero-desc">Track and manage class attendance with style</p>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filter-section">
        <div class="section-header">
          <div class="header-left">
            <div class="header-icon">🔍</div>
            <span class="header-title">Class Selection</span>
          </div>
          <div class="required-badge">Required</div>
        </div>

        <div class="filter-form">
          <div class="form-row">
            <div class="form-col">
              <label class="form-label">
                <span class="label-icon">🏢</span>
                Department
              </label>
              <select
                  v-model="filters.department_id"
                  @change="onFilterChange"
                  class="form-select"
              >
                <option value="">Choose Department</option>
                <option
                    v-for="dept in departments"
                    :key="dept.id"
                    :value="dept.id"
                >
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <div class="form-col">
              <label class="form-label">
                <span class="label-icon">📚</span>
                Subject
              </label>
              <select
                  v-model="filters.subject_id"
                  @change="onFilterChange"
                  class="form-select"
              >
                <option value="">Choose Subject</option>
                <option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :value="subject.id"
                >
                  {{ subject.name }}
                </option>
              </select>
            </div>

            <div class="form-col">
              <label class="form-label">
                <span class="label-icon">📅</span>
                Class Date
              </label>
              <input
                  type="date"
                  v-model="filters.class_date"
                  @change="onFilterChange"
                  class="form-input"
              />
            </div>
          </div>

          <button
              @click="loadStudents"
              :disabled="!isFilterValid || loading"
              class="load-button"
          >
            <span class="btn-shimmer"></span>
            <span class="btn-content">
              <span class="btn-icon">✨</span>
              <span>{{ loading ? 'Loading Students...' : 'Load Students' }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Class Info Section -->
      <transition name="scale-in">
        <div v-if="classInfo" class="class-info-section">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon gradient-purple">
                <span>📖</span>
              </div>
              <div class="info-text">
                <span class="info-label">Subject</span>
                <span class="info-value">{{ classInfo.subject }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon gradient-pink">
                <span>🏢</span>
              </div>
              <div class="info-text">
                <span class="info-label">Department</span>
                <span class="info-value">{{ classInfo.department }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon gradient-blue">
                <span>📅</span>
              </div>
              <div class="info-text">
                <span class="info-label">Date</span>
                <span class="info-value">{{ formatDate(classInfo.class_date) }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon gradient-green">
                <span>📄</span>
              </div>
              <div class="info-text">
                <span class="info-label">Topic</span>
                <span class="info-value">{{ classInfo.topic || 'Not specified' }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Students Table Section -->
      <transition name="scale-in">
        <div v-if="students.length > 0" class="students-section">
          <div class="section-header">
            <div class="header-left">
              <div class="header-icon">👥</div>
              <span class="header-title">Students Roster</span>
              <div class="count-pill">{{ students.length }}</div>
            </div>
            <div class="header-actions">
              <button @click="markAllAs('present')" class="action-btn btn-success">
                <span>✓</span>
                <span>All Present</span>
              </button>
              <button @click="markAllAs('absent')" class="action-btn btn-danger">
                <span>✗</span>
                <span>All Absent</span>
              </button>
            </div>
          </div>

          <!-- Students Table -->
          <div class="students-table">
            <div class="table-wrapper">
              <!-- Table Header -->
              <div class="table-header-row">
                <div class="th th-roll" style="text-align: center">Roll</div>
                <div class="th th-name" style="text-align: center">Name</div>
                <div class="th th-status" style="text-align: center">Attendance</div>
                <div class="th th-remarks" style="text-align: center">Remarks</div>
                <div class="th th-state" style="text-align: center">State</div>
              </div>

              <!-- Table Body -->
              <div class="table-body">
                <div v-for="(student) in students" :key="student.id" class="table-row">
                  <!-- Roll -->
                  <div class="td td-roll" data-label="Roll">
                    <span class="roll-badge">{{ student.roll_no }}</span>
                  </div>

                  <!-- Name -->
                  <div class="td td-name" data-label="Name">
                    <div class="student-profile">
                      <div class="student-avatar">
                        <span>{{ student.name.charAt(0).toUpperCase() }}</span>
                        <div class="avatar-glow"></div>
                      </div>
                      <span class="student-name">{{ student.name }}</span>
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="td td-status" data-label="Attendance">
                    <div class="status-selector">
                      <button
                          v-for="status in statuses"
                          :key="status.value"
                          @click="updateStatus(student, status.value)"
                          :class="['status-option', status.class, { selected: student.attendance_status === status.value }]"
                          :title="status.label"
                      >
                        <span>{{ status.emoji }}</span>
                        <span class="status-label">{{ status.label }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Remarks -->
                  <div class="td td-remarks" data-label="Remarks">
                    <input v-model="student.remarks" type="text" placeholder="Add notes..." class="remarks-field" maxlength="500"/>
                  </div>

                  <!-- State -->
                  <div class="td td-state" data-label="State">
                    <span v-if="student.is_marked" class="state-badge state-saved">
                      <span>✓</span>
                      <span>Saved</span>
                    </span>
                    <span v-else-if="student.attendance_status" class="state-badge state-modified">
                      <span>✎</span>
                      <span>Changed</span>
                    </span>
                    <span v-else class="state-badge state-pending">
                      <span>○</span>
                      <span>Pending</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="summary-grid">
            <div class="summary-item card-present">
              <div class="summary-glow"></div>
              <div class="summary-content">
<!--                <div class="summary-icon">✓</div>-->
                <div class="summary-data">
                  <div class="summary-count">{{ summary.present }}</div>
                  <div class="summary-label">Present</div>
                </div>
              </div>
            </div>

            <div class="summary-item card-absent">
              <div class="summary-glow"></div>
              <div class="summary-content">
<!--                <div class="summary-icon">✗</div>-->
                <div class="summary-data">
                  <div class="summary-count">{{ summary.absent }}</div>
                  <div class="summary-label">Absent</div>
                </div>
              </div>
            </div>

            <div class="summary-item card-late">
              <div class="summary-glow"></div>
              <div class="summary-content">
<!--                <div class="summary-icon">⏰</div>-->
                <div class="summary-data">
                  <div class="summary-count">{{ summary.late }}</div>
                  <div class="summary-label">Late</div>
                </div>
              </div>
            </div>

            <div class="summary-item card-excused">
              <div class="summary-glow"></div>
              <div class="summary-content">
<!--                <div class="summary-icon">📋</div>-->
                <div class="summary-data">
                  <div class="summary-count">{{ summary.excused }}</div>
                  <div class="summary-label">Excused</div>
                </div>
              </div>
            </div>

            <div class="summary-item card-total">
              <div class="summary-glow"></div>
              <div class="summary-content">
<!--                <div class="summary-icon">👥</div>-->
                <div class="summary-data">
                  <div class="summary-count">{{ students.length }}</div>
                  <div class="summary-label">Total</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-bar">
            <button
                @click="submitAttendance"
                :disabled="!hasChanges || submitting"
                class="primary-btn"
            >
              <span class="btn-shimmer"></span>
              <span class="btn-content">
                <span>✓</span>
                <span>{{ submitting ? 'Submitting...' : 'Submit Attendance' }}</span>
              </span>
            </button>
            <button @click="resetForm" class="secondary-btn">
              <span>↻</span>
              <span>Reset Changes</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Empty State -->
      <transition name="fade">
        <div v-if="!loading && filtersApplied && students.length === 0" class="empty-section">
          <div class="empty-icon">
            <span>📂</span>
            <div class="empty-pulse"></div>
            <div class="empty-pulse pulse-delay"></div>
          </div>
          <h3 class="empty-title">No Students Found</h3>
          <p class="empty-desc">Try selecting different filters or check back later</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceForm',

  data() {
    return {
      filters: {
        department_id: null,
        subject_id: null,
        class_date: null
      },
      classInfo: null,
      students: [],
      departments: [],
      subjects: [],
      loading: false,
      submitting: false,
      filtersApplied: false,
      originalStudents: [],
      statuses: [
        { value: 'present', label: 'Present', emoji: '✓', class: 'opt-present' },
        { value: 'absent', label: 'Absent', emoji: '✗', class: 'opt-absent' },
        { value: 'late', label: 'Late', emoji: '⏰', class: 'opt-late' },
        { value: 'excused', label: 'Excused', emoji: '📋', class: 'opt-excused' }
      ]
    };
  },

  computed: {
    isFilterValid() {
      return this.filters.department_id && this.filters.subject_id && this.filters.class_date;
    },

    summary() {
      const summary = { present: 0, absent: 0, late: 0, excused: 0 };
      this.students.forEach(student => {
        if (student.attendance_status) summary[student.attendance_status]++;
      });
      return summary;
    },

    hasChanges() {
      return this.students.some(student => student.attendance_status);
    }
  },

  mounted() {
    this.loadDepartments();
    this.loadSubjects();
  },

  methods: {
    async loadDepartments() {
      try {
        const response = await this.$api.get('/departments');
        this.departments = response.data.data;
      } catch (error) {
        alert('Failed to load departments');
      }
    },

    async loadSubjects() {
      try {
        const response = await this.$api.get('/get-subjects');
        console.log(response)
        this.subjects = response.data;
      } catch (error) {
        alert('Failed to load subjects');
      }
    },

    onFilterChange() {
      this.students = [];
      this.classInfo = null;
      this.filtersApplied = false;
    },

    async loadStudents() {
      if (!this.isFilterValid) {
        alert('Please select all filters');
        return;
      }

      this.loading = true;
      this.filtersApplied = true;

      try {
        const response = await this.$api.post('/attendance/students', this.filters);
        if (response.data.success) {
          console.log(response.data.data)
          this.classInfo = response.data.data.class;
          this.students = response.data.data.students.map(student => ({
            ...student,
            remarks: ''
          }));
          this.originalStudents = JSON.parse(JSON.stringify(this.students));
          alert(`Loaded ${this.students.length} students`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert('No class found');
        } else {
          alert('Failed to load students');
        }
        this.students = [];
        this.classInfo = null;
      } finally {
        this.loading = false;
      }
    },

    updateStatus(student, status) {
      student.attendance_status = status;
    },

    markAllAs(status) {
      if (confirm(`Mark all students as ${status.toUpperCase()}?`)) {
        this.students.forEach(student => {
          student.attendance_status = status;
        });
        alert(`All marked as ${status}`);
      }
    },

    async submitAttendance() {
      const marked = this.students.filter(s => s.attendance_status);
      if (marked.length === 0) {
        alert('Mark at least one student');
        return;
      }

      if (confirm(`Submit attendance for ${marked.length} students?`)) {
        this.submitting = true;
        try {
          const data = marked.map(s => ({
            student_id: s.id,
            status: s.attendance_status,
            remarks: s.remarks || null
          }));

          const response = await this.$api.post('/attendance/save-bulk', {
            class_id: this.classInfo.id,
            attendance: data
          });

          if (response.data.success) {
            alert('Attendance submitted successfully!');
            await this.loadStudents();
          }
        } catch (error) {
          alert('Failed to submit');
        } finally {
          this.submitting = false;
        }
      }
    },

    resetForm() {
      if (confirm('Reset all changes?')) {
        this.students = JSON.parse(JSON.stringify(this.originalStudents));
        alert('Form reset');
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main App Container */
.attendance-app {
  min-height: 100vh;
  background: #0a0a15;
  background-image:
      radial-gradient(at 20% 30%, rgba(120, 119, 198, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 20%, rgba(240, 147, 251, 0.15) 0px, transparent 50%),
      radial-gradient(at 50% 80%, rgba(102, 126, 234, 0.15) 0px, transparent 50%);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Animated Particles */
.bg-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0.3;
  animation: floatParticle 25s infinite ease-in-out;
}

.particle:nth-child(1) { width: 100px; height: 100px; top: 10%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { width: 70px; height: 70px; top: 70%; left: 85%; animation-delay: 3s; }
.particle:nth-child(3) { width: 120px; height: 120px; top: 85%; left: 15%; animation-delay: 6s; }
.particle:nth-child(4) { width: 60px; height: 60px; top: 40%; left: 75%; animation-delay: 9s; }
.particle:nth-child(5) { width: 90px; height: 90px; top: 55%; left: 45%; animation-delay: 12s; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-40px) rotate(180deg); opacity: 0.5; }
}

/* Container */
.container {
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  padding: 40px 32px;
  position: relative;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 60px 50px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-60px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
  animation: heroGlow 10s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
  50% { transform: translate(-15%, -15%) scale(1.15); opacity: 0.7; }
}

.hero-wrapper {
  display: flex;
  align-items: center;
  gap: 36px;
  position: relative;
  z-index: 1;
}

.hero-icon-box {
  width: 110px;
  height: 110px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 54px;
  position: relative;
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3);
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.08); }
}

.icon-pulse {
  position: absolute;
  width: 130%;
  height: 130%;
  border: 3px solid rgba(102, 126, 234, 0.6);
  border-radius: 30px;
  animation: pulseRing 2.5s ease-out infinite;
}

.pulse-delay {
  animation-delay: 1.25s;
}

@keyframes pulseRing {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.4); }
}

.hero-text-box {
  flex: 1;
}

.hero-heading {
  font-size: 52px;
  font-weight: 900;
  margin: 0 0 14px 0;
  background: linear-gradient(135deg, #ffffff, #b8c1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2.5px;
  line-height: 1.1;
}

.hero-desc {
  font-size: 19px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
  font-weight: 500;
}

/* Filter Section */
.filter-section,
.class-info-section,
.students-section {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(40px);
  /*border: 1px solid rgba(255, 255, 255, 0.1);*/
  /*border-radius: 32px;*/
  /*padding: 32px;*/
  margin-bottom: 32px;
  /*box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);*/
  /*animation: slideUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;*/
  /*animation-delay: 0.1s;*/
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.class-info-section { animation-delay: 0.2s; }
.students-section { animation-delay: 0.3s; }

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.header-title {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.required-badge,
.count-pill {
  padding: 8px 18px;
  background: rgba(102, 126, 234, 0.25);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 24px;
  font-size: 13px;
  font-weight: 700;
  color: #b8c1ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-pill {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
}

/* Form Styles */
.filter-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.label-icon {
  font-size: 20px;
}

.form-select,
.form-input {
  width: 100%;
  height: 60px;
  padding: 0 22px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  appearance: none;
  cursor: pointer;
}

.form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23ffffff' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;
  padding-right: 50px;
}

.form-select:hover,
.form-input:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
}

.form-select:focus,
.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  border-color: #667eea;
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.25), 0 10px 30px rgba(102, 126, 234, 0.3);
  transform: translateY(-3px);
}

.form-select option {
  background: #1a1a2e;
  color: #ffffff;
  padding: 12px;
}

/* Load Button */
.load-button,
.primary-btn {
  height: 64px;
  padding: 0 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 19px;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmerMove 2.5s infinite;
}

@keyframes shimmerMove {
  100% { left: 100%; }
}

.btn-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-icon {
  font-size: 22px;
}

.load-button:hover:not(:disabled),
.primary-btn:hover:not(:disabled) {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4);
}

.load-button:disabled,
.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.info-icon {
  width: 68px;
  height: 68px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.gradient-purple { background: linear-gradient(135deg, #667eea, #764ba2); }
.gradient-pink { background: linear-gradient(135deg, #f093fb, #f5576c); }
.gradient-blue { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.gradient-green { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.info-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 800;
}

.info-value {
  font-size: 18px;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.3;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 14px;
}

.action-btn {
  padding: 14px 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-success:hover {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.5);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: transparent;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.5);
}

/* Students Table */
.students-table {
  margin-bottom: 40px;
}

.table-wrapper {
  border-radius: 22px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-height: 650px;
  overflow-y: auto;
}

.table-header-row {
  display: grid;
  grid-template-columns: 90px 150px 1fr 450px 350px 150px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 8px 40px;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.th {
  color: white;
  /*font-size: 15px;*/
  /*font-weight: 800;*/
  /*text-transform: uppercase;*/
  letter-spacing: 0.8px;
}

.table-body {
  background: rgba(255, 255, 255, 0.02);
}

.table-row {
  display: grid;
  grid-template-columns: 90px 150px 1fr 450px 350px 150px;
  padding: 20px 28px;
  gap: 20px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(255, 255, 255, 0.02);
  position: relative;
}

.table-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.table-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.04);
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(8px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.table-row:hover::before {
  opacity: 1;
}

.td {
  color: rgba(255, 255, 255, 0.95);
  font-size: 15px;
}

/* Index Badge */
.index-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgba(102, 126, 234, 0.2);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 14px;
  color: #b8c1ff;
  font-weight: 800;
  font-size: 16px;
  transition: all 0.3s ease;
}

.table-row:hover .index-badge {
  background: rgba(102, 126, 234, 0.35);
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Roll Badge */
.roll-badge {
  display: inline-block;
  padding: 8px 18px;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 14px;
  color: #b8c1ff;
  font-weight: 800;
  font-size: 15px;
}

/* Student Profile */
.student-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.student-avatar {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 18px;
  position: relative;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.avatar-glow {
  position: absolute;
  width: 120%;
  height: 120%;
  border: 3px solid rgba(102, 126, 234, 0.4);
  border-radius: 50%;
  animation: avatarPulse 2.5s ease-out infinite;
}

@keyframes avatarPulse {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.6); }
}

.student-name {
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
}

/* Status Selector */
.status-selector {
  display: flex;
  gap: 10px;
}

.status-option {
  flex: 1;
  padding: 14px 10px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.status-option span:first-child {
  font-size: 20px;
}

.status-label {
  font-size: 12px;
}

.status-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.status-option.selected.opt-present {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: transparent;
  color: white;
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.5);
}

.status-option.selected.opt-absent {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: transparent;
  color: white;
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.5);
}

.status-option.selected.opt-late {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-color: transparent;
  color: white;
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 10px 25px rgba(245, 158, 11, 0.5);
}

.status-option.selected.opt-excused {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-color: transparent;
  color: white;
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.5);
}

/* Remarks Field */
.remarks-field {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
}

.remarks-field::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.remarks-field:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.4);
}

.remarks-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.12);
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

/* State Badge */
.state-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.state-saved {
  background: rgba(16, 185, 129, 0.25);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.state-modified {
  background: rgba(245, 158, 11, 0.25);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.state-pending {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.summary-item {
  padding: 32px 28px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.summary-glow {
  position: absolute;
  top: -150%;
  left: -150%;
  width: 400%;
  height: 400%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%);
  animation: glowSpin 12s linear infinite;
}

@keyframes glowSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  z-index: 1;
}

.summary-icon {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
  transition: all 0.4s ease;
}

.summary-item:hover {
  transform: translateY(-10px) scale(1.04);
}

.summary-item:hover .summary-icon {
  transform: rotate(360deg) scale(1.15);
}

.card-present {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.5);
}

.card-absent {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 15px 40px rgba(239, 68, 68, 0.5);
}

.card-late {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 15px 40px rgba(245, 158, 11, 0.5);
}

.card-excused {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.5);
}

.card-total {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
}

.summary-data {
  color: white;
}

.summary-count {
  font-size: 44px;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 10px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.summary-label {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  opacity: 0.95;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.secondary-btn {
  height: 64px;
  padding: 0 50px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: white;
  font-size: 19px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-section {
  padding: 120px 40px;
  text-align: center;
  animation: fadeIn 0.7s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.empty-icon {
  width: 180px;
  height: 180px;
  margin: 0 auto 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 90px;
  position: relative;
  box-shadow: 0 25px 60px rgba(102, 126, 234, 0.5);
  animation: emptyFloat 3.5s ease-in-out infinite;
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-18px); }
}

.empty-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid rgba(102, 126, 234, 0.6);
  border-radius: 50%;
  animation: emptyRing 2.5s ease-out infinite;
}

.empty-pulse.pulse-delay {
  animation-delay: 1.25s;
}

@keyframes emptyRing {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.6); }
}

.empty-title {
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 14px;
  letter-spacing: -1px;
}

.empty-desc {
  font-size: 19px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

/* Transitions */
.scale-in-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-in-leave-active {
  transition: all 0.4s ease;
}

.scale-in-enter {
  opacity: 0;
  transform: scale(0.85);
}

.scale-in-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7688f5, #8557b8);
}

.table-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 28px 20px;
  }

  .hero-section {
    padding: 40px 28px;
  }

  .hero-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .hero-icon-box {
    width: 90px;
    height: 90px;
    font-size: 44px;
  }

  .hero-heading {
    font-size: 38px;
  }

  .hero-desc {
    font-size: 17px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }

  .table-header-row {
    display: none;
  }

  .table-row {
    display: flex;
    flex-direction: column;
    padding: 28px 24px;
    gap: 20px;
    border-radius: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .table-row::before {
    display: none;
  }

  .td {
    display: grid;
    grid-template-columns: 110px 1fr;
    align-items: center;
    gap: 14px;
  }

  .td::before {
    content: attr(data-label);
    font-weight: 800;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.65);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .td-status,
  .td-remarks {
    grid-template-columns: 1fr;
  }

  .td-status::before,
  .td-remarks::before {
    grid-column: 1 / -1;
    margin-bottom: 10px;
  }

  .status-selector {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .status-label {
    display: none;
  }

  .status-option span:first-child {
    font-size: 26px;
  }

  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 18px;
  }

  .summary-count {
    font-size: 36px;
  }

  .action-bar {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-heading {
    font-size: 32px;
  }

  .header-title {
    font-size: 19px;
  }

  .summary-count {
    font-size: 32px;
  }
}
</style>