<template>
  <div class="teacher-management">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-chalkboard-teacher"></i>
          </div>
          <div>
            <h1>Teacher Management</h1>
            <p class="subtitle">Manage teachers and their information</p>
          </div>
        </div>
        <button @click="openAddModal" class="btn-add">
          <i class="fa fa-plus-circle"></i>
          <span>Add New Teacher</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-chalkboard-teacher"></i>
        </div>
        <div class="stat-info">
          <h3>{{ pagination.total }}</h3>
          <p>Total Teachers</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-user-tie"></i>
        </div>
        <div class="stat-info">
          <h3>{{ departmentHeadsCount }}</h3>
          <p>Department Heads</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fa fa-building"></i>
        </div>
        <div class="stat-info">
          <h3>{{ uniqueDepartmentsCount }}</h3>
          <p>Departments</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fa fa-certificate"></i>
        </div>
        <div class="stat-info">
          <h3>{{ qualifiedTeachersCount }}</h3>
          <p>Qualified Teachers</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fa fa-search search-icon"></i>
        <input
            v-model="filters.search"
            @input="searchTeachers"
            type="text"
            placeholder="Search by name, email, mobile or BMDC number..."
            class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-building"></i> Department</label>
          <select v-model="filters.department_id" @change="fetchTeachers" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-id-badge"></i> Designation</label>
          <select v-model="filters.designation_id" @change="fetchTeachers" class="filter-select">
            <option value="">All Designations</option>
            <option v-for="des in designations" :key="des.id" :value="des.id">
              {{ des.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-crown"></i> Head Status</label>
          <select v-model="filters.is_head" @change="fetchTeachers" class="filter-select">
            <option value="">All Status</option>
            <option value="1">Department Head</option>
            <option value="0">Regular Teacher</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modern Table -->
    <div class="table-card" >
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-hashtag"></i> ID</th>
            <th><i class="fa fa-id-card"></i> BMDC No</th>
            <th><i class="fa fa-user"></i> Name</th>
            <th><i class="fa fa-envelope"></i> Email</th>
            <th><i class="fa fa-mobile-alt"></i> Mobile</th>
            <th><i class="fa fa-building"></i> Department</th>
            <th><i class="fa fa-id-badge"></i> Designation</th>
            <th><i class="fa fa-crown"></i> Head</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="11" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading teachers...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="teachers.length === 0">
            <td colspan="11" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-user-slash"></i>
                <p>No teachers found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="teacher in teachers" :key="teacher.id" class="table-row">
            <td><span class="id-badge">{{ teacher.id }}</span></td>
            <td><span class="bmdc-code">{{ teacher.BMDC_NO }}</span></td>
            <td>
              <div class="teacher-name-cell">
                <span class="name">{{ teacher.name }}</span>
              </div>
            </td>
            <td>
              <span class="email">
                <i class="fa fa-envelope"></i> {{ teacher.email }}
              </span>
            </td>
            <td>
              <span class="mobile">
                <i class="fa fa-phone"></i> {{ teacher.mobile }}
              </span>
            </td>
            <td>
              <span class="dept-badge">
                {{ teacher.department ? teacher.department.name : 'N/A' }}
              </span>
            </td>
            <td>
              <span class="designation-badge">
                {{ teacher.designation ? teacher.designation.name : 'N/A' }}
              </span>
            </td>
            <td>
              <button
                  @click="toggleHead(teacher)"
                  :class="['head-toggle', teacher.is_head ? 'is-head' : 'not-head']"
                  :title="'Click to ' + (teacher.is_head ? 'remove as head' : 'make head')"
              >
                <i :class="teacher.is_head ? 'fa fa-crown' : 'fa fa-user'"></i>
                {{ teacher.is_head ? 'Head' : 'Teacher' }}
              </button>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editTeacher(teacher)" class="btn-action btn-edit" title="Edit">
                  <i class="fa fa-edit"></i>
                </button>
                <button @click="deleteTeacher(teacher)" class="btn-action btn-delete" title="Delete">
                  <i class="fa fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination -->
      <div class="pagination-wrapper" v-if="pagination.last_page > 1">
        <div class="pagination-info">
          Showing {{ ((pagination.current_page - 1) * filters.per_page) + 1 }} to
          {{ Math.min(pagination.current_page * filters.per_page, pagination.total) }}
          of {{ pagination.total }} teachers
        </div>
        <div class="pagination-controls">
          <button
              @click="changePage(1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
              title="First Page"
          >
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
          >
            <i class="fa fa-angle-left"></i>
          </button>

          <div class="page-numbers">
            <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                :class="['page-number', { active: page === pagination.current_page }]"
            >
              {{ page }}
            </button>
          </div>

          <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
          >
            <i class="fa fa-angle-right"></i>
          </button>
          <button
              @click="changePage(pagination.last_page)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
              title="Last Page"
          >
            <i class="fa fa-angle-double-right"></i>
          </button>
        </div>
        <div class="per-page-selector">
          <select v-model="filters.per_page" @change="fetchTeachers" class="per-page-select">
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modern Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title">
              <i :class="isEditing ? 'fa fa-user-edit' : 'fa fa-user-plus'"></i>
              <h2>{{ isEditing ? 'Edit Teacher' : 'Create New Teacher' }}</h2>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveTeacher" class="modal-form">
            <div class="form-grid">
              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-user"></i>
                  Select User <span class="required">*</span>
                </label>
                <select
                    v-model="form.user_id"
                    class="field-select"
                    :class="{ 'error': errors.user_id }"
                    required
                >
                  <option value="">Select user</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.login_code }})
                  </option>
                </select>
                <span v-if="errors.user_id" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.user_id[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-id-card"></i>
                  BMDC Number <span class="required">*</span>
                </label>
                <input
                    v-model="form.BMDC_NO"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.BMDC_NO }"
                    placeholder="Enter BMDC number"
                    required
                />
                <span v-if="errors.BMDC_NO" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.BMDC_NO[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-user"></i>
                  Full Name <span class="required">*</span>
                </label>
                <input
                    v-model="form.name"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.name }"
                    placeholder="Enter full name"
                    required
                />
                <span v-if="errors.name" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.name[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-envelope"></i>
                  Email Address <span class="required">*</span>
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    class="field-input"
                    :class="{ 'error': errors.email }"
                    placeholder="Enter email address"
                    required
                />
                <span v-if="errors.email" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.email[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-mobile-alt"></i>
                  Mobile Number <span class="required">*</span>
                </label>
                <input
                    v-model="form.mobile"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.mobile }"
                    placeholder="Enter mobile number"
                    required
                />
                <span v-if="errors.mobile" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.mobile[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-building"></i>
                  Department
                </label>
                <select
                    v-model="form.department_id"
                    class="field-select"
                    :class="{ 'error': errors.department_id }"
                >
                  <option value="">Select department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.department_id[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-id-badge"></i>
                  Designation
                </label>
                <select
                    v-model="form.designation_id"
                    class="field-select"
                    :class="{ 'error': errors.designation_id }"
                >
                  <option value="">Select designation</option>
                  <option v-for="des in designations" :key="des.id" :value="des.id">
                    {{ des.name }}
                  </option>
                </select>
                <span v-if="errors.designation_id" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.designation_id[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-graduation-cap"></i>
                  Qualification <span class="required">*</span>
                </label>
                <input
                    v-model="form.qualification"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.qualification }"
                    placeholder="Enter qualification (e.g., MBBS, PhD)"
                    required
                />
                <span v-if="errors.qualification" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.qualification[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-calendar-alt"></i>
                  Joining Date <span class="required">*</span>
                </label>
                <input
                    v-model="form.joining_date"
                    type="date"
                    class="field-input"
                    :class="{ 'error': errors.joining_date }"
                    required
                />
                <span v-if="errors.joining_date" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.joining_date[0] }}
                </span>
              </div>

              <div class="form-field full-width">
                <label class="checkbox-wrapper">
                  <input v-model="form.is_head" type="checkbox" class="checkbox-input" />
                  <span class="checkbox-label">
                    <i class="fa fa-crown"></i>
                    Mark as Department Head
                  </span>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="btn-submit" :disabled="saving">
                <i :class="saving ? 'fa fa-spinner fa-spin' : (isEditing ? 'fa fa-save' : 'fa fa-plus-circle')"></i>
                {{ saving ? 'Saving...' : (isEditing ? 'Update Teacher' : 'Create Teacher') }}
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
  name: 'TeacherManagement',
  data() {
    return {
      teachers: [],
      departments: [],
      designations: [],
      users: [],
      loading: false,
      saving: false,
      showModal: false,
      isEditing: false,
      filters: {
        search: '',
        department_id: '',
        designation_id: '',
        is_head: '',
        per_page: 10,
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
      form: {
        id: null,
        user_id: '',
        BMDC_NO: '',
        name: '',
        email: '',
        mobile: '',
        department_id: '',
        designation_id: '',
        qualification: '',
        joining_date: '',
        is_head: false,
      },
      errors: {},
      searchTimeout: null,
    };
  },
  computed: {
    departmentHeadsCount() {
      return this.teachers.filter(t => t.is_head).length;
    },
    uniqueDepartmentsCount() {
      const depts = new Set(this.teachers.filter(t => t.department_id).map(t => t.department_id));
      return depts.size;
    },
    qualifiedTeachersCount() {
      return this.teachers.filter(t => t.qualification && t.qualification.trim() !== '').length;
    },
    visiblePages() {
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;
      const delta = 2;
      const pages = [];

      for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
        pages.push(i);
      }

      if (current - delta > 2) {
        pages.unshift('...');
      }
      if (current + delta < last - 1) {
        pages.push('...');
      }

      pages.unshift(1);
      if (last > 1) pages.push(last);

      return pages;
    }
  },
  mounted() {
    this.fetchTeachers();
    this.fetchDepartments();
    this.fetchDesignations();
    this.fetchUsers();
  },
  methods: {
    async fetchTeachers(page = 1) {
      this.loading = true;
      try {
        const params = {
          page: page,
          per_page: this.filters.per_page,
          search: this.filters.search,
          department_id: this.filters.department_id,
          designation_id: this.filters.designation_id,
          is_head: this.filters.is_head,
        };

        const response = await this.$api.get('/teachers', { params });
        this.teachers = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        };
      } catch (error) {
        console.error('Error fetching teachers:', error);
        alert('Failed to fetch teachers');
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    async fetchDesignations() {
      try {
        const response = await this.$api.get('/designations');
        this.designations = response.data;
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    },

    async fetchUsers() {
      try {
        const response = await this.$api.get('/teacher-users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    searchTeachers() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchTeachers();
      }, 500);
    },

    changePage(page) {
      if (page !== '...' && page >= 1 && page <= this.pagination.last_page) {
        this.fetchTeachers(page);
      }
    },

    openAddModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    editTeacher(teacher) {
      this.isEditing = true;
      this.form = {
        id: teacher.id,
        user_id: teacher.user_id,
        BMDC_NO: teacher.BMDC_NO,
        name: teacher.name,
        email: teacher.email,
        mobile: teacher.mobile,
        department_id: teacher.department_id || '',
        designation_id: teacher.designation_id || '',
        qualification: teacher.qualification,
        joining_date: teacher.joining_date,
        is_head: teacher.is_head,
      };
      this.showModal = true;
    },

    async saveTeacher() {
      this.saving = true;
      this.errors = {};

      try {
        const data = {
          user_id: this.form.user_id,
          BMDC_NO: this.form.BMDC_NO,
          name: this.form.name,
          email: this.form.email,
          mobile: this.form.mobile,
          department_id: this.form.department_id || null,
          designation_id: this.form.designation_id || null,
          qualification: this.form.qualification,
          joining_date: this.form.joining_date,
          is_head: this.form.is_head ? 1 : 0,
        };

        if (this.isEditing) {
          await this.$api.put(`/teachers/${this.form.id}`, data);
          //alert('Teacher updated successfully!');
        } else {
          await this.$api.post('/teachers', data);
          alert('Teacher created successfully!');
        }

        this.closeModal();
        this.fetchTeachers(this.pagination.current_page);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          alert('An error occurred. Please try again.');
        }
      } finally {
        this.saving = false;
      }
    },

    async toggleHead(teacher) {
      const action = teacher.is_head ? 'remove as department head' : 'make department head';
      if (confirm(`Are you sure you want to ${action} for ${teacher.name}?`)) {
        try {
          await this.$api.post(`/teachers/${teacher.id}/toggle-head`);
          alert('Teacher head status updated successfully!');
          this.fetchTeachers(this.pagination.current_page);
        } catch (error) {
          console.error('Error toggling head status:', error);
          alert('Failed to update teacher head status');
        }
      }
    },

    async deleteTeacher(teacher) {
      if (confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
        try {
          await this.$api.delete(`/teachers/${teacher.id}`);
          alert('Teacher deleted successfully!');
          this.fetchTeachers(this.pagination.current_page);
        } catch (error) {
          console.error('Error deleting teacher:', error);
          alert('Failed to delete teacher');
        }
      }
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        id: null,
        user_id: '',
        BMDC_NO: '',
        name: '',
        email: '',
        mobile: '',
        department_id: '',
        designation_id: '',
        qualification: '',
        joining_date: '',
        is_head: false,
      };
      this.errors = {};
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return dateString;
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.teacher-management {
  min-height: 100vh;
  background: white;
  padding: 30px 20px;
}

.header-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
}

.title-section h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
}

.subtitle {
  margin: 5px 0 0 0;
  color: #718096;
  font-size: 14px;
}

.btn-add {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
}

.stat-icon.blue { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.stat-icon.green { background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%); }
.stat-icon.orange { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.purple { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.stat-info h3 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
}

.stat-info p {
  margin: 5px 0 0 0;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.filters-section {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.search-input:focus {
  outline: none;
  border-color: #11998e;
  background: white;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filter-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
}

.filter-item label i {
  margin-right: 6px;
  color: #11998e;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #11998e;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

.table-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
}

.modern-table thead {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.modern-table th {
  padding: 6px 10px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: white;
  /* text-transform: uppercase; */
  /* letter-spacing: 0.5px; */
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody tr:hover {
  background: #f7fafc;
  transform: scale(1.01);
}

.modern-table td {
  padding: 16px;
  font-size: 14px;
  color: #4a5568;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 60px 20px !important;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #11998e;
}

.loading-spinner i {
  font-size: 36px;
}

.loading-spinner span {
  font-size: 16px;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #a0aec0;
}

.empty-state i {
  font-size: 48px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

.id-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}

.bmdc-code {
  font-family: 'Courier New', monospace;
  background: #e6fffa;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  color: #11998e;
  font-size: 13px;
}

.teacher-name-cell .name {
  font-weight: 600;
  color: #2d3748;
}

.email,
.mobile {
  color: #4a5568;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.email i,
.mobile i {
  color: #11998e;
}

.dept-badge,
.designation-badge {
  background: #f7fafc;
  color: #4a5568;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  display: inline-block;
}

.qualification {
  font-size: 13px;
  color: #4a5568;
}

.date-time {
  font-size: 13px;
  color: #718096;
}

.head-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.head-toggle.is-head {
  background: #fef5e7;
  color: #f39c12;
}

.head-toggle.not-head {
  background: #e8f5e9;
  color: #4caf50;
}

.head-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #bee3f8;
  color: #2c5282;
}

.btn-edit:hover {
  background: #90cdf4;
  transform: scale(1.1);
}

.btn-delete {
  background: #fed7d7;
  color: #c53030;
}

.btn-delete:hover {
  background: #fc8181;
  transform: scale(1.1);
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn,
.page-number {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled),
.page-number:hover {
  border-color: #11998e;
  color: #11998e;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  border-color: transparent;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.per-page-select {
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  background: white;
  cursor: pointer;
  color: #4a5568;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s ease;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-title i {
  font-size: 28px;
  color: #11998e;
}

.modal-title h2 {
  margin: 0;
  font-size: 24px;
  color: #2d3748;
  font-weight: 700;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #718096;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #cbd5e0;
  color: #2d3748;
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.field-label i {
  margin-right: 8px;
  color: #11998e;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.field-input,
.field-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #11998e;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

.field-input.error,
.field-select.error {
  border-color: #fc8181;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #e53e3e;
  font-size: 12px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #11998e;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.checkbox-label i {
  color: #f39c12;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-submit {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-submit {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .teacher-management {
    padding: 20px 15px;
  }
  .header-section {
    padding: 20px;
  }
  .title-section h1 {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .btn-add {
    width: 100%;
    justify-content: center;
  }
  .stats-cards {
    grid-template-columns: 1fr;
  }
  .filter-group {
    grid-template-columns: 1fr;
  }
  .table-card {
    margin: 0 -20px;
    border-radius: 0;
  }
  .modern-table {
    font-size: 12px;
  }
  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .pagination-wrapper {
    flex-direction: column;
  }
  .modal-actions {
    flex-direction: column-reverse;
  }
  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .teacher-management {
    padding: 15px 10px;
  }
  .title-section h1 {
    font-size: 22px;
  }
  .stat-card {
    padding: 15px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
  .btn-action {
    width: 30px;
    height: 30px;
  }
}

html {
  scroll-behavior: smooth;
}

.table-wrapper::-webkit-scrollbar,
.modal-container::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.table-wrapper::-webkit-scrollbar-track,
.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb,
.modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover,
.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>