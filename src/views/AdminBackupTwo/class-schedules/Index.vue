<template>
  <div class="schedule-management">
    <!-- Header with Stats -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fas fa-calendar-alt"></i> Class Schedule Management
        </h1>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon total">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_schedules || 0 }}</div>
              <div class="stat-label">Total Schedules</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon active">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.active_schedules || 0 }}</div>
              <div class="stat-label">Active</div>
            </div>
          </div>
        </div>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <i class="fas fa-plus"></i> Add New Schedule
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by subject, teacher, or classroom..."
            class="search-input"
        />
      </div>

      <select v-model="filters.day_of_week" @change="loadSchedules" class="filter-select">
        <option value="">All Days</option>
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
        <option value="saturday">Saturday</option>
        <option value="sunday">Sunday</option>
      </select>

      <select v-model="filters.class_type" @change="loadSchedules" class="filter-select">
        <option value="">All Types</option>
        <option value="lecture">Lecture</option>
        <option value="practical">Practical</option>
        <option value="tutorial">Tutorial</option>
        <option value="seminar">Seminar</option>
      </select>

      <select v-model="filters.session_id" @change="loadSchedules" class="filter-select">
        <option value="">All Sessions</option>
        <option v-for="session in formData.sessions" :key="session.id" :value="session.id">
          {{ session.name }} - {{ session.year }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner-ring"></div>
        <p>Loading Schedules...</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="schedules-table">
          <thead>
          <tr>
            <th><i class="fas fa-calendar-day"></i> Day</th>
            <th><i class="fas fa-clock"></i> Time</th>
            <th><i class="fas fa-book"></i> Subject</th>
            <th><i class="fas fa-user-tie"></i> Teacher</th>
            <th><i class="fas fa-door-open"></i> Room</th>
            <th><i class="fas fa-tag"></i> Type</th>
            <th><i class="fas fa-graduation-cap"></i> Session</th>
            <th><i class="fas fa-toggle-on"></i> Status</th>
            <th><i class="fas fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="schedules.length === 0">
            <td colspan="9" class="no-data">
              <div class="no-data-content">
                <div class="no-data-icon">
                  <i class="fas fa-calendar-times"></i>
                </div>
                <h3>No Schedules Found</h3>
                <p>Create your first class schedule to get started</p>
              </div>
            </td>
          </tr>
          <tr v-for="schedule in schedules" :key="schedule.id" class="table-row">
            <td>
                <span >
<!--                  <i class="fas fa-calendar"></i>-->
                  {{ getDayLabel(schedule.day_of_week) }}
                </span>
            </td>
            <td>
              <div class="time-cell">
                <div class="time-badge">
                  <i class="fas fa-clock"></i>
                  <div class="time-info">
                    <span class="time-start">{{ formatTime(schedule.start_time) }}</span>
                    <span class="time-divider">→</span>
                    <span class="time-end">{{ formatTime(schedule.end_time) }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="subject-cell">
                <div class="subject-icon">
                  <i class="fas fa-book-open"></i>
                </div>
                <div class="subject-info">
                  <span class="subject-name">{{ schedule.subject?.name }}</span>
                  <span class="subject-code">{{ schedule.subject?.code }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="teacher-cell">
                <div class="teacher-avatar">
                  <i class="fas fa-user-tie"></i>
                </div>
                <span class="teacher-name">{{ schedule.teacher?.name }}</span>
              </div>
            </td>
            <td>
                <span class="status-badge status-active">
                  {{ schedule.classroom?.name }}
                </span>
            </td>
            <td>
                <span class="status-badge status-active">
                  {{ getTypeLabel(schedule.class_type) }}
                </span>
            </td>
            <td>
              <div class="session-cell">
                <i class="fas fa-graduation-cap"></i>
                {{ schedule.session?.name }}
              </div>
            </td>
            <td>
                <span :class="['status-badge', schedule.is_active ? 'status-active' : 'status-inactive']">
                  {{ schedule.is_active ? 'Active' : 'Inactive' }}
                </span>
            </td>
            <td class="actions">
              <button @click="openModal(schedule)" class="btn-icon btn-edit" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteSchedule(schedule)" class="btn-icon btn-delete" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <span class="pagination-info">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
        <span class="total-items">({{ pagination.total }} total)</span>
      </span>

      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h2>
              <i :class="editMode ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editMode ? 'Edit Schedule' : 'Add New Schedule' }}
            </h2>
            <button @click="closeModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveSchedule" class="modal-body">
            <!-- Conflict Warning -->
            <div v-if="errors.conflict" class="conflict-alert">
              <i class="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Scheduling Conflict!</strong>
                <ul>
                  <li v-for="(conflict, index) in errors.conflict" :key="index">{{ conflict }}</li>
                </ul>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Subject <span class="required">*</span></label>
                <select
                    v-model="form.subject_id"
                    class="form-control"
                    :class="{ 'error': errors.subject_id }"
                >
                  <option value="">Select Subject</option>
                  <option v-for="subject in formData.subjects" :key="subject.id" :value="subject.id">
                    {{ subject.code }} - {{ subject.name }}
                  </option>
                </select>
                <span v-if="errors.subject_id" class="error-text">{{ errors.subject_id[0] }}</span>
              </div>

              <div class="form-group">
                <label>Teacher <span class="required">*</span></label>
                <select
                    v-model="form.teacher_id"
                    class="form-control"
                    :class="{ 'error': errors.teacher_id }"
                >
                  <option value="">Select Teacher</option>
                  <option v-for="teacher in formData.teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} ({{ teacher.employee_id }})
                  </option>
                </select>
                <span v-if="errors.teacher_id" class="error-text">{{ errors.teacher_id[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Classroom <span class="required">*</span></label>
                <select
                    v-model="form.classroom_id"
                    class="form-control"
                    :class="{ 'error': errors.classroom_id }"
                >
                  <option value="">Select Classroom</option>
                  <option v-for="classroom in formData.classrooms" :key="classroom.id" :value="classroom.id">
                    {{ classroom.code }} - {{ classroom.name }}
                  </option>
                </select>
                <span v-if="errors.classroom_id" class="error-text">{{ errors.classroom_id[0] }}</span>
              </div>

              <div class="form-group">
                <label>Session <span class="required">*</span></label>
                <select
                    v-model="form.session_id"
                    class="form-control"
                    :class="{ 'error': errors.session_id }"
                >
                  <option value="">Select Session</option>
                  <option v-for="session in formData.sessions" :key="session.id" :value="session.id">
                    {{ session.name }} - {{ session.year }}
                  </option>
                </select>
                <span v-if="errors.session_id" class="error-text">{{ errors.session_id[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Day of Week <span class="required">*</span></label>
                <select
                    v-model="form.day_of_week"
                    class="form-control"
                    :class="{ 'error': errors.day_of_week }"
                >
                  <option value="">Select Day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
                <span v-if="errors.day_of_week" class="error-text">{{ errors.day_of_week[0] }}</span>
              </div>

              <div class="form-group">
                <label>Class Type <span class="required">*</span></label>
                <select
                    v-model="form.class_type"
                    class="form-control"
                    :class="{ 'error': errors.class_type }"
                >
                  <option value="">Select Type</option>
                  <option value="lecture">Lecture</option>
                  <option value="practical">Practical</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="seminar">Seminar</option>
                </select>
                <span v-if="errors.class_type" class="error-text">{{ errors.class_type[0] }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Start Time <span class="required">*</span></label>
                <input
                    v-model="form.start_time"
                    type="time"
                    class="form-control"
                    :class="{ 'error': errors.start_time }"
                />
                <span v-if="errors.start_time" class="error-text">{{ errors.start_time[0] }}</span>
              </div>

              <div class="form-group">
                <label>End Time <span class="required">*</span></label>
                <input
                    v-model="form.end_time"
                    type="time"
                    class="form-control"
                    :class="{ 'error': errors.end_time }"
                />
                <span v-if="errors.end_time" class="error-text">{{ errors.end_time[0] }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="form.is_active" type="checkbox" />
                <span class="checkbox-text">
                  <i :class="form.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                  Mark as Active
                </span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn btn-secondary">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <i :class="saving ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
                {{ saving ? 'Saving...' : 'Save Schedule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ClassScheduleManagement',

  data() {
    return {
      schedules: [],
      stats: {},
      formData: {
        subjects: [],
        teachers: [],
        classrooms: [],
        sessions: []
      },
      loading: false,
      saving: false,
      showModal: false,
      editMode: false,
      searchTimeout: null,

      filters: {
        search: '',
        day_of_week: '',
        class_type: '',
        session_id: ''
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      },

      form: {
        id: null,
        subject_id: '',
        teacher_id: '',
        classroom_id: '',
        session_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        class_type: '',
        is_active: true
      },

      errors: {}
    };
  },

  mounted() {
    this.loadFormData();
    this.loadStats();
    this.loadSchedules();
  },

  methods: {
    async loadFormData() {
      try {
        const response = await this.$api.get('/schedules/form-data');
        this.formData = response.data;
      } catch (error) {
        this.showError('Failed to load form data');
      }
    },

    async loadStats() {
      try {
        const response = await this.$api.get('/schedules/stats');
        this.stats = response.data;
      } catch (error) {
        console.error('Failed to load stats');
      }
    },

    async loadSchedules(page = 1) {
      this.loading = true;
      try {
        const params = {
          page: page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key];
          }
        });

        const response = await this.$api.get('/schedules', { params });
        this.schedules = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
      } catch (error) {
        this.showError('Failed to load schedules');
      } finally {
        this.loading = false;
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadSchedules();
      }, 500);
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.loadSchedules(page);
      }
    },

    openModal(schedule = null) {
      this.editMode = !!schedule;
      if (schedule) {
        this.form = { ...schedule };
      } else {
        this.resetForm();
      }
      this.errors = {};
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
      this.errors = {};
    },

    resetForm() {
      this.form = {
        id: null,
        subject_id: '',
        teacher_id: '',
        classroom_id: '',
        session_id: '',
        day_of_week: '',
        start_time: '',
        end_time: '',
        class_type: '',
        is_active: true
      };
    },

    async saveSchedule() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.editMode) {
          await this.$api.put(`/schedules/${this.form.id}`, this.form);
          this.showSuccess('Schedule updated successfully');
        } else {
          await this.$api.post('/schedules', this.form);
          this.showSuccess('Schedule created successfully');
        }

        this.closeModal();
        this.loadSchedules(this.pagination.current_page);
        this.loadStats();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.showError('Failed to save schedule');
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteSchedule(schedule) {
      const subjectName = schedule.subject?.name || 'this schedule';
      if (!confirm(`Are you sure you want to delete ${subjectName}?`)) {
        return;
      }

      try {
        await this.$api.delete(`/schedules/${schedule.id}`);
        this.showSuccess('Schedule deleted successfully');
        this.loadSchedules(this.pagination.current_page);
        this.loadStats();
      } catch (error) {
        this.showError('Failed to delete schedule');
      }
    },

    getDayLabel(day) {
      return day ? day.charAt(0).toUpperCase() + day.slice(1) : '';
    },

    getDayBadgeClass(day) {
      const classes = {
        monday: 'badge-monday',
        tuesday: 'badge-tuesday',
        wednesday: 'badge-wednesday',
        thursday: 'badge-thursday',
        friday: 'badge-friday',
        saturday: 'badge-saturday',
        sunday: 'badge-sunday'
      };
      return classes[day] || '';
    },

    getTypeLabel(type) {
      const labels = {
        lecture: 'Lecture',
        practical: 'Practical',
        tutorial: 'Tutorial',
        seminar: 'Seminar'
      };
      return labels[type] || type;
    },

    getTypeBadgeClass(type) {
      const classes = {
        lecture: 'badge-lecture',
        practical: 'badge-practical',
        tutorial: 'badge-tutorial',
        seminar: 'badge-seminar'
      };
      return classes[type] || '';
    },

    formatTime(time) {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    },

    showSuccess(message) {
      console.log(message)
      //alert(message);
    },

    showError(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
.schedule-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px 0;
}

.page-title i {
  color: #667eea;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

/* Filters */
.filter-section {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 16px;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Table */
.table-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
}

.schedules-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1200px;
}

.schedules-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.schedules-table thead::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255,255,255,0.6) 50%,
  transparent 100%
  );
}

.schedules-table th {
  padding: 20px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  position: relative;
}

.schedules-table th i {
  margin-right: 6px;
  opacity: 0.9;
}

.schedules-table th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.schedules-table td {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #475569;
  vertical-align: middle;
  background: white;
  transition: all 0.3s ease;
}

.table-row {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-row:hover {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  transform: scale(1.01);
}

.table-row:hover::before {
  width: 8px;
}

.table-row:hover td {
  background: linear-gradient(90deg, #f8fafc 0%, white 100%);
}

.table-row:last-child td {
  border-bottom: none;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.badge i {
  font-size: 12px;
}

.badge:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Day Badges - Modern Gradient Design */
.badge-day {
  font-weight: 800;
  text-transform: uppercase;
  padding: 10px 16px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.badge-day::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
  );
  transition: left 0.5s ease;
}

.badge-day:hover::before {
  left: 100%;
}

.badge-monday {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.badge-tuesday {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #1e3a8a;
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.4);
}

.badge-wednesday {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: #4c1d95;
  box-shadow: 0 4px 12px rgba(167, 139, 250, 0.4);
}

.badge-thursday {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  color: #064e3b;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.4);
}

.badge-friday {
  background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%);
  color: #831843;
  box-shadow: 0 4px 12px rgba(244, 114, 182, 0.4);
}

.badge-saturday {
  background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
  color: #0c4a6e;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
}

.badge-sunday {
  background: linear-gradient(135deg, #fb7185 0%, #f43f5e 100%);
  color: #881337;
  box-shadow: 0 4px 12px rgba(251, 113, 133, 0.4);
}

/* Type Badges with Icons */
.badge-type {
  font-weight: 700;
  padding: 9px 14px;
  border-radius: 10px;
}

.badge-lecture {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.2);
}

.badge-lecture::before {
  content: '📚';
  margin-right: 4px;
  font-size: 14px;
}

.badge-practical {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.2);
}

.badge-practical::before {
  content: '🔬';
  margin-right: 4px;
  font-size: 14px;
}

.badge-tutorial {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2);
}

.badge-tutorial::before {
  content: '📖';
  margin-right: 4px;
  font-size: 14px;
}

.badge-seminar {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  box-shadow: 0 3px 10px rgba(99, 102, 241, 0.2);
}

.badge-seminar::before {
  content: '🎤';
  margin-right: 4px;
  font-size: 14px;
}

.badge-classroom {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #1e293b;
  font-weight: 700;
  padding: 9px 14px;
  box-shadow: 0 3px 10px rgba(71, 85, 105, 0.15);
}

.badge-classroom:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Status Badge with Animation */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.status-active {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.status-active::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 4px;
  animation: pulse-success 2s ease-in-out infinite;
}

@keyframes pulse-success {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
    transform: scale(1.1);
  }
}

.status-inactive {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.status-inactive::before {
  content: '';
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  margin-right: 4px;
}

/* Special Cell Designs */
.time-cell {
  display: flex;
  justify-content: center;
}

.time-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.time-badge:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}

.time-badge:hover i,
.time-badge:hover .time-info {
  color: white;
}

.time-badge i {
  font-size: 18px;
  color: #667eea;
  transition: all 0.3s ease;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 13px;
  color: #334155;
  transition: all 0.3s ease;
}

.time-start,
.time-end {
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.time-divider {
  color: #667eea;
  font-weight: 900;
  font-size: 14px;
  transition: all 0.3s ease;
}

.time-badge:hover .time-divider {
  color: white;
  transform: scale(1.2);
}

/* Subject Cell with Icon */
.subject-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.subject-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}

.subject-icon i {
  font-size: 18px;
  color: #4338ca;
  transition: all 0.3s ease;
}

.table-row:hover .subject-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: rotate(10deg) scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.table-row:hover .subject-icon i {
  color: white;
  transform: scale(1.1);
}

.subject-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-name {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.3;
  transition: all 0.3s ease;
}

.table-row:hover .subject-name {
  color: #667eea;
}

.subject-code {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Courier New', monospace;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
  display: inline-block;
  width: fit-content;
}

/* Teacher Cell with Avatar */
.teacher-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
}

.teacher-avatar i {
  font-size: 18px;
  color: #92400e;
  transition: all 0.3s ease;
}

.table-row:hover .teacher-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.table-row:hover .teacher-avatar i {
  color: white;
}

.teacher-name {
  font-weight: 600;
  font-size: 14px;
  color: #334155;
  transition: all 0.3s ease;
}

.table-row:hover .teacher-name {
  color: #667eea;
  font-weight: 700;
}

/* Session Cell */
.session-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #64748b;
  transition: all 0.3s ease;
}

.session-cell i {
  font-size: 16px;
  color: #667eea;
  transition: all 0.3s ease;
}

.table-row:hover .session-cell {
  color: #334155;
}

.table-row:hover .session-cell i {
  transform: scale(1.2);
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.btn-icon:hover::before {
  width: 120%;
  height: 120%;
}

.btn-icon i {
  position: relative;
  z-index: 1;
  font-size: 16px;
}

.btn-edit {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border-color: #93c5fd;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  transform: translateY(-4px) rotate(5deg);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border-color: #fca5a5;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  transform: translateY(-4px) rotate(-5deg);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 600;
  color: #475569;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.total-items {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header h2 i {
  color: #667eea;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #fee2e2;
  color: #991b1b;
}

.modal-body {
  padding: 24px;
}

/* Conflict Alert */
.conflict-alert {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.conflict-alert i {
  color: #991b1b;
  font-size: 24px;
  flex-shrink: 0;
}

.conflict-alert strong {
  color: #991b1b;
  display: block;
  margin-bottom: 8px;
}

.conflict-alert ul {
  margin: 0;
  padding-left: 20px;
  color: #7f1d1d;
}

.conflict-alert li {
  margin-bottom: 4px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control.error {
  border-color: #ef4444;
}

.error-text {
  display: block;
  margin-top: 4px;
  color: #ef4444;
  font-size: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  background: #f1f5f9;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #475569;
}

.checkbox-text i {
  color: #10b981;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

/* Loading & No Data */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 6px solid #e0e7ff;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner p {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  margin: 0;
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.no-data {
  text-align: center;
  padding: 0;
}

.no-data-content {
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.no-data-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 30px;
  animation: float-icon 3s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-10px) rotate(5deg);
  }
}

.no-data-icon i {
  font-size: 56px;
  color: #cbd5e1;
  animation: icon-bounce 2s ease-in-out infinite;
}

@keyframes icon-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.no-data-content h3 {
  font-size: 22px;
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.no-data-content p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  max-width: 400px;
  line-height: 1.6;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.modal-enter .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 1200px) {
  .filter-section {
    grid-template-columns: 1fr 1fr;
  }

  .schedules-table {
    min-width: 1000px;
  }

  .schedules-table th,
  .schedules-table td {
    padding: 16px 12px;
    font-size: 13px;
  }

  .subject-icon,
  .teacher-avatar {
    width: 38px;
    height: 38px;
  }

  .subject-icon i,
  .teacher-avatar i {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .schedule-management {
    padding: 16px;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .filter-section {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 12px;
  }

  .table-container {
    border-radius: 16px;
    margin: 0 -16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .schedules-table {
    min-width: 900px;
  }

  .schedules-table th {
    padding: 14px 10px;
    font-size: 10px;
  }

  .schedules-table th i {
    display: none;
  }

  .schedules-table td {
    padding: 14px 10px;
    font-size: 12px;
  }

  .badge {
    padding: 6px 10px;
    font-size: 10px;
  }

  .badge-day {
    padding: 8px 12px;
  }

  .badge-day i {
    font-size: 10px;
  }

  .time-badge {
    padding: 8px 12px;
    gap: 6px;
  }

  .time-badge i {
    font-size: 14px;
  }

  .time-info {
    font-size: 11px;
    gap: 4px;
  }

  .subject-icon,
  .teacher-avatar {
    width: 34px;
    height: 34px;
  }

  .subject-icon i,
  .teacher-avatar i {
    font-size: 14px;
  }

  .subject-name {
    font-size: 12px;
  }

  .subject-code {
    font-size: 10px;
    padding: 2px 6px;
  }

  .teacher-name {
    font-size: 12px;
  }

  .session-cell {
    font-size: 11px;
  }

  .session-cell i {
    font-size: 13px;
  }

  .status-badge {
    padding: 7px 12px;
    font-size: 10px;
  }

  .btn-icon {
    width: 34px;
    height: 34px;
  }

  .btn-icon i {
    font-size: 13px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-large {
    max-width: 100%;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .modal-body {
    padding: 20px;
  }

  .no-data-icon {
    width: 100px;
    height: 100px;
  }

  .no-data-icon i {
    font-size: 48px;
  }

  .no-data-content h3 {
    font-size: 18px;
  }

  .no-data-content p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .schedules-table {
    min-width: 800px;
  }

  .schedules-table th,
  .schedules-table td {
    padding: 12px 8px;
    font-size: 11px;
  }

  .badge {
    padding: 5px 8px;
    font-size: 9px;
  }

  .time-badge {
    padding: 6px 10px;
  }

  .time-info {
    font-size: 10px;
  }

  .subject-icon,
  .teacher-avatar {
    width: 30px;
    height: 30px;
  }

  .subject-icon i,
  .teacher-avatar i {
    font-size: 12px;
  }

  .subject-name,
  .teacher-name {
    font-size: 11px;
  }

  .btn-icon {
    width: 30px;
    height: 30px;
  }

  .btn-icon i {
    font-size: 12px;
  }
}

/* Smooth Scrollbar for Table */
.table-wrapper::-webkit-scrollbar {
  height: 10px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>