<template>
  <div class="tree-item">
    <div
        :class="[
                'flex items-center gap-2 p-3 border rounded-lg',
                level === 0 ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
            ]"
        :style="{ marginLeft: level * 20 + 'px' }"
    >
      <!-- Drag Handle -->
      <div class="cursor-move text-gray-400 hover:text-gray-600">
        <i class="fas fa-grip-vertical"></i>
      </div>

      <!-- Expand/Collapse -->
      <button
          v-if="item.children && item.children.length > 0"
          @click="expanded = !expanded"
          class="text-gray-600 hover:text-gray-900"
      >
        <i :class="expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
      </button>
      <div v-else class="w-5"></div>

      <!-- Content -->
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-900">{{ item.title }}</span>
          <span class="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded">
                        {{ item.level_type }}
                    </span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Max Marks: {{ item.max_marks }} • Level: {{ item.level_number }}
          <span v-if="item.description"> • {{ item.description }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <button
            @click="$emit('add-child', item)"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Add Child"
        >
          <i class="fas fa-plus text-sm"></i>
        </button>
        <button
            @click="$emit('edit', item)"
            class="p-2 text-green-600 hover:bg-green-50 rounded"
            title="Edit"
        >
          <i class="fas fa-edit text-sm"></i>
        </button>
        <button
            @click="$emit('delete', item)"
            class="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
        >
          <i class="fas fa-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Children -->
    <div v-if="expanded && item.children && item.children.length > 0" class="mt-2">
      <tree-item
          v-for="(child, index) in item.children"
          :key="child.id || child.temp_id"
          :item="child"
          :index="index"
          :level="level + 1"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-child="$emit('add-child', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',

  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      expanded: true
    }
  }
}
</script>