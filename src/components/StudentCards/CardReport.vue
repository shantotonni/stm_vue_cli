<template>
  <div class="card-report">
    <loading-spinner v-if="loading" />

    <div v-else-if="reportData" class="max-w-7xl mx-auto p-6">
      <!-- Action Bar (No Print) -->
      <div class="no-print mb-6 flex items-center justify-between">
        <router-link
            :to="`/student-cards/${cardId}`"
            class="text-blue-600 hover:text-blue-800"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Card Details
        </router-link>

        <div class="flex gap-2">
          <button
              @click="downloadPDF"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <i class="fas fa-file-pdf"></i>
            Download PDF
          </button>
          <button
              @click="printReport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <i class="fas fa-print"></i>
            Print Report
          </button>
        </div>
      </div>

      <!-- Printable Report -->
      <div id="printable-report" class="bg-white shadow-lg">
        <!-- Report Header -->
        <div class="report-header border-b-4 border-blue-600 p-8 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Medical College</h1>
          <h2 class="text-xl font-semibold text-gray-700 mb-1">Student Progress Card Report</h2>
          <p class="text-gray-600">{{ reportData.record.card_type.department.name }}</p>
        </div>

        <!-- Student Information -->
        <div class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Student Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-3">
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Name:</span>
              <span class="text-gray-900">{{ reportData.record.student.full_name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Roll Number:</span>
              <span class="text-gray-900">{{ reportData.record.student.roll_no }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Session:</span>
              <span class="text-gray-900">{{ reportData.record.student.session?.session_name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Batch:</span>
              <span class="text-gray-900">{{ reportData.record.student.batch?.batch_name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Academic Year:</span>
              <span class="text-gray-900">{{ reportData.record.academic_year.year_name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Card Number:</span>
              <span class="text-gray-900">{{ reportData.record.card_number || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Card Information -->
        <div class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Card Information
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-3">
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Card Name:</span>
              <span class="text-gray-900">{{ reportData.record.card_type.card_name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Card Code:</span>
              <span class="text-gray-900">{{ reportData.record.card_type.card_code }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Department:</span>
              <span class="text-gray-900">{{ reportData.record.card_type.department.name }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Category:</span>
              <span class="text-gray-900">{{ formatText(reportData.record.card_type.card_category) }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">Start Date:</span>
              <span class="text-gray-900">{{ formatDate(reportData.record.placement_start_date) }}</span>
            </div>
            <div class="flex">
              <span class="font-semibold text-gray-700 w-40">End Date:</span>
              <span class="text-gray-900">
                                {{ reportData.record.placement_end_date ? formatDate(reportData.record.placement_end_date) : 'Ongoing' }}
                            </span>
            </div>
          </div>
        </div>

        <!-- Resource Assignment -->
        <div v-if="reportData.record.cadaver || reportData.record.specimen" class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Resource Assignment
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-3">
            <div v-if="reportData.record.cadaver" class="flex">
              <span class="font-semibold text-gray-700 w-40">Cadaver:</span>
              <span class="text-gray-900">
                                {{ reportData.record.cadaver.cadaver_number }}
                                ({{ reportData.record.cadaver.location }})
                            </span>
            </div>
            <div v-if="reportData.record.specimen" class="flex">
              <span class="font-semibold text-gray-700 w-40">Specimen:</span>
              <span class="text-gray-900">
                                {{ reportData.record.specimen.specimen_number }} - {{ reportData.record.specimen.specimen_name }}
                            </span>
            </div>
          </div>
        </div>

        <!-- Progress Details -->
        <div class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Progress Details
          </h3>

          <div v-if="reportData.record.card_type.structure_type === 'item_based'" class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">S/N</th>
                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Item Name</th>
                <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Start Date</th>
                <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Exam Date</th>
                <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Marks</th>
                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Lecturer</th>
                <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Remarks</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, index) in reportData.structure"
                  :key="item.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="border border-gray-300 px-4 py-2 text-sm">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm">{{ item.title }}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                  {{ item.date_of_beginning ? formatDate(item.date_of_beginning) : '-' }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                  {{ item.date_of_examination ? formatDate(item.date_of_examination) : '-' }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                  {{ item.marks_obtained || 0 }}/{{ item.max_marks }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-sm">{{ item.lecturer || '-' }}</td>
                <td class="border border-gray-300 px-4 py-2 text-sm">{{ item.remarks || '-' }}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Hierarchical Structure -->
          <div v-else class="space-y-4">
            <div v-for="(topic, topicIndex) in reportData.structure" :key="topicIndex" class="border border-gray-300 rounded">
              <div class="bg-gray-100 px-4 py-2 font-semibold border-b border-gray-300">
                {{ topicIndex + 1 }}. {{ topic.title }}
              </div>
              <div class="p-4">
                <div v-if="topic.children && topic.children.length > 0" class="space-y-2">
                  <div v-for="(child, childIndex) in topic.children" :key="childIndex" class="pl-4 border-l-2 border-blue-500">
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <p class="font-medium">{{ topicIndex + 1 }}.{{ childIndex + 1 }} {{ child.title }}</p>
                        <div class="text-sm text-gray-600 mt-1 space-y-1">
                          <div v-if="child.progress">
                            <span class="inline-block w-32">Start:</span>
                            <span>{{ child.progress.date_of_beginning ? formatDate(child.progress.date_of_beginning) : 'N/A' }}</span>
                          </div>
                          <div v-if="child.progress">
                            <span class="inline-block w-32">Exam:</span>
                            <span>{{ child.progress.date_of_examination ? formatDate(child.progress.date_of_examination) : 'N/A' }}</span>
                          </div>
                          <div v-if="child.progress && child.progress.lecturer">
                            <span class="inline-block w-32">Lecturer:</span>
                            <span>{{ child.progress.lecturer }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="text-right ml-4">
                        <div class="font-bold text-lg">
                          {{ child.progress?.marks_obtained || 0 }}/{{ child.progress?.max_marks || 0 }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ calculatePercentage(child.progress?.marks_obtained, child.progress?.max_marks) }}%
                        </div>
                      </div>
                    </div>
                    <div v-if="child.progress?.remarks" class="mt-2 text-sm text-gray-600 italic">
                      Remarks: {{ child.progress.remarks }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Term Exam Results -->
        <div v-if="reportData.record.card_type.has_term_exams && reportData.record.term_exam_results?.length > 0" class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Term Examination Results
          </h3>
          <table class="min-w-full border-collapse border border-gray-300">
            <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Term</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Date</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Marks Obtained</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Total Marks</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Percentage</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Result</th>
              <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Examiner</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(result, index) in reportData.record.term_exam_results"
                :key="result.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            >
              <td class="border border-gray-300 px-4 py-2 text-sm">{{ result.term_exam.term_name }}</td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ formatDate(result.exam_date) }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                {{ result.marks_obtained }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ result.term_exam.total_marks }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ result.percentage }}%
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                                    <span :class="result.is_passed ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'">
                                        {{ result.is_passed ? 'PASSED' : 'FAILED' }}
                                    </span>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm">
                {{ result.examiner?.full_name || '-' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Attendance Summary -->
        <div v-if="reportData.record.card_type.has_attendance && reportData.record.attendance_data" class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Attendance Summary
          </h3>
          <table class="min-w-full border-collapse border border-gray-300">
            <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Class Type</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Classes Held</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Classes Attended</th>
              <th class="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">Percentage</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(data, type, index) in reportData.record.attendance_data"
                :key="type"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
            >
              <td class="border border-gray-300 px-4 py-2 text-sm">{{ formatText(type) }}</td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">{{ data.held }}</td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">{{ data.attended }}</td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center font-semibold">
                {{ calculatePercentage(data.attended, data.held) }}%
              </td>
            </tr>
            <tr class="bg-gray-200 font-semibold">
              <td class="border border-gray-300 px-4 py-2 text-sm">OVERALL</td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ calculateTotalAttendance().held }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ calculateTotalAttendance().attended }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm text-center">
                {{ reportData.record.attendance_percentage }}%
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Statistics -->
        <div class="p-8 border-b bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Summary
          </h3>
          <div class="grid grid-cols-2 gap-x-8 gap-y-4">
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Total Items:</span>
              <span class="text-gray-900">{{ reportData.statistics.total_items }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Completed Items:</span>
              <span class="text-gray-900">{{ reportData.statistics.completed_items }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Progress Percentage:</span>
              <span class="text-gray-900 font-bold">{{ reportData.statistics.progress_percentage }}%</span>
            </div>
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Total Marks Obtained:</span>
              <span class="text-gray-900 font-bold">
                                {{ reportData.statistics.total_marks_obtained }}/{{ reportData.statistics.total_marks }}
                            </span>
            </div>
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Marks Percentage:</span>
              <span class="text-gray-900 font-bold">{{ reportData.statistics.marks_percentage }}%</span>
            </div>
            <div class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Overall Result:</span>
              <span :class="reportData.statistics.is_passed ? 'text-green-700 font-bold' : 'text-red-700 font-bold'">
                                {{ reportData.statistics.is_passed ? 'PASSED' : 'NOT PASSED' }}
                            </span>
            </div>
            <div v-if="reportData.statistics.attendance_percentage !== null" class="flex justify-between border-b border-gray-300 pb-2">
              <span class="font-semibold text-gray-700">Attendance Percentage:</span>
              <span class="text-gray-900 font-bold">{{ reportData.statistics.attendance_percentage }}%</span>
            </div>
          </div>
        </div>

        <!-- Remarks -->
        <div v-if="reportData.record.overall_remarks" class="p-8 border-b">
          <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase border-b-2 border-gray-300 pb-2">
            Overall Remarks
          </h3>
          <p class="text-gray-900 whitespace-pre-line">{{ reportData.record.overall_remarks }}</p>
        </div>

        <!-- Signatures -->
        <div class="p-8">
          <h3 class="text-lg font-bold text-gray-900 mb-6 uppercase border-b-2 border-gray-300 pb-2">
            Signatures
          </h3>
          <div class="grid grid-cols-2 gap-12 mt-12">
            <div>
              <div class="border-t-2 border-gray-400 pt-2 text-center">
                <p class="font-semibold text-gray-900">Batch Teacher</p>
                <p v-if="reportData.record.batch_teacher_signed_at" class="text-sm text-gray-600 mt-1">
                  Signed on: {{ formatDate(reportData.record.batch_teacher_signed_at) }}
                </p>
              </div>
            </div>
            <div>
              <div class="border-t-2 border-gray-400 pt-2 text-center">
                <p class="font-semibold text-gray-900">Head of Department</p>
                <p v-if="reportData.record.hod_signed_at" class="text-sm text-gray-600 mt-1">
                  Signed on: {{ formatDate(reportData.record.hod_signed_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="report-footer text-center p-4 bg-gray-100 border-t-2 border-gray-300">
          <p class="text-sm text-gray-600">
            Generated on: {{ formatDateTime(new Date()) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            This is a computer-generated report
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardReport',

  data() {
    return {
      reportData: null,
      loading: false
    }
  },

  computed: {
    cardId() {
      return this.$route.params.id
    }
  },

  created() {
    this.loadReport()
  },

  methods: {
    async loadReport() {
      this.loading = true
      try {
        const response = await this.$http.get(`/student-cards/${this.cardId}/report`)
        this.reportData = response.data.data
      } catch (error) {
        this.$toast.error('Error loading report')
        this.$router.push(`/student-cards/${this.cardId}`)
      } finally {
        this.loading = false
      }
    },

    printReport() {
      window.print()
    },

    async downloadPDF() {
      this.$toast.info('PDF download feature will be implemented with server-side generation')
      // Can be implemented using libraries like jsPDF or server-side PDF generation
    },

    formatText(text) {
      if (!text) return ''
      return text.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatDateTime(date) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    calculatePercentage(obtained, total) {
      if (!total || total === 0) return 0
      return Math.round((obtained / total) * 100)
    },

    calculateTotalAttendance() {
      let totalHeld = 0
      let totalAttended = 0

      if (this.reportData?.record?.attendance_data) {
        Object.values(this.reportData.record.attendance_data).forEach(data => {
          totalHeld += data.held || 0
          totalAttended += data.attended || 0
        })
      }

      return { held: totalHeld, attended: totalAttended }
    }
  }
}
</script>

<style scoped>
/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  #printable-report {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .report-header {
    page-break-after: avoid;
  }

  table {
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  thead {
    display: table-header-group;
  }

  tfoot {
    display: table-footer-group;
  }
}

/* Screen styles */
@media screen {
  #printable-report {
    max-width: 210mm;
    margin: 0 auto;
  }
}
</style>