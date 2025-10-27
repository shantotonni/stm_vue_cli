<template>
  <div class="progress-tracker p-6">
    <loading-spinner v-if="loading" />

    <div v-else-if="card" class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            :to="`/student-cards/${cardId}`"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Card Details
        </router-link>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <span><i class="fas fa-user mr-2"></i>{{ card.student.full_name }}</span>
              <span><i class="fas fa-id-card mr-2"></i>{{ card.card_type.card_name }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
                @click="bulkUpdateMode = !bulkUpdateMode"
                :class="[
                                'px-4 py-2 rounded-lg flex items-center gap-2',
                                bulkUpdateMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                            ]"
            >
              <i class="fas fa-tasks"></i>
              Bulk Update
            </button>
            <button
                @click="saveAllProgress"
                :disabled="!hasChanges || saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <loading-spinner v-if="saving" class="w-4 h-4" />
              <i v-else class="fas fa-save"></i>
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.total_items }}</p>
            </div>
            <i class="fas fa-list text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-green-600">{{ statistics.completed }}</p>
            </div>
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">In Progress</p>
              <p class="text-2xl font-bold text-yellow-600">{{ statistics.in_progress }}</p>
            </div>
            <i class="fas fa-spinner text-yellow-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Not Started</p>
              <p class="text-2xl font-bold text-gray-600">{{ statistics.not_started }}</p>
            </div>
            <i class="fas fa-clock text-gray-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Marks</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ statistics.total_marks_obtained }}/{{ statistics.total_max_marks }}
              </p>
              <p class="text-xs text-gray-500">{{ statistics.marks_percentage }}%</p>
            </div>
            <i class="fas fa-calculator text-purple-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-gray-900">Overall Progress</h3>
          <span class="text-2xl font-bold text-blue-600">{{ statistics.completion_percentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
              class="h-4 rounded-full transition-all"
              :class="getProgressColor(statistics.completion_percentage)"
              :style="{ width: statistics.completion_percentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Filters and View Options -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <select
                v-model="filterStatus"
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search items..."
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex items-center gap-2">
            <button
                @click="viewMode = 'list'"
                :class="[
                                'px-3 py-2 rounded',
                                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            ]"
            >
              <i class="fas fa-list"></i>
            </button>
            <button
                @click="viewMode = 'tree'"
                :class="[
                                'px-3 py-2 rounded',
                                viewMode === 'tree' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            ]"
            >
              <i class="fas fa-sitemap"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Update Panel -->
      <div v-if="bulkUpdateMode" class="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <i class="fas fa-info-circle text-yellow-600 text-xl mt-1"></i>
          <div class="flex-1">
            <h3 class="font-semibold text-yellow-900 mb-2">Bulk Update Mode</h3>
            <p class="text-sm text-yellow-800 mb-3">
              Select multiple items to update their progress at once. Use checkboxes to select items.
            </p>
            <div class="flex items-center gap-2">
              <button
                  @click="selectAllFiltered"
                  class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
              >
                Select All Visible
              </button>
              <button
                  @click="clearSelection"
                  class="px-3 py-1 bg-white border border-yellow-600 text-yellow-600 rounded text-sm hover:bg-yellow-50"
              >
                Clear Selection
              </button>
              <span class="text-sm text-yellow-800 ml-2">
                                {{ selectedItems.length }} item(s) selected
                            </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Items List -->
      <div class="space-y-3">
        <div
            v-for="item in filteredProgressItems"
            :key="item.id"
            class="bg-white rounded-lg shadow"
        >
          <div class="p-4">
            <div class="flex items-start gap-4">
              <!-- Checkbox for Bulk Update -->
              <div v-if="bulkUpdateMode" class="pt-1">
                <input
                    type="checkbox"
                    :checked="selectedItems.includes(item.id)"
                    @change="toggleItemSelection(item.id)"
                    class="w-5 h-5 text-blue-600 rounded"
                />
              </div>

              <!-- Status Icon -->
              <div class="pt-1">
                <i
                    :class="getStatusIconClass(item)"
                    class="text-2xl"
                ></i>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-gray-900 text-lg">
                      {{ item.structure_level.title }}
                    </h3>
                    <p v-if="item.structure_level.description" class="text-sm text-gray-600 mt-1">
                      {{ item.structure_level.description }}
                    </p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>
                                                <i class="fas fa-layer-group mr-1"></i>
                                                {{ item.structure_level.level_type }}
                                            </span>
                      <span>
                                                <i class="fas fa-hashtag mr-1"></i>
                                                Level {{ item.structure_level.level_number }}
                                            </span>
                      <span>
                                                <i class="fas fa-calculator mr-1"></i>
                                                Max: {{ item.max_marks }} marks
                                            </span>
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-2xl font-bold" :class="item.is_completed ? 'text-green-600' : 'text-gray-400'">
                      {{ item.marks_obtained || 0 }}/{{ item.max_marks }}
                    </div>
                    <div class="text-xs text-gray-500">{{ item.percentage }}%</div>
                  </div>
                </div>

                <!-- Progress Form -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        v-model="item.date_of_beginning"
                        type="date"
                        @change="markAsChanged(item.id)"
                        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Exam Date</label>
                    <input
                        v-model="item.date_of_examination"
                        type="date"
                        @change="markAsChanged(item.id)"
                        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Marks Obtained</label>
                    <input
                        v-model.number="item.marks_obtained"
                        type="number"
                        step="0.01"
                        :max="item.max_marks"
                        @change="markAsChanged(item.id)"
                        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Lecturer</label>
                    <select
                        v-model="item.lecturer_id"
                        @change="markAsChanged(item.id)"
                        class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Lecturer</option>
                      <option
                          v-for="teacher in teachers"
                          :key="teacher.id"
                          :value="teacher.id"
                      >
                        {{ teacher.full_name }}
                      </option>
                    </select>
                  </div>

                  <div class="flex items-end">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                          v-model="item.is_completed"
                          type="checkbox"
                          @change="markAsChanged(item.id)"
                          class="w-4 h-4 text-blue-600 rounded"
                      />
                      <span class="text-sm font-medium text-gray-700">Completed</span>
                    </label>
                  </div>
                </div>

                <!-- Remarks -->
                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                      v-model="item.remarks"
                      rows="2"
                      @change="markAsChanged(item.id)"
                      placeholder="Add remarks or notes..."
                      class="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <!-- Quick Actions -->
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex gap-2">
                    <button
                        v-if="!item.date_of_beginning"
                        @click="markAsStarted(item)"
                        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <i class="fas fa-play mr-1"></i>
                      Mark as Started
                    </button>
                    <button
                        v-if="!item.is_completed && item.date_of_beginning"
                        @click="markAsCompleted(item)"
                        class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      <i class="fas fa-check mr-1"></i>
                      Mark as Completed
                    </button>
                  </div>

                  <div class="text-xs text-gray-500">
                    <span v-if="item.lecturer">By: {{ item.lecturer.full_name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProgressItems.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
          <i class="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
          <p class="text-gray-600">Try adjusting your filters</p>
        </div>
      </div>
    </div>

    <!-- Quick Mark Dialog -->
    <transition name="modal">
      <div v-if="showQuickMarkDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">{{ quickMarkMode === 'started' ? 'Mark as Started' : 'Mark as Completed' }}</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ quickMarkMode === 'started' ? 'Start Date' : 'Examination Date' }}
                </label>
                <input
                    v-model="quickMarkData.date"
                    type="date"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Lecturer</label>
                <select
                    v-model="quickMarkData.lecturer_id"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Lecturer</option>
                  <option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="teacher.id"
                  >
                    {{ teacher.full_name }}
                  </option>
                </select>
              </div>

              <div v-if="quickMarkMode === 'completed'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Marks Obtained</label>
                <input
                    v-model.number="quickMarkData.marks_obtained"
                    type="number"
                    step="0.01"
                    :max="quickMarkItem?.max_marks"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">Max: {{ quickMarkItem?.max_marks }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea
                    v-model="quickMarkData.remarks"
                    rows="2"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex gap-3">
              <button
                  @click="showQuickMarkDialog = false"
                  class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  @click="submitQuickMark"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProgressTracker',

  data() {
    return {
      card: null,
      progressItems: [],
      statistics: null,
      loading: false,
      saving: false,
      teachers: [],
      changedItems: new Set(),
      bulkUpdateMode: false,
      selectedItems: [],
      filterStatus: '',
      searchQuery: '',
      viewMode: 'list',
      showQuickMarkDialog: false,
      quickMarkMode: 'started',
      quickMarkItem: null,
      quickMarkData: {
        date: new Date().toISOString().split('T')[0],
        lecturer_id: '',
        marks_obtained: 0,
        remarks: ''
      }
    }
  },

  computed: {
    ...mapState('progress', ['loading']),

    cardId() {
      return this.$route.params.id
    },

    hasChanges() {
      return this.changedItems.size > 0
    },

    filteredProgressItems() {
      let items = [...this.progressItems]

      // Filter by status
      if (this.filterStatus) {
        items = items.filter(item => {
          if (this.filterStatus === 'completed') return item.is_completed
          if (this.filterStatus === 'in_progress') return item.date_of_beginning && !item.is_completed
          if (this.filterStatus === 'not_started') return !item.date_of_beginning
          return true
        })
      }

      // Filter by search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter(item =>
            item.structure_level.title.toLowerCase().includes(query) ||
            (item.structure_level.description && item.structure_level.description.toLowerCase().includes(query))
        )
      }

      return items
    }
  },

  created() {
    this.loadData()
    this.loadTeachers()
  },

  methods: {
    ...mapActions('progress', ['fetchProgress', 'updateProgress', 'bulkUpdateProgress', 'markStarted', 'markCompleted', 'fetchStatistics']),

    async loadData() {
      this.loading = true
      try {
        // Load card details
        const cardResponse = await this.$http.get(`/student-cards/${this.cardId}`)
        this.card = cardResponse.data.data

        // Load progress
        const progressResponse = await this.$http.get(`/progress/record/${this.cardId}`)
        this.progressItems = progressResponse.data.data

        // Load statistics
        await this.loadStatistics()
      } catch (error) {
        this.$toast.error('Error loading data')
        this.$router.push('/student-cards')
      } finally {
        this.loading = false
      }
    },

    async loadStatistics() {
      try {
        const response = await this.$http.get(`/progress/statistics/${this.cardId}`)
        this.statistics = response.data.data
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    },

    async loadTeachers() {
      try {
        const response = await this.$http.get('/teachers', {
          params: { is_active: 1, per_page: 100 }
        })
        this.teachers = response.data.data
      } catch (error) {
        console.error('Error loading teachers:', error)
      }
    },

    markAsChanged(itemId) {
      this.changedItems.add(itemId)
    },

    async saveAllProgress() {
      if (this.changedItems.size === 0) return

      this.saving = true
      try {
        const itemsToUpdate = this.progressItems
            .filter(item => this.changedItems.has(item.id))
            .map(item => ({
              id: item.id,
              date_of_beginning: item.date_of_beginning,
              date_of_examination: item.date_of_examination,
              marks_obtained: item.marks_obtained,
              remarks: item.remarks,
              lecturer_id: item.lecturer_id,
              is_completed: item.is_completed
            }))

        await this.$http.post('/progress/bulk-update', {
          progress_items: itemsToUpdate
        })

        this.changedItems.clear()
        await this.loadStatistics()
        this.$toast.success('Progress updated successfully')
      } catch (error) {
        this.$toast.error('Error updating progress')
      } finally {
        this.saving = false
      }
    },

    markAsStarted(item) {
      this.quickMarkMode = 'started'
      this.quickMarkItem = item
      this.quickMarkData = {
        date: new Date().toISOString().split('T')[0],
        lecturer_id: '',
        marks_obtained: 0,
        remarks: ''
      }
      this.showQuickMarkDialog = true
    },

    markAsCompleted(item) {
      this.quickMarkMode = 'completed'
      this.quickMarkItem = item
      this.quickMarkData = {
        date: new Date().toISOString().split('T')[0],
        lecturer_id: item.lecturer_id || '',
        marks_obtained: item.marks_obtained || 0,
        remarks: item.remarks || ''
      }
      this.showQuickMarkDialog = true
    },

    async submitQuickMark() {
      if (!this.quickMarkData.lecturer_id) {
        this.$toast.error('Please select a lecturer')
        return
      }

      try {
        if (this.quickMarkMode === 'started') {
          await this.$http.post(`/progress/${this.quickMarkItem.id}/mark-started`, {
            date_of_beginning: this.quickMarkData.date,
            lecturer_id: this.quickMarkData.lecturer_id
          })
        } else {
          await this.$http.post(`/progress/${this.quickMarkItem.id}/mark-completed`, {
            date_of_examination: this.quickMarkData.date,
            marks_obtained: this.quickMarkData.marks_obtained,
            remarks: this.quickMarkData.remarks,
            lecturer_id: this.quickMarkData.lecturer_id
          })
        }

        this.showQuickMarkDialog = false
        await this.loadData()
        this.$toast.success('Progress updated successfully')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error updating progress')
      }
    },

    toggleItemSelection(itemId) {
      const index = this.selectedItems.indexOf(itemId)
      if (index > -1) {
        this.selectedItems.splice(index, 1)
      } else {
        this.selectedItems.push(itemId)
      }
    },

    selectAllFiltered() {
      this.selectedItems = this.filteredProgressItems.map(item => item.id)
    },

    clearSelection() {
      this.selectedItems = []
    },

    getStatusIconClass(item) {
      if (item.is_completed) return 'fas fa-check-circle text-green-600'
      if (item.date_of_beginning) return 'fas fa-spinner text-yellow-600'
      return 'far fa-circle text-gray-400'
    },

    getProgressColor(percentage) {
      if (percentage >= 80) return 'bg-green-500'
      if (percentage >= 50) return 'bg-yellow-500'
      if (percentage >= 25) return 'bg-orange-500'
      return 'bg-red-500'
    }
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;
}
</style>