<!-- ================================================================== -->
<!-- MenuPreviewItem.vue -->
<!-- ================================================================== -->
<template>
  <div class="preview-menu-item">
    <!-- Menu Link -->
    <div
        class="preview-menu-link"
        :class="{ 'has-children': hasChildren, 'expanded': expanded }"
        @click="hasChildren ? toggleExpand() : null"
    >
      <!-- Icon -->
      <div class="preview-icon">
        <i v-if="menu.icon" :class="menu.icon"></i>
        <i v-else class="fas fa-circle"></i>
      </div>

      <!-- Title -->
      <span class="preview-title">{{ menu.title }}</span>

      <!-- Permission Badge -->
      <span v-if="menu.permission" class="preview-permission" :title="menu.permission">
        <i class="fas fa-shield-alt"></i>
      </span>

      <!-- Chevron for parent menus -->
      <i
          v-if="hasChildren"
          class="preview-chevron fas fa-chevron-down"
          :class="{ 'rotated': !expanded }"
      ></i>
    </div>

    <!-- Children -->
    <transition name="slide">
      <div v-if="hasChildren && expanded" class="preview-children">
        <menu-preview-item
            v-for="child in menu.children"
            :key="child.id"
            :menu="child"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MenuPreviewItem',
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
.preview-menu-item {
  margin-bottom: 4px;
}

.preview-menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.preview-menu-link:hover {
  background: rgba(102, 126, 234, 0.1);
}

.preview-menu-link.has-children {
  font-weight: 600;
}

.preview-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1rem;
}

.preview-title {
  flex: 1;
  color: #1f2937;
  font-size: 0.95rem;
}

.preview-permission {
  width: 20px;
  height: 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 0.7rem;
}

.preview-chevron {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.preview-chevron.rotated {
  transform: rotate(-90deg);
}

.preview-children {
  margin-left: 32px;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 2px solid rgba(102, 126, 234, 0.2);
}

.preview-children .preview-menu-link {
  padding: 10px 16px;
  font-weight: 500;
  font-size: 0.9rem;
}

.preview-children .preview-icon {
  font-size: 0.9rem;
}

/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-menu-link {
    padding: 10px 12px;
  }

  .preview-children {
    margin-left: 20px;
    padding-left: 8px;
  }
}
</style>