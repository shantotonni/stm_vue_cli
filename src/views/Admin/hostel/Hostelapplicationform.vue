<template>
  <div class="hostel-application-container">
    <!-- Form Header -->
    <div class="form-header">
      <div class="logo-section">
        <img src="../../../assets/images/logo.png" alt="MCW Logo" class="mcw-logo" />
      </div>
      <div class="title-section">
        <h1>HOSTEL SEAT</h1>
        <p class="subtitle">ALLOTMENT FORM</p>
      </div>
      <div class="photo-section">
        <div class="photo-upload">
          <img v-if="form.student_photo_preview" :src="form.student_photo_preview" alt="Student Photo" />
          <div v-else class="photo-placeholder">
            <i class="fas fa-user"></i>
            <span>STUDENT'S PHOTO</span>
            <span v-if="studentLoaded" class="auto-loaded">(Auto-loaded)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- College Info -->
    <div class="college-info">
      <p class="college-name">MCW | MEDICAL COLLEGE FOR WOMEN AND HOSPITAL</p>
      <p class="address">
        Plot-4, Road-8-9, Sector-1, Uttara Model Town, Dhaka-1230, Bangladesh<br />
        Phone: 88-02-58953939, 88-02-58950003, Fax: 88-02-7912428<br />
        E-mail: medicalcollegeforwomen@yahoo.com, Web: www.medicalcollegeforwomen.edu.bd
      </p>
    </div>

    <!-- Student ID Lookup Section -->
    <div class="student-lookup-section">
      <div class="lookup-box">
        <div class="lookup-title">
          <i class="fas fa-search"></i>
          Student Information Lookup
        </div>
        <div class="lookup-form">
          <div class="lookup-input-group">
            <label>Student ID / Roll Number:</label>
            <input
                type="text"
                v-model="studentId"
                @input="clearStudentData"
                placeholder="Enter Student ID or Roll Number"
                class="lookup-input"
                :disabled="studentLoaded"
            />
            <button
                type="button"
                @click="fetchStudentData"
                class="btn-lookup"
                :disabled="!studentId || isLoadingStudent || studentLoaded"
            >
              <i class="fas fa-search" v-if="!isLoadingStudent"></i>
              <i class="fas fa-spinner fa-spin" v-else></i>
              {{ isLoadingStudent ? 'Searching...' : 'Search Student' }}
            </button>
            <button
                v-if="studentLoaded"
                type="button"
                @click="resetStudentLookup"
                class="btn-reset"
            >
              <i class="fas fa-redo"></i>
              Change Student
            </button>
          </div>

          <!-- Success Message -->
          <div v-if="studentLoaded" class="student-loaded-message">
            <i class="fas fa-check-circle"></i>
            Student information loaded successfully! You can now fill in the remaining details.
          </div>

          <!-- Error Message -->
          <div v-if="studentLoadError" class="student-error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ studentLoadError }}
          </div>
        </div>
      </div>
    </div>

    <!-- Form Body -->
    <form @submit.prevent="submitForm" class="application-form">
      <!-- Office Use Section -->
      <div class="office-section">
        <h3>For office only</h3>
        <div class="office-grid">
          <div class="form-group">
            <label>Present seat allotment date:</label>
            <input
                type="date"
                v-model="form.present_seat_allotment_date"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Room no:</label>
            <input
                type="text"
                v-model="form.room_no"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Risk bond no:</label>
            <input
                type="text"
                v-model="form.risk_bond_no"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Date:</label>
            <input
                type="date"
                v-model="form.allotment_date"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>First hostel entry date:</label>
            <input
                type="date"
                v-model="form.first_hostel_entry_date"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Dues clear up to:</label>
            <input
                type="date"
                v-model="form.dues_clear_up_to"
                class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Hostel seat cancellation date:</label>
            <input
                type="date"
                v-model="form.hostel_seat_cancellation_date"
                class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Student Information -->
      <div class="student-section">
        <div class="section-header">
          <h3>Student Information</h3>
          <span v-if="studentLoaded" class="auto-filled-badge">
            <i class="fas fa-magic"></i> Auto-filled from student database
          </span>
        </div>

        <div class="form-row">
          <label>Name (Capital Letter)</label>
          <input
              type="text"
              v-model="form.student_name"
              class="form-control-inline"
              placeholder="Student Name"
              required
              style="text-transform: uppercase"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
          <label class="inline-label">*Mobile:</label>
          <input
              type="tel"
              v-model="form.student_mobile"
              class="form-control-inline short"
              placeholder="01XXXXXXXXX"
              required
              :readonly="studentLoaded && form.student_mobile"
              :class="{ 'auto-filled': studentLoaded && form.student_mobile }"
          />
        </div>

        <div class="form-row">
          <label>College batch: MCW</label>
          <input
              type="text"
              v-model="form.college_batch"
              class="form-control-inline short"
              placeholder="Batch"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
          <label class="inline-label">Session:</label>
          <input
              type="text"
              v-model="form.mcw_session"
              class="form-control-inline short"
              placeholder="Session"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
          <label class="inline-label">Present year:</label>
          <input
              type="text"
              v-model="form.present_year"
              class="form-control-inline short"
              placeholder="Year"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
        </div>

        <div class="form-row">
          <label>First year admission roll no</label>
          <input
              type="text"
              v-model="form.first_year_roll_no"
              class="form-control-inline"
              placeholder="Roll Number"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
          <label class="inline-label">Third year roll no:</label>
          <input
              type="text"
              v-model="form.third_year_roll_no"
              class="form-control-inline"
              placeholder="Roll Number"
              :readonly="studentLoaded"
              :class="{ 'auto-filled': studentLoaded }"
          />
        </div>

        <div class="form-row">
          <label>Student's present Address</label>
          <input
              type="text"
              v-model="form.present_address"
              class="form-control-inline full"
              placeholder="Present Address"
              :class="{ 'auto-filled': studentLoaded && form.present_address }"
          />
        </div>

        <div class="form-row">
          <label>Student's permanent Address</label>
          <input
              type="text"
              v-model="form.permanent_address"
              class="form-control-inline full"
              placeholder="Permanent Address"
              :class="{ 'auto-filled': studentLoaded && form.permanent_address }"
          />
        </div>

        <div class="form-row">
          <label>Marital status</label>
          <select v-model="form.marital_status" class="form-control-inline short">
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Guardian Information Section -->
        <div class="guardian-info-section">
          <h4>Guardian Information (Please fill in manually)</h4>

          <div class="form-row">
            <label>Father's Name</label>
            <input
                type="text"
                v-model="form.father.name"
                class="form-control-inline"
                placeholder="Father's Name"
            />
            <label class="inline-label">Occupation:</label>
            <input
                type="text"
                v-model="form.father.occupation"
                class="form-control-inline short"
                placeholder="Occupation"
            />
            <label class="inline-label">*Mobile:</label>
            <input
                type="tel"
                v-model="form.father.mobile"
                class="form-control-inline short"
                placeholder="01XXXXXXXXX"
            />
          </div>

          <div class="form-row">
            <label>Mother's Name</label>
            <input
                type="text"
                v-model="form.mother.name"
                class="form-control-inline"
                placeholder="Mother's Name"
            />
            <label class="inline-label">Occupation:</label>
            <input
                type="text"
                v-model="form.mother.occupation"
                class="form-control-inline short"
                placeholder="Occupation"
            />
            <label class="inline-label">*Mobile:</label>
            <input
                type="tel"
                v-model="form.mother.mobile"
                class="form-control-inline short"
                placeholder="01XXXXXXXXX"
            />
          </div>

          <div class="form-row">
            <label>Local Guardian's name with relation</label>
            <input
                type="text"
                v-model="form.local_guardian.name"
                class="form-control-inline"
                placeholder="Guardian's Name"
            />
            <label class="inline-label">Relation:</label>
            <input
                type="text"
                v-model="form.local_guardian.relation"
                class="form-control-inline short"
                placeholder="Relation"
            />
            <label class="inline-label">*Mobile no:</label>
            <input
                type="tel"
                v-model="form.local_guardian.mobile"
                class="form-control-inline short"
                placeholder="01XXXXXXXXX"
            />
          </div>

          <div class="form-row">
            <label>Local Guardian's address</label>
            <input
                type="text"
                v-model="form.local_guardian.address"
                class="form-control-inline full"
                placeholder="Local Guardian's Address"
            />
          </div>
        </div>

        <div class="form-row">
          <label>Reason for asking/change a hostel seat (in brief):</label>
          <textarea
              v-model="form.reason_for_seat"
              class="form-control-inline full"
              rows="3"
              placeholder="Briefly describe the reason"
          ></textarea>
        </div>
      </div>

      <!-- Undertaking Section -->
      <div class="undertaking-section">
        <h4>UNDERTAKING BY THE STUDENT:</h4>
        <p>
          Above information given by me is true. I shall abide by the rules & discipline of the hostel as may be promulgated by the "Medical College
          for Women" authority from time to time, failing which I shall be liable for disciplinary action as may be imposed upon me.
        </p>
        <div class="signature-container">
          <button type="button" @click="openSignatureModal('student')" class="signature-btn">
            <img v-if="form.student_signature" :src="form.student_signature" alt="Student Signature" class="signature-preview" />
            <span v-else>Click to Sign</span>
          </button>
          <label>Student's Signature & Date</label>
        </div>
      </div>

      <!-- Parents & Guardian Section -->
      <div class="parents-section">
        <h4>UNDERTAKING BY THE PARENTS & GUARDIAN:</h4>
        <p>
          My above named daughter/ward shall abide by the rules & discipline of the hostel of Medical College for Women, failing which the
          authority will take the necessary action against my daughter/ward with or without fine.
        </p>

        <div class="signatures-grid">
          <!-- Father's Signature -->
          <div class="signature-block">
            <div class="photo-signature-combo">
              <div class="guardian-photo-upload" @click="triggerGuardianPhotoUpload('father')">
                <img v-if="form.father.photo_preview" :src="form.father.photo_preview" alt="Father Photo" />
                <div v-else class="photo-placeholder small">
                  <span>FATHER'S PHOTO</span>
                </div>
                <input
                    type="file"
                    ref="fatherPhoto"
                    @change="handleGuardianPhoto('father', $event)"
                    accept="image/*"
                    style="display: none"
                />
              </div>
              <div class="signature-area">
                <button type="button" @click="openSignatureModal('father')" class="signature-btn small">
                  <img v-if="form.father.signature" :src="form.father.signature" alt="Father Signature" class="signature-preview" />
                  <span v-else>Sign Here</span>
                </button>
                <label>FATHER'S SIGNATURE<br />DATE:</label>
              </div>
            </div>
          </div>

          <!-- Mother's Signature -->
          <div class="signature-block">
            <div class="photo-signature-combo">
              <div class="guardian-photo-upload" @click="triggerGuardianPhotoUpload('mother')">
                <img v-if="form.mother.photo_preview" :src="form.mother.photo_preview" alt="Mother Photo" />
                <div v-else class="photo-placeholder small">
                  <span>MOTHER'S PHOTO</span>
                </div>
                <input
                    type="file"
                    ref="motherPhoto"
                    @change="handleGuardianPhoto('mother', $event)"
                    accept="image/*"
                    style="display: none"
                />
              </div>
              <div class="signature-area">
                <button type="button" @click="openSignatureModal('mother')" class="signature-btn small">
                  <img v-if="form.mother.signature" :src="form.mother.signature" alt="Mother Signature" class="signature-preview" />
                  <span v-else>Sign Here</span>
                </button>
                <label>MOTHER'S SIGNATURE<br />DATE:</label>
              </div>
            </div>
          </div>

          <!-- Local Guardian's Signature -->
          <div class="signature-block">
            <div class="photo-signature-combo">
              <div class="guardian-photo-upload" @click="triggerGuardianPhotoUpload('local_guardian')">
                <img v-if="form.local_guardian.photo_preview" :src="form.local_guardian.photo_preview" alt="Guardian Photo" />
                <div v-else class="photo-placeholder small">
                  <span>LOCAL GUARDIAN'S PHOTO</span>
                </div>
                <input
                    type="file"
                    ref="localGuardianPhoto"
                    @change="handleGuardianPhoto('local_guardian', $event)"
                    accept="image/*"
                    style="display: none"
                />
              </div>
              <div class="signature-area">
                <button type="button" @click="openSignatureModal('local_guardian')" class="signature-btn small">
                  <img v-if="form.local_guardian.signature" :src="form.local_guardian.signature" alt="Guardian Signature" class="signature-preview" />
                  <span v-else>Sign Here</span>
                </button>
                <label>LOCAL GUARDIAN'S SIGNATURE<br />DATE:</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Authority Signatures -->
      <div class="authority-section">
        <div class="authority-signatures">
          <div class="authority-sign">
            <div class="sign-line"></div>
            <label>Asst Hostel Super</label>
          </div>
          <div class="authority-sign">
            <div class="sign-line"></div>
            <label>Vice Principal</label>
          </div>
          <div class="authority-sign">
            <div class="sign-line"></div>
            <label>Principal</label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="button" @click="previewForm" class="btn btn-secondary" :disabled="!studentLoaded">
          <i class="fas fa-eye"></i> Preview
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting || !studentLoaded">
          <i class="fas fa-save"></i> {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </form>

    <!-- Signature Modal -->
    <SignatureModal
        v-if="showSignatureModal"
        :signature-type="currentSignatureType"
        @close="closeSignatureModal"
        @save="saveSignature"
    />

    <!-- Preview Modal -->
    <PreviewModal
        v-if="showPreviewModal"
        :application="form"
        @close="showPreviewModal = false"
        @print="printApplication"
    />
  </div>
</template>

<script>
import SignatureModal from './SignatureModal.vue';
import PreviewModal from './PreviewModal.vue';

export default {
  name: 'HostelApplicationForm',

  components: {
    SignatureModal,
    PreviewModal
  },

  data() {
    return {
      studentId: '',
      studentLoaded: false,
      isLoadingStudent: false,
      studentLoadError: '',

      form: {
        // Student Info (Auto-filled from student table)
        student_id: null,
        student_name: '',
        student_mobile: '',
        student_photo: null,
        student_photo_preview: null,

        // Academic (Auto-filled)
        college_batch: '',
        mcw_session: '',
        present_year: '',
        first_year_roll_no: '',
        third_year_roll_no: '',

        // Address (May be auto-filled if available)
        present_address: '',
        permanent_address: '',
        marital_status: '',

        // Reason (User fills)
        reason_for_seat: '',

        // Office Use
        present_seat_allotment_date: '',
        room_no: '',
        risk_bond_no: '',
        allotment_date: '',
        first_hostel_entry_date: '',
        dues_clear_up_to: '',
        hostel_seat_cancellation_date: '',

        // Signatures
        student_signature: null,

        // Guardian Info (User fills manually)
        father: {
          name: '',
          occupation: '',
          mobile: '',
          photo: null,
          photo_preview: null,
          signature: null
        },

        mother: {
          name: '',
          occupation: '',
          mobile: '',
          photo: null,
          photo_preview: null,
          signature: null
        },

        local_guardian: {
          name: '',
          relation: '',
          mobile: '',
          address: '',
          photo: null,
          photo_preview: null,
          signature: null
        }
      },

      showSignatureModal: false,
      currentSignatureType: null,
      showPreviewModal: false,
      isSubmitting: false
    };
  },

  methods: {
    async fetchStudentData() {
      if (!this.studentId) {
        this.$notify({
          title: 'Error',
          message: 'Please enter Student ID',
          type: 'warning'
        });
        return;
      }

      this.isLoadingStudent = true;
      this.studentLoadError = '';

      try {
        const response = await this.$api.get(`/students/get_student/${this.studentId}`);
        const student = response.data.data;

        // Auto-fill student information
        this.form.student_id = student.id;
        this.form.student_name = student.name;
        this.form.student_mobile = student.mobile || '';
        this.form.college_batch = student.batch || '';
        this.form.mcw_session = student.session || '';
        this.form.present_year = student.current_year || '';
        this.form.first_year_roll_no = student.first_year_roll || '';
        this.form.third_year_roll_no = student.third_year_roll || '';
        this.form.present_address = student.present_address || '';
        this.form.permanent_address = student.permanent_address || '';

        // Load student photo if available
        if (student.photo) {
          this.form.student_photo_preview = student.photo;
        }

        this.studentLoaded = true;

        this.$notify({
          title: 'Success',
          message: 'Student information loaded successfully!',
          type: 'success'
        });

      } catch (error) {
        console.error('Error fetching student data:', error);
        this.studentLoadError = error.response?.data?.message || 'Student not found. Please check the ID and try again.';

        this.$notify({
          title: 'Error',
          message: this.studentLoadError,
          type: 'error'
        });
      } finally {
        this.isLoadingStudent = false;
      }
    },

    clearStudentData() {
      if (this.studentLoaded) {
        this.studentLoadError = '';
      }
    },

    resetStudentLookup() {
      if (confirm('Are you sure you want to change student? All auto-filled data will be cleared.')) {
        this.studentId = '';
        this.studentLoaded = false;
        this.studentLoadError = '';

        // Clear auto-filled fields
        this.form.student_id = null;
        this.form.student_name = '';
        this.form.student_mobile = '';
        this.form.student_photo_preview = null;
        this.form.college_batch = '';
        this.form.mcw_session = '';
        this.form.present_year = '';
        this.form.first_year_roll_no = '';
        this.form.third_year_roll_no = '';
        this.form.present_address = '';
        this.form.permanent_address = '';
      }
    },

    triggerGuardianPhotoUpload(type) {
      const refName = type === 'father' ? 'fatherPhoto' :
          type === 'mother' ? 'motherPhoto' : 'localGuardianPhoto';
      this.$refs[refName].click();
    },

    handleGuardianPhoto(type, event) {
      const file = event.target.files[0];
      if (file) {
        this.form[type].photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form[type].photo_preview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    openSignatureModal(type) {
      this.currentSignatureType = type;
      this.showSignatureModal = true;
    },

    closeSignatureModal() {
      this.showSignatureModal = false;
      this.currentSignatureType = null;
    },

    saveSignature(signatureData) {
      if (this.currentSignatureType === 'student') {
        this.form.student_signature = signatureData;
      } else {
        this.form[this.currentSignatureType].signature = signatureData;
      }
      this.closeSignatureModal();
    },

    previewForm() {
      this.showPreviewModal = true;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();

        // Append basic fields
        Object.keys(this.form).forEach(key => {
          if (key !== 'father' && key !== 'mother' && key !== 'local_guardian' &&
              !key.includes('_preview') && this.form[key]) {
            formData.append(key, this.form[key]);
          }
        });

        // Append guardian data
        ['father', 'mother', 'local_guardian'].forEach(guardianType => {
          Object.keys(this.form[guardianType]).forEach(key => {
            if (!key.includes('_preview') && this.form[guardianType][key]) {
              formData.append(`${guardianType}[${key}]`, this.form[guardianType][key]);
            }
          });
        });

        const response = await this.$api.post('/hostel-applications', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.$notify({
          title: 'Success',
          message: 'Application submitted successfully!',
          type: 'success'
        });

        // Redirect to application list or print page
        this.$router.push(`/hostel-applications/${response.data.data.id}`);

      } catch (error) {
        console.error('Error submitting application:', error);
        this.$notify({
          title: 'Error',
          message: error.response?.data?.message || 'Failed to submit application',
          type: 'error'
        });
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      if (!this.studentLoaded) {
        this.$notify({
          title: 'Validation Error',
          message: 'Please search and load student information first',
          type: 'warning'
        });
        return false;
      }

      if (!this.form.student_name) {
        this.$notify({
          title: 'Validation Error',
          message: 'Student name is required',
          type: 'warning'
        });
        return false;
      }

      if (!this.form.student_mobile) {
        this.$notify({
          title: 'Validation Error',
          message: 'Student mobile is required',
          type: 'warning'
        });
        return false;
      }

      return true;
    },

    printApplication() {
      window.print();
    }
  }
};
</script>

<style scoped>
.hostel-application-container {
  padding: 20px;
  background: white;
}

/* Student Lookup Section */
.student-lookup-section {
  margin-bottom: 30px;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lookup-box {
  background: linear-gradient(135deg, #6b4c7a 0%, #8e6d9e 100%);
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(107, 76, 122, 0.3);
}

.lookup-title {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.lookup-title i {
  font-size: 22px;
}

.lookup-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.lookup-input-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.lookup-input-group label {
  font-weight: 600;
  color: #333;
  min-width: 180px;
}

.lookup-input {
  flex: 1;
  min-width: 250px;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.lookup-input:focus {
  border-color: #6b4c7a;
  outline: none;
  box-shadow: 0 0 0 3px rgba(107, 76, 122, 0.1);
}

.lookup-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.btn-lookup,
.btn-reset {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-lookup {
  background: #6b4c7a;
  color: white;
}

.btn-lookup:hover:not(:disabled) {
  background: #583a62;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 76, 122, 0.4);
}

.btn-lookup:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-reset {
  background: #f39c12;
  color: white;
}

.btn-reset:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.student-loaded-message {
  margin-top: 15px;
  padding: 12px 15px;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  color: #155724;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.student-loaded-message i {
  font-size: 20px;
}

.student-error-message {
  margin-top: 15px;
  padding: 12px 15px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  color: #721c24;
  display: flex;
  align-items: center;
  gap: 10px;
}

.student-error-message i {
  font-size: 20px;
}

/* Auto-filled Fields */
.auto-filled {
  background-color: #e8f5e9 !important;
  border-color: #81c784 !important;
}

.auto-filled-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h3 {
  margin: 0;
  color: #6b4c7a;
  font-size: 18px;
}

.guardian-info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.guardian-info-section h4 {
  color: #6b4c7a;
  font-size: 16px;
  margin-bottom: 15px;
}

.auto-loaded {
  font-size: 9px;
  color: #4caf50;
  margin-top: 5px;
}

/* Form Header */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 20px 0;
  border-bottom: 2px solid #6b4c7a;
}

.logo-section {
  flex: 0 0 150px;
}

.mcw-logo {
  width: 160px;
  height: auto;
}

.title-section {
  flex: 1;
  text-align: center;
}

.title-section h1 {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.title-section .subtitle {
  font-size: 18px;
  margin: 5px 0 0;
  color: #666;
  letter-spacing: 2px;
}

.photo-section {
  flex: 0 0 150px;
  display: flex;
  justify-content: flex-end;
}

.photo-upload {
  width: 120px;
  height: 140px;
  border: 2px solid #6b4c7a;
  background: #f5f0f7;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b4c7a;
  text-align: center;
  padding: 10px;
}

.photo-placeholder i {
  font-size: 24px;
  margin-bottom: 10px;
}

.photo-placeholder span {
  font-size: 11px;
  font-weight: bold;
}

/* College Info */
.college-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #333;
}

.college-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.address {
  margin: 0;
  line-height: 1.6;
}

/* Office Section */
.office-section {
  background: #f8f9fa;
  border: 2px solid #6b4c7a;
  padding: 15px;
  margin-bottom: 20px;
}

.office-section h3 {
  margin: 0 0 15px;
  font-size: 16px;
  font-weight: bold;
  color: #6b4c7a;
}

.office-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.form-control {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

/* Student Section */
.student-section {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px dotted #ccc;
  padding-bottom: 8px;
  flex-wrap: wrap;
}

.form-row label {
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
  min-width: 180px;
  color: #333;
}

.inline-label {
  min-width: auto !important;
  margin-left: 15px;
}

.form-control-inline {
  flex: 1;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 4px 8px;
  font-size: 13px;
  outline: none;
}

.form-control-inline:focus {
  border-bottom: 1px solid #6b4c7a;
  background: #f9f9f9;
}

.form-control-inline:read-only {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-control-inline.short {
  flex: 0 0 150px;
}

.form-control-inline.full {
  flex: 1;
  width: 100%;
}

textarea.form-control-inline {
  resize: vertical;
  min-height: 60px;
}

/* Undertaking Section */
.undertaking-section {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
}

.undertaking-section h4 {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px;
  color: #333;
}

.undertaking-section p {
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
}

.signature-container {
  text-align: right;
  margin-top: 30px;
}

.signature-btn {
  width: 200px;
  height: 80px;
  border: 2px solid #6b4c7a;
  background: white;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 5px;
}

.signature-btn:hover {
  background: #f5f0f7;
}

.signature-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Parents Section */
.parents-section {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
}

.parents-section h4 {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 10px;
  color: #333;
}

.parents-section p {
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: justify;
}

.signatures-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.signature-block {
  text-align: center;
}

.photo-signature-combo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guardian-photo-upload {
  width: 100%;
  height: 150px;
  border: 2px solid #6b4c7a;
  background: #f5f0f7;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guardian-photo-upload img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder.small {
  font-size: 10px;
  font-weight: bold;
  color: #6b4c7a;
  padding: 10px;
}

.signature-area {
  text-align: center;
}

.signature-btn.small {
  width: 100%;
  height: 60px;
  margin-bottom: 5px;
}

.signature-area label {
  font-size: 11px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
}

/* Authority Section */
.authority-section {
  margin-top: 40px;
  padding-top: 20px;
}

.authority-signatures {
  display: flex;
  justify-content: space-around;
  gap: 30px;
}

.authority-sign {
  flex: 1;
  text-align: center;
}

.sign-line {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #333;
  margin-bottom: 5px;
}

.authority-sign label {
  font-size: 12px;
  font-weight: bold;
  display: block;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: #6b4c7a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #583a62;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 15px;
  }

  .office-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .signatures-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-row label {
    min-width: auto;
    width: 100%;
    margin-bottom: 5px;
  }

  .form-control-inline {
    width: 100%;
  }

  .inline-label {
    margin-left: 0;
    margin-top: 10px;
  }

  .lookup-input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .lookup-input-group label {
    min-width: auto;
  }

  .lookup-input {
    min-width: auto;
  }
}

/* Print Styles */
@media print {
  .student-lookup-section,
  .form-actions,
  .btn {
    display: none !important;
  }

  .hostel-application-container {
    padding: 0;
  }

  .form-control-inline,
  .form-control {
    border: none;
    border-bottom: 1px solid #333;
  }
}
</style>