<template>
  <div class="user-management">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-users"></i>
          </div>
          <div>
            <h1>User Management</h1>
            <p class="subtitle">Manage your users and their permissions</p>
          </div>
        </div>
        <button @click="openAddModal" class="btn-add">
          <i class="fa fa-plus-circle"></i>
          <span>Add New User</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-users"></i>
        </div>
        <div class="stat-info">
          <h3>{{ pagination.total }}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ activeUsersCount }}</h3>
          <p>Active Users</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <i class="fa fa-user-graduate"></i>
        </div>
        <div class="stat-info">
          <h3>{{ studentsCount }}</h3>
          <p>Students</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i class="fa fa-chalkboard-teacher"></i>
        </div>
        <div class="stat-info">
          <h3>{{ teachersCount }}</h3>
          <p>Teachers</p>
        </div>
      </div>
    </div>

    <!-- Filters Section with Modern Design -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fa fa-search search-icon"></i>
        <input
            v-model="filters.search"
            @input="searchUsers"
            type="text"
            placeholder="Search by name, login code or mobile..."
            class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-toggle-on"></i> Status</label>
          <select v-model="filters.status" @change="fetchUsers" class="filter-select">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-user-tag"></i> User Type</label>
          <select v-model="filters.user_type" @change="fetchUsers" class="filter-select">
            <option value="">All Types</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="dept_head">Dept Head</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-shield-alt"></i> Role</label>
          <select v-model="filters.role_id" @change="fetchUsers" class="filter-select">
            <option value="">All Roles</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modern Table -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-hashtag"></i> ID</th>
<!--            <th><i class="fa fa-image"></i> Avatar</th>-->
            <th><i class="fa fa-key"></i> Login Code</th>
            <th><i class="fa fa-user"></i> Name</th>
            <th><i class="fa fa-mobile-alt"></i> Mobile</th>
            <th><i class="fa fa-user-tag"></i> Type</th>
            <th><i class="fa fa-shield-alt"></i> Role</th>
            <th><i class="fa fa-toggle-on"></i> Status</th>
            <th><i class="fa fa-clock"></i> Last Login</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="10" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading users...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="!users || users.length === 0">
            <td colspan="10" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-users-slash"></i>
                <p>No users found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="user in users" :key="user.id" class="table-row">
            <td><span class="id-badge">{{ user.id }}</span></td>
<!--            <td>-->
<!--              <div class="avatar-wrapper">-->
<!--                <img-->
<!--                    :src="user.avatar ? '/' + user.avatar : '/default-avatar.png'"-->
<!--                    :alt="user.name"-->
<!--                    class="user-avatar"-->
<!--                    @error="setDefaultAvatar"-->
<!--                />-->
<!--                <span v-if="user.is_active" class="online-indicator"></span>-->
<!--              </div>-->
<!--            </td>-->
            <td><span class="login-code">{{ user.login_code }}</span></td>
            <td>
              <div class="user-name-cell">
                <span class="name">{{ user.name }}</span>
              </div>
            </td>
            <td>
              <span class="mobile" v-if="user.mobile">
                <i class="fa fa-phone"></i> {{ user.mobile }}
              </span>
              <span v-else class="text-muted">No mobile</span>
            </td>
            <td>
              <span :class="['type-badge', 'type-' + user.user_type]">
                <i :class="getUserTypeIcon(user.user_type)"></i>
                {{ formatUserType(user.user_type) }}
              </span>
            </td>
            <td>
              <span class="role-badge">{{ user.role ? user.role.name : 'N/A' }}</span>
            </td>
            <td>
              <button
                  @click="toggleStatus(user)"
                  :class="['status-toggle', user.is_active ? 'active' : 'inactive']"
                  :title="'Click to ' + (user.is_active ? 'deactivate' : 'activate')"
              >
                <i :class="user.is_active ? 'fa fa-check-circle' : 'fa fa-times-circle'"></i>
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td>
              <span class="date-time">{{ formatDate(user.last_login_at) }}</span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editUser(user)" class="btn-action btn-edit" title="Edit">
                  <i class="fa fa-edit"></i>
                </button>
                <button @click="deleteUser(user)" class="btn-action btn-delete" title="Delete">
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
          of {{ pagination.total }} users
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
          <select v-model="filters.per_page" @change="fetchUsers" class="per-page-select">
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
              <h2>{{ isEditing ? 'Edit User' : 'Create New User' }}</h2>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveUser" class="modal-form">
            <div class="form-grid">
              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-key"></i>
                  Login Code <span class="required">*</span>
                </label>
                <input
                    v-model="form.login_code"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.login_code }"
                    placeholder="Enter login code"
                    required
                />
                <span v-if="errors.login_code" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.login_code[0] }}
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
                  <i class="fa fa-mobile-alt"></i>
                  Mobile Number
                </label>
                <input
                    v-model="form.mobile"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.mobile }"
                    placeholder="Enter mobile number"
                />
                <span v-if="errors.mobile" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.mobile[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-lock"></i>
                  Password <span class="required" v-if="!isEditing">*</span>
                  <span v-if="isEditing" class="optional">(Leave blank to keep current)</span>
                </label>
                <input
                    v-model="form.password"
                    type="password"
                    class="field-input"
                    :class="{ 'error': errors.password }"
                    placeholder="Enter password"
                    :required="!isEditing"
                />
                <span v-if="errors.password" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.password[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-user-tag"></i>
                  User Type <span class="required">*</span>
                </label>
                <select
                    v-model="form.user_type"
                    class="field-select"
                    :class="{ 'error': errors.user_type }"
                    required
                >
                  <option value="">Select user type</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                  <option value="dept_head">Department Head</option>
                </select>
                <span v-if="errors.user_type" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.user_type[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-shield-alt"></i>
                  Role <span class="required">*</span>
                </label>
                <select
                    v-model="form.role_id"
                    class="field-select"
                    :class="{ 'error': errors.role_id }"
                    required
                >
                  <option value="">Select role</option>
                  <option v-for="role in roles" :key="role.id" :value="role.id">
                    {{ role.name }}
                  </option>
                </select>
                <span v-if="errors.role_id" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.role_id[0] }}
                </span>
              </div>
            </div>

            <div class="form-field full-width">
              <label class="field-label">
                <i class="fa fa-image"></i>
                Profile Avatar
              </label>
              <div class="file-upload-wrapper">
                <input
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="file-input"
                    id="avatar-upload"
                />
                <label for="avatar-upload" class="file-label">
                  <i class="fa fa-cloud-upload-alt"></i>
                  <span>Choose image or drag here</span>
                </label>
              </div>
              <span v-if="errors.avatar" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.avatar[0] }}
              </span>

              <div v-if="avatarPreview || (isEditing && form.avatar)" class="image-preview">
                <img :src="avatarPreview || '/' + form.avatar" alt="Avatar Preview" />
                <button type="button" @click="removeAvatar" class="remove-image">
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>

            <div class="checkbox-group">
              <label class="checkbox-wrapper">
                <input v-model="form.is_active" type="checkbox" class="checkbox-input" />
                <span class="checkbox-label">
                  <i class="fa fa-check-circle"></i>
                  Active User
                </span>
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                Cancel
              </button>
              <button type="submit" class="btn-submit" :disabled="saving">
                <i :class="saving ? 'fa fa-spinner fa-spin' : (isEditing ? 'fa fa-save' : 'fa fa-plus-circle')"></i>
                {{ saving ? 'Saving...' : (isEditing ? 'Update User' : 'Create User') }}
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
  name: 'UserManagement',
  data() {
    return {
      users: [],
      roles: [],
      loading: false,
      saving: false,
      showModal: false,
      isEditing: false,
      filters: {
        search: '',
        status: '',
        user_type: '',
        role_id: '',
        per_page: 10,
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
      },
      form: {
        id: null,
        login_code: '',
        name: '',
        password: '',
        mobile: '',
        role_id: '',
        user_type: '',
        avatar: null,
        is_active: true,
      },
      avatarFile: null,
      avatarPreview: null,
      errors: {},
      searchTimeout: null,
    };
  },
  computed: {
    activeUsersCount() {
      return (this.users || []).filter(u => u.is_active).length;
    },
    studentsCount() {
      return (this.users || []).filter(u => u.user_type === 'student').length;
    },
    teachersCount() {
      return (this.users || []).filter(u => u.user_type === 'teacher').length;
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
    this.fetchUsers();
    this.fetchRoles();
  },
  methods: {
    async fetchUsers(page = 1) {
      this.loading = true;
      try {
        const params = {
          page: page,
          per_page: this.filters.per_page,
          search: this.filters.search,
          status: this.filters.status,
          user_type: this.filters.user_type,
          role_id: this.filters.role_id,
        };

        const response = await this.$api.get('/users', { params });
        this.users = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          total: response.data.total,
        };
      } catch (error) {
        console.error('Error fetching users:', error);
        this.showToast('Failed to fetch users', 'error')
      } finally {
        this.loading = false;
      }
    },

    async fetchRoles() {
      try {
        const response = await this.$api.get('/roles');
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },

    searchUsers() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchUsers();
      }, 500);
    },

    changePage(page) {
      if (page !== '...' && page >= 1 && page <= this.pagination.last_page) {
        this.fetchUsers(page);
      }
    },

    openAddModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    editUser(user) {
      this.isEditing = true;
      this.form = {
        id: user.id,
        login_code: user.login_code,
        name: user.name,
        password: '',
        mobile: user.mobile || '',
        role_id: user.role_id,
        user_type: user.user_type,
        avatar: user.avatar,
        is_active: user.is_active,
      };
      this.avatarPreview = null;
      this.avatarFile = null;
      this.showModal = true;
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.avatarFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.avatarPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removeAvatar() {
      this.avatarFile = null;
      this.avatarPreview = null;
      this.form.avatar = null;
      document.getElementById('avatar-upload').value = '';
    },

    async saveUser() {
      this.saving = true;
      this.errors = {};

      try {
        const formData = new FormData();
        formData.append('login_code', this.form.login_code);
        formData.append('name', this.form.name);
        formData.append('mobile', this.form.mobile || '');
        formData.append('role_id', this.form.role_id);
        formData.append('user_type', this.form.user_type);
        formData.append('is_active', this.form.is_active ? 1 : 0);

        if (this.form.password) {
          formData.append('password', this.form.password);
        }

        if (this.avatarFile) {
          formData.append('avatar', this.avatarFile);
        }

        if (this.isEditing) {
          formData.append('_method', 'PUT');
          await this.$api.post(`/users/${this.form.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.showToast('User updated successfully!', 'success')
        } else {
          await this.$api.post('/users', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.showToast('User created successfully!', 'success')
        }
        console.log('ok')
        this.closeModal();
        this.fetchUsers(this.pagination.current_page);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.showToast('An error occurred. Please try again.', 'error')
        }
      } finally {
        this.saving = false;
      }
    },
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        type,
        message,
        icon: type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
      }
      setTimeout(() => {
        this.toast.show = false
      }, 3000)
    },
    async toggleStatus(user) {
      const action = user.is_active ? 'deactivate' : 'activate';
      if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
        try {
          await this.$api.post(`/users/${user.id}/toggle-status`);
          this.showToast(`User ${action}d successfully!`, 'success')
          this.fetchUsers(this.pagination.current_page);
        } catch (error) {
          console.error('Error toggling status:', error);
          this.showToast(`Failed to update user status`, 'error')
        }
      }
    },

    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        try {
          await this.$api.delete(`/users/${user.id}`);
          this.showToast(`User deleted successfully!`, 'success')
          this.fetchUsers(this.pagination.current_page);
        } catch (error) {
          console.error('Error deleting user:', error);
          this.showToast(`Failed to delete user`, 'error')
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
        login_code: '',
        name: '',
        password: '',
        mobile: '',
        role_id: '',
        user_type: '',
        avatar: null,
        is_active: true,
      };
      this.avatarFile = null;
      this.avatarPreview = null;
      this.errors = {};
    },

    formatDate(dateString) {
      if (!dateString) return '<span class="never-logged">Never</span>';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },

    formatUserType(type) {
      const types = {
        admin: 'Admin',
        teacher: 'Teacher',
        student: 'Student',
        dept_head: 'Dept Head'
      };
      return types[type] || type;
    },

    getUserTypeIcon(type) {
      const icons = {
        admin: 'fa fa-user-shield',
        teacher: 'fa fa-chalkboard-teacher',
        student: 'fa fa-user-graduate',
        dept_head: 'fa fa-user-tie'
      };
      return icons[type] || 'fa fa-user';
    },

    setDefaultAvatar(event) {
      event.target.src = '/default-avatar.png';
    }
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.user-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px 20px;
}

/* Modern Header Section */
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* Stats Cards */
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

.stat-icon.blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
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

/* Filters Section */
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
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  color: #667eea;
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Table Card */
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
  min-width: 1200px;
}

.modern-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modern-table th {
  padding: 18px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  color: #667eea;
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

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #48bb78;
  border: 2px solid white;
  border-radius: 50%;
}

.login-code {
  font-family: 'Courier New', monospace;
  background: #edf2f7;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  color: #667eea;
  font-size: 13px;
}

.user-name-cell .name {
  font-weight: 600;
  color: #2d3748;
}

.mobile {
  color: #4a5568;
  font-size: 13px;
}

.mobile i {
  margin-right: 5px;
  color: #667eea;
}

.text-muted {
  color: #a0aec0;
  font-style: italic;
  font-size: 13px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.type-admin { background: #e6f2ff; color: #0066cc; }
.type-teacher { background: #e0f7fa; color: #00838f; }
.type-student { background: #fff3e0; color: #e65100; }
.type-dept_head { background: #f3e5f5; color: #6a1b9a; }

.role-badge {
  background: #f7fafc;
  color: #4a5568;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

.status-toggle {
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

.status-toggle.active {
  background: #c6f6d5;
  color: #22543d;
}

.status-toggle.inactive {
  background: #fed7d7;
  color: #742a2a;
}

.status-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.date-time {
  font-size: 13px;
  color: #718096;
}

.never-logged {
  color: #cbd5e0;
  font-style: italic;
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

/* Pagination */
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
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Modal Styles */
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
  max-width: 800px;
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
  color: #667eea;
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
  color: #667eea;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.optional {
  font-size: 12px;
  color: #718096;
  font-weight: 400;
  margin-left: 8px;
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.file-upload-wrapper {
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.file-label:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.file-label i {
  font-size: 36px;
  color: #667eea;
  margin-bottom: 10px;
}

.file-label span {
  color: #718096;
  font-size: 14px;
}

.image-preview {
  margin-top: 15px;
  position: relative;
  display: inline-block;
}

.image-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #e2e8f0;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #e53e3e;
  transform: scale(1.1);
}

.checkbox-group {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #667eea;
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
  color: #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .pagination-wrapper {
    flex-direction: column;
    text-align: center;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 15px;
  }

  .modal-container {
    margin: 20px;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }
}
</style>