<template>
  <div class="class-management">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-wrapper">
          <div class="icon-box">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h1 class="page-title">Class Management</h1>
            <p class="page-subtitle">Manage your classes efficiently</p>
          </div>
        </div>
        <button @click="dailyClassGenerate" class="btn-primary btn-glow">
          <i class="fas fa-plus-circle"></i>
          <span>Daily Class Generate</span>
          <div class="btn-shine"></div>
        </button>
        <button @click="openCreateModal" class="btn-primary btn-glow">
          <i class="fas fa-plus-circle"></i>
          <span>New Class</span>
          <div class="btn-shine"></div>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card stat-card-1">
        <div class="stat-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.scheduled }}</div>
          <div class="stat-label">Scheduled</div>
        </div>
      </div>
      <div class="stat-card stat-card-2">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>
      <div class="stat-card stat-card-3">
        <div class="stat-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.cancelled }}</div>
          <div class="stat-label">Cancelled</div>
        </div>
      </div>
      <div class="stat-card stat-card-4">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ pagination.total }}</div>
          <div class="stat-label">Total Classes</div>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section glass-effect">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-filter"></i>
          Filters
        </h3>
      </div>
      <div class="filter-grid">
        <div class="filter-item">
          <label class="filter-label">
            <i class="fas fa-search"></i>
            Search
          </label>
          <div class="input-wrapper">
            <input v-model="filters.search" @input="debouncedSearch" type="text" placeholder="Search classes..." class="filter-input"/>
            <i class="fas fa-search input-icon"></i>
          </div>
        </div>

        <div class="filter-item">
          <label class="filter-label">
            <i class="fas fa-tasks"></i>
            Status
          </label>
          <div class="select-wrapper">
            <select v-model="filters.status" @change="fetchClasses" class="filter-select">
              <option value="">All Status</option>
              <option value="scheduled">📅 Scheduled</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
              <option value="rescheduled">🔄 Rescheduled</option>
            </select>
            <i class="fas fa-chevron-down select-icon"></i>
          </div>
        </div>

        <div class="filter-item">
          <label class="filter-label">
            <i class="fas fa-calendar-alt"></i>
            Date
          </label>
          <div class="input-wrapper">
            <input
                v-model="filters.date"
                @change="fetchClasses"
                type="date"
                class="filter-input"
            />
            <i class="fas fa-calendar input-icon"></i>
          </div>
        </div>

        <div class="filter-item">
          <label class="filter-label">&nbsp;</label>
          <button @click="clearFilters" class="btn-clear">
            <i class="fas fa-sync-alt"></i>
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-section glass-effect">
      <div class="section-header">
        <h3 class="section-title">
          <i class="fas fa-list"></i>
          Classes List
        </h3>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading classes...</p>
      </div>

      <div v-else-if="classes.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 class="empty-title">No Classes Found</h3>
        <p class="empty-text">Start by adding your first class session</p>
        <button @click="openCreateModal" class="btn-primary btn-glow">
          <i class="fas fa-plus-circle"></i>
          <span>Add First Class</span>
        </button>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
          <tr>
            <th><i class="fas fa-list-alt"></i> Schedule</th>
            <th><i class="fas fa-calendar"></i> Date</th>
            <th><i class="fas fa-book"></i> Topic</th>
            <th><i class="fas fa-clock"></i> Time</th>
            <th><i class="fas fa-info-circle"></i> Status</th>
            <th><i class="fas fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="classItem in classes" :key="classItem.id" class="table-row">
            <td>
              <div class="schedule-cell">
                <i class="fas fa-list-alt"></i>
                <span>{{ getScheduleDisplayName(classItem.schedule) }}</span>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <i class="fas fa-calendar-day"></i>
                <span>{{ formatDate(classItem.class_date) }}</span>
              </div>
            </td>
            <td>
              <div class="topic-cell">
                <i class="fas fa-bookmark"></i>
                {{ classItem.topic || 'No Topic' }}
              </div>
            </td>
            <td>
              <div class="time-cell">
                <span v-if="classItem.actual_start_time" class="time-badge">
                  <i class="fas fa-play-circle"></i>
                  {{ formatTime(classItem.actual_start_time) }}
                </span>
                <span v-if="classItem.actual_end_time" class="time-badge">
                  <i class="fas fa-stop-circle"></i>
                  {{ formatTime(classItem.actual_end_time) }}
                </span>
                <span v-if="!classItem.actual_start_time && !classItem.actual_end_time" class="time-badge time-badge-empty">
                  <i class="fas fa-minus-circle"></i>
                  Not set
                </span>
              </div>
            </td>
            <td>
              <span :class="getStatusClass(classItem.status)">
                <i :class="getStatusIcon(classItem.status)"></i>
                {{ classItem.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
<!--                <button @click="viewClass(classItem)" class="btn-action btn-view" title="View">-->
<!--                  <i class="fas fa-eye"></i>-->
<!--                </button>-->
                <button @click="editClass(classItem)" class="btn-action btn-edit" title="Edit">
                  <i class="fas fa-pen"></i>
                </button>
                <button @click="confirmDelete(classItem)" class="btn-action btn-delete" title="Delete">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="pagination-section">
        <div class="pagination-info">
          <i class="fas fa-info-circle"></i>
          Showing <strong>{{ pagination.from }}</strong> to <strong>{{ pagination.to }}</strong> of <strong>{{ pagination.total }}</strong> entries
        </div>
        <div class="pagination-buttons">
          <button
              @click="goToPage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="pagination-btn pagination-btn-nav"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="['pagination-btn', { active: page === pagination.current_page }]"
          >
            {{ page }}
          </button>
          <button
              @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="pagination-btn pagination-btn-nav"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container glass-effect">
          <div class="modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon" :class="isEditing ? 'modal-icon-edit' : 'modal-icon-create'">
                <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              </div>
              <div>
                <h2 class="modal-title">{{ isEditing ? 'Edit Class' : 'Create New Class' }}</h2>
                <p class="modal-subtitle">{{ isEditing ? 'Update class information' : 'Add a new class to your schedule' }}</p>
              </div>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="modal-body">
            <div class="form-grid">
              <!-- Schedule Dropdown -->
              <div class="form-group full-width">
                <label class="form-label">
                  <i class="fas fa-list-alt"></i>
                  Schedule
                  <span class="required">*</span>
                </label>
                <div class="select-wrapper">
                  <select v-model.number="formData.schedule_id" required class="form-control form-select">
                    <option value="" disabled>Select a schedule</option>
                    <option
                        v-for="schedule in schedules"
                        :key="schedule.id"
                        :value="schedule.id"
                    >
                      {{ getScheduleDisplayName(schedule) }}
                    </option>
                  </select>
                  <i class="fas fa-chevron-down select-arrow"></i>
                </div>
                <small v-if="schedules.length === 0" class="form-hint text-warning">
                  <i class="fas fa-exclamation-triangle"></i>
                  No schedules available. Please create a schedule first.
                </small>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-calendar-day"></i>
                  Class Date
                  <span class="required">*</span>
                </label>
                <input
                    v-model="formData.class_date"
                    type="date"
                    required
                    class="form-control"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-tasks"></i>
                  Status
                </label>
                <div class="select-wrapper">
                  <select v-model="formData.status" class="form-control form-select">
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                    <option value="rescheduled">🔄 Rescheduled</option>
                  </select>
                  <i class="fas fa-chevron-down select-arrow"></i>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-clock"></i>
                  Start Time
                </label>
                <input
                    v-model="formData.actual_start_time"
                    type="time"
                    class="form-control"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-clock"></i>
                  End Time
                </label>
                <input
                    v-model="formData.actual_end_time"
                    type="time"
                    class="form-control"
                />
              </div>

              <div class="form-group full-width">
                <label class="form-label">
                  <i class="fas fa-bookmark"></i>
                  Topic
                </label>
                <input
                    v-model="formData.topic"
                    type="text"
                    class="form-control"
                    placeholder="Enter class topic"
                    maxlength="500"
                />
              </div>

              <div class="form-group full-width">
                <label class="form-label">
                  <i class="fas fa-align-left"></i>
                  Description
                </label>
                <textarea
                    v-model="formData.description"
                    class="form-control"
                    rows="4"
                    placeholder="Enter class description"
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-secondary">
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button type="submit" :disabled="submitting || schedules.length === 0" class="btn-primary btn-glow">
                <span v-if="submitting">
                  <i class="fas fa-spinner fa-spin"></i>
                  Saving...
                </span>
                <span v-else>
                  <i class="fas fa-save"></i>
                  {{ isEditing ? 'Update Class' : 'Create Class' }}
                </span>
                <div class="btn-shine"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container delete-modal glass-effect">
          <div class="modal-header">
            <div class="modal-title-wrapper">
              <div class="modal-icon modal-icon-danger">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                <h2 class="modal-title">Confirm Deletion</h2>
                <p class="modal-subtitle">This action cannot be undone</p>
              </div>
            </div>
            <button @click="closeDeleteModal" class="modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="delete-warning">
              <i class="fas fa-exclamation-circle"></i>
              <p>Are you sure you want to delete this class?</p>
            </div>
            <div class="delete-info">
              <div class="info-row">
                <strong><i class="fas fa-list-alt"></i> Schedule:</strong>
                <span>{{ getScheduleName(classToDelete) }}</span>
              </div>
              <div class="info-row">
                <strong><i class="fas fa-bookmark"></i> Topic:</strong>
                <span>{{ classToDelete?.topic || 'No Topic' }}</span>
              </div>
              <div class="info-row">
                <strong><i class="fas fa-calendar"></i> Date:</strong>
                <span>{{ formatDate(classToDelete?.class_date) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeDeleteModal" class="btn-secondary">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button @click="deleteClass" :disabled="deleting" class="btn-danger btn-glow">
              <span v-if="deleting">
                <i class="fas fa-spinner fa-spin"></i>
                Deleting...
              </span>
              <span v-else>
                <i class="fas fa-trash-alt"></i>
                Yes, Delete
              </span>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        <div class="toast-icon">
          <i :class="getToastIcon(toast.type)"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ getToastTitle(toast.type) }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button @click="toast.show = false" class="toast-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ClassManagement',

  data() {
    return {
      classes: [],
      schedules: [],
      loading: false,
      submitting: false,
      deleting: false,
      showModal: false,
      showDeleteModal: false,
      isEditing: false,
      classToDelete: null,

      stats: {
        scheduled: 0,
        completed: 0,
        cancelled: 0,
      },

      filters: {
        search: '',
        status: '',
        date: '',
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
      },

      formData: {
        schedule_id: '',
        class_date: '',
        actual_start_time: null,
        actual_end_time: null,
        topic: '',
        description: '',
        status: 'scheduled',
      },

      toast: {
        show: false,
        message: '',
        type: 'success',
      },

      searchTimeout: null,
    };
  },

  computed: {
    visiblePages() {
      const pages = [];
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;

      let start = Math.max(1, current - 2);
      let end = Math.min(last, current + 2);

      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(last, start + 4);
        } else if (end === last) {
          start = Math.max(1, end - 4);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },

  mounted() {
    this.fetchSchedules();
    this.fetchClasses();
  },

  methods: {
    async fetchSchedules() {
      try {
        const response = await this.$api.get('/classes/schedules');
        this.schedules = response.data || [];
      } catch (error) {
        this.showToast('Failed to fetch schedules', 'error');
        console.error(error);
      }
    },
    async dailyClassGenerate() {
      try {
        const response = await this.$api.get('/classes/daily-class-generate');
        this.schedules = response.data || [];
        this.fetchClasses();
      } catch (error) {
        this.showToast('Failed to fetch schedules', 'error');
        console.error(error);
      }
    },

    async fetchClasses() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          search: this.filters.search,
          status: this.filters.status,
          date: this.filters.date,
        };

        const response = await this.$api.get('/classes', { params });
        console.log(response)
        this.classes = response.data.data;

        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        };

        this.calculateStats();
      } catch (error) {
        this.showToast('Failed to fetch classes', 'error');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    calculateStats() {
      this.stats = {
        scheduled: this.classes.filter(c => c.status === 'scheduled').length,
        completed: this.classes.filter(c => c.status === 'completed').length,
        cancelled: this.classes.filter(c => c.status === 'cancelled').length,
      };
    },
    getScheduleName(classItem) {
      if (!classItem) return 'N/A';
      console.log(classItem)
      if (classItem.schedule) {
        return classItem.schedule.title ||
            classItem.schedule.course_name ||
            classItem.schedule.batch_name ||
            `Schedule #${classItem.schedule_id}`;
      }
      return `Schedule #${classItem.schedule_id}`;
    },

    getScheduleDisplayName(schedule) {
      if (!schedule) return 'Unknown Schedule';
      const parts = [];
      if (schedule.day_of_week) parts.push(schedule.day_of_week);
      if (schedule.teacher) parts.push(`(${schedule.teacher.name})`);
      if (schedule.subject) parts.push(schedule.subject.name);
      if (schedule.classroom) parts.push(schedule.classroom.name);
      if (schedule.start_time) parts.push(schedule.start_time + '-' +schedule.end_time);

      return parts.length > 0 ? parts.join(' - ') : `Schedule #${schedule.id}`;
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.fetchClasses();
      }, 500);
    },

    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        date: '',
      };
      this.pagination.current_page = 1;
      this.fetchClasses();
    },

    goToPage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchClasses();
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetFormData();
      this.showModal = true;
    },

    editClass(classItem) {
      this.isEditing = true;
      this.formData = {
        id: classItem.id,
        schedule_id: classItem.schedule_id,
        class_date: classItem.class_date,
        actual_start_time: classItem.actual_start_time,
        actual_end_time: classItem.actual_end_time,
        topic: classItem.topic,
        description: classItem.description,
        status: classItem.status,
      };
      this.showModal = true;
    },

    viewClass(classItem) {
      this.editClass(classItem);
    },

    closeModal() {
      this.showModal = false;
      this.resetFormData();
    },

    resetFormData() {
      this.formData = {
        schedule_id: '',
        class_date: '',
        actual_start_time: null,
        actual_end_time: null,
        topic: '',
        description: '',
        status: 'scheduled',
      };
    },

    async submitForm() {
      this.submitting = true;
      try {
        if (this.isEditing) {
          await this.$api.put(`/classes/${this.formData.id}`, this.formData);
          this.showToast('Class updated successfully', 'success');
        } else {
          await this.$api.post('/classes', this.formData);
          this.showToast('Class created successfully', 'success');
        }
        this.closeModal();
        this.fetchClasses();
      } catch (error) {
        this.showToast(
            error.response?.data?.message || 'Failed to save class',
            'error'
        );
        console.error(error);
      } finally {
        this.submitting = false;
      }
    },

    confirmDelete(classItem) {
      this.classToDelete = classItem;
      this.showDeleteModal = true;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.classToDelete = null;
    },

    async deleteClass() {
      this.deleting = true;
      try {
        await this.$api.delete(`/classes/${this.classToDelete.id}`);
        this.showToast('Class deleted successfully', 'success');
        this.closeDeleteModal();
        this.fetchClasses();
      } catch (error) {
        this.showToast('Failed to delete class', 'error');
      } finally {
        this.deleting = false;
      }
    },

    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type,
      };
      setTimeout(() => {
        this.toast.show = false;
      }, 4000);
    },

    getToastIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle',
      };
      return icons[type] || icons.info;
    },

    getToastTitle(type) {
      const titles = {
        success: 'Success!',
        error: 'Error!',
        warning: 'Warning!',
        info: 'Info',
      };
      return titles[type] || 'Notification';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },

    formatTime(time) {
      if (!time) return '';
      return new Date('2000-01-01 ' + time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    getStatusClass(status) {
      const classes = {
        scheduled: 'status-badge status-scheduled',
        completed: 'status-badge status-completed',
        cancelled: 'status-badge status-cancelled',
        rescheduled: 'status-badge status-rescheduled',
      };
      return classes[status] || 'status-badge';
    },

    getStatusIcon(status) {
      const icons = {
        scheduled: 'fas fa-calendar-check',
        completed: 'fas fa-check-double',
        cancelled: 'fas fa-ban',
        rescheduled: 'fas fa-redo',
      };
      return icons[status] || 'fas fa-circle';
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.class-management {
  min-height: 100vh;
  padding: 30px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  background: white;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 500px;
  height: 500px;
  /*background: linear-gradient(135deg, #667eea, #764ba2);*/
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 50%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, 50px) scale(1.1); }
  50% { transform: translate(-30px, 80px) scale(0.9); }
  75% { transform: translate(-60px, -40px) scale(1.05); }
}

/* Glass Effect */
.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Header Section */
.header-section {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
}

/* Buttons with Glow Effect */
.btn-primary,
.btn-secondary,
.btn-danger,
.btn-clear {
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.btn-glow {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #4a5568;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

.btn-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.5);
}

.btn-clear {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  width: 100%;
}

.btn-clear:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.5);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.btn-primary:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(180deg, transparent, currentColor);
  opacity: 0.8;
}

.stat-card-1 { color: #667eea; }
.stat-card-2 { color: #10b981; }
.stat-card-3 { color: #f5576c; }
.stat-card-4 { color: #4facfe; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: currentColor;
  color: white;
  opacity: 0.9;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: currentColor;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Section */
.filter-section,
.table-section {
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.section-header {
  margin-bottom: 25px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #667eea;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-label i {
  color: #667eea;
}

.input-wrapper,
.select-wrapper {
  position: relative;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-icon,
.select-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #667eea;
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  border-top-color: #764ba2;
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  border-top-color: #f093fb;
  animation-delay: -0.15s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: white;
  opacity: 0.9;
}

.empty-title {
  font-size: 24px;
  color: #1a202c;
  margin-bottom: 10px;
  font-weight: 700;
}

.empty-text {
  color: #718096;
  margin-bottom: 30px;
  font-size: 15px;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.data-table th {
  padding: 18px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
}

.data-table th:first-child {
  border-top-left-radius: 12px;
}

.data-table th:last-child {
  border-top-right-radius: 12px;
}

.data-table tbody tr {
  background: white;
  transition: all 0.3s ease;
}

.data-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.data-table td {
  padding: 18px;
  color: #2d3748;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.date-cell,
.topic-cell,
.schedule-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.schedule-cell i {
  color: #4facfe;
}

.date-cell i {
  color: #667eea;
}

.topic-cell i {
  color: #764ba2;
}

.time-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

.time-badge-empty {
  background: rgba(0, 0, 0, 0.05);
  color: #718096;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-scheduled {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.status-completed {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.status-cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.status-rescheduled {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: white;
}

.btn-view {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.btn-view:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.btn-edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-edit:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.btn-delete:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(250, 112, 154, 0.4);
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 20px;
}

.pagination-info {
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-info i {
  color: #667eea;
}

.pagination-buttons {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: #4a5568;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled):not(.active) {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.pagination-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2000;
  backdrop-filter: blur(8px);
}

.modal-container {
  width: 100%;
  max-width: 750px;
  max-height: 90vh;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.delete-modal {
  max-width: 550px;
}

.modal-header {
  padding: 30px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  flex-shrink: 0;
}

.modal-icon-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-icon-edit {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.modal-icon-danger {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
}

.modal-subtitle {
  font-size: 13px;
  color: #718096;
  margin-top: 5px;
  font-weight: 500;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #718096;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #2d3748;
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
  overflow-y: auto;
}

.modal-footer {
  padding: 25px 30px;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 13px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-label i {
  color: #667eea;
}

.required {
  color: #f5576c;
  margin-left: 4px;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Custom Select Styling */
.form-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 40px;
  cursor: pointer;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
  font-size: 12px;
}

.form-hint {
  margin-top: 8px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-warning {
  color: #f59e0b;
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* Delete Modal Specific */
.delete-warning {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #991b1b;
  font-weight: 600;
}

.delete-warning i {
  font-size: 24px;
}

.delete-info {
  background: rgba(0, 0, 0, 0.03);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  color: #2d3748;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-row strong {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
}

.info-row i {
  color: #667eea;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  min-width: 350px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 3000;
  animation: toastSlideIn 0.4s ease;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.toast-error .toast-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
}

.toast-warning .toast-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.toast-info .toast-icon {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  color: #718096;
}

.toast-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #2d3748;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Responsive Design */
@media (max-width: 968px) {
  .class-management {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 28px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .data-table {
    min-width: 900px;
  }

  .pagination-section {
    flex-direction: column;
  }

  .toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }

  .modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 16px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .icon-box {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
}
</style>