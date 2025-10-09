<template>
  <transition name="modal-fade">
    <div v-if="show && exam" class="modal-overlay" @click.self="close">
      <div class="modern-students-modal">
        <!-- Header -->
        <div class="modal-header-students">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-user-graduate"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">Student Management</h2>
              <p class="modal-subtitle">{{ exam.title }}</p>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-students">
          <!-- Statistics Cards -->
          <div class="stats-grid">
            <div class="stat-card stat-enrolled">
              <div class="stat-visual">
                <div class="stat-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-circle">
                  <svg viewBox="0 0 36 36" class="circular-chart">
                    <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="circle" :stroke-dasharray="`${enrolledPercentage}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                </div>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ enrolledStudents.length }}</div>
                <div class="stat-label">Enrolled Students</div>
              </div>
            </div>

            <div class="stat-card stat-eligible">
              <div class="stat-visual">
                <div class="stat-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ eligibleCount }}</div>
                <div class="stat-label">Eligible Students</div>
                <div class="stat-percentage">
                  {{ eligiblePercentage }}% of total
                </div>
              </div>
            </div>

            <div class="stat-card stat-not-eligible">
              <div class="stat-visual">
                <div class="stat-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ notEligibleCount }}</div>
                <div class="stat-label">Not Eligible</div>
                <div class="stat-percentage">
                  {{ notEligiblePercentage }}% of total
                </div>
              </div>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="action-bar">
            <div class="action-buttons">
              <button class="action-btn btn-add" @click="showAddStudents = !showAddStudents">
                <i class="fas" :class="showAddStudents ? 'fa-minus' : 'fa-plus'"></i>
                {{ showAddStudents ? 'Hide' : 'Add Students' }}
              </button>
              <button class="action-btn btn-seat" @click="assignSeats">
                <i class="fas fa-chair"></i>
                Auto Assign Seats
              </button>
              <button class="action-btn btn-export">
                <i class="fas fa-file-export"></i>
                Export List
              </button>
            </div>
          </div>

          <!-- Add Students Section -->
          <transition name="expand">
            <div v-if="showAddStudents" class="add-students-section">
              <div class="section-header">
                <i class="fas fa-user-plus"></i>
                <h3>Add Students to Exam</h3>
              </div>
              <div class="add-form">
                <div class="form-row">
                  <div class="form-col">
                    <label class="form-label">
                      <i class="fas fa-graduation-cap"></i>
                      Academic Year
                    </label>
                    <select class="form-select" v-model="addYear">
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                    </select>
                  </div>
                  <div class="form-col">
                    <label class="form-label">
                      <i class="fas fa-calendar-alt"></i>
                      Semester
                    </label>
                    <select class="form-select" v-model="addSemester">
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                  <div class="form-col-button">
                    <button class="btn-add-all" @click="addStudentsByYearSem">
                      <i class="fas fa-user-plus"></i>
                      Add All Students
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Search Box -->
          <div class="search-section">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input
                  type="text"
                  class="search-input"
                  placeholder="Search by name or student ID..."
                  v-model="searchQuery"
              >
              <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
                <i class="fas fa-times"></i>
              </span>
            </div>
            <div class="result-count">
              Showing {{ filteredStudents.length }} of {{ enrolledStudents.length }} students
            </div>
          </div>

          <!-- Students Grid -->
          <div class="students-container">
            <div v-if="filteredStudents.length === 0" class="empty-state">
              <i class="fas fa-user-slash"></i>
              <h3>No Students Found</h3>
              <p>{{ searchQuery ? 'Try adjusting your search' : 'Add students to this exam' }}</p>
            </div>

            <div v-else class="students-grid">
              <div
                  v-for="student in filteredStudents"
                  :key="student.id"
                  class="student-card"
                  :class="{ 'not-eligible': !student.is_eligible }"
              >
                <div class="student-header">
                  <div class="student-avatar-section">
                    <div class="student-avatar">
                      {{ getInitials(student.name) }}
                    </div>
                    <div class="student-basic">
                      <h4 class="student-name">{{ student.name }}</h4>
                      <p class="student-id">ID: {{ student.student_id_number }}</p>
                    </div>
                  </div>
                  <div class="eligibility-badge" :class="student.is_eligible ? 'eligible' : 'not-eligible'">
                    <i class="fas" :class="student.is_eligible ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    {{ student.is_eligible ? 'Eligible' : 'Not Eligible' }}
                  </div>
                </div>

                <div class="student-details">
                  <div class="detail-item">
                    <i class="fas fa-hashtag"></i>
                    <span class="detail-label">Roll Number</span>
                    <span class="detail-value">{{ student.roll_no }}</span>
                  </div>

                  <div class="detail-item">
                    <i class="fas fa-chair"></i>
                    <span class="detail-label">Seat Number</span>
                    <div class="seat-input-wrapper">
                      <input
                          type="text"
                          class="seat-input"
                          v-model="student.seat_number"
                          @change="updateSeat(student)"
                          placeholder="Not assigned"
                      >
                    </div>
                  </div>

                  <div class="detail-item">
                    <i class="fas fa-clipboard-check"></i>
                    <span class="detail-label">Attendance</span>
                    <span class="attendance-badge" v-if="student.attendance_status">
                      {{ student.attendance_status }}
                    </span>
                    <span v-else class="no-attendance">Not marked</span>
                  </div>
                </div>

                <div class="student-actions">
                  <button
                      class="action-btn-card btn-toggle"
                      @click="toggleEligibility(student)"
                      :title="student.is_eligible ? 'Mark as Not Eligible' : 'Mark as Eligible'"
                  >
                    <i class="fas fa-exchange-alt"></i>
                    Toggle Eligibility
                  </button>
                  <button
                      class="action-btn-card btn-remove"
                      @click="removeStudent(student)"
                      title="Remove from Exam"
                  >
                    <i class="fas fa-trash-alt"></i>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-students">
          <div class="footer-info">
            <i class="fas fa-info-circle"></i>
            Total: {{ enrolledStudents.length }} students enrolled
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
  name: 'ExamStudentsModal',

  props: {
    show: Boolean,
    exam: Object
  },

  data() {
    return {
      enrolledStudents: [],
      searchQuery: '',
      showAddStudents: false,
      addYear: 1,
      addSemester: 1
    };
  },

  computed: {
    filteredStudents() {
      if (!this.searchQuery) return this.enrolledStudents;

      const query = this.searchQuery.toLowerCase();
      return this.enrolledStudents.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.student_id.toLowerCase().includes(query) ||
          s.roll_number.toLowerCase().includes(query)
      );
    },

    eligibleCount() {
      return this.enrolledStudents.filter(s => s.is_eligible).length;
    },

    notEligibleCount() {
      return this.enrolledStudents.filter(s => !s.is_eligible).length;
    },

    eligiblePercentage() {
      if (this.enrolledStudents.length === 0) return 0;
      return Math.round((this.eligibleCount / this.enrolledStudents.length) * 100);
    },

    notEligiblePercentage() {
      if (this.enrolledStudents.length === 0) return 0;
      return Math.round((this.notEligibleCount / this.enrolledStudents.length) * 100);
    },

    enrolledPercentage() {
      return this.enrolledStudents.length > 0 ? 100 : 0;
    }
  },

  watch: {
    show(val) {
      if (val && this.exam) {
        this.fetchEnrolledStudents();
      }
    }
  },

  methods: {
    async fetchEnrolledStudents() {
      try {
        const response = await this.$api.get(`/exams/${this.exam.id}/students`);
        console.log(response)
        this.enrolledStudents = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        this.$toast.error('Failed to load students');
      }
    },

    async updateSeat(student) {
      try {
        await this.$api.put(`/exams/${this.exam.id}/students/${student.id}`, {
          seat_number: student.seat_number
        });
        this.$toast.success('Seat number updated');
      } catch (error) {
        console.error('Error updating seat:', error);
        this.$toast.error('Failed to update seat');
      }
    },

    async toggleEligibility(student) {
      try {
        await this.$api.put(`/exams/${this.exam.id}/students/${student.id}`, {
          is_eligible: !student.is_eligible
        });
        student.is_eligible = !student.is_eligible;
        this.$toast.success('Eligibility updated');
      } catch (error) {
        console.error('Error updating eligibility:', error);
        this.$toast.error('Failed to update eligibility');
      }
    },

    async removeStudent(student) {
      if (confirm(`Remove ${student.name} from this exam?`)) {
        try {
          await this.$api.delete(`/exams/${this.exam.id}/students/${student.id}`);
          this.$toast.success('Student removed successfully');
          this.fetchEnrolledStudents();
        } catch (error) {
          console.error('Error removing student:', error);
          this.$toast.error('Failed to remove student');
        }
      }
    },

    async addStudentsByYearSem() {
      try {
        await this.$api.post(`/exams/${this.exam.id}/students/bulk/assign`, {
          year: this.addYear,
          semester: this.addSemester
        });
        this.$toast.success('Students added successfully');
        this.showAddStudents = false;
        this.fetchEnrolledStudents();
      } catch (error) {
        console.error('Error adding students:', error);
        this.$toast.error('Failed to add students');
      }
    },

    async assignSeats() {
      if (confirm('Auto assign seats to all students?')) {
        try {
          await this.$api.post(`/exams/${this.exam.id}/students/assign-seats`);
          this.$toast.success('Seats assigned successfully');
          this.fetchEnrolledStudents();
        } catch (error) {
          console.error('Error assigning seats:', error);
          this.$toast.error('Failed to assign seats');
        }
      }
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
    },

    close() {
      this.showAddStudents = false;
      this.searchQuery = '';
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

.modern-students-modal {
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
.modal-header-students {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
.modal-body-students {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

.stat-enrolled::before { background: #4facfe; }
.stat-eligible::before { background: #38ef7d; }
.stat-not-eligible::before { background: #f76b1c; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-visual {
  position: relative;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.stat-enrolled .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-eligible .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-not-eligible .stat-icon {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
  color: white;
}

.stat-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
}

.circular-chart {
  display: block;
  max-width: 100%;
  max-height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #4facfe;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% { stroke-dasharray: 0 100; }
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
  margin-top: 0.5rem;
}

.stat-percentage {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 0.25rem;
}

/* Action Bar */
.action-bar {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-seat {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-export {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Add Students Section */
.add-students-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-header i {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
}

.form-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label i {
  color: #667eea;
}

.form-select {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-col-button {
  display: flex;
  align-items: flex-end;
}

.btn-add-all {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-add-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Search Section */
.search-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-clear:hover {
  background: #cbd5e0;
}

.result-count {
  color: #718096;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Students Container */
.students-container {
  min-height: 400px;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.student-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #4facfe;
}

.student-card.not-eligible {
  border-left-color: #f76b1c;
  background: #fff8f5;
}

.student-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.student-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f1f1;
}

.student-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.student-avatar {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.student-basic {
  flex: 1;
}

.student-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.student-id {
  margin: 0;
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
}

.eligibility-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.eligibility-badge.eligible {
  background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%);
  color: #11998e;
  border: 2px solid #38ef7d;
}

.eligibility-badge.not-eligible {
  background: linear-gradient(135deg, #fad96115 0%, #f76b1c15 100%);
  color: #f76b1c;
  border: 2px solid #f76b1c;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.detail-item {
  display: grid;
  grid-template-columns: 30px 120px 1fr;
  align-items: center;
  gap: 0.75rem;
}

.detail-item i {
  color: #4facfe;
  font-size: 1rem;
}

.detail-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
}

.detail-value {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 600;
}

.seat-input-wrapper {
  flex: 1;
}

.seat-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  transition: all 0.3s ease;
}

.seat-input:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.attendance-badge {
  padding: 0.35rem 0.85rem;
  background: linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%);
  color: #4facfe;
  border: 2px solid #4facfe;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
}

.no-attendance {
  color: #cbd5e0;
  font-size: 0.85rem;
  font-style: italic;
}

.student-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn-card {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-remove {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.action-btn-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

/* Footer */
.modal-footer-students {
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
  font-weight: 600;
}

.footer-info i {
  color: #4facfe;
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Scrollbar */
.modal-body-students::-webkit-scrollbar {
  width: 8px;
}

.modal-body-students::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-students::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 1200px) {
  .students-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modern-students-modal {
    max-height: 98vh;
  }

  .modal-header-students {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body-students {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .students-grid {
    grid-template-columns: 1fr;
  }

  .detail-item {
    grid-template-columns: 30px 1fr;
    grid-template-rows: auto auto;
  }

  .detail-label {
    grid-column: 2;
  }

  .detail-value,
  .seat-input-wrapper,
  .attendance-badge,
  .no-attendance {
    grid-column: 2;
  }

  .modal-footer-students {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-close-footer {
    width: 100%;
    justify-content: center;
  }
}
</style>