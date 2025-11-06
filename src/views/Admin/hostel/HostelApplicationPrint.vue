<template>
  <div class="hostel-print-form-single-page">
    <!-- Header Section -->
    <div class="print-header">
      <div class="logo-box">
        <img src="../../../assets/images/logo.png" alt="MCW Logo" class="logo" />
      </div>
      <div class="title-box">
        <h1 class="main-title">HOSTEL SEAT</h1>
        <p class="subtitle">ALLOTMENT FORM</p>
      </div>
      <div class="photo-box">
        <img v-if="application.student_photo_preview" :src="application.student_photo_preview" alt="Student" />
        <div v-else class="photo-placeholder">STUDENT'S<br>PHOTO</div>
      </div>
    </div>

    <!-- College Info -->
    <div class="college-bar">
      <div class="college-name">MCW | MEDICAL COLLEGE FOR WOMEN AND HOSPITAL</div>
      <div class="college-address">
        Plot-4, Road-8-9, Sector-1, Uttara Model Town, Dhaka-1230, Bangladesh | Ph: 88-02-58953939, 88-02-58950003, Fax: 88-02-7912428
      </div>
    </div>

    <!-- Office Section -->
    <div class="office-box">
      <strong>For office only</strong>
      <table class="office-table">
        <tr>
          <td class="lbl">Present seat allotment date:</td>
          <td class="val">{{ formatDate(application.present_seat_allotment_date) }}</td>
          <td class="lbl">Room no:</td>
          <td class="val">{{ application.room_no }}</td>
          <td class="lbl">Risk bond no:</td>
          <td class="val">{{ application.risk_bond_no }}</td>
          <td class="lbl">Date:</td>
          <td class="val">{{ formatDate(application.allotment_date) }}</td>
        </tr>
        <tr>
          <td class="lbl">First hostel entry date:</td>
          <td class="val">{{ formatDate(application.first_hostel_entry_date) }}</td>
          <td class="lbl">Dues clear up to:</td>
          <td class="val">{{ formatDate(application.dues_clear_up_to) }}</td>
          <td class="lbl" colspan="2">Hostel seat cancellation date:</td>
          <td class="val" colspan="2">{{ formatDate(application.hostel_seat_cancellation_date) }}</td>
        </tr>
      </table>
    </div>

    <!-- Student Info Section -->
    <div class="info-lines">
      <div class="line">
        <span class="label">Name (Capital Letter)</span>
        <span class="value">{{ application.student_name }}</span>
        <span class="label-inline">*Mobile:</span>
        <span class="value-inline">{{ application.student_mobile }}</span>
      </div>

      <div class="line">
        <span class="label">Father's Name</span>
        <span class="value">{{ application.father.name }}</span>
        <span class="label-inline">Occupation:</span>
        <span class="value-inline">{{ application.father.occupation }}</span>
        <span class="label-inline">*Mobile:</span>
        <span class="value-inline">{{ application.father.mobile }}</span>
      </div>

      <div class="line">
        <span class="label">Mother's Name</span>
        <span class="value">{{ application.mother.name }}</span>
        <span class="label-inline">Occupation:</span>
        <span class="value-inline">{{ application.mother.occupation }}</span>
        <span class="label-inline">*Mobile:</span>
        <span class="value-inline">{{ application.mother.mobile }}</span>
      </div>

      <div class="line">
        <span class="label">Local Guardian's name with relation</span>
        <span class="value">{{ application.local_guardian.name }}</span>
        <span class="label-inline">Relation:</span>
        <span class="value-inline">{{ application.local_guardian.relation }}</span>
        <span class="label-inline">*Mobile no:</span>
        <span class="value-inline">{{ application.local_guardian.mobile }}</span>
      </div>

      <div class="line">
        <span class="label">College batch: MCW</span>
        <span class="value short">{{ application.college_batch }}</span>
        <span class="label-inline">Session:</span>
        <span class="value-inline">{{ application.mcw_session }}</span>
        <span class="label-inline">Present year:</span>
        <span class="value-inline">{{ application.present_year }}</span>
      </div>

      <div class="line">
        <span class="label">First year admission roll no</span>
        <span class="value">{{ application.first_year_roll_no }}</span>
        <span class="label-inline">Third year roll no:</span>
        <span class="value-inline">{{ application.third_year_roll_no }}</span>
      </div>

      <div class="line">
        <span class="label">Student's present Address</span>
        <span class="value wide">{{ application.present_address }}</span>
      </div>

      <div class="line">
        <span class="label">Student's permanent Address</span>
        <span class="value wide">{{ application.permanent_address }}</span>
      </div>

      <div class="line">
        <span class="label">Local Guardian's address</span>
        <span class="value wide">{{ application.local_guardian.address }}</span>
      </div>

      <div class="line">
        <span class="label">Marital status</span>
        <span class="value">{{ application.marital_status }}</span>
      </div>

      <div class="line">
        <span class="label">Reason for asking/change a hostel seat (in brief):</span>
      </div>
      <div class="reason-box">{{ application.reason_for_seat }}</div>
    </div>

    <!-- Student Undertaking -->
    <div class="undertaking">
      <strong>UNDERTAKING BY THE STUDENT:</strong>
      <p class="text">Above information given by me is true. I shall abide by the rules & discipline of the hostel as may be promulgated by the "Medical College for Women" authority from time to time, failing which I shall be liable for disciplinary action as may be imposed upon me.</p>
      <div class="sign-right">
        <div class="sign-img">
          <img v-if="application.student_signature" :src="application.student_signature" alt="Signature" />
        </div>
        <div class="sign-text">Student's Signature & Date</div>
      </div>
    </div>

    <!-- Parents Undertaking -->
    <div class="parents-undertaking">
      <strong>UNDERTAKING BY THE PARENTS & GUARDIAN:</strong>
      <p class="text">My above named daughter/ward shall abide by the rules & discipline of the hostel of Medical College for Women, failing which the authority will take the necessary action against my daughter/ward with or without fine.</p>

      <div class="guardian-grid">
        <!-- Father -->
        <div class="guardian-col">
          <div class="g-photo" style="background:#b89aaa">
            <img v-if="application.father.photo_preview" :src="application.father.photo_preview" alt="Father" />
            <div v-else class="g-photo-text">FATHER'S<br>PHOTO</div>
          </div>
          <div class="g-sign">
            <img v-if="application.father.signature" :src="application.father.signature" alt="Sign" />
          </div>
          <div class="g-label">FATHER'S<br>SIGNATURE<br>DATE:</div>
        </div>

        <!-- Mother -->
        <div class="guardian-col">
          <div class="g-photo" style="background:#3a3a3a">
            <img v-if="application.mother.photo_preview" :src="application.mother.photo_preview" alt="Mother" />
            <div v-else class="g-photo-text white">MOTHER'S<br>PHOTO</div>
          </div>
          <div class="g-sign">
            <img v-if="application.mother.signature" :src="application.mother.signature" alt="Sign" />
          </div>
          <div class="g-label">MOTHER'S<br>SIGNATURE<br>DATE:</div>
        </div>

        <!-- Local Guardian -->
        <div class="guardian-col">
          <div class="g-photo" style="background:#d4a5b8">
            <img v-if="application.local_guardian.photo_preview" :src="application.local_guardian.photo_preview" alt="Guardian" />
            <div v-else class="g-photo-text">LOCAL<br>GUARDIAN'S<br>PHOTO</div>
          </div>
          <div class="g-sign">
            <img v-if="application.local_guardian.signature" :src="application.local_guardian.signature" alt="Sign" />
          </div>
          <div class="g-label">LOCAL<br>GUARDIAN'S<br>SIGNATURE<br>DATE:</div>
        </div>
      </div>
    </div>

    <!-- Authority Signatures -->
    <div class="authority-box">
      <div class="auth-col">
        <div class="auth-line"></div>
        <div class="auth-label">Asst Hostel Super</div>
      </div>
      <div class="auth-col">
        <div class="auth-line"></div>
        <div class="auth-label">Vice Principal</div>
      </div>
      <div class="auth-col">
        <div class="auth-line"></div>
        <div class="auth-label">Principal</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HostelApplicationPrintSinglePage',

  props: {
    application: {
      type: Object,
      required: true
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('en-GB');
    }
  }
};
</script>

<style scoped>
/* ============================================
   SINGLE PAGE A4 OPTIMIZED PRINT LAYOUT
   All content fits in ONE A4 page (297mm)
   ============================================ */

.hostel-print-form-single-page {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  padding: 8mm 10mm;
  background: white;
  font-family: Arial, sans-serif;
  font-size: 9pt;
  color: #000;
  box-sizing: border-box;
  overflow: hidden;
  page-break-after: avoid;
}

/* Header Section - Compact */
.print-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #6b4c7a;
  padding-bottom: 3mm;
  margin-bottom: 3mm;
}

.logo-box {
  width: 25mm;
  flex-shrink: 0;
}

.logo {
  width: 22mm;
  height: auto;
}

.title-box {
  flex: 1;
  text-align: center;
  padding-top: 1mm;
}

.main-title {
  font-size: 24pt;
  font-weight: bold;
  margin: 0;
  line-height: 1;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 11pt;
  margin: 1mm 0 0;
  letter-spacing: 2px;
}

.photo-box {
  width: 25mm;
  height: 30mm;
  border: 2px solid #6b4c7a;
  background: #f5f0f7;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.photo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  font-size: 7pt;
  font-weight: bold;
  color: #6b4c7a;
  text-align: center;
  line-height: 1.2;
}

/* College Info - Compact */
.college-bar {
  text-align: center;
  margin-bottom: 2mm;
  font-size: 8pt;
  line-height: 1.3;
}

.college-name {
  font-weight: bold;
  margin-bottom: 1mm;
}

.college-address {
  font-size: 7pt;
}

/* Office Section - Compact */
.office-box {
  border: 2px solid #6b4c7a;
  background: #f8f9fa;
  padding: 2mm;
  margin-bottom: 2mm;
  font-size: 8pt;
}

.office-box strong {
  display: block;
  margin-bottom: 1mm;
}

.office-table {
  width: 100%;
  border-collapse: collapse;
}

.office-table td {
  padding: 0.5mm 1mm;
  font-size: 7.5pt;
}

.office-table .lbl {
  font-weight: 600;
  white-space: nowrap;
}

.office-table .val {
  border-bottom: 1px solid #333;
  min-width: 12mm;
}

/* Info Lines - Very Compact */
.info-lines {
  margin-bottom: 2mm;
  font-size: 8.5pt;
}

.line {
  display: flex;
  align-items: center;
  min-height: 4.5mm;
  border-bottom: 1px dotted #999;
  padding: 0.3mm 0;
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
  min-width: 50mm;
  flex-shrink: 0;
  font-size: 8pt;
}

.value {
  flex: 1;
  padding: 0 1mm;
  font-size: 8pt;
}

.value.short {
  flex: 0 0 18mm;
}

.value.wide {
  width: 100%;
  margin-top: 0.5mm;
}

.label-inline {
  font-weight: 600;
  margin-left: 3mm;
  font-size: 8pt;
}

.value-inline {
  padding: 0 1mm;
  min-width: 20mm;
  font-size: 8pt;
}

.reason-box {
  min-height: 10mm;
  max-height: 12mm;
  padding: 1mm;
  border: 1px solid #ddd;
  margin-top: 1mm;
  font-size: 8pt;
  line-height: 1.3;
  overflow: hidden;
}

/* Undertaking Sections - Compact */
.undertaking,
.parents-undertaking {
  background: #f8f9fa;
  border: 1px solid #999;
  padding: 2mm;
  margin-bottom: 2mm;
  font-size: 8pt;
}

.undertaking strong,
.parents-undertaking strong {
  display: block;
  margin-bottom: 1mm;
  font-size: 8.5pt;
}

.text {
  margin: 0 0 2mm;
  line-height: 1.3;
  text-align: justify;
  font-size: 7.5pt;
}

.sign-right {
  text-align: right;
  margin-top: 3mm;
}

.sign-img {
  display: inline-block;
  width: 40mm;
  height: 14mm;
  border: 2px solid #6b4c7a;
  background: white;
  vertical-align: top;
  margin-bottom: 0.5mm;
}

.sign-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sign-text {
  font-size: 7.5pt;
  font-weight: bold;
}

/* Guardian Grid - Compact */
.guardian-grid {
  display: flex;
  justify-content: space-between;
  gap: 3mm;
  margin-top: 3mm;
}

.guardian-col {
  flex: 1;
  text-align: center;
}

.g-photo {
  width: 100%;
  height: 28mm;
  border: 2px solid #6b4c7a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1mm;
  overflow: hidden;
}

.g-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.g-photo-text {
  font-size: 7pt;
  font-weight: bold;
  color: #6b4c7a;
  line-height: 1.2;
}

.g-photo-text.white {
  color: white;
}

.g-sign {
  width: 100%;
  height: 12mm;
  border: 2px solid #6b4c7a;
  background: white;
  margin-bottom: 0.5mm;
  overflow: hidden;
}

.g-sign img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.g-label {
  font-size: 7pt;
  font-weight: bold;
  line-height: 1.2;
}

/* Authority Signatures - Compact */
.authority-box {
  display: flex;
  justify-content: space-around;
  gap: 8mm;
  margin-top: 5mm;
}

.auth-col {
  flex: 1;
  text-align: center;
}

.auth-line {
  height: 10mm;
  border-bottom: 1px solid #000;
  margin-bottom: 0.5mm;
}

.auth-label {
  font-size: 8pt;
  font-weight: bold;
}

/* Print Optimization */
@media print {
  .hostel-print-form-single-page {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 8mm 10mm;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}

/* Prevent page breaks */
.hostel-print-form-single-page,
.print-header,
.college-bar,
.office-box,
.info-lines,
.undertaking,
.parents-undertaking,
.guardian-grid,
.authority-box {
  page-break-inside: avoid;
  break-inside: avoid;
}
</style>