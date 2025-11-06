<template>
  <div class="print-view" v-if="formData">
    <!-- Header -->
    <div class="print-header">
      <div class="header-top">
        <div class="classroom-field">
          CLASS ROOM: _________________
        </div>
        <div class="name-field">
          NAME: _________________
        </div>
      </div>

      <div class="college-header">
        <div class="logo-section">
          <div class="logo-placeholder">MCW</div>
        </div>
        <div class="college-details">
          <h1>MEDICAL COLLEGE FOR<br>WOMEN AND HOSPITAL</h1>
          <p>Plot-4, Road-8/9, Sector-1, Uttara Model Town, Dhaka-1230, Bangladesh</p>
          <p>Phone: 88-02-58953939, 88-02-58950003, Fax: 88-02-7912428</p>
          <p>E-mail: medicalcollegeforwomen@yahoo.com; Web: www.medicalcollegeforwomen.edu.bd</p>
        </div>
      </div>
    </div>

    <!-- Title -->
    <div class="form-title-print">
      <h2>APPLICATION FORM FOR ADMISSION IN MBBS COURSE, SESSION: 2023-2024</h2>
      <p class="form-note">(IITo be filled by candidate's own hand writing II All fields must fill with CAPITAL letter IIStar Marked(*) fields are mandatory)</p>
    </div>

    <!-- Category -->
    <div class="category-section">
      <strong>Category:</strong>
      <span v-for="cat in categories" :key="cat" class="category-item">
        {{ cat }}
        <span v-if="formData.category === cat">✓</span>
        <span v-else>/</span>
      </span>
    </div>

    <!-- Admission Test Information -->
    <div class="print-section">
      <div class="section-header">ADMISSION TEST INFORMATION</div>
      <div class="info-grid">
        <div class="info-column">
          <div class="info-row">
            <span class="label">Roll No:</span>
            <span class="value">{{ formData.roll_no }}</span>
          </div>
          <div class="info-row">
            <span class="label">Merit Position:</span>
            <span class="value">{{ formData.merit_position }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-row">
            <span class="label">Written score:</span>
            <span class="value">{{ formData.written_score }}</span>
          </div>
          <div class="info-row">
            <span class="label">College code:</span>
            <span class="value">{{ formData.college_code }}</span>
          </div>
        </div>
        <div class="info-column">
          <div class="info-row">
            <span class="label">Merit Score:</span>
            <span class="value">{{ formData.merit_score }}</span>
          </div>
          <div class="info-row">
            <span class="label">Serial No:</span>
            <span class="value">{{ formData.serial_no }}</span>
          </div>
        </div>
        <div class="photo-box">
          <div class="photo-label">Photo<br>5 copies</div>
          <div class="photo-container" v-if="formData.photo_paths && formData.photo_paths[0]">
            <img :src="getPhotoUrl(formData.photo_paths[0])" alt="Student Photo">
          </div>
          <div class="photo-placeholder" v-else></div>
        </div>
      </div>
    </div>

    <!-- Details of Applicant -->
    <div class="print-section">
      <div class="section-header">DETAILS OF APPLICANT</div>

      <div class="detail-row">
        <span class="label">*Name (Capital Letter)</span>
        <span class="value">{{ formData.name }}</span>
        <span class="label">*Mobile:</span>
        <span class="value-small">{{ formData.mobile }}</span>
      </div>

      <div class="detail-row">
        <span class="label">*Father's Name</span>
        <span class="value">{{ formData.fathers_name }}</span>
        <span class="label">Occupation:</span>
        <span class="value-small">{{ formData.fathers_occupation }}</span>
        <span class="label">*Mobile:</span>
        <span class="value-small">{{ formData.fathers_mobile }}</span>
      </div>

      <div class="detail-row">
        <span class="label">*Mother's Name</span>
        <span class="value">{{ formData.mothers_name }}</span>
        <span class="label">Occupation:</span>
        <span class="value-small">{{ formData.mothers_occupation }}</span>
        <span class="label">*Mobile:</span>
        <span class="value-small">{{ formData.mothers_mobile }}</span>
      </div>

      <div class="detail-row">
        <span class="label">*Date of Birth</span>
        <span class="value-small">{{ formatDate(formData.date_of_birth) }}</span>
        <span class="label">*Blood Group</span>
        <span class="value-small">{{ formData.blood_group }}</span>
        <span class="label">Married:</span>
        <span class="value-small">{{ formData.marital_status }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Country of Birth</span>
        <span class="value-small">{{ formData.country_of_birth }}</span>
        <span class="label">Nationality</span>
        <span class="value-small">{{ formData.nationality }}</span>
        <span class="label">Religion</span>
        <span class="value-small">{{ formData.religion }}</span>
      </div>

      <div class="detail-row">
        <span class="label">National ID No.</span>
        <span class="value">{{ formData.national_id_no }}</span>
        <span class="label">Passport No.</span>
        <span class="value">{{ formData.passport_no }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Language known:</span>
        <span class="value-small">(a) {{ getLanguage(0) }}</span>
        <span class="value-small">(b) {{ getLanguage(1) }}</span>
        <span class="value-small">(c) {{ getLanguage(2) }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">*Mailing/Present Address</span>
        <span class="value">{{ formData.mailing_address }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Tel (Res)</span>
        <span class="value">{{ formData.tel_res }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">*Permanent Address</span>
        <span class="value">{{ formData.permanent_address }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">*Applicant's E-mail:</span>
        <span class="value">{{ formData.applicant_email }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">*Father/Mother's Email:</span>
        <span class="value">{{ formData.parent_email }}</span>
      </div>
    </div>

    <!-- Local Guardian -->
    <div class="print-section">
      <div class="section-header">DETAILS OF LOCAL GUARDIAN (WHEN APPLICABLE)</div>

      <div class="detail-row">
        <span class="label">*Name:</span>
        <span class="value">{{ formData.guardian_name }}</span>
        <span class="label">Occupation</span>
        <span class="value-small">{{ formData.guardian_occupation }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">*Mailing address:</span>
        <span class="value">{{ formData.guardian_address }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Mobile:</span>
        <span class="value-small">{{ formData.guardian_mobile }}</span>
        <span class="label">Relationship with candidate:</span>
        <span class="value">{{ formData.guardian_relationship }}</span>
      </div>

      <div class="detail-row full-width">
        <span class="label">Email:</span>
        <span class="value">{{ formData.guardian_email }}</span>
      </div>
    </div>

    <!-- Educational Qualifications -->
    <div class="print-section">
      <div class="section-header">RESULTS OF SSC/O LEVEL & HSC/A LEVEL & EQUIVALENT:</div>

      <table class="edu-table">
        <thead>
        <tr>
          <th>Exam</th>
          <th>Name of Institute</th>
          <th>Country</th>
          <th>Year</th>
          <th>Educational<br>Board</th>
          <th>Roll No</th>
          <th>GPA without<br>additional</th>
          <th>GPA with<br>additional</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>SSC/O level<br>/Equivalent</td>
          <td>{{ formData.ssc_institute }}</td>
          <td>{{ formData.ssc_country }}</td>
          <td>{{ formData.ssc_year }}</td>
          <td>{{ formData.ssc_board }}</td>
          <td>{{ formData.ssc_roll_no }}</td>
          <td>{{ formData.ssc_gpa_without }}</td>
          <td>{{ formData.ssc_gpa_with }}</td>
        </tr>
        <tr>
          <td>HSC/A level<br>/Equivalent</td>
          <td>{{ formData.hsc_institute }}</td>
          <td>{{ formData.hsc_country }}</td>
          <td>{{ formData.hsc_year }}</td>
          <td>{{ formData.hsc_board }}</td>
          <td>{{ formData.hsc_roll_no }}</td>
          <td>{{ formData.hsc_gpa_without }}</td>
          <td>{{ formData.hsc_gpa_with }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Sports & Activities -->
    <div class="print-section">
      <div class="section-header">SPORTS & OTHERS EXTRA CURRICULAR ACTIVITY ACHIEVEMENTS (IF ANY):</div>
      <div class="text-content">{{ formData.sports_activities }}</div>
    </div>

    <!-- Page Break for Print -->
    <div class="page-break"></div>

    <!-- Referees -->
    <div class="print-section">
      <div class="section-header">Name & address of 2 (two) referees:</div>
      <p class="note">(resident in your country who could testify to your character, academic background and capacity or further studies, preferably from Heads of schools/college)</p>

      <div v-for="(referee, index) in formData.referees" :key="index" class="referee-item">
        <div class="referee-number">0{{ index + 1 }}.</div>
        <div class="referee-content">
          <div class="referee-address">{{ referee.address }}</div>
          <div class="referee-contact">
            <span>E-mail: {{ referee.email }}</span>
            <span>Mobile: {{ referee.mobile }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pay Order -->
    <div class="print-section">
      <div class="detail-row">
        <span class="label"><strong>PAY ORDER No:</strong></span>
        <span class="value">{{ formData.pay_order_no }}</span>
      </div>
    </div>

    <!-- Declarations -->
    <div class="print-section">
      <div class="section-header">DECLARATION BY THE CANDIDATE:</div>
      <p class="declaration-text">
        I do hereby declare that this application form has been filled in by me in own handwriting and that the information given herein are correct.
        I do hereby agree that, if I am admitted, I shall abide by the rules and regulations of this college and also abide by the orders given by the
        college authority with regard to my conducts, discipline and studies. I fully understand that the Principal of the college will have full liberty
        to expel me from college for any infringement of the above undertaking not withstanding the fact that all fees may have been paid.
      </p>
      <div class="signature-section">
        <div>
          <div class="label">Signature & Date:</div>
          <div class="signature-line">{{ formatDate(formData.candidate_declaration_date) }}</div>
        </div>
        <div>
          <div class="label">Full name of candidate (capital letter)</div>
          <div class="signature-line">{{ formData.name }}</div>
        </div>
      </div>
    </div>

    <div class="print-section">
      <div class="section-header">DECLARATION BY PARENT/GUARDIAN:</div>
      <p class="declaration-text">
        I do hereby declare that in the event of my daughter/wards (give full name) <strong>{{ formData.name }}</strong> being successful in
        obtaining admission to the Medical College for Women & Hospital shall make all arrangements to the satisfaction of the college authority
        for the timely payment of all dues, tuition fees and such other fees as may be required to be paid during the period of her studies at this
        college.
      </p>
      <div class="signature-section">
        <div>
          <div class="label">Signature of parents/guardian</div>
          <div class="signature-line">{{ formData.parent_name }}</div>
        </div>
        <div>
          <div class="label">Date:</div>
          <div class="signature-line">{{ formatDate(formData.parent_declaration_date) }}</div>
        </div>
        <div>
          <div class="label">Relationship with candidate</div>
          <div class="signature-line">{{ formData.parent_relationship }}</div>
        </div>
      </div>
    </div>

    <!-- Student ID & Form Number -->
    <div class="print-section id-section">
      <div class="id-display">
        <h3>STUDENT ID: {{ formData.student_id }}</h3>
        <p>FORM NUMBER: {{ formData.form_number }}</p>
        <p>STATUS: {{ formData.status.toUpperCase() }}</p>
      </div>
    </div>

    <!-- Print Button -->
    <div class="print-actions no-print">
      <button @click="printForm" class="btn-print">Print Form</button>
      <button @click="$router.go(-1)" class="btn-back">Back</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PrintView',

  data() {
    return {
      formData: null,
      categories: ['General', 'Freedom Fighter', 'Scholarship', 'Governing Body', 'Foreign']
    };
  },

  methods: {
    async loadFormData() {
      const formId = this.$route.params.id;
      try {
        const response = await axios.get(`/api/admission-forms/${formId}`);
        this.formData = response.data.data;
      } catch (error) {
        console.error('Error loading form:', error);
        alert('Error loading form data');
      }
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-GB');
    },

    getLanguage(index) {
      if (this.formData.languages_known && this.formData.languages_known[index]) {
        return this.formData.languages_known[index];
      }
      return '';
    },

    getPhotoUrl(path) {
      return `/storage/${path}`;
    },

    printForm() {
      window.print();
    }
  },

  mounted() {
    this.loadFormData();
  }
};
</script>

<style scoped>
@import './PrintViewStyles.css';
</style>