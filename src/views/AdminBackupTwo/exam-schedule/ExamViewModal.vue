<template>
  <transition name="modal-fade">
    <div v-if="show && exam" class="modal-overlay" @click.self="close">
      <div class="modern-modal">
        <!-- Header -->
        <div class="modal-header-modern">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">{{ exam.title }}</h2>
              <p class="modal-subtitle">Detailed Exam Information</p>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
          <div class="status-badge-large" :class="'status-' + exam.status">
            <i class="fas" :class="getStatusIcon(exam.status)"></i>
            {{ exam.status }}
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body-modern">
          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-item stat-primary">
              <div class="stat-icon">
                <i class="fas fa-award"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ exam.total_marks }}</div>
                <div class="stat-label">Total Marks</div>
              </div>
            </div>

            <div class="stat-item stat-success">
              <div class="stat-icon">
                <i class="fas fa-check-double"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ exam.pass_marks }}</div>
                <div class="stat-label">Passing Marks</div>
              </div>
            </div>

            <div class="stat-item stat-info">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ exam.students_count || 0 }}</div>
                <div class="stat-label">Enrolled Students</div>
              </div>
            </div>

            <div class="stat-item stat-warning">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-details">
                <div class="stat-value">{{ exam.duration_minutes }}</div>
                <div class="stat-label">Minutes</div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="content-grid">
            <!-- Basic Information Card -->
            <div class="info-card">
              <div class="info-card-header">
                <i class="fas fa-info-circle"></i>
                <h3>Basic Information</h3>
              </div>
              <div class="info-card-body">
                <div class="info-row">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="fas fa-tag"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Exam Type</span>
                      <span class="info-value">
                       {{ exam.exam_type ? exam.exam_type.name : 'N/A' }}
                      </span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="fas fa-book"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Subject</span>
                      <span class="info-value">
                        {{ exam.subject ? exam.subject.name : 'N/A' }}
                        <span class="badge badge-outline" v-if="exam.subject && exam.subject.department">
                          {{ exam.subject.department.code }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="info-row">
                  <div class="info-item">
                    <div class="info-icon">
                      <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Teacher</span>
                      <span class="info-value">{{ exam.teacher ? exam.teacher.name : 'N/A' }}</span>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon">
                      <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Year / Semester</span>
                      <span class="info-value">Year {{ exam.year }} - Semester {{ exam.semester }}</span>
                    </div>
                  </div>
                </div>

                <div class="info-row">
                  <div class="info-item full-width">
                    <div class="info-icon">
                      <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="info-content">
                      <span class="info-label">Academic Year</span>
                      <span class="info-value">{{ exam.session.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date & Time Card -->
            <div class="info-card">
              <div class="info-card-header">
                <i class="fas fa-calendar-check"></i>
                <h3>Date & Time Details</h3>
              </div>
              <div class="info-card-body">
                <div class="date-time-box">
                  <div class="date-section">
                    <div class="date-icon">
                      <i class="fas fa-calendar-day"></i>
                    </div>
                    <div class="date-content">
                      <span class="date-label">Exam Date</span>
                      <span class="date-value">{{ formatDate(exam.exam_date) }}</span>
                    </div>
                  </div>

                  <div class="time-section">
                    <div class="time-item">
                      <i class="fas fa-clock"></i>
                      <div>
                        <span class="time-label">Start Time</span>
                        <span class="time-value">{{ formatTime(exam.start_time) }}</span>
                      </div>
                    </div>
                    <div class="time-divider">
                      <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="time-item">
                      <i class="fas fa-clock"></i>
                      <div>
                        <span class="time-label">End Time</span>
                        <span class="time-value">{{ formatTime(exam.end_time) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="venue-info">
                  <div class="venue-item">
                    <i class="fas fa-door-open"></i>
                    <div>
                      <span class="venue-label">Room Number</span>
                      <span class="venue-value">{{ exam.classroom.name || 'Not assigned' }}</span>
                    </div>
                  </div>
                  <div class="venue-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                      <span class="venue-label">Capacity</span>
                      <span class="venue-value">{{ exam.classroom.capacity || 'Not specified' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions & Syllabus -->
          <div class="content-row" v-if="exam.instructions || exam.syllabus_topics">
            <div class="detail-card" v-if="exam.instructions">
              <div class="detail-card-header">
                <i class="fas fa-list-ul"></i>
                <h3>Exam Instructions</h3>
              </div>
              <div class="detail-card-body">
                <p>{{ exam.instructions }}</p>
              </div>
            </div>

            <div class="detail-card" v-if="exam.syllabus_topics">
              <div class="detail-card-header">
                <i class="fas fa-book-open"></i>
                <h3>Syllabus Topics</h3>
              </div>
              <div class="detail-card-body">
                <p>{{ exam.syllabus_topics }}</p>
              </div>
            </div>
          </div>

          <!-- Supervisors -->
          <div v-if="exam.supervisors && exam.supervisors.length" class="supervisors-section">
            <div class="section-header">
              <i class="fas fa-user-tie"></i>
              <h3>Exam Supervisors</h3>
            </div>
            <div class="supervisors-grid">
              <div
                  v-for="supervisor in exam.supervisors"
                  :key="supervisor.id"
                  class="supervisor-card"
              >
                <div class="supervisor-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <div class="supervisor-info">
                  <h4>{{ supervisor.name }}</h4>
                  <span class="supervisor-role">{{ supervisor.pivot.role }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div v-if="exam.notifications && exam.notifications.length" class="notifications-section">
            <div class="section-header">
              <i class="fas fa-bell"></i>
              <h3>Notification History</h3>
            </div>
            <div class="notifications-list">
              <div
                  v-for="notification in exam.notifications"
                  :key="notification.id"
                  class="notification-item"
              >
                <div class="notification-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="notification-content">
                  <div class="notification-header">
                    <span class="notification-type">{{ notification.notification_type }}</span>
                    <span class="notification-time">{{ formatDateTime(notification.created_at) }}</span>
                  </div>
                  <p class="notification-message">{{ notification.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-modern">
          <button
              v-if="exam.status === 'scheduled'"
              class="btn-action btn-edit"
              @click="editExam"
          >
            <i class="fas fa-edit"></i>
            Edit Exam
          </button>
          <button class="btn-action btn-close" @click="close">
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
  name: 'ExamViewModal',

  props: {
    show: Boolean,
    exam: Object
  },

  methods: {
    getStatusIcon(status) {
      const icons = {
        'scheduled': 'fa-calendar-check',
        'ongoing': 'fa-hourglass-half',
        'completed': 'fa-check-circle',
        'cancelled': 'fa-times-circle'
      };
      return icons[status] || 'fa-question-circle';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatTime(time) {
      if (!time) return '';
      return new Date('2000-01-01 ' + time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return '';
      return new Date(datetime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    editExam() {
      this.$emit('edit', this.exam);
    },

    close() {
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
  padding: 2rem;
  overflow-y: auto;
}

.modern-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
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
.modal-header-modern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
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
  color: white;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
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

.status-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.status-scheduled {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.status-ongoing {
  background: rgba(247, 107, 28, 0.9);
  color: white;
}

.status-completed {
  background: rgba(72, 198, 239, 0.9);
  color: white;
}

.status-cancelled {
  background: rgba(245, 87, 108, 0.9);
  color: white;
}

/* Body */
.modal-body-modern {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-primary {
  border-left-color: #667eea;
}

.stat-success {
  border-left-color: #38ef7d;
}

.stat-info {
  border-left-color: #00f2fe;
}

.stat-warning {
  border-left-color: #fee140;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-success .stat-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-info .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-warning .stat-icon {
  background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%);
  color: white;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.info-card-header i {
  color: #667eea;
  font-size: 1.25rem;
}

.info-card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.info-card-body {
  padding: 1.5rem;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-outline {
  border: 2px solid #667eea;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Date & Time Box */
.date-time-box {
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.date-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
  margin-bottom: 1.5rem;
}

.date-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.date-label {
  display: block;
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.date-value {
  display: block;
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 700;
}

.time-section {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-item i {
  color: #667eea;
  font-size: 1.25rem;
}

.time-label {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 600;
}

.time-value {
  display: block;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 700;
}

.time-divider {
  color: #cbd5e0;
  font-size: 1.25rem;
}

.venue-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.venue-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
}

.venue-item i {
  color: #667eea;
  font-size: 1.25rem;
}

.venue-label {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 600;
}

.venue-value {
  display: block;
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 600;
}

/* Content Row */
.content-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.detail-card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

.detail-card-body {
  padding: 1.5rem;
}

.detail-card-body p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

/* Supervisors Section */
.supervisors-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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
  color: #667eea;
  font-size: 1.25rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.supervisors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.supervisor-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.supervisor-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.supervisor-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.supervisor-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
}

.supervisor-role {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

/* Notifications Section */
.notifications-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.notification-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.notification-type {
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.notification-time {
  font-size: 0.8rem;
  color: #a0aec0;
  font-weight: 600;
}

.notification-message {
  margin: 0;
  color: #4a5568;
  line-height: 1.5;
}

/* Footer */
.modal-footer-modern {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-action {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4);
}

.btn-close {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-close:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

/* Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modern-modal {
    max-height: 95vh;
  }

  .modal-header-modern {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body-modern {
    padding: 1rem;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .content-grid,
  .content-row {
    grid-template-columns: 1fr;
  }

  .info-row {
    grid-template-columns: 1fr;
  }

  .supervisors-grid {
    grid-template-columns: 1fr;
  }

  .time-section {
    flex-direction: column;
    gap: 1rem;
  }

  .time-divider {
    transform: rotate(90deg);
  }
}
</style>