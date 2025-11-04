<template>
  <div class="quick-attendance">
    <!-- Header with Swipe Actions -->
    <div class="quick-header">
      <div class="header-top">
        <button class="btn-back" @click="$emit('back')">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="class-title">
          <h3>{{ classInfo.subject }}</h3>
          <span>{{ classInfo.date }}</span>
        </div>
      </div>

      <div class="swipe-instructions">
        <div class="swipe-demo">
          <span class="demo-left">← Swipe Left: Absent</span>
          <span class="demo-right">Swipe Right: Present →</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">
          {{ markedCount }} / {{ totalStudents }} marked
        </div>
      </div>
    </div>

    <!-- Students Swipe List -->
    <div class="swipe-list" ref="swipeList">
      <transition-group name="swipe-out" tag="div">
        <div
            v-for="student in visibleStudents"
            :key="student.id"
            class="swipe-card"
            :class="{ 'swiping': student.swiping, 'marked': student.marked }"
            :style="getSwipeStyle(student)"
            @touchstart="touchStart($event, student)"
            @touchmove="touchMove($event, student)"
            @touchend="touchEnd($event, student)"
            @mousedown="mouseDown($event, student)"
        >
          <!-- Swipe Indicators -->
          <div class="swipe-indicator swipe-left" :class="{ active: student.swipeDirection === 'left' }">
            <i class="fas fa-times"></i>
            <span>ABSENT</span>
          </div>
          <div class="swipe-indicator swipe-right" :class="{ active: student.swipeDirection === 'right' }">
            <i class="fas fa-check"></i>
            <span>PRESENT</span>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <div class="student-number">{{ currentIndex + 1 }}</div>
            <div class="student-avatar" :class="'avatar-' + getAvatarColor(student.id)">
              {{ getInitials(student.name) }}
            </div>
            <div class="student-name">{{ student.name }}</div>
            <div class="student-roll">Roll: {{ student.roll_number }}</div>

            <!-- Manual Buttons -->
            <div class="manual-buttons">
              <button class="btn-manual btn-absent" @click.stop="markStudent(student, 'absent')">
                <i class="fas fa-times"></i>
              </button>
              <button class="btn-manual btn-late" @click.stop="markStudent(student, 'late')">
                <i class="fas fa-clock"></i>
              </button>
              <button class="btn-manual btn-present" @click.stop="markStudent(student, 'present')">
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Completion Message -->
      <div v-if="allMarked" class="completion-card">
        <div class="completion-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>All Done! 🎉</h3>
        <p>You've marked attendance for all {{ totalStudents }} students</p>
        <button class="btn-review" @click="showReview = true">
          <i class="fas fa-list"></i>
          Review & Submit
        </button>
      </div>
    </div>

    <!-- Review Modal -->
    <transition name="modal-fade">
      <div v-if="showReview" class="modal-overlay" @click="showReview = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Review Attendance</h3>
            <button class="btn-close" @click="showReview = false">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="review-stats">
            <div class="review-stat">
              <div class="stat-icon stat-present"><i class="fas fa-check"></i></div>
              <div class="stat-info">
                <span class="stat-value">{{ getCount('present') }}</span>
                <span class="stat-label">Present</span>
              </div>
            </div>
            <div class="review-stat">
              <div class="stat-icon stat-absent"><i class="fas fa-times"></i></div>
              <div class="stat-info">
                <span class="stat-value">{{ getCount('absent') }}</span>
                <span class="stat-label">Absent</span>
              </div>
            </div>
            <div class="review-stat">
              <div class="stat-icon stat-late"><i class="fas fa-clock"></i></div>
              <div class="stat-info">
                <span class="stat-value">{{ getCount('late') }}</span>
                <span class="stat-label">Late</span>
              </div>
            </div>
          </div>

          <div class="review-list">
            <div
                v-for="student in students"
                :key="student.id"
                class="review-item"
            >
              <div class="review-student">
                <span class="review-name">{{ student.name }}</span>
                <span class="review-roll">{{ student.roll_number }}</span>
              </div>
              <span class="review-status" :class="'status-' + student.status">
                {{ student.status || 'Not Marked' }}
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-modal btn-cancel" @click="showReview = false">
              Edit
            </button>
            <button class="btn-modal btn-submit" @click="submitAttendance">
              <i class="fas fa-paper-plane"></i>
              Submit
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Undo Snackbar -->
    <transition name="snackbar-fade">
      <div v-if="lastAction" class="snackbar">
        <span>{{ lastAction.student.name }} marked as {{ lastAction.status }}</span>
        <button class="btn-undo" @click="undoLast">
          <i class="fas fa-undo"></i> Undo
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'QuickAttendance',
  props: {
    classInfo: {
      type: Object,
      required: true
    },
    students: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      swipeThreshold: 100,
      showReview: false,
      lastAction: null,
      studentStates: {}
    };
  },
  computed: {
    visibleStudents() {
      // Show current and next student
      return this.students
          .slice(this.currentIndex, this.currentIndex + 2)
          .map(s => ({
            ...s,
            ...this.studentStates[s.id]
          }));
    },
    markedCount() {
      return this.students.filter(s => s.status).length;
    },
    totalStudents() {
      return this.students.length;
    },
    progressPercentage() {
      return (this.markedCount / this.totalStudents) * 100;
    },
    allMarked() {
      return this.markedCount === this.totalStudents;
    }
  },
  methods: {
    touchStart(event, student) {
      if (student.marked) return;

      const touch = event.touches[0];
      this.$set(this.studentStates, student.id, {
        startX: touch.clientX,
        currentX: touch.clientX,
        swiping: true,
        swipeDirection: null
      });
    },

    touchMove(event, student) {
      if (!this.studentStates[student.id]?.swiping) return;

      const touch = event.touches[0];
      const deltaX = touch.clientX - this.studentStates[student.id].startX;

      this.$set(this.studentStates, student.id, {
        ...this.studentStates[student.id],
        currentX: touch.clientX,
        swipeDirection: deltaX > 50 ? 'right' : deltaX < -50 ? 'left' : null
      });
    },

    touchEnd(event, student) {
      const state = this.studentStates[student.id];
      if (!state?.swiping) return;

      const deltaX = state.currentX - state.startX;

      if (Math.abs(deltaX) > this.swipeThreshold) {
        const status = deltaX > 0 ? 'present' : 'absent';
        this.markStudent(student, status);
      } else {
        // Reset position
        this.$set(this.studentStates, student.id, {
          swiping: false,
          swipeDirection: null
        });
      }
    },

    mouseDown(event, student) {
      if (student.marked) return;

      this.$set(this.studentStates, student.id, {
        startX: event.clientX,
        currentX: event.clientX,
        swiping: true,
        swipeDirection: null
      });

      const mouseMove = (e) => {
        const deltaX = e.clientX - this.studentStates[student.id].startX;
        this.$set(this.studentStates, student.id, {
          ...this.studentStates[student.id],
          currentX: e.clientX,
          swipeDirection: deltaX > 50 ? 'right' : deltaX < -50 ? 'left' : null
        });
      };

      const mouseUp = (e) => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);

        const deltaX = this.studentStates[student.id].currentX - this.studentStates[student.id].startX;

        if (Math.abs(deltaX) > this.swipeThreshold) {
          const status = deltaX > 0 ? 'present' : 'absent';
          this.markStudent(student, status);
        } else {
          this.$set(this.studentStates, student.id, {
            swiping: false,
            swipeDirection: null
          });
        }
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    },

    getSwipeStyle(student) {
      const state = this.studentStates[student.id];
      if (!state?.swiping) return {};

      const deltaX = state.currentX - state.startX;
      const rotation = deltaX * 0.1;

      return {
        transform: `translateX(${deltaX}px) rotate(${rotation}deg)`,
        transition: 'none'
      };
    },

    markStudent(student, status) {
      this.$set(student, 'status', status);
      this.$set(student, 'marked', true);

      // Save last action for undo
      this.lastAction = {
        student: student,
        status: status,
        index: this.currentIndex
      };

      // Clear last action after 3 seconds
      setTimeout(() => {
        if (this.lastAction?.student.id === student.id) {
          this.lastAction = null;
        }
      }, 3000);

      // Animate out and move to next
      this.$set(this.studentStates, student.id, {
        marked: true,
        swiping: false
      });

      setTimeout(() => {
        if (this.currentIndex < this.students.length - 1) {
          this.currentIndex++;
        }
      }, 300);
    },

    undoLast() {
      if (!this.lastAction) return;

      const student = this.lastAction.student;
      this.$set(student, 'status', null);
      this.$set(student, 'marked', false);

      this.currentIndex = this.lastAction.index;
      this.lastAction = null;
    },

    getCount(status) {
      return this.students.filter(s => s.status === status).length;
    },

    submitAttendance() {
      this.$emit('submit', this.students);
      this.showReview = false;
    },

    getInitials(name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    getAvatarColor(id) {
      const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal'];
      return colors[id % colors.length];
    }
  }
};
</script>

<style scoped>
.quick-attendance {
  height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.quick-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-back {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
}

.class-title h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.class-title span {
  font-size: 0.9rem;
  opacity: 0.9;
}

.swipe-instructions {
  margin-bottom: 1rem;
}

.swipe-demo {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  opacity: 0.95;
  padding: 0.75rem;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
}

.progress-container {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 10px;
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Swipe List */
.swipe-list {
  flex: 1;
  position: relative;
  padding: 2rem 1rem;
  overflow: hidden;
}

.swipe-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  padding: 2rem;
  transition: transform 0.3s, opacity 0.3s;
  cursor: grab;
  user-select: none;
}

.swipe-card:active {
  cursor: grabbing;
}

.swipe-card.swiping {
  transition: none;
}

.swipe-card:nth-child(2) {
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0.5;
  z-index: -1;
}

/* Swipe Indicators */
.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 700;
  font-size: 1.5rem;
}

.swipe-indicator.active {
  opacity: 1;
}

.swipe-left {
  left: -80px;
  color: #ef4444;
}

.swipe-right {
  right: -80px;
  color: #10b981;
}

.swipe-indicator i {
  font-size: 3rem;
}

.swipe-indicator span {
  font-size: 0.9rem;
  letter-spacing: 2px;
}

/* Card Content */
.card-content {
  text-align: center;
  position: relative;
}

.student-number {
  position: absolute;
  top: -1rem;
  right: -1rem;
  width: 36px;
  height: 36px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.student-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
}

.avatar-blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.avatar-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.avatar-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.avatar-orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.avatar-pink { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); }
.avatar-teal { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); }

.student-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.student-roll {
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
}

/* Manual Buttons */
.manual-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-manual {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-manual:active {
  transform: scale(0.95);
}

.btn-absent {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.btn-late {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.btn-present {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Completion Card */
.completion-card {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.completion-icon {
  font-size: 5rem;
  color: #10b981;
  margin-bottom: 1rem;
}

.completion-card h3 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.completion-card p {
  color: #718096;
  margin-bottom: 2rem;
}

.btn-review {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #2d3748;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #f7fafc;
}

.review-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
}

.review-stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-present { background: #10b981; }
.stat-absent { background: #ef4444; }
.stat-late { background: #f59e0b; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
}

.review-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.review-student {
  display: flex;
  flex-direction: column;
}

.review-name {
  font-weight: 600;
  color: #2d3748;
}

.review-roll {
  font-size: 0.85rem;
  color: #718096;
}

.review-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.status-present {
  background: #d1fae5;
  color: #047857;
}

.status-absent {
  background: #fee2e2;
  color: #b91c1c;
}

.status-late {
  background: #fef3c7;
  color: #b45309;
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
}

.btn-modal {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-submit {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  z-index: 1001;
}

.btn-undo {
  background: #667eea;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Animations */
.swipe-out-leave-active {
  transition: all 0.3s;
}

.swipe-out-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}

.snackbar-fade-enter-active, .snackbar-fade-leave-active {
  transition: all 0.3s;
}

.snackbar-fade-enter, .snackbar-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

@media (max-width: 480px) {
  .swipe-card {
    width: 95%;
    padding: 1.5rem;
  }

  .student-avatar {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }

  .student-name {
    font-size: 1.25rem;
  }

  .btn-manual {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .review-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}
</style>