<template>
  <div class="student-card-record-view">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Student Card Record Details</h2>
        <p class="text-muted">View complete card record information</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link
            :to="`/student-card-records/${id}/edit`"
            class="btn btn-warning me-2"
        >
          <i class="bi bi-pencil me-2"></i>Edit
        </router-link>
        <router-link to="/student-card-records" class="btn btn-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </router-link>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Record Details -->
    <div v-else-if="record">
      <!-- Basic Information Card -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Basic Information</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Card Number</label>
              <strong>{{ record.card_number || 'N/A' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Student</label>
              <strong>{{ record.student ? record.student.name : 'N/A' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Card Type</label>
              <strong>{{ record.card_type ? record.card_type.name : 'N/A' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Academic Year</label>
              <strong>{{ record.academic_year ? record.academic_year.name : 'N/A' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Status</label>
              <span
                  class="badge fs-6"
                  :class="getStatusClass(record.status)"
              >
                {{ formatStatus(record.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Summary Card -->
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">Progress Summary</h5>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div class="col-md-3">
              <div class="text-center p-3 bg-light rounded">
                <h2 class="text-primary mb-0">{{ record.total_marks_obtained || 0 }}</h2>
                <small class="text-muted">Total Marks</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="text-center p-3 bg-light rounded">
                <h2 class="text-success mb-0">{{ record.total_attendance || 0 }}</h2>
                <small class="text-muted">Total Attendance</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="text-center p-3 bg-light rounded">
                <h2 class="text-info mb-0">{{ record.attendance_percentage || 0 }}%</h2>
                <small class="text-muted">Attendance %</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="text-center p-3 bg-light rounded">
                <h2 class="text-warning mb-0">
                  {{ record.structure_progress ? record.structure_progress.length : 0 }}
                </h2>
                <small class="text-muted">Structure Progress</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Placement Information -->
      <div class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0">Placement Information</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Cadaver</label>
              <strong>{{ record.cadaver ? record.cadaver.name : 'Not Assigned' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Specimen</label>
              <strong>{{ record.specimen ? record.specimen.name : 'Not Assigned' }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Placement Start Date</label>
              <strong>{{ formatDate(record.placement_start_date) }}</strong>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Placement End Date</label>
              <strong>{{ formatDate(record.placement_end_date) }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Structure Progress -->
      <div v-if="record.structure_progress && record.structure_progress.length > 0" class="card mb-4">
        <div class="card-header bg-warning text-white">
          <h5 class="mb-0">Structure Progress</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
              <tr>
                <th>Structure Level</th>
                <th>Date Started</th>
                <th>Date Examined</th>
                <th>Marks</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="progress in record.structure_progress" :key="progress.id">
                <td>{{ progress.structure_level ? progress.structure_level.title : 'N/A' }}</td>
                <td>{{ formatDate(progress.date_of_beginning) }}</td>
                <td>{{ formatDate(progress.date_of_examination) }}</td>
                <td>{{ progress.marks_obtained || 0 }} / {{ progress.max_marks || 0 }}</td>
                <td>
                    <span class="badge" :class="progress.is_completed ? 'bg-success' : 'bg-warning'">
                      {{ progress.is_completed ? 'Completed' : 'In Progress' }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Term Exam Results -->
      <div v-if="record.term_exam_results && record.term_exam_results.length > 0" class="card mb-4">
        <div class="card-header bg-danger text-white">
          <h5 class="mb-0">Term Exam Results</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
              <tr>
                <th>Term</th>
                <th>Exam Date</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Remarks</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="result in record.term_exam_results" :key="result.id">
                <td>{{ result.term_exam ? result.term_exam.term_name : 'N/A' }}</td>
                <td>{{ formatDate(result.exam_date) }}</td>
                <td>{{ result.marks_obtained || 0 }}</td>
                <td>{{ result.term_exam ? result.term_exam.total_marks : 0 }}</td>
                <td>{{ result.percentage || 0 }}%</td>
                <td>{{ result.remarks || '-' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Remarks -->
      <div v-if="record.overall_remarks" class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Overall Remarks</h5>
        </div>
        <div class="card-body">
          <p class="mb-0">{{ record.overall_remarks }}</p>
        </div>
      </div>

      <!-- Signatures -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Signatures</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">Batch Teacher</label>
              <div v-if="record.batch_teacher_signature">
                <strong>Signed</strong>
                <br />
                <small class="text-muted">{{ formatDate(record.batch_teacher_signed_at) }}</small>
              </div>
              <div v-else>
                <span class="text-muted">Not Signed</span>
              </div>
            </div>
            <div class="col-md-6">
              <label class="text-muted d-block mb-1">HOD</label>
              <div v-if="record.hod_signature">
                <strong>Signed</strong>
                <br />
                <small class="text-muted">{{ formatDate(record.hod_signed_at) }}</small>
              </div>
              <div v-else>
                <span class="text-muted">Not Signed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'StudentCardRecordView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      record: null,
      loading: false
    };
  },
  mounted() {
    this.loadRecord();
  },
  methods: {
    async loadRecord() {
      this.loading = true;
      try {
        const response = await api.studentCardRecords.getById(this.id);
        this.record = response.data;
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load record',
          type: 'danger'
        });
        this.$router.push('/student-card-records');
      } finally {
        this.loading = false;
      }
    },
    getStatusClass(status) {
      const classes = {
        not_started: 'bg-secondary',
        in_progress: 'bg-info',
        completed: 'bg-success',
        failed: 'bg-danger'
      };
      return classes[status] || 'bg-secondary';
    },
    formatStatus(status) {
      return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>