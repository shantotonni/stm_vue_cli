<!-- components/Admin/MenuManagement.vue -->
<template>
  <div class="menu-management">
    <div class="page-header">
      <h1>Menu Management</h1>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Add New Menu
      </button>
    </div>

    <div class="menu-tree">
      <div class="tree-header">
        <h3>Menu Structure</h3>
      </div>

      <div v-for="menu in menus" :key="menu.id" class="menu-item">
        <div class="menu-row">
          <div class="menu-info">
            <i v-if="menu.icon" :class="menu.icon"></i>
            <span class="menu-title">{{ menu.title }}</span>
            <span class="menu-route">{{ menu.route }}</span>
            <span class="menu-permission">{{ menu.permission || 'No permission' }}</span>
          </div>

          <div class="menu-actions">
            <button @click="editMenu(menu)" class="btn btn-sm btn-warning">Edit</button>
            <button @click="deleteMenu(menu)" class="btn btn-sm btn-danger">Delete</button>
            <button @click="addChild(menu)" class="btn btn-sm btn-success">Add Child</button>
          </div>
        </div>

        <!-- Children menus -->
        <div v-if="menu.children && menu.children.length" class="children-menus">
          <div v-for="child in menu.children" :key="child.id" class="child-menu">
            <div class="menu-row">
              <div class="menu-info child">
                <i v-if="child.icon" :class="child.icon"></i>
                <span class="menu-title">{{ child.title }}</span>
                <span class="menu-route">{{ child.route }}</span>
                <span class="menu-permission">{{ child.permission || 'No permission' }}</span>
              </div>

              <div class="menu-actions">
                <button @click="editMenu(child)" class="btn btn-sm btn-warning">Edit</button>
                <button @click="deleteMenu(child)" class="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Menu Permissions -->
    <div class="role-permissions">
      <h3>Role Menu Permissions</h3>
      <div class="role-tabs">
        <button
            v-for="role in roles"
            :key="role.id"
            @click="selectedRole = role"
            :class="{ 'active': selectedRole && selectedRole.id === role.id }"
            class="role-tab"
        >
          {{ role.display_name }}
        </button>
      </div>
{{allMenus}}
      <div v-if="selectedRole" class="role-menu-form">
        <h4>Menus for {{ selectedRole.display_name }}</h4>
        <form @submit.prevent="updateRoleMenus">
          <div class="menu-checkboxes">
            <div v-for="menu in allMenus" :key="menu.id" class="menu-checkbox">
              <label>
                <input
                    type="checkbox"
                    :value="menu.id"
                    v-model="selectedMenus"
                >
                <i v-if="menu.icon" :class="menu.icon"></i>
                {{ menu.title }}
              </label>

              <!-- Children checkboxes -->
              <div v-if="menu.children && menu.children.length" class="children-checkboxes">
                <div v-for="child in menu.children" :key="child.id" class="child-checkbox">
                  <label>
                    <input
                        type="checkbox"
                        :value="child.id"
                        v-model="selectedMenus"
                    >
                    <i v-if="child.icon" :class="child.icon"></i>
                    {{ child.title }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Update Role Menus</button>
        </form>
      </div>
    </div>

    <!-- Create/Edit Menu Modal -->
    <menu-form-modal
        v-if="showCreateForm || showEditForm"
        :menu="selectedMenu"
        :menus="allMenus"
        :permissions="permissions"
        @close="closeModal"
        @saved="menuSaved"
    />
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
      selectedMenu: null
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const [menusRes, rolesRes, permsRes] = await Promise.all([
          this.$api.get('/menus'),
          this.$api.get('/roles'),
          this.$api.get('/permissions')
        ])
        console.log("menusRes:", menusRes)
        console.log("rolesRes:", rolesRes)
        console.log("permsRes:", permsRes)

        this.allMenus = menusRes.data.menus
        this.menus = this.buildMenuTree(menusRes.data.menus)
        this.roles = rolesRes.data.roles
        this.permissions = permsRes.data.permissions
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    },

    buildMenuTree(menus) {
      const tree = []
      const menuMap = {}

      // Create map of all menus
      menus.forEach(menu => {
        menuMap[menu.id] = { ...menu, children: [] }
      })

      // Build tree structure
      menus.forEach(menu => {
        if (menu.parent_id) {
          if (menuMap[menu.parent_id]) {
            menuMap[menu.parent_id].children.push(menuMap[menu.id])
          }
        } else {
          tree.push(menuMap[menu.id])
        }
      })

      return tree
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
      if (confirm(`Are you sure you want to delete "${menu.title}"?`)) {
        try {
          await this.$api.delete(`/menus/${menu.id}`)
          this.loadData()
        } catch (error) {
          alert('Failed to delete menu')
        }
      }
    },

    async updateRoleMenus() {
      try {
        await this.$api.put(`/menus/roles/${this.selectedRole.id}`, {
          menu_ids: this.selectedMenus
        })

        alert('Role menus updated successfully')
      } catch (error) {
        alert('Failed to update role menus')
      }
    },

    closeModal() {
      this.showCreateForm = false
      this.showEditForm = false
      this.selectedMenu = null
    },

    menuSaved() {
      this.closeModal()
      this.loadData()
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
.menu-management {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.menu-tree {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.menu-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.menu-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-info.child {
  padding-left: 2rem;
}

.menu-title {
  font-weight: bold;
}

.menu-route {
  color: #666;
  font-family: monospace;
}

.menu-permission {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.children-menus {
  margin-left: 2rem;
}

.role-permissions {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.role-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.role-tab {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.role-tab.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.menu-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.menu-checkbox {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 4px;
}

.children-checkboxes {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
}

.child-checkbox {
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary { background: #3498db; color: white; }
.btn-warning { background: #f39c12; color: white; }
.btn-danger { background: #e74c3c; color: white; }
.btn-success { background: #27ae60; color: white; }
.btn-sm { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
</style>