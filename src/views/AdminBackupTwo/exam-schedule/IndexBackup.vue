<template>
  <div class="exam-management">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Exam Management</h1>
        <p class="page-subtitle">Organize and manage all your examinations</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <i class="fa fa-plus-circle"></i>
        <span>Create New Exam</span>
      </button>
    </div>

    <!-- Filters Card -->
    <div class="filters-card">
      <div class="filters-grid">
        <div class="filter-item">
          <div class="input-group">
            <i class="fa fa-search input-icon"></i>
            <input
                v-model="filters.search"
                type="text"
                class="form-input"
                placeholder="Search exams..."
                @input="debounceSearch"
            />
          </div>
        </div>

        <div class="filter-item">
          <select v-model="filters.status" class="form-select" @change="fetchExams">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" class="form-select" @change="fetchExams">
            <option value="">All Departments</option>
            <option v-for="dept in dropdownData.departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <input v-model="filters.year" type="text" class="form-input" placeholder="Year" @change="fetchExams" />
        </div>

        <div class="filter-item">
          <input v-model="filters.semester" type="text" class="form-input" placeholder="Semester" @change="fetchExams" />
        </div>

        <div class="filter-item">
          <button @click="resetFilters" class="btn btn-outline">
            <i class="fa fa-refresh"></i>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <div class="table-container">
        <table class="data-table">
          <thead>
          <tr>
            <th @click="sortBy('id')" class="sortable">
              <div class="th-content">
                ID
                <i :class="getSortIcon('id')"></i>
              </div>
            </th>
            <th @click="sortBy('title')" class="sortable">
              <div class="th-content">
                Title
                <i :class="getSortIcon('title')"></i>
              </div>
            </th>
            <th>Subject</th>
            <th>Department</th>
            <th @click="sortBy('exam_date')" class="sortable">
              <div class="th-content">
                Date
                <i :class="getSortIcon('exam_date')"></i>
              </div>
            </th>
            <th>Time</th>
            <th>Semester</th>
            <th>Status</th>
            <th class="text-center">Actions</th>
          </tr>
          </thead>
          <tbody v-if="loading">
          <tr>
            <td colspan="9" class="loading-cell">
              <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading exams...</p>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else-if="exams.length === 0">
          <tr>
            <td colspan="9" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-inbox"></i>
                <p>No exams found</p>
                <button @click="openCreateModal" class="btn btn-primary btn-sm">Create First Exam</button>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr v-for="exam in exams" :key="exam.id" class="table-row">
            <td class="font-medium">#{{ exam.id }}</td>
            <td class="font-medium">{{ exam.title }}</td>
            <td>{{ exam.subject ? exam.subject.name : 'N/A' }}</td>
            <td>
                <span class="department-badge">
                  {{ exam.department ? exam.department.name : 'N/A' }}
                </span>
            </td>
            <td>{{ formatDate(exam.exam_date) }}</td>
            <td class="time-cell">{{ formatTime(exam.start_time) }} - {{ formatTime(exam.end_time) }}</td>
            <td>{{ exam.semester }} / {{ exam.year }}</td>
            <td>
                <span :class="getStatusBadgeClass(exam.status)">
                  {{ getStatusText(exam.status) }}
                </span>
            </td>
            <td class="text-center">
              <div class="action-buttons">
                <button @click="viewExam(exam)" class="action-btn btn-view" title="View Details">
                  <i class="fa fa-eye"></i>
                </button>
                <button @click="editExam(exam)" class="action-btn btn-edit" title="Edit">
                  <i class="fa fa-edit"></i>
                </button>
                <button @click="deleteExam(exam.id)" class="action-btn btn-delete" title="Delete">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-section" v-if="pagination.total > 0">
        <div class="pagination-info">
          Showing <span class="font-semibold">{{ pagination.from }}-{{ pagination.to }}</span> of
          <span class="font-semibold">{{ pagination.total }}</span> exams
        </div>
        <div class="pagination-controls">
          <button
              class="pagination-btn"
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <button
              v-for="page in paginationPages"
              :key="page"
              class="pagination-btn"
              :class="{ active: page === pagination.current_page }"
              @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
              class="pagination-btn"
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? 'Edit Exam' : 'Create New Exam' }}</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <!-- Title -->
              <div class="form-group col-span-2">
                <label class="form-label">Title <span class="required">*</span></label>
                <input
                    v-model="form.title"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.title }"
                    placeholder="Enter exam title"
                />
                <span v-if="errors.title" class="error-message">{{ errors.title[0] }}</span>
              </div>

              <!-- Exam Type -->
              <div class="form-group">
                <label class="form-label">Exam Type <span class="required">*</span></label>
                <select
                    v-model="form.exam_type_id"
                    class="form-select"
                    :class="{ 'input-error': errors.exam_type_id }"
                >
                  <option value="">Select Type</option>
                  <option v-for="type in dropdownData.exam_types" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <span v-if="errors.exam_type_id" class="error-message">{{ errors.exam_type_id[0] }}</span>
              </div>

              <!-- Department -->
              <div class="form-group">
                <label class="form-label">Department <span class="required">*</span></label>
                <select
                    v-model="form.department_id"
                    class="form-select"
                    :class="{ 'input-error': errors.department_id }"
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in dropdownData.departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="error-message">{{ errors.department_id[0] }}</span>
              </div>

              <!-- Subject -->
              <div class="form-group">
                <label class="form-label">Subject</label>
                <select v-model="form.subject_id" class="form-select">
                  <option value="">Select Subject</option>
                  <option v-for="subj in dropdownData.subjects" :key="subj.id" :value="subj.id">
                    {{ subj.name }}
                  </option>
                </select>
              </div>

              <!-- Teacher -->
              <div class="form-group">
                <label class="form-label">Teacher <span class="required">*</span></label>
                <select
                    v-model="form.teacher_id"
                    class="form-select"
                    :class="{ 'input-error': errors.teacher_id }"
                >
                  <option value="">Select Teacher</option>
                  <option v-for="teacher in dropdownData.teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }}
                  </option>
                </select>
                <span v-if="errors.teacher_id" class="error-message">{{ errors.teacher_id[0] }}</span>
              </div>

              <!-- Session -->
              <div class="form-group">
                <label class="form-label">Session</label>
                <select v-model="form.session_id" class="form-select">
                  <option value="">Select Session</option>
                  <option v-for="session in dropdownData.sessions" :key="session.id" :value="session.id">
                    {{ session.name }}
                  </option>
                </select>
              </div>

              <!-- Classroom -->
              <div class="form-group">
                <label class="form-label">Classroom</label>
                <select v-model="form.classroom_id" class="form-select">
                  <option value="">Select Classroom</option>
                  <option v-for="room in dropdownData.classrooms" :key="room.id" :value="room.id">
                    {{ room.name }}
                  </option>
                </select>
              </div>

              <!-- Exam Date -->
              <div class="form-group">
                <label class="form-label">Exam Date <span class="required">*</span></label>
                <input
                    v-model="form.exam_date"
                    type="date"
                    class="form-input"
                    :class="{ 'input-error': errors.exam_date }"
                />
                <span v-if="errors.exam_date" class="error-message">{{ errors.exam_date[0] }}</span>
              </div>

              <!-- Start Time -->
              <div class="form-group">
                <label class="form-label">Start Time <span class="required">*</span></label>
                <input
                    v-model="form.start_time"
                    type="time"
                    class="form-input"
                    :class="{ 'input-error': errors.start_time }"
                />
                <span v-if="errors.start_time" class="error-message">{{ errors.start_time[0] }}</span>
              </div>

              <!-- End Time -->
              <div class="form-group">
                <label class="form-label">End Time <span class="required">*</span></label>
                <input
                    v-model="form.end_time"
                    type="time"
                    class="form-input"
                    :class="{ 'input-error': errors.end_time }"
                />
                <span v-if="errors.end_time" class="error-message">{{ errors.end_time[0] }}</span>
              </div>

              <!-- Duration -->
              <div class="form-group">
                <label class="form-label">Duration (minutes) <span class="required">*</span></label>
                <input
                    v-model="form.duration_minutes"
                    type="number"
                    class="form-input"
                    :class="{ 'input-error': errors.duration_minutes }"
                    placeholder="120"
                />
                <span v-if="errors.duration_minutes" class="error-message">{{ errors.duration_minutes[0] }}</span>
              </div>

              <!-- Total Marks -->
              <div class="form-group">
                <label class="form-label">Total Marks</label>
                <input
                    v-model="form.total_marks"
                    type="number"
                    class="form-input"
                    placeholder="100"
                />
              </div>

              <!-- Pass Marks -->
              <div class="form-group">
                <label class="form-label">Pass Marks</label>
                <input
                    v-model="form.pass_marks"
                    type="number"
                    class="form-input"
                    placeholder="40"
                    :class="{ 'input-error': errors.pass_marks }"
                />
                <span v-if="errors.pass_marks" class="error-message">{{ errors.pass_marks[0] }}</span>
              </div>

              <!-- Semester -->
              <div class="form-group">
                <label class="form-label">Semester <span class="required">*</span></label>
                <input
                    v-model="form.semester"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.semester }"
                    placeholder="1st"
                />
                <span v-if="errors.semester" class="error-message">{{ errors.semester[0] }}</span>
              </div>

              <!-- Year -->
              <div class="form-group">
                <label class="form-label">Year <span class="required">*</span></label>
                <input
                    v-model="form.year"
                    type="text"
                    class="form-input"
                    :class="{ 'input-error': errors.year }"
                    placeholder="2025"
                />
                <span v-if="errors.year" class="error-message">{{ errors.year[0] }}</span>
              </div>

              <!-- Status -->
              <div class="form-group">
                <label class="form-label">Status <span class="required">*</span></label>
                <select v-model="form.status" class="form-select">
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <!-- Instructions -->
              <div class="form-group col-span-2">
                <label class="form-label">Instructions</label>
                <textarea
                    v-model="form.instructions"
                    class="form-textarea"
                    rows="3"
                    placeholder="Enter any special instructions for the exam..."
                ></textarea>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <i v-if="submitting" class="fa fa-spinner fa-spin"></i>
                <span v-else>{{ isEditing ? 'Update Exam' : 'Create Exam' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-container view-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Exam Details</h3>
          <button class="modal-close" @click="closeViewModal">
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="modal-body" v-if="selectedExam">
          <div class="exam-details-grid">
            <div class="detail-item">
              <label>Title</label>
              <p class="detail-value">{{ selectedExam.title }}</p>
            </div>

            <div class="detail-item">
              <label>Subject</label>
              <p class="detail-value">{{ selectedExam.subject ? selectedExam.subject.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Exam Type</label>
              <p class="detail-value">{{ selectedExam.exam_type ? selectedExam.exam_type.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Teacher</label>
              <p class="detail-value">{{ selectedExam.teacher ? selectedExam.teacher.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Department</label>
              <p class="detail-value">{{ selectedExam.department ? selectedExam.department.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Session</label>
              <p class="detail-value">{{ selectedExam.session ? selectedExam.session.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Date</label>
              <p class="detail-value">{{ formatDate(selectedExam.exam_date) }}</p>
            </div>

            <div class="detail-item">
              <label>Time</label>
              <p class="detail-value">{{ formatTime(selectedExam.start_time) }} - {{ formatTime(selectedExam.end_time) }}</p>
            </div>

            <div class="detail-item">
              <label>Duration</label>
              <p class="detail-value">{{ selectedExam.duration_minutes }} minutes</p>
            </div>

            <div class="detail-item">
              <label>Classroom</label>
              <p class="detail-value">{{ selectedExam.classroom ? selectedExam.classroom.name : 'N/A' }}</p>
            </div>

            <div class="detail-item">
              <label>Total Marks</label>
              <p class="detail-value">{{ selectedExam.total_marks }}</p>
            </div>

            <div class="detail-item">
              <label>Pass Marks</label>
              <p class="detail-value">{{ selectedExam.pass_marks }}</p>
            </div>

            <div class="detail-item">
              <label>Semester / Year</label>
              <p class="detail-value">{{ selectedExam.semester }} / {{ selectedExam.year }}</p>
            </div>

            <div class="detail-item">
              <label>Status</label>
              <p class="detail-value">
                <span :class="getStatusBadgeClass(selectedExam.status)">
                  {{ getStatusText(selectedExam.status) }}
                </span>
              </p>
            </div>

            <div class="detail-item col-span-2" v-if="selectedExam.instructions">
              <label>Instructions</label>
              <p class="detail-value instruction-text">{{ selectedExam.instructions }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamManagement',

  data() {
    return {
      exams: [],
      dropdownData: {
        subjects: [],
        exam_types: [],
        teachers: [],
        sessions: [],
        departments: [],
        classrooms: []
      },
      filters: {
        search: '',
        status: '',
        department_id: '',
        year: '',
        semester: '',
        sort_by: 'exam_date',
        sort_order: 'desc'
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      },
      showModal: false,
      showViewModal: false,
      isEditing: false,
      selectedExam: null,
      form: this.getEmptyForm(),
      errors: {},
      loading: false,
      submitting: false,
      searchTimeout: null
    };
  },

  computed: {
    paginationPages() {
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
    }
  },

  mounted() {
    this.fetchExams();
    this.fetchDropdownData();
  },

  methods: {
    async fetchExams() {
      this.loading = true;
      try {
        const params = {
          ...this.filters,
          page: this.pagination.current_page,
          per_page: this.pagination.per_page
        };
        const response = await this.$api.get('/exams', { params });
        this.exams = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        };
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDropdownData() {
      try {
        const response = await this.$api.get('/exams-dropdown-data');
        this.dropdownData = response.data;
      } catch (error) {
        console.error('Dropdown data fetch error:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.fetchExams();
      }, 500);
    },

    sortBy(field) {
      if (this.filters.sort_by === field) {
        this.filters.sort_order = this.filters.sort_order === 'asc' ? 'desc' : 'asc';
      } else {
        this.filters.sort_by = field;
        this.filters.sort_order = 'asc';
      }
      this.fetchExams();
    },

    getSortIcon(field) {
      if (this.filters.sort_by !== field) return 'fa fa-sort';
      return this.filters.sort_order === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchExams();
      }
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: '',
        department_id: '',
        year: '',
        semester: '',
        sort_by: 'exam_date',
        sort_order: 'desc'
      };
      this.pagination.current_page = 1;
      this.fetchExams();
    },

    openCreateModal() {
      this.isEditing = false;
      this.form = this.getEmptyForm();
      this.errors = {};
      this.showModal = true;
    },

    editExam(exam) {
      this.isEditing = true;
      this.form = {
        id: exam.id,
        subject_id: exam.subject_id || '',
        exam_type_id: exam.exam_type_id,
        teacher_id: exam.teacher_id,
        session_id: exam.session_id || '',
        department_id: exam.department_id,
        title: exam.title,
        exam_date: exam.exam_date,
        start_time: exam.start_time,
        end_time: exam.end_time,
        duration_minutes: exam.duration_minutes,
        classroom_id: exam.classroom_id || '',
        total_marks: exam.total_marks,
        pass_marks: exam.pass_marks,
        instructions: exam.instructions || '',
        semester: exam.semester,
        year: exam.year,
        status: exam.status
      };
      this.errors = {};
      this.showModal = true;
    },

    viewExam(exam) {
      this.selectedExam = exam;
      this.showViewModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.form = this.getEmptyForm();
      this.errors = {};
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedExam = null;
    },

    async submitForm() {
      this.submitting = true;
      this.errors = {};
      try {
        const formData = { ...this.form };
        if (!formData.subject_id) formData.subject_id = null;
        if (!formData.session_id) formData.session_id = null;
        if (!formData.classroom_id) formData.classroom_id = null;
        if (this.isEditing) {
          await this.$api.put(`/exams/${this.form.id}`, formData);
        } else {
          await this.$api.post('/exams', formData);
        }
        this.closeModal();
        this.fetchExams();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
        console.error(error);
      } finally {
        this.submitting = false;
      }
    },

    async deleteExam(id) {
      if (!confirm('Are you sure you want to delete this exam?')) {
        return;
      }
      try {
        await this.$api.delete(`/exams/${id}`);
        this.fetchExams();
      } catch (error) {
        console.error(error);
      }
    },

    getEmptyForm() {
      return {
        subject_id: '',
        exam_type_id: '',
        teacher_id: '',
        session_id: '',
        department_id: '',
        title: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        duration_minutes: '',
        classroom_id: '',
        total_marks: 100,
        pass_marks: 40,
        instructions: '',
        semester: '',
        year: '',
        status: 'scheduled'
      };
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    formatTime(time) {
      if (!time) return 'N/A';
      return new Date('1970-01-01T' + time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },

    getStatusText(status) {
      const statusMap = {
        scheduled: 'Scheduled',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled'
      };
      return statusMap[status] || status;
    },

    getStatusBadgeClass(status) {
      return `status-badge status-${status}`;
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.exam-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  color: white;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

/* Filters Card */
.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filter-item {
  position: relative;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.form-input, .form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.input-group .form-input {
  padding-left: 42px;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239ca3af' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-outline {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Table Card */
.table-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.data-table thead th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: white;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.data-table tbody td {
  padding: 16px;
  font-size: 14px;
  color: #374151;
}

.font-medium {
  font-weight: 500;
  color: #1f2937;
}

.font-semibold {
  font-weight: 600;
}

.time-cell {
  white-space: nowrap;
  font-size: 13px;
}

.department-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-scheduled {
  background: #dbeafe;
  color: #1e40af;
}

.status-ongoing {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-view:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
}

.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-edit:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-2px);
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

/* Loading & Empty States */
.loading-cell, .empty-cell {
  padding: 60px 20px !important;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #6b7280;
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-state i {
  font-size: 48px;
  color: #d1d5db;
}

.empty-state p {
  color: #6b7280;
  font-size: 16px;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 6px;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  background: #f5f7ff;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.view-modal {
  max-width: 700px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  color: #6b7280;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  border-top: 1px solid #e5e7eb;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-span-2 {
  grid-column: span 2;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-error {
  border-color: #ef4444 !important;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
}

/* Exam Details Grid */
.exam-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
}

.instruction-text {
  line-height: 1.6;
  color: #4b5563;
}

.text-center {
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .col-span-2 {
    grid-column: span 1;
  }

  .exam-details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .exam-management {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .filters-card {
    padding: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .data-table {
    font-size: 13px;
  }

  .data-table thead th,
  .data-table tbody td {
    padding: 12px 8px;
  }

  .pagination-section {
    flex-direction: column;
    text-align: center;
  }

  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }

  .action-btn {
    width: 100%;
  }

  .modal-overlay {
    padding: 10px;
  }
}
</style>