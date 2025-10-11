<!-- components/Admin/MenuManagement.vue - Beautiful Design -->
<template>
  <div class="menu-management">
    <!-- Beautiful Header with Gradient -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="icon-wrapper">
            <i class="fas fa-bars"></i>
          </div>
          <div>
            <h1>Menu Management System</h1>
            <p class="subtitle">Create and manage navigation menus with role-based access control</p>
          </div>
        </div>
        <button @click="showCreateForm = true" class="btn btn-primary">
          <i class="fas fa-plus-circle"></i>
          <span>Add New Menu</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon">
          <i class="fas fa-list"></i>
        </div>
        <div class="stat-content">
          <h4>Total Menus</h4>
          <p class="stat-value">{{ allMenus.length }}</p>
        </div>
      </div>

      <div class="stat-card green">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <h4>Active Menus</h4>
          <p class="stat-value">{{ activeMenusCount }}</p>
        </div>
      </div>

      <div class="stat-card purple">
        <div class="stat-icon">
          <i class="fas fa-sitemap"></i>
        </div>
        <div class="stat-content">
          <h4>Parent Menus</h4>
          <p class="stat-value">{{ parentMenusCount }}</p>
        </div>
      </div>

      <div class="stat-card orange">
        <div class="stat-icon">
          <i class="fas fa-users-cog"></i>
        </div>
        <div class="stat-content">
          <h4>Roles</h4>
          <p class="stat-value">{{ roles.length }}</p>
        </div>
      </div>
    </div>

    <!-- Menu Tree Section -->
    <div class="content-section">
      <div class="section-header">
        <h3><i class="fas fa-sitemap"></i> Menu Structure</h3>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search menus..."
          >
        </div>
      </div>

      <div class="menu-tree">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading menus...</p>
        </div>

        <div v-else-if="filteredMenus.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h4>No Menus Found</h4>
          <p>Create your first menu to get started</p>
          <button @click="showCreateForm = true" class="btn btn-primary">
            <i class="fas fa-plus"></i> Create Menu
          </button>
        </div>

        <div v-else>
          <div v-for="menu in filteredMenus" :key="'parent-' + menu.id" class="menu-item-card">
            <!-- Parent Menu -->
            <div class="menu-row parent">
              <div class="menu-left">
                <div class="menu-icon-badge" :class="menu.is_active ? 'active' : 'inactive'">
                  <i v-if="menu.icon" :class="menu.icon"></i>
                  <i v-else class="fas fa-bars"></i>
                </div>
                <div class="menu-details">
                  <div class="menu-header">
                    <h4 class="menu-title">{{ menu.title }}</h4>
                    <span class="menu-status" :class="menu.is_active ? 'active' : 'inactive'">
                      <i :class="menu.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                      {{ menu.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="menu-meta">
                    <span class="meta-item">
                      <i class="fas fa-code"></i>
                      <code>{{ menu.name }}</code>
                    </span>
                    <span v-if="menu.route" class="meta-item">
                      <i class="fas fa-link"></i>
                      {{ menu.route }}
                    </span>
                    <span v-if="menu.permission" class="meta-item permission">
                      <i class="fas fa-shield-alt"></i>
                      {{ menu.permission }}
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-sort-numeric-down"></i>
                      Order: {{ menu.sort_order }}
                    </span>
                  </div>
                  <!-- Role Tags -->
                  <div v-if="menu.roles && menu.roles.length" class="role-tags">
                    <span class="role-tag-label">Roles:</span>
                    <span
                        v-for="(role, index) in menu.roles"
                        :key="'role-' + menu.id + '-' + role.id + '-' + index"
                        class="role-tag"
                    >
                      {{ role.display_name }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="menu-actions">
                <button @click="editMenu(menu)" class="action-btn edit" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="addChild(menu)" class="action-btn add" title="Add Child">
                  <i class="fas fa-plus"></i>
                </button>
                <button @click="deleteMenu(menu)" class="action-btn delete" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <!-- Children menus -->
            <div v-if="menu.children && menu.children.length" class="children-container">
              <div v-for="child in menu.children" :key="'child-' + child.id" class="menu-row child">
                <div class="menu-left">
                  <div class="child-connector"></div>
                  <div class="menu-icon-badge small" :class="child.is_active ? 'active' : 'inactive'">
                    <i v-if="child.icon" :class="child.icon"></i>
                    <i v-else class="fas fa-circle"></i>
                  </div>
                  <div class="menu-details">
                    <div class="menu-header">
                      <h5 class="menu-title">{{ child.title }}</h5>
                      <span class="menu-status small" :class="child.is_active ? 'active' : 'inactive'">
                        <i :class="child.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                        {{ child.is_active ? 'Active' : 'Inactive' }}
                      </span>
                    </div>
                    <div class="menu-meta">
                      <span class="meta-item">
                        <i class="fas fa-code"></i>
                        <code>{{ child.name }}</code>
                      </span>
                      <span v-if="child.route" class="meta-item">
                        <i class="fas fa-link"></i>
                        {{ child.route }}
                      </span>
                      <span v-if="child.permission" class="meta-item permission">
                        <i class="fas fa-shield-alt"></i>
                        {{ child.permission }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="menu-actions">
                  <button @click="editMenu(child)" class="action-btn edit" title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteMenu(child)" class="action-btn delete" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Menu Permissions Section -->
    <div class="content-section">
      <div class="section-header">
        <h3><i class="fas fa-users-cog"></i> Role Menu Permissions</h3>
        <p class="section-subtitle">Assign menus to different user roles</p>
      </div>

      <div class="role-menu-container">
        <!-- Role Tabs -->
        <div class="role-tabs">
          <button
              v-for="role in roles"
              :key="role.id"
              @click="selectedRole = role"
              :class="['role-tab', { 'active': selectedRole && selectedRole.id === role.id }]"
          >
            <i class="fas fa-user-shield"></i>
            <span>{{ role.display_name }}</span>
            <span v-if="selectedRole && selectedRole.id === role.id" class="menu-count">
              {{ selectedMenus.length }} menus
            </span>
          </button>
        </div>

        <!-- Role Menu Form -->
        <div v-if="selectedRole" class="role-menu-form">
          <div class="form-header">
            <h4>Configure menus for <strong>{{ selectedRole.display_name }}</strong> role</h4>
            <div class="quick-actions">
              <button @click="selectAllMenus" class="btn btn-sm btn-outline">
                <i class="fas fa-check-double"></i> Select All
              </button>
              <button @click="deselectAllMenus" class="btn btn-sm btn-outline">
                <i class="fas fa-times"></i> Deselect All
              </button>
            </div>
          </div>

          <form @submit.prevent="updateRoleMenus">
            <div class="menu-checkboxes">
              <div v-for="menu in parentMenusOnly" :key="'menu-' + menu.id" class="menu-checkbox-card">
                <!-- Parent Menu Checkbox -->
                <label class="checkbox-label parent">
                  <input
                      type="checkbox"
                      :value="menu.id"
                      v-model="selectedMenus"
                      @change="onParentMenuToggle(menu)"
                  >
                  <span class="checkbox-custom"></span>
                  <div class="checkbox-content">
                    <i v-if="menu.icon" :class="menu.icon"></i>
                    <span class="checkbox-title">{{ menu.title }}</span>
                    <span v-if="menu.permission" class="permission-badge">
                      <i class="fas fa-shield-alt"></i> {{ menu.permission }}
                    </span>
                  </div>
                </label>

                <!-- Children Checkboxes -->
                <div v-if="getMenuChildren(menu.id).length > 0" class="children-checkboxes">
                  <label
                      v-for="child in getMenuChildren(menu.id)"
                      :key="'child-' + child.id"
                      class="checkbox-label child"
                  >
                    <input
                        type="checkbox"
                        :value="child.id"
                        v-model="selectedMenus"
                    >
                    <span class="checkbox-custom"></span>
                    <div class="checkbox-content">
                      <i v-if="child.icon" :class="child.icon"></i>
                      <span class="checkbox-title">{{ child.title }}</span>
                      <span v-if="child.permission" class="permission-badge">
                        <i class="fas fa-shield-alt"></i> {{ child.permission }}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" :disabled="saving" class="btn btn-primary btn-large">
                <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                <span>{{ saving ? 'Saving...' : 'Update Role Menus' }}</span>
              </button>
            </div>
          </form>
        </div>

        <div v-else class="no-role-selected">
          <i class="fas fa-hand-pointer"></i>
          <h4>Select a role to manage menus</h4>
          <p>Choose a role from the tabs above to configure menu access</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <menu-form-modal
        v-if="showCreateForm || showEditForm"
        :menu="selectedMenu"
        :menus="allMenus"
        :permissions="permissions"
        :roles="roles"
        @close="closeModal"
        @saved="menuSaved"
    />

    <!-- Toast Notifications -->
    <transition name="fade">
      <div v-if="toast.show" :class="['toast', toast.type]">
        <i :class="toast.icon"></i>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import MenuFormModal from './MenuFormModal.vue'

export default {
  name: 'MenuManagement',
  components: {
    MenuFormModal
  },
  data() {
    return {
      menus: [],
      allMenus: [],
      roles: [],
      permissions: [],
      selectedRole: null,
      selectedMenus: [],
      showCreateForm: false,
      showEditForm: false,
      selectedMenu: null,
      loading: false,
      saving: false,
      searchQuery: '',
      toast: {
        show: false,
        type: 'success',
        message: '',
        icon: 'fas fa-check-circle'
      }
    }
  },

  computed: {
    filteredMenus() {
      if (!this.searchQuery) {
        return this.menus
      }
      const query = this.searchQuery.toLowerCase()
      return this.menus.filter(menu => {
        const matchParent = menu.title.toLowerCase().includes(query) ||
            menu.name.toLowerCase().includes(query)
        const matchChildren = menu.children?.some(child =>
            child.title.toLowerCase().includes(query) ||
            child.name.toLowerCase().includes(query)
        )
        return matchParent || matchChildren
      })
    },

    activeMenusCount() {
      return this.allMenus.filter(m => m.is_active).length
    },

    parentMenusCount() {
      return this.allMenus.filter(m => !m.parent_id).length
    },

    parentMenusOnly() {
      return this.allMenus.filter(m => !m.parent_id).sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [menusRes, rolesRes, permsRes] = await Promise.all([
          this.$api.get('/menus'),
          this.$api.get('/roles'),
          this.$api.get('/permissions')
        ])
        this.allMenus = menusRes.data.menus || menusRes.data
        this.menus = this.buildMenuTree(this.allMenus)
        this.roles = rolesRes.data.roles || rolesRes.data
        this.permissions = permsRes.data.permissions || permsRes.data.permissions
      } catch (error) {
        this.showToast('Failed to load data', 'error')
        console.error('Failed to load data:', error)
      } finally {
        this.loading = false
      }
    },

    buildMenuTree(menus) {
      const tree = []
      const menuMap = {}

      menus.forEach(menu => {
        menuMap[menu.id] = { ...menu, children: [] }
      })

      menus.forEach(menu => {
        if (menu.parent_id && menuMap[menu.parent_id]) {
          menuMap[menu.parent_id].children.push(menuMap[menu.id])
        } else if (!menu.parent_id) {
          tree.push(menuMap[menu.id])
        }
      })

      return tree.sort((a, b) => a.sort_order - b.sort_order)
    },

    editMenu(menu) {
      this.selectedMenu = menu
      this.showEditForm = true
    },

    addChild(parentMenu) {
      this.selectedMenu = { parent_id: parentMenu.id }
      this.showCreateForm = true
    },

    async deleteMenu(menu) {
      if (!confirm(`Are you sure you want to delete "${menu.title}"?\n\nThis action cannot be undone.`)) {
        return
      }

      try {
        await this.$api.delete(`/menus/${menu.id}`)
        this.showToast('Menu deleted successfully', 'success')
        await this.loadData()
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to delete menu'
        this.showToast(errorMsg, 'error')
      }
    },

    async updateRoleMenus() {
      this.saving = true
      try {
        await this.$api.put(`/menus/roles/${this.selectedRole.id}`, {
          menu_ids: this.selectedMenus
        })

        this.showToast('Role menus updated successfully', 'success')
        await this.loadData()
      } catch (error) {
        this.showToast('Failed to update role menus', 'error')
      } finally {
        this.saving = false
      }
    },

    onParentMenuToggle(menu) {
      const isChecked = this.selectedMenus.includes(menu.id)
      const children = this.getMenuChildren(menu.id)

      if (children.length > 0) {
        children.forEach(child => {
          const index = this.selectedMenus.indexOf(child.id)
          if (isChecked && index === -1) {
            this.selectedMenus.push(child.id)
          } else if (!isChecked && index > -1) {
            this.selectedMenus.splice(index, 1)
          }
        })
      }
    },

    getMenuChildren(parentId) {
      return this.allMenus.filter(m => m.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
    },

    selectAllMenus() {
      this.selectedMenus = this.allMenus.map(m => m.id)
    },

    deselectAllMenus() {
      this.selectedMenus = []
    },

    closeModal() {
      this.showCreateForm = false
      this.showEditForm = false
      this.selectedMenu = null
    },

    async menuSaved() {
      this.closeModal()
      await this.loadData()
      this.showToast('Menu saved successfully', 'success')
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
    }
  },

  watch: {
    selectedRole(role) {
      if (role) {
        this.selectedMenus = role.menus ? role.menus.map(m => m.id) : []
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.menu-management {
  padding: 2rem;
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  backdrop-filter: blur(10px);
}

.header-left h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  margin: 0;
  opacity: 0.95;
  font-size: 0.95rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: currentColor;
  opacity: 0.05;
  border-radius: 50%;
  transform: translate(30%, -30%);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-card.blue { color: #667eea; }
.stat-card.green { color: #27ae60; }
.stat-card.purple { color: #9b59b6; }
.stat-card.orange { color: #f39c12; }

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: currentColor;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
}

.stat-content h4 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-header h3 i {
  color: #667eea;
}

.section-subtitle {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Menu Item Card */
.menu-item-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-item-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
}

.menu-row.parent {
  background: white;
}

.menu-row.child {
  background: #fafafa;
  border-top: 1px solid #e5e7eb;
}

.menu-left {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
}

.menu-icon-badge {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}

.menu-icon-badge.small {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.menu-icon-badge.inactive {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.child-connector {
  width: 2px;
  height: 100%;
  background: #667eea;
  position: absolute;
  left: 25px;
  top: -20px;
}

.menu-details {
  flex: 1;
  min-width: 0;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.menu-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.menu-row.child .menu-title {
  font-size: 1rem;
}

.menu-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.menu-status.active {
  background: #d1fae5;
  color: #065f46;
}

.menu-status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.menu-status.small {
  padding: 0.25rem 0.625rem;
  font-size: 0.7rem;
}

.menu-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #6b7280;
}

.meta-item i {
  color: #667eea;
  font-size: 0.75rem;
}

.meta-item code {
  font-family: 'Courier New', monospace;
  color: #374151;
  font-weight: 500;
}

.meta-item.permission {
  background: #e0e9ff;
  border-color: #c7d2fe;
  color: #4c51bf;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.role-tag-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.role-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.menu-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.action-btn.edit {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.edit:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.action-btn.add {
  background: #d1fae5;
  color: #065f46;
}

.action-btn.add:hover {
  background: #10b981;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.children-container {
  position: relative;
}

/* Role Menu Permissions */
.role-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.role-tab {
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #374151;
}

.role-tab:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.role-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.menu-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.menu-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.menu-checkbox-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s ease;
}

.menu-checkbox-card:hover {
  border-color: #667eea;
  background: white;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.checkbox-label:hover {
  background: rgba(102, 126, 234, 0.05);
}

.checkbox-label.parent {
  font-weight: 600;
}

.checkbox-label.child {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 5px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  position: relative;
  margin-top: 2px;
}

.checkbox-label input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;
}

.checkbox-title {
  flex: 1;
  color: #1f2937;
}

.permission-badge {
  background: #e0e9ff;
  color: #4c51bf;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.children-checkboxes {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.no-role-selected {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.no-role-selected i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.no-role-selected h4 {
  margin: 0.5rem 0;
  color: #374151;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

.btn-outline {
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
}

.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f9fafb;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state i {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h4 {
  margin: 0.5rem 0;
  color: #374151;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;
  z-index: 9999;
  min-width: 300px;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast i {
  font-size: 1.25rem;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}

/* Responsive */
@media (max-width: 768px) {
  .menu-management {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .menu-row {
    flex-direction: column;
    align-items: stretch;
  }

  .menu-actions {
    justify-content: flex-end;
  }

  .menu-checkboxes {
    grid-template-columns: 1fr;
  }

  .search-box {
    width: 100%;
  }
}
</style>