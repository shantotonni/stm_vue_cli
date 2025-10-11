<template>
  <div class="report-container">
    <!-- Header Section -->
    <div class="report-header">
      <h1 class="report-title">Class Schedule Report</h1>
      <p class="report-subtitle">View weekly class timetable and schedule</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <input
              type="text"
              v-model="filters.search"
              placeholder="Search by class, subject, or teacher..."
              class="search-input"
              @input="handleSearch"
          />
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" @change="fetchSchedule" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="viewMode" @change="handleViewChange" class="filter-select">
            <option value="weekly">Weekly Calendar</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading schedule...</p>
    </div>

    <!-- Weekly Calendar View -->
    <div v-else-if="viewMode === 'weekly' && hasSchedule" class="calendar-container">
      <div class="calendar-grid">
        <div
            v-for="day in weekDays"
            :key="day"
            class="day-column"
            :class="{ 'today': isToday(day) }"
        >
          <div class="day-header">
            <h3 class="day-name">{{ day }}</h3>
            <span class="class-count">{{ weeklySchedule[day].length }} classes</span>
          </div>

          <div class="day-schedule">
            <div
                v-for="(classItem, index) in weeklySchedule[day]"
                :key="index"
                class="class-block"
                :style="{ background: classItem.color_code }"
            >
              <div class="class-time">
                {{ formatTime(classItem.start_time) }} - {{ formatTime(classItem.end_time) }}
              </div>
              <div class="class-title">{{ classItem.class_title }}</div>
              <div class="class-subject">{{ classItem.subject }}</div>

              <div class="class-hover-info">
                <div class="hover-detail">
                  <span class="detail-icon">👨‍🏫</span>
                  <span>{{ classItem.teacher }}</span>
                </div>
                <div class="hover-detail">
                  <span class="detail-icon">🚪</span>
                  <span>{{ classItem.classroom }}</span>
                </div>
              </div>
            </div>

            <div v-if="weeklySchedule[day].length === 0" class="no-classes">
              <span class="no-class-icon">📭</span>
              <p>No classes scheduled</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View (Mobile Friendly) -->
    <div v-else-if="viewMode === 'list' && scheduleList.length > 0" class="list-container">
      <div
          v-for="day in weekDays"
          :key="day"
          class="day-section"
          v-if="getDaySchedule(day).length > 0"
      >
        <div class="day-section-header" @click="toggleDay(day)">
          <h3>{{ day }}</h3>
          <span class="toggle-icon">{{ expandedDays[day] ? '▼' : '▶' }}</span>
        </div>

        <transition name="slide">
          <div v-show="expandedDays[day]" class="day-classes">
            <div
                v-for="(classItem, index) in getDaySchedule(day)"
                :key="index"
                class="list-class-card"
            >
              <div class="list-class-color" :style="{ background: classItem.color_code }"></div>
              <div class="list-class-content">
                <div class="list-class-header">
                  <h4>{{ classItem.class_title }}</h4>
                  <span class="list-class-time">
                    {{ formatTime(classItem.start_time) }} - {{ formatTime(classItem.end_time) }}
                  </span>
                </div>
                <div class="list-class-details">
                  <div class="detail-row">
                    <span class="detail-label">Subject:</span>
                    <span class="detail-value">{{ classItem.subject }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Teacher:</span>
                    <span class="detail-value">{{ classItem.teacher }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Room:</span>
                    <span class="detail-value">{{ classItem.classroom }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="empty-state">
      <div class="empty-icon">📅</div>
      <h3>No Schedule Found</h3>
      <p>No classes are scheduled for the selected filters</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClassScheduleReport',
  data() {
    return {
      weeklySchedule: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      },
      scheduleList: [],
      departments: [],
      loading: false,
      viewMode: 'weekly',
      filters: {
        search: '',
        department_id: '',
      },
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      expandedDays: {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
      },
      searchTimeout: null,
    };
  },
  computed: {
    hasSchedule() {
      return Object.values(this.weeklySchedule).some(day => day.length > 0);
    },
  },
  mounted() {
    this.fetchDepartments();
    this.fetchSchedule();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await axios.get('/api/departments');
        this.departments = response.data.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchSchedule() {
      this.loading = true;
      try {
        if (this.viewMode === 'weekly') {
          const response = await axios.get('/api/reports/class-schedule/weekly', {
            params: this.filters,
          });
          this.weeklySchedule = response.data.data;
        } else {
          const response = await axios.get('/api/reports/class-schedule', {
            params: this.filters,
          });
          this.scheduleList = response.data.data.data;
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchSchedule();
      }, 500);
    },
    handleViewChange() {
      this.fetchSchedule();
    },
    formatTime(time) {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    },
    isToday(day) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date().getDay();
      return days[today] === day;
    },
    getDaySchedule(day) {
      return this.scheduleList.filter(item => item.day === day);
    },
    toggleDay(day) {
      this.expandedDays[day] = !this.expandedDays[day];
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
/* Main Container */
.report-container {
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Header Section */
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.report-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 250px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Calendar Container */
.calendar-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
}

.day-column {
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-column.today {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.day-header {
  background: #f9fafb;
  padding: 15px;
  border-bottom: 2px solid #e5e7eb;
  text-align: center;
}

.day-name {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.class-count {
  font-size: 12px;
  color: #6b7280;
}

.day-schedule {
  padding: 10px;
  background: #fafafa;
  min-height: 450px;
}

.class-block {
  background: #4A90E2;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.class-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.class-block:hover .class-hover-info {
  opacity: 1;
  visibility: visible;
}

.class-time {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 5px;
}

.class-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.class-subject {
  font-size: 12px;
  opacity: 0.85;
}

.class-hover-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.hover-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.detail-icon {
  font-size: 16px;
}

.no-classes {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.no-class-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
  opacity: 0.5;
}

.no-classes p {
  margin: 0;
  font-size: 13px;
}

/* List View */
.list-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.day-section {
  border-bottom: 1px solid #e5e7eb;
}

.day-section:last-child {
  border-bottom: none;
}

.day-section-header {
  padding: 20px 25px;
  background: #f9fafb;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.day-section-header:hover {
  background: #f3f4f6;
}

.day-section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.toggle-icon {
  color: #6b7280;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.day-classes {
  padding: 15px 25px 25px;
}

.list-class-card {
  display: flex;
  background: #f9fafb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.list-class-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.list-class-color {
  width: 6px;
  min-width: 6px;
}

.list-class-content {
  flex: 1;
  padding: 20px;
}

.list-class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.list-class-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.list-class-time {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.list-class-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  min-width: 70px;
}

.detail-value {
  color: #111827;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #111827;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .calendar-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1024px) {
  .calendar-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .report-container {
    padding: 15px;
  }

  .report-header {
    padding: 25px;
  }

  .report-title {
    font-size: 24px;
  }

  .calendar-grid {
    grid-template-columns: 1fr;
  }

  .day-column {
    min-height: auto;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }
}
</style>