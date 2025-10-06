<!-- MenuTreeItem.vue -->
<template>
  <div class="menu-tree-item">
    <div class="tree-item-row" :class="{ 'has-children': hasChildren }">
      <!-- Expand/Collapse Button -->
      <button
          v-if="hasChildren"
          @click="toggleExpand"
          class="expand-btn"
      >
        <i :class="expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
      </button>
      <div v-else class="expand-spacer"></div>

      <!-- Menu Info -->
      <div class="menu-info">
        <!-- Icon -->
        <div class="menu-icon">
          <i v-if="menu.icon" :class="menu.icon"></i>
          <i v-else class="fas fa-circle"></i>
        </div>

        <!-- Title & Details -->
        <div class="menu-details">
          <div class="menu-title-row">
            <h4 class="menu-title">{{ menu.title }}</h4>
            <code class="menu-name">{{ menu.name }}</code>
          </div>

          <div class="menu-meta">
            <span v-if="menu.route" class="meta-item route">
              <i class="fas fa-link"></i> {{ menu.route }}
            </span>
            <span v-else-if="menu.url" class="meta-item url">
              <i class="fas fa-external-link-alt"></i> {{ menu.url }}
            </span>

            <span v-if="menu.permission" class="meta-item permission">
              <i class="fas fa-shield-alt"></i> {{ menu.permission }}
            </span>

            <span class="meta-item order">
              <i class="fas fa-sort-numeric-down"></i> Order: {{ menu.sort_order }}
            </span>

            <span :class="['meta-item status', menu.is_active ? 'active' : 'inactive']">
              <i :class="menu.is_active ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
              {{ menu.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Role Tags -->
          <div v-if="menu.roles && menu.roles.length > 0" class="role-tags">
            <span
                v-for="role in menu.roles"
                :key="role.id"
                class="role-tag"
            >
              {{ role.display_name }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="menu-actions">
          <button
              @click="$emit('edit', menu)"
              class="action-btn edit"
              title="Edit Menu"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
              @click="$emit('add-child', menu)"
              class="action-btn add"
              title="Add Child Menu"
          >
            <i class="fas fa-plus"></i>
          </button>
          <button
              @click="$emit('delete', menu)"
              class="action-btn delete"
              title="Delete Menu"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && expanded" class="tree-children">
      <menu-tree-item
          v-for="child in menu.children"
          :key="child.id"
          :menu="child"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-child="$emit('add-child', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuTreeItem',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      expanded: true
    }
  },

  computed: {
    hasChildren() {
      return this.menu.children && this.menu.children.length > 0
    }
  },

  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style scoped>
.menu-tree-item {
  margin-bottom: 8px;
}

.tree-item-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.tree-item-row:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.tree-item-row.has-children {
  border-left: 4px solid #667eea;
}

.expand-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  transition: all 0.2s;
  flex-shrink: 0;
}

.expand-btn:hover {
  background: #667eea;
  color: white;
}

.expand-spacer {
  width: 32px;
  flex-shrink: 0;
}

.menu-info {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
}

.menu-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.menu-details {
  flex: 1;
  min-width: 0;
}

.menu-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.menu-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.menu-name {
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.menu-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.meta-item i {
  font-size: 0.75rem;
}

.meta-item.route {
  background: #dbeafe;
  color: #1e40af;
}

.meta-item.url {
  background: #e0e7ff;
  color: #4c51bf;
}

.meta-item.permission {
  background: #e0e9ff;
  color: #4c51bf;
}

.meta-item.order {
  background: #f3f4f6;
  color: #6b7280;
}

.meta-item.status.active {
  background: #d1fae5;
  color: #065f46;
}

.meta-item.status.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.role-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-tag {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.menu-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.action-btn.edit {
  background: #dbeafe;
  color: #1e40af;
}

.action-btn.edit:hover {
  background: #3b82f6;
  color: white;
}

.action-btn.add {
  background: #d1fae5;
  color: #065f46;
}

.action-btn.add:hover {
  background: #10b981;
  color: white;
}

.action-btn.delete {
  background: #fee2e2;
  color: #991b1b;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

.tree-children {
  margin-left: 44px;
  margin-top: 8px;
  padding-left: 20px;
  border-left: 2px dashed #d1d5db;
}

/* Responsive */
@media (max-width: 768px) {
  .menu-info {
    flex-direction: column;
  }

  .menu-meta {
    flex-direction: column;
    gap: 6px;
  }

  .menu-actions {
    flex-direction: column;
  }
}
</style>
