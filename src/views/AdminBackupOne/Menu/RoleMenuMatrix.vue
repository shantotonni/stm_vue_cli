<!-- components/Admin/RoleMenuMatrix.vue -->
<template>
  <div class="role-menu-matrix">
    <div class="matrix-header">
      <h3><i class="fas fa-th"></i> Role-Menu Permission Matrix</h3>
      <p>Quick overview of which roles have access to which menus</p>
    </div>

    <div class="matrix-table-container">
      <table class="matrix-table">
        <thead>
        <tr>
          <th class="menu-column">Menu</th>
          <th
              v-for="role in roles"
              :key="role.id"
              class="role-column"
          >
            <div class="role-header">
              <i class="fas fa-user-shield"></i>
              {{ role.display_name }}
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="menu in parentMenus">
          <!-- Parent Menu Row -->
          <tr :key="'parent-' + menu.id" class="parent-row">
            <td class="menu-cell">
              <div class="menu-name">
                <i v-if="menu.icon" :class="menu.icon"></i>
                <strong>{{ menu.title }}</strong>
                <span v-if="menu.permission" class="permission-tag">
                    {{ menu.permission }}
                  </span>
              </div>
            </td>
            <td
                v-for="role in roles"
                :key="role.id"
                class="checkbox-cell"
            >
              <label class="matrix-checkbox">
                <input
                    type="checkbox"
                    :checked="hasMenuAccess(role.id, menu.id)"
                    @change="toggleMenuAccess(role.id, menu.id)"
                >
                <span class="checkmark"></span>
              </label>
            </td>
          </tr>

          <!-- Child Menu Rows -->
          <tr
              v-for="child in getChildMenus(menu.id)"
              :key="'child-' + child.id"
              class="child-row"
          >
            <td class="menu-cell">
              <div class="menu-name child">
                <i class="fas fa-level-up-alt fa-rotate-90"></i>
                <i v-if="child.icon" :class="child.icon"></i>
                {{ child.title }}
                <span v-if="child.permission" class="permission-tag">
                    {{ child.permission }}
                  </span>
              </div>
            </td>
            <td
                v-for="role in roles"
                :key="role.id"
                class="checkbox-cell"
            >
              <label class="matrix-checkbox">
                <input
                    type="checkbox"
                    :checked="hasMenuAccess(role.id, child.id)"
                    @change="toggleMenuAccess(role.id, child.id)"
                >
                <span class="checkmark"></span>
              </label>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div class="matrix-actions">
      <button @click="saveAll" :disabled="saving" class="btn btn-primary">
        <i v-if="saving" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-save"></i>
        {{ saving ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/api'

export default {
  name: 'RoleMenuMatrix',
  props: {
    roles: Array,
    menus: Array
  },

  data() {
    return {
      roleMenuMap: {},
      saving: false
    }
  },

  computed: {
    parentMenus() {
      return this.menus.filter(m => !m.parent_id).sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  mounted() {
    this.initializeRoleMenuMap()
  },

  methods: {
    initializeRoleMenuMap() {
      this.roles.forEach(role => {
        this.roleMenuMap[role.id] = role.menus?.map(m => m.id) || []
      })
    },

    getChildMenus(parentId) {
      return this.menus.filter(m => m.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
    },

    hasMenuAccess(roleId, menuId) {
      return this.roleMenuMap[roleId]?.includes(menuId) || false
    },

    toggleMenuAccess(roleId, menuId) {
      if (!this.roleMenuMap[roleId]) {
        this.roleMenuMap[roleId] = []
      }

      const index = this.roleMenuMap[roleId].indexOf(menuId)
      if (index > -1) {
        this.roleMenuMap[roleId].splice(index, 1)
      } else {
        this.roleMenuMap[roleId].push(menuId)
      }
    },

    async saveAll() {
      this.saving = true
      try {
        const promises = Object.keys(this.roleMenuMap).map(roleId => {
          return api.put(`/menus/roles/${roleId}`, {
            menu_ids: this.roleMenuMap[roleId]
          })
        })

        await Promise.all(promises)
        this.$emit('update')
        this.$toast.success('All role menus updated successfully!')
      } catch (error) {
        this.$toast.error('Failed to update role menus')
        console.error(error)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.role-menu-matrix {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.matrix-header {
  margin-bottom: 24px;
}

.matrix-header h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.5rem;
}

.matrix-header p {
  margin: 0;
  color: #6b7280;
}

.matrix-table-container {
  overflow-x: auto;
  margin-bottom: 24px;
}

.matrix-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.matrix-table thead {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.matrix-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid rgba(255,255,255,0.2);
}

.role-column {
  min-width: 120px;
  text-align: center !important;
}

.role-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.parent-row {
  background: #f9fafb;
}

.parent-row:hover {
  background: #f3f4f6;
}

.child-row {
  background: white;
}

.child-row:hover {
  background: #fafafa;
}

.matrix-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.menu-cell {
  min-width: 300px;
}

.menu-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-name.child {
  padding-left: 24px;
}

.permission-tag {
  background: #e0e9ff;
  color: #4c51bf;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.checkbox-cell {
  text-align: center;
}

.matrix-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.matrix-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 28px;
  height: 28px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matrix-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.matrix-checkbox input:checked ~ .checkmark::after {
  content: '✓';
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.matrix-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>