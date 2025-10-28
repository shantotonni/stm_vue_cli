<template>
  <div class="attendance-bulk-mark">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Bulk Mark Attendance</h2>
        <p class="text-muted">Mark attendance for multiple students</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/attendance" class="btn btn-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </router-link>
      </div>
    </div>

    <!-- Class Information Card -->
    <div class="card mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Class Information</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label required">Class Date</label>
            <input v-model="classInfo.class_date" type="date" class="form-control" required />
          </div>
          <div class="col-md-4">
            <label class="form-label required">Class Type</label>
            <select v-model="classInfo.class_type" class="form-select" required>
              <option value="">Select Type</option>
              <option value="lecture">Lecture</option>
              <option value="tutorial">Tutorial</option>
              <option value="practical">Practical</option>
              <option value="demonstration">Demonstration</option>
              <option value="integrated">Integrated</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label required">Card Type</label>
            <select v-model="classInfo.card_type_id" class="form-select" required>
              <option value="">Select Card Type</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Class Topic</label>
            <input v-model="classInfo.class_topic" type="text" class="form-control" placeholder="Enter topic" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Conducted By</label>
            <select v-model="classInfo.conducted_by_teacher_id" class="form-select">
              <option value="">Select Teacher (Optional)</option>
              <!-- Dynamic options -->
            </select>
          </div>
          <div class="col-md-12">
            <button @click="loadStudents" type="button" class="btn btn-primary" :disabled="!isClassInfoValid || loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Load Students
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Students List -->
    <div v-if="students.length > 0" class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Mark Attendance</h5>
        <div class="btn-group" role="group">
          <button @click="markAll('present')" type="button" class="btn btn-sm btn-success">All Present</button>
          <button @click="markAll('absent')" type="button" class="btn btn-sm btn-danger">All Absent</button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(student, index) in students" :key="student.id">
              <td>
                <strong>{{ student.name }}</strong>
              </td>
              <td>{{ student.student_id || 'N/A' }}</td>
              <td>
                <div class="btn-group btn-group-sm" role="group">
                  <input type="radio" class="btn-check" :name="`status-${student.id}`" :id="`present-${student.id}`" v-model="attendanceRecords[index].status" value="present">
                  <label class="btn btn-outline-success" :for="`present-${student.id}`">Present</label>

                  <input type="radio" class="btn-check" :name="`status-${student.id}`" :id="`absent-${student.id}`" v-model="attendanceRecords[index].status" value="absent">
                  <label class="btn btn-outline-danger" :for="`absent-${student.id}`">Absent</label>

                  <input type="radio" class="btn-check" :name="`status-${student.id}`" :id="`late-${student.id}`" v-model="attendanceRecords[index].status" value="late">
                  <label class="btn btn-outline-warning" :for="`late-${student.id}`">Late</label>

                  <input type="radio" class="btn-check" :name="`status-${student.id}`" :id="`excused-${student.id}`" v-model="attendanceRecords[index].status" value="excused">
                  <label class="btn btn-outline-info" :for="`excused-${student.id}`">Excused</label>
                </div>
              </td>
              <td>
                <input v-model="attendanceRecords[index].remarks" type="text" class="form-control form-control-sm" placeholder="Optional remarks" />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        <div class="d-flex justify-content-between">
          <router-link to="/attendance" class="btn btn-secondary">Cancel</router-link>
          <button @click="submitBulkAttendance" type="button" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            Submit Attendance ({{ students.length }} students)
          </button>
        </div>
      </div>
    </div>

    <!-- No Students Message -->
    <div v-else-if="!loading && classInfo.card_type_id" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      Click "Load Students" to fetch students for this card type.
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'AttendanceBulkMark',
  data() {
    return {
      classInfo: {
        class_date: new Date().toISOString().split('T')[0],
        class_type: '',
        card_type_id: '',
        class_topic: '',
        conducted_by_teacher_id: ''
      },
      students: [],
      attendanceRecords: [],
      loading: false,
      submitting: false
    };
  },
  computed: {
    isClassInfoValid() {
      return this.classInfo.class_date && this.classInfo.class_type && this.classInfo.card_type_id;
    }
  },
  methods: {
    async loadStudents() {
      this.loading = true;
      try {
        // This should fetch students based on card_type_id
        // For now using placeholder
        // const response = await api.students.getByCardType(this.classInfo.card_type_id);
        // this.students = response.data;

        // Placeholder - replace with actual API call
        this.students = [
          { id: 1, name: 'Student 1', student_id: 'S001' },
          { id: 2, name: 'Student 2', student_id: 'S002' }
        ];

        // Initialize attendance records
        this.attendanceRecords = this.students.map(student => ({
          student_id: student.id,
          status: 'present',
          remarks: ''
        }));
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    markAll(status) {
      this.attendanceRecords.forEach(record => {
        record.status = status;
      });
    },
    async submitBulkAttendance() {
      this.submitting = true;
      try {
        const attendances = this.attendanceRecords.map(record => ({
          student_id: record.student_id,
          card_type_id: this.classInfo.card_type_id,
          class_date: this.classInfo.class_date,
          class_type: this.classInfo.class_type,
          class_topic: this.classInfo.class_topic,
          status: record.status,
          remarks: record.remarks,
          conducted_by_teacher_id: this.classInfo.conducted_by_teacher_id || null,
          marked_by_teacher_id: this.classInfo.conducted_by_teacher_id || null
        }));

        await api.attendance.bulkMark({ attendances });

        this.$root.$emit('show-notification', {
          message: `Attendance marked successfully for ${this.students.length} students`,
          type: 'success'
        });

        this.$router.push('/attendance');
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to submit attendance',
          type: 'danger'
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.required::after {
  content: ' *';
  color: red;
}
</style>