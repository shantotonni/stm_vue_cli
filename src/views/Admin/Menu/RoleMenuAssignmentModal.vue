<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container large">
      <div class="modal-header">
        <h3><i class="fas fa-users-cog"></i> Manage Role Menu Access</h3>
        <button @click="$emit('close')" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Role Tabs -->
        <div class="role-tabs">
          <button
              v-for="role in roles"
              :key="role.id"
              @click="selectedRoleId = role.id"
              :class="['role-tab', { active: selectedRoleId === role.id }]"
          >
            <i class="fas fa-user-shield"></i>
            {{ role.display_name }}
            <span class="menu-count">{{ getRoleMenuCount(role.id) }}</span>
          </button>
        </div>

        <!-- Menu Assignment -->
        <div v-if="selectedRoleId" class="menu-assignment">
          <div class="assignment-header">
            <h4>Assign Menus for {{ getSelectedRole()?.display_name }}</h4>
            <div class="quick-actions">
              <button @click="selectAll" class="btn btn-sm">
                <i class="fas fa-check-double"></i> Select All
              </button>
              <button @click="deselectAll" class="btn btn-sm">
                <i class="fas fa-times"></i> Deselect All
              </button>
            </div>
          </div>

          <div class="menu-tree-container">
            <div
                v-for="menu in parentMenus"
                :key="menu.id"
                class="menu-group"
            >
              <!-- Parent Menu -->
              <label class="menu-checkbox-label parent">
                <input
                    type="checkbox"
                    :value="menu.id"
                    v-model="selectedMenuIds"
                    @change="onParentMenuChange(menu)"
                    class="menu-checkbox"
                >
                <div class="menu-info">
                  <i v-if="menu.icon" :class="menu.icon"></i>
                  <span class="menu-title">{{ menu.title }}</span>
                  <span v-if="menu.permission" class="permission-badge">
                    <i class="fas fa-shield-alt"></i> {{ menu.permission }}
                  </span>
                </div>
              </label>

              <!-- Child Menus -->
              <div v-if="getChildMenus(menu.id).length > 0" class="child-menus">
                <label
                    v-for="child in getChildMenus(menu.id)"
                    :key="child.id"
                    class="menu-checkbox-label child"
                >
                  <input
                      type="checkbox"
                      :value="child.id"
                      v-model="selectedMenuIds"
                      class="menu-checkbox"
                  >
                  <div class="menu-info">
                    <i v-if="child.icon" :class="child.icon"></i>
                    <span class="menu-title">{{ child.title }}</span>
                    <span v-if="child.permission" class="permission-badge">
                      <i class="fas fa-shield-alt"></i> {{ child.permission }}
                    </span>
                    <span v-if="child.route" class="route-badge">{{ child.route }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn-secondary">
          <i class="fas fa-times"></i> Cancel
        </button>
        <button @click="saveRoleMenus" :disabled="saving" class="btn btn-primary">
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-save"></i>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/api'

export default {
  name: 'RoleMenuAssignmentModal',
  props: {
    roles: Array,
    menus: Array
  },

  data() {
    return {
      selectedRoleId: null,
      selectedMenuIds: [],
      saving: false
    }
  },

  computed: {
    parentMenus() {
      return this.menus.filter(m => !m.parent_id).sort((a, b) => a.sort_order - b.sort_order)
    }
  },

  mounted() {
    if (this.roles.length > 0) {
      this.selectedRoleId = this.roles[0].id
      this.loadRoleMenus()
    }
  },

  watch: {
    selectedRoleId() {
      this.loadRoleMenus()
    }
  },

  methods: {
    getSelectedRole() {
      return this.roles.find(r => r.id === this.selectedRoleId)
    },

    getRoleMenuCount(roleId) {
      const role = this.roles.find(r => r.id === roleId)
      return role?.menus?.length || 0
    },

    getChildMenus(parentId) {
      return this.menus.filter(m => m.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order)
    },

    loadRoleMenus() {
      const role = this.getSelectedRole()
      this.selectedMenuIds = role?.menus?.map(m => m.id) || []
    },

    onParentMenuChange(menu) {
      const children = this.getChildMenus(menu.id)
      const isParentChecked = this.selectedMenuIds.includes(menu.id)

      children.forEach(child => {
        const childIndex = this.selectedMenuIds.indexOf(child.id)
        if (isParentChecked && childIndex === -1) {
          this.selectedMenuIds.push(child.id)
        } else if (!isParentChecked && childIndex > -1) {
          this.selectedMenuIds.splice(childIndex, 1)
        }
      })
    },

    selectAll() {
      this.selectedMenuIds = this.menus.map(m => m.id)
    },

    deselectAll() {
      this.selectedMenuIds = []
    },

    async saveRoleMenus() {
      this.saving = true
      try {
        await api.put(`/menus/roles/${this.selectedRoleId}`, {
          menu_ids: this.selectedMenuIds
        })

        this.$emit('updated')
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
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container.large {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: white;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.role-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.role-tab {
  padding: 12px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.role-tab:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.role-tab.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.menu-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.role-tab.active .menu-count {
  background: rgba(255, 255, 255, 0.3);
}

.assignment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.assignment-header h4 {
  margin: 0;
  color: #1f2937;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.menu-tree-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-group {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.menu-checkbox-label {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
  gap: 12px;
}

.menu-checkbox-label:hover {
  background: #f9fafb;
}

.menu-checkbox-label.parent {
  background: #f3f4f6;
  font-weight: 600;
}

.menu-checkbox-label.child {
  padding-left: 48px;
  border-top: 1px solid #e5e7eb;
}

.menu-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.menu-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.menu-info i {
  width: 24px;
  color: #667eea;
  font-size: 1.1rem;
}

.menu-title {
  flex: 1;
  color: #1f2937;
}

.permission-badge {
  background: #e0e9ff;
  color: #4c51bf;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.route-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-family: monospace;
}

.modal-footer {
  padding: 20px 32px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  background: #f9fafb;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
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