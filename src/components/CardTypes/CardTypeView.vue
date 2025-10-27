<template>
  <div class="card-type-view p-6">
    <loading-spinner v-if="loading" />

    <div v-else-if="cardType" class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/card-types"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Card Types
        </router-link>

        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900">{{ cardType.card_name }}</h1>
              <span
                  :class="[
                                    'px-3 py-1 rounded-full text-sm font-semibold',
                                    cardType.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                ]"
              >
                                {{ cardType.is_active ? 'Active' : 'Inactive' }}
                            </span>
            </div>
            <p class="text-gray-600">{{ cardType.card_code }}</p>
          </div>

          <div class="flex gap-2">
            <router-link
                :to="`/card-types/${cardType.id}/structure`"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <i class="fas fa-sitemap"></i>
              Manage Structure
            </router-link>
            <router-link
                :to="`/card-types/${cardType.id}/edit`"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <i class="fas fa-edit"></i>
              Edit
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Marks</p>
              <p class="text-2xl font-bold text-gray-900">{{ cardType.total_marks }}</p>
              <p class="text-xs text-gray-500 mt-1">Pass: {{ cardType.pass_marks }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-calculator text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Structure Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ cardType.structure_levels_count || 0 }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cardType.structure_type.replace('_', ' ') }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-layer-group text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Student Records</p>
              <p class="text-2xl font-bold text-gray-900">{{ cardType.student_records_count || 0 }}</p>
              <p class="text-xs text-gray-500 mt-1">Assigned students</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-users text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Applicable Year</p>
              <p class="text-2xl font-bold text-gray-900">{{ getYearText(cardType.applicable_year) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ cardType.card_category }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i class="fas fa-graduation-cap text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-info-circle text-blue-600"></i>
                Basic Information
              </h2>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Department</label>
                  <p class="text-gray-900 font-medium">{{ cardType.department.name }}</p>
                  <p class="text-xs text-gray-500">{{ cardType.department.code }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Card Code</label>
                  <p class="text-gray-900 font-medium">{{ cardType.card_code }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Category</label>
                  <p>
                                        <span :class="getCategoryClass(cardType.card_category)">
                                            {{ formatText(cardType.card_category) }}
                                        </span>
                  </p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Structure Type</label>
                  <p class="text-gray-900">{{ formatText(cardType.structure_type) }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Marking Type</label>
                  <p class="text-gray-900">{{ formatText(cardType.marking_type) }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Sequence</label>
                  <p class="text-gray-900">{{ cardType.sequence }}</p>
                </div>
              </div>

              <div v-if="cardType.description" class="mt-4 pt-4 border-t">
                <label class="text-sm font-medium text-gray-600">Description</label>
                <p class="text-gray-900 mt-1">{{ cardType.description }}</p>
              </div>
            </div>
          </div>

          <!-- Structure Preview -->
          <div v-if="cardType.root_structure_levels && cardType.root_structure_levels.length > 0" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <i class="fas fa-sitemap text-purple-600"></i>
                  Card Structure
                </h2>
                <router-link
                    :to="`/card-types/${cardType.id}/structure`"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit Structure <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
              </div>

              <div class="space-y-2">
                <div
                    v-for="level in cardType.root_structure_levels"
                    :key="level.id"
                    class="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900">{{ level.title }}</p>
                      <p class="text-xs text-gray-500">
                        {{ level.level_type }} • Max Marks: {{ level.max_marks }}
                      </p>
                    </div>
                    <span v-if="level.children && level.children.length > 0" class="text-xs text-gray-500">
                                            {{ level.children.length }} sub-items
                                        </span>
                  </div>

                  <!-- Children -->
                  <div v-if="level.children && level.children.length > 0" class="mt-2 ml-4 space-y-1">
                    <div
                        v-for="child in level.children.slice(0, 3)"
                        :key="child.id"
                        class="text-sm text-gray-600 border-l-2 border-gray-300 pl-3 py-1"
                    >
                      {{ child.title }} ({{ child.max_marks }} marks)
                    </div>
                    <p v-if="level.children.length > 3" class="text-xs text-gray-500 ml-3">
                      ... and {{ level.children.length - 3 }} more
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-lg shadow">
            <div class="p-6 text-center">
              <i class="fas fa-sitemap text-gray-400 text-4xl mb-3"></i>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Structure Defined</h3>
              <p class="text-gray-600 mb-4">This card type doesn't have a structure yet.</p>
              <router-link
                  :to="`/card-types/${cardType.id}/structure`"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <i class="fas fa-plus"></i>
                Build Structure
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Features -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-cog text-green-600"></i>
                Features
              </h2>

              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-file-alt text-blue-600"></i>
                    <span class="text-sm font-medium">Term Exams</span>
                  </div>
                  <div>
                                        <span v-if="cardType.has_term_exams" class="text-green-600 font-semibold">
                                            {{ cardType.term_exam_count }} Terms
                                        </span>
                    <span v-else class="text-gray-400">Disabled</span>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-user-check text-green-600"></i>
                    <span class="text-sm font-medium">Attendance</span>
                  </div>
                  <div>
                                        <span v-if="cardType.has_attendance" class="text-green-600 font-semibold">
                                            Enabled
                                        </span>
                    <span v-else class="text-gray-400">Disabled</span>
                  </div>
                </div>

                <div v-if="cardType.has_attendance && cardType.attendance_types" class="pl-8">
                  <p class="text-xs text-gray-600 mb-1">Types:</p>
                  <div class="flex flex-wrap gap-1">
                                        <span
                                            v-for="type in cardType.attendance_types"
                                            :key="type"
                                            class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                        >
                                            {{ formatText(type) }}
                                        </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Requirements -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-clipboard-list text-orange-600"></i>
                Requirements
              </h2>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <i
                      :class="[
                                            'fas fa-procedures',
                                            cardType.requires_cadaver ? 'text-red-600' : 'text-gray-400'
                                        ]"
                  ></i>
                  <span
                      :class="[
                                            'text-sm',
                                            cardType.requires_cadaver ? 'text-gray-900 font-medium' : 'text-gray-400'
                                        ]"
                  >
                                        Cadaver Required
                                    </span>
                </div>

                <div class="flex items-center gap-2">
                  <i
                      :class="[
                                            'fas fa-flask',
                                            cardType.requires_specimen ? 'text-blue-600' : 'text-gray-400'
                                        ]"
                  ></i>
                  <span
                      :class="[
                                            'text-sm',
                                            cardType.requires_specimen ? 'text-gray-900 font-medium' : 'text-gray-400'
                                        ]"
                  >
                                        Specimen Required
                                    </span>
                </div>

                <div class="flex items-center gap-2">
                  <i
                      :class="[
                                            'fas fa-tools',
                                            cardType.requires_equipment ? 'text-purple-600' : 'text-gray-400'
                                        ]"
                  ></i>
                  <span
                      :class="[
                                            'text-sm',
                                            cardType.requires_equipment ? 'text-gray-900 font-medium' : 'text-gray-400'
                                        ]"
                  >
                                        Equipment Required
                                    </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>

              <div class="space-y-2">
                <router-link
                    to="/student-cards/assign"
                    class="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-user-plus text-blue-600"></i>
                  <span class="text-sm font-medium">Assign to Students</span>
                </router-link>

                <router-link
                    :to="`/card-types/${cardType.id}/structure`"
                    class="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-sitemap text-purple-600"></i>
                  <span class="text-sm font-medium">Manage Structure</span>
                </router-link>

                <button
                    @click="duplicateCard"
                    class="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-copy text-green-600"></i>
                  <span class="text-sm font-medium">Duplicate Card</span>
                </button>

                <button
                    @click="confirmDelete"
                    class="w-full flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  <i class="fas fa-trash text-red-600"></i>
                  <span class="text-sm font-medium text-red-600">Delete Card</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Created:</span>
                  <span class="font-medium">{{ formatDate(cardType.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Updated:</span>
                  <span class="font-medium">{{ formatDate(cardType.updated_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <confirm-dialog
        :show="showDeleteDialog"
        title="Delete Card Type"
        message="Are you sure you want to delete this card type? This action cannot be undone and will affect all associated student records."
        confirm-text="Delete"
        cancel-text="Cancel"
        variant="danger"
        @confirm="deleteCard"
        @cancel="showDeleteDialog = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CardTypeView',

  data() {
    return {
      cardType: null,
      loading: false,
      showDeleteDialog: false
    }
  },

  computed: {
    cardId() {
      return this.$route.params.id
    }
  },

  created() {
    this.loadCardType()
  },

  methods: {
    ...mapActions('cardTypes', ['fetchCardType', 'deleteCardType', 'duplicateCardType']),

    async loadCardType() {
      this.loading = true
      try {
        this.cardType = await this.fetchCardType(this.cardId)
      } catch (error) {
        this.$toast.error('Error loading card type')
        this.$router.push('/card-types')
      } finally {
        this.loading = false
      }
    },

    async duplicateCard() {
      try {
        await this.duplicateCardType(this.cardId)
        this.$toast.success('Card type duplicated successfully')
        this.$router.push('/card-types')
      } catch (error) {
        this.$toast.error('Error duplicating card type')
      }
    },

    confirmDelete() {
      this.showDeleteDialog = true
    },

    async deleteCard() {
      try {
        await this.deleteCardType(this.cardId)
        this.$toast.success('Card type deleted successfully')
        this.$router.push('/card-types')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error deleting card type')
        this.showDeleteDialog = false
      }
    },

    getCategoryClass(category) {
      const classes = {
        practical: 'px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800',
        dissection: 'px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800',
        lab: 'px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800',
        clinical: 'px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800',
        theory: 'px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800',
        assessment: 'px-3 py-1 text-sm font-semibold rounded-full bg-pink-100 text-pink-800'
      }
      return classes[category] || classes.practical
    },

    formatText(text) {
      if (!text) return ''
      return text.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    getYearText(year) {
      const yearMap = {
        1: '1st Year',
        2: '2nd Year',
        3: '3rd Year',
        4: '4th Year',
        5: '5th Year'
      }
      return yearMap[year] || `Year ${year}`
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>