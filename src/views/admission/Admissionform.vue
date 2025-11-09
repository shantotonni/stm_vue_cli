<template>
  <div class="admission-form-wrapper">

    <!-- Stunning Modern Header -->
    <div class="hero-header">
      <div class="hero-background">
        <div class="animated-bg"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <div class="hero-content">
        <div class="logo-container">
          <div class="logo-badge">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" opacity="0.3"/>
              <text x="50" y="65" text-anchor="middle" fill="#fff" font-size="36" font-weight="bold">MCW</text>
            </svg>
          </div>
        </div>

        <div class="hero-text">
          <h1 class="hero-title">
            MEDICAL COLLEGE FOR<br/>
            WOMEN AND HOSPITAL
          </h1>
          <p class="hero-subtitle">MBBS Admission Form • Session 2023-2024</p>
          <div class="hero-details">
            <span class="detail-item">
              <span class="detail-icon">📍</span>
              Plot-4, Road-8/9, Uttara Model Town, Dhaka-1230
            </span>
            <span class="detail-item">
              <span class="detail-icon">📞</span>
              88-02-58953939, 88-02-58950003
            </span>
            <span class="detail-item">
              <span class="detail-icon">✉️</span>
              medicalcollegeforwomen@yahoo.com
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Section -->
    <div class="progress-section" v-if="!formData.student_id">
      <div class="progress-wrapper">
        <div class="progress-info">
          <span class="progress-label">Form Completion</span>
          <span class="progress-percentage">{{ formProgress }}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{width: formProgress + '%'}">
            <div class="progress-glow"></div>
          </div>
        </div>
        <p class="progress-message">
          <span v-if="formProgress < 30">🚀 Just getting started! Keep going!</span>
          <span v-else-if="formProgress < 70">💪 Great progress! You're halfway there!</span>
          <span v-else-if="formProgress < 100">🎯 Almost done! Just a few more fields!</span>
          <span v-else>✨ Perfect! Your form is complete!</span>
        </p>
      </div>
    </div>

    <!-- Success Banner -->
    <div v-if="formData.student_id && !showSuccessModal" class="success-hero">
      <div class="success-animation">
        <div class="success-checkmark">
          <svg class="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
      </div>
      <div class="success-content">
        <h2 class="success-title">🎉 Form Submitted Successfully!</h2>
        <div class="success-ids">
          <div class="id-card">
            <span class="id-label">Student ID</span>
            <span class="id-value">{{ formData.student_id }}</span>
          </div>
          <div class="id-card">
            <span class="id-label">Form Number</span>
            <span class="id-value">{{ formData.form_number }}</span>
          </div>
        </div>
        <p class="success-message">
          Please save these IDs for future reference. You can now print your form or return to the dashboard.
        </p>
      </div>
    </div>

    <!-- Main Form Container -->
    <div class="form-container">

      <!-- Print Only Header (Hidden on screen) -->
      <div class="print-only-header">
        <div class="print-logo">
          <div class="print-logo-box">MCW</div>
        </div>
        <div class="print-info">
          <h1 class="print-title">MEDICAL COLLEGE FOR WOMEN AND HOSPITAL</h1>
          <p>Plot-4, Road-8/9, Sector-1, Uttara Model Town, Dhaka-1230, Bangladesh</p>
          <p>Phone: 88-02-58953939, 88-02-58950003, Fax: 88-02-7912428</p>
          <p>E-mail: medicalcollegeforwomen@yahoo.com</p>
        </div>
      </div>

      <div class="print-only-title">
        <h2>APPLICATION FORM FOR ADMISSION IN MBBS COURSE, SESSION: 2023-2024</h2>
        <p>(To be filled by candidate's own hand writing. All fields must fill with CAPITAL letter. Star Marked(*) fields are mandatory)</p>
      </div>

      <form @submit.prevent="submitForm" class="beautiful-form">

        <!-- Category Selection -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">📋</div>
            <div class="header-content">
              <h3 class="header-title">Admission Category</h3>
              <p class="header-subtitle">Select your admission category</p>
            </div>
          </div>
          <div class="card-content">
            <div class="category-selection">
              <label v-for="cat in categories" :key="cat" class="category-option-modern">
                <input type="radio" v-model="formData.category" :value="cat" />
                <div class="option-content">
                  <div class="option-check">
                    <span class="check-circle"></span>
                  </div>
                  <div class="option-text">
                    <span class="option-name">{{ cat }}</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Admission Test Information -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">📝</div>
            <div class="header-content">
              <h3 class="header-title">Admission Test Information</h3>
              <p class="header-subtitle">Enter your admission test details</p>
            </div>
          </div>
          <div class="card-content">
            <div class="input-grid-modern">

              <div class="form-group-modern">
                <label class="label-modern">Roll Number</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🎫</span>
                  <input
                      type="text"
                      v-model="formData.roll_no"
                      class="input-modern"
                      placeholder="Enter your roll number"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Written Score</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📊</span>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.written_score"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Merit Score</label>
                <div class="input-wrapper">
                  <span class="input-prefix">⭐</span>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.merit_score"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Merit Position</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🏆</span>
                  <input
                      type="number"
                      v-model="formData.merit_position"
                      class="input-modern"
                      placeholder="Your merit position"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">College Code</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🏫</span>
                  <input
                      type="text"
                      v-model="formData.college_code"
                      class="input-modern"
                      placeholder="College code"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Serial Number</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🔢</span>
                  <input
                      type="text"
                      v-model="formData.serial_no"
                      class="input-modern"
                      placeholder="Serial number"
                  />
                </div>
              </div>

            </div>

            <!-- Beautiful Photo Upload -->
            <div class="photo-section-modern">
              <label class="label-modern">
                <span class="label-icon">📸</span>
                Student Photograph (5 copies required)
              </label>
              <div class="photo-upload-modern" @click="$refs.photoInput.click()">
                <input
                    type="file"
                    ref="photoInput"
                    @change="handlePhotoUpload"
                    accept="image/*"
                    multiple
                    style="display: none"
                />

                <div v-if="!photoPreview" class="upload-area">
                  <div class="upload-icon-container">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <p class="upload-title">Click or drag photo to upload</p>
                  <p class="upload-subtitle">PNG, JPG • Max 2MB per photo • 5 copies needed</p>
                </div>

                <div v-else class="photo-preview-modern">
                  <img :src="photoPreview" alt="Student Photo" />
                  <div class="photo-overlay">
                    <div class="overlay-content">
                      <svg class="check-icon-svg" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <span>Photo Uploaded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Personal Details -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">👤</div>
            <div class="header-content">
              <h3 class="header-title">Personal Information</h3>
              <p class="header-subtitle">Please enter your personal details in CAPITAL LETTERS</p>
            </div>
          </div>
          <div class="card-content">
            <div class="input-grid-modern">

              <div class="form-group-modern span-2">
                <label class="label-modern required">Full Name</label>
                <div class="input-wrapper">
                  <span class="input-prefix">👤</span>
                  <input
                      type="text"
                      v-model="formData.name"
                      @input="toUpperCase('name')"
                      class="input-modern uppercase"
                      placeholder="ENTER YOUR FULL NAME"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern required">Mobile Number</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📱</span>
                  <input
                      type="tel"
                      v-model="formData.mobile"
                      class="input-modern"
                      placeholder="+880 1XXX-XXXXXX"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern span-2">
                <label class="label-modern required">Father's Name</label>
                <div class="input-wrapper">
                  <span class="input-prefix">👨</span>
                  <input
                      type="text"
                      v-model="formData.fathers_name"
                      @input="toUpperCase('fathers_name')"
                      class="input-modern uppercase"
                      placeholder="FATHER'S FULL NAME"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Father's Occupation</label>
                <div class="input-wrapper">
                  <span class="input-prefix">💼</span>
                  <input
                      type="text"
                      v-model="formData.fathers_occupation"
                      class="input-modern"
                      placeholder="Occupation"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Father's Mobile</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📱</span>
                  <input
                      type="tel"
                      v-model="formData.fathers_mobile"
                      class="input-modern"
                      placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div class="form-group-modern span-2">
                <label class="label-modern required">Mother's Name</label>
                <div class="input-wrapper">
                  <span class="input-prefix">👩</span>
                  <input
                      type="text"
                      v-model="formData.mothers_name"
                      @input="toUpperCase('mothers_name')"
                      class="input-modern uppercase"
                      placeholder="MOTHER'S FULL NAME"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Mother's Occupation</label>
                <div class="input-wrapper">
                  <span class="input-prefix">💼</span>
                  <input
                      type="text"
                      v-model="formData.mothers_occupation"
                      class="input-modern"
                      placeholder="Occupation"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Mother's Mobile</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📱</span>
                  <input
                      type="tel"
                      v-model="formData.mothers_mobile"
                      class="input-modern"
                      placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern required">Date of Birth</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📅</span>
                  <input
                      type="date"
                      v-model="formData.date_of_birth"
                      class="input-modern"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Blood Group</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🩸</span>
                  <select v-model="formData.blood_group" class="input-modern">
                    <option value="">Select Blood Group</option>
                    <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Marital Status</label>
                <div class="radio-group-modern">
                  <label class="radio-option">
                    <input type="radio" v-model="formData.marital_status" value="No" />
                    <span class="radio-label">Single</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="formData.marital_status" value="Yes" />
                    <span class="radio-label">Married</span>
                  </label>
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Country of Birth</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🌍</span>
                  <input
                      type="text"
                      v-model="formData.country_of_birth"
                      class="input-modern"
                      placeholder="Bangladesh"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Nationality</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🎌</span>
                  <input
                      type="text"
                      v-model="formData.nationality"
                      class="input-modern"
                      placeholder="Bangladeshi"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Religion</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🕌</span>
                  <input
                      type="text"
                      v-model="formData.religion"
                      class="input-modern"
                      placeholder="Religion"
                  />
                </div>
              </div>

              <div class="form-group-modern span-2">
                <label class="label-modern">National ID Number</label>
                <div class="input-wrapper">
                  <span class="input-prefix">🆔</span>
                  <input
                      type="text"
                      v-model="formData.national_id_no"
                      class="input-modern"
                      placeholder="Enter NID number"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Passport Number</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📘</span>
                  <input
                      type="text"
                      v-model="formData.passport_no"
                      class="input-modern"
                      placeholder="Passport number (if any)"
                  />
                </div>
              </div>

              <div class="form-group-modern span-3">
                <label class="label-modern">Languages Known</label>
                <div class="language-grid">
                  <div class="input-wrapper">
                    <span class="input-prefix">🗣️</span>
                    <input
                        type="text"
                        v-model="languages[0]"
                        class="input-modern"
                        placeholder="Language 1"
                    />
                  </div>
                  <div class="input-wrapper">
                    <span class="input-prefix">🗣️</span>
                    <input
                        type="text"
                        v-model="languages[1]"
                        class="input-modern"
                        placeholder="Language 2"
                    />
                  </div>
                  <div class="input-wrapper">
                    <span class="input-prefix">🗣️</span>
                    <input
                        type="text"
                        v-model="languages[2]"
                        class="input-modern"
                        placeholder="Language 3"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">📮</div>
            <div class="header-content">
              <h3 class="header-title">Address Information</h3>
              <p class="header-subtitle">Enter your current and permanent addresses</p>
            </div>
          </div>
          <div class="card-content">
            <div class="input-grid-modern">

              <div class="form-group-modern span-3">
                <label class="label-modern required">Mailing/Present Address</label>
                <div class="input-wrapper">
                  <span class="input-prefix top">📍</span>
                  <textarea
                      v-model="formData.mailing_address"
                      class="input-modern textarea-modern"
                      rows="3"
                      placeholder="Enter your current mailing address"
                      required
                  ></textarea>
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Telephone (Residence)</label>
                <div class="input-wrapper">
                  <span class="input-prefix">☎️</span>
                  <input
                      type="tel"
                      v-model="formData.tel_res"
                      class="input-modern"
                      placeholder="Home phone number"
                  />
                </div>
              </div>

              <div class="form-group-modern span-3">
                <label class="label-modern required">Permanent Address</label>
                <div class="input-wrapper">
                  <span class="input-prefix top">🏠</span>
                  <textarea
                      v-model="formData.permanent_address"
                      class="input-modern textarea-modern"
                      rows="3"
                      placeholder="Enter your permanent address"
                      required
                  ></textarea>
                </div>
              </div>

              <div class="form-group-modern span-2">
                <label class="label-modern required">Applicant's Email</label>
                <div class="input-wrapper">
                  <span class="input-prefix">✉️</span>
                  <input
                      type="email"
                      v-model="formData.applicant_email"
                      class="input-modern"
                      placeholder="your.email@example.com"
                      required
                  />
                </div>
              </div>

              <div class="form-group-modern span-2">
                <label class="label-modern">Parent's Email</label>
                <div class="input-wrapper">
                  <span class="input-prefix">✉️</span>
                  <input
                      type="email"
                      v-model="formData.parent_email"
                      class="input-modern"
                      placeholder="parent.email@example.com"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Guardian Details -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">👨‍👩‍👧</div>
            <div class="header-content">
              <h3 class="header-title">Local Guardian Details</h3>
              <p class="header-subtitle">Optional - Fill if applicable</p>
            </div>
          </div>
          <div class="card-content">
            <div class="input-grid-modern">

              <div class="form-group-modern span-2">
                <label class="label-modern">Guardian's Name</label>
                <div class="input-wrapper">
                  <span class="input-prefix">👤</span>
                  <input
                      type="text"
                      v-model="formData.guardian_name"
                      class="input-modern"
                      placeholder="Full name of guardian"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Occupation</label>
                <div class="input-wrapper">
                  <span class="input-prefix">💼</span>
                  <input
                      type="text"
                      v-model="formData.guardian_occupation"
                      class="input-modern"
                      placeholder="Guardian's occupation"
                  />
                </div>
              </div>

              <div class="form-group-modern span-3">
                <label class="label-modern">Guardian's Address</label>
                <div class="input-wrapper">
                  <span class="input-prefix top">📍</span>
                  <textarea
                      v-model="formData.guardian_address"
                      class="input-modern textarea-modern"
                      rows="2"
                      placeholder="Guardian's mailing address"
                  ></textarea>
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Guardian's Mobile</label>
                <div class="input-wrapper">
                  <span class="input-prefix">📱</span>
                  <input
                      type="tel"
                      v-model="formData.guardian_mobile"
                      class="input-modern"
                      placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Relationship</label>
                <div class="input-wrapper">
                  <span class="input-prefix">👥</span>
                  <input
                      type="text"
                      v-model="formData.guardian_relationship"
                      class="input-modern"
                      placeholder="Relationship with candidate"
                  />
                </div>
              </div>

              <div class="form-group-modern">
                <label class="label-modern">Guardian's Email</label>
                <div class="input-wrapper">
                  <span class="input-prefix">✉️</span>
                  <input
                      type="email"
                      v-model="formData.guardian_email"
                      class="input-modern"
                      placeholder="guardian.email@example.com"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Educational Qualifications -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">🎓</div>
            <div class="header-content">
              <h3 class="header-title">Educational Qualifications</h3>
              <p class="header-subtitle">SSC/O Level & HSC/A Level examination details</p>
            </div>
          </div>
          <div class="card-content">

            <!-- SSC -->
            <div class="education-section">
              <h4 class="education-title">SSC / O Level / Equivalent</h4>
              <div class="input-grid-modern">
                <div class="form-group-modern span-2">
                  <label class="label-modern">Name of Institute</label>
                  <input
                      type="text"
                      v-model="formData.ssc_institute"
                      class="input-modern"
                      placeholder="Institute name"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Country</label>
                  <input
                      type="text"
                      v-model="formData.ssc_country"
                      class="input-modern"
                      placeholder="Country"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Passing Year</label>
                  <input
                      type="number"
                      v-model="formData.ssc_year"
                      class="input-modern"
                      placeholder="Year"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Board</label>
                  <input
                      type="text"
                      v-model="formData.ssc_board"
                      class="input-modern"
                      placeholder="Board name"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Roll Number</label>
                  <input
                      type="text"
                      v-model="formData.ssc_roll_no"
                      class="input-modern"
                      placeholder="Roll no"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">GPA (without additional)</label>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.ssc_gpa_without"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">GPA (with additional)</label>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.ssc_gpa_with"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <!-- HSC -->
            <div class="education-section">
              <h4 class="education-title">HSC / A Level / Equivalent</h4>
              <div class="input-grid-modern">
                <div class="form-group-modern span-2">
                  <label class="label-modern">Name of Institute</label>
                  <input
                      type="text"
                      v-model="formData.hsc_institute"
                      class="input-modern"
                      placeholder="Institute name"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Country</label>
                  <input
                      type="text"
                      v-model="formData.hsc_country"
                      class="input-modern"
                      placeholder="Country"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Passing Year</label>
                  <input
                      type="number"
                      v-model="formData.hsc_year"
                      class="input-modern"
                      placeholder="Year"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Board</label>
                  <input
                      type="text"
                      v-model="formData.hsc_board"
                      class="input-modern"
                      placeholder="Board name"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Roll Number</label>
                  <input
                      type="text"
                      v-model="formData.hsc_roll_no"
                      class="input-modern"
                      placeholder="Roll no"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">GPA (without additional)</label>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.hsc_gpa_without"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">GPA (with additional)</label>
                  <input
                      type="number"
                      step="0.01"
                      v-model="formData.hsc_gpa_with"
                      class="input-modern"
                      placeholder="0.00"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Extra Curricular Activities -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">⚽</div>
            <div class="header-content">
              <h3 class="header-title">Extra Curricular Activities</h3>
              <p class="header-subtitle">Sports and other achievements</p>
            </div>
          </div>
          <div class="card-content">
            <div class="form-group-modern">
              <label class="label-modern">Sports & Extra Curricular Achievements</label>
              <textarea
                  v-model="formData.sports_activities"
                  class="input-modern textarea-modern"
                  rows="4"
                  placeholder="Describe your sports and extra curricular activities..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Referees -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">📞</div>
            <div class="header-content">
              <h3 class="header-title">Referees</h3>
              <p class="header-subtitle">Provide details of two referees (preferably school/college heads)</p>
            </div>
          </div>
          <div class="card-content">
            <div v-for="(referee, index) in formData.referees" :key="index" class="referee-card">
              <h5 class="referee-number">Referee {{ index + 1 }}</h5>
              <div class="input-grid-modern">
                <div class="form-group-modern span-3">
                  <label class="label-modern">Name & Address</label>
                  <textarea
                      v-model="referee.address"
                      class="input-modern textarea-modern"
                      rows="2"
                      placeholder="Full name and complete address of referee"
                  ></textarea>
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Email</label>
                  <div class="input-wrapper">
                    <span class="input-prefix">✉️</span>
                    <input
                        type="email"
                        v-model="referee.email"
                        class="input-modern"
                        placeholder="referee@example.com"
                    />
                  </div>
                </div>
                <div class="form-group-modern">
                  <label class="label-modern">Mobile</label>
                  <div class="input-wrapper">
                    <span class="input-prefix">📱</span>
                    <input
                        type="tel"
                        v-model="referee.mobile"
                        class="input-modern"
                        placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pay Order -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">💳</div>
            <div class="header-content">
              <h3 class="header-title">Payment Information</h3>
              <p class="header-subtitle">Enter your pay order details</p>
            </div>
          </div>
          <div class="card-content">
            <div class="form-group-modern">
              <label class="label-modern">Pay Order Number</label>
              <div class="input-wrapper">
                <span class="input-prefix">💰</span>
                <input
                    type="text"
                    v-model="formData.pay_order_no"
                    class="input-modern"
                    placeholder="Enter pay order number"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ANNEXES SECTION -->
        <div class="form-card slide-up annexes-section">
          <div class="card-header-modern">
            <div class="header-icon">📎</div>
            <div class="header-content">
              <h3 class="header-title">Annexes</h3>
              <p class="header-subtitle" style="color: #dc2626; font-weight: 600;">
                (Only original copies should be added with application)
              </p>
            </div>
          </div>
          <div class="card-content">

            <div class="annexes-list-simple">

              <div class="annex-item">
                <div class="annex-number">1.</div>
                <div class="annex-text">
                  <strong>5 (Five) copies of passport size recent colour photograph.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[0]" disabled />
                  <span class="check-icon" v-if="annexChecked[0]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">2.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of SSC or equivalent certificate.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[1]" disabled />
                  <span class="check-icon" v-if="annexChecked[1]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">3.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of SSC or equivalent transcript.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[2]" disabled />
                  <span class="check-icon" v-if="annexChecked[2]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">4.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of HSC or equivalent certificate.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[3]" disabled />
                  <span class="check-icon" v-if="annexChecked[3]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">5.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of HSC or equivalent transcript.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[4]" disabled />
                  <span class="check-icon" v-if="annexChecked[4]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">6.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of birth certificate.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[5]" disabled />
                  <span class="check-icon" v-if="annexChecked[5]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">7.</div>
                <div class="annex-text">
                  <strong>Attested photo copy of Citizenship/National ID Card.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[6]" disabled />
                  <span class="check-icon" v-if="annexChecked[6]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">8.</div>
                <div class="annex-text">
                  <strong>2 (Two) copies of passport size recent photograph of the Father.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[7]" disabled />
                  <span class="check-icon" v-if="annexChecked[7]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">8.</div>
                <div class="annex-text">
                  <strong>2 (Two) copies of passport size recent photograph of the Mother.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[8]" disabled />
                  <span class="check-icon" v-if="annexChecked[8]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">10.</div>
                <div class="annex-text">
                  <strong>Attested copy of National ID of the Parents.</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[9]" disabled />
                  <span class="check-icon" v-if="annexChecked[9]">✓</span>
                </div>
              </div>

              <div class="annex-item">
                <div class="annex-number">11.</div>
                <div class="annex-text">
                  <strong>Original Payment Slip (Pay Order).</strong>
                </div>
                <div class="annex-checkbox">
                  <input type="checkbox" v-model="annexChecked[10]" disabled />
                  <span class="check-icon" v-if="annexChecked[10]">✓</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        <!-- Document Upload Section -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">📁</div>
            <div class="header-content">
              <h3 class="header-title">Upload Required Documents</h3>
              <p class="header-subtitle">Upload scanned copies of all documents mentioned above</p>
            </div>
          </div>
          <div class="card-content">

            <div class="documents-grid">

              <!-- Student Photos -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">📸</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Student Photos <span class="required-badge">Required</span></h5>
                    <p class="doc-description">5 passport-size photos (JPG/PNG, max 2MB each)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('student_photo')">
                  <input
                      type="file"
                      :ref="'student_photo'"
                      @change="handleFileUpload($event, 'student_photo')"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      style="display: none"
                  />
                  <div v-if="!documents.student_photo || documents.student_photo.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.student_photo" :key="index" class="file-preview">
                      <img v-if="file.preview" :src="file.preview" alt="Photo" class="preview-thumbnail" />
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('student_photo', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SSC Certificate -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">📜</span>
                  <div class="doc-info">
                    <h5 class="doc-title">SSC Certificate <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested copy (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('ssc_certificate')">
                  <input
                      type="file"
                      :ref="'ssc_certificate'"
                      @change="handleFileUpload($event, 'ssc_certificate')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.ssc_certificate || documents.ssc_certificate.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.ssc_certificate" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('ssc_certificate', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SSC Marksheet -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">📊</span>
                  <div class="doc-info">
                    <h5 class="doc-title">SSC Marksheet <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested transcript (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('ssc_marksheet')">
                  <input
                      type="file"
                      :ref="'ssc_marksheet'"
                      @change="handleFileUpload($event, 'ssc_marksheet')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.ssc_marksheet || documents.ssc_marksheet.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.ssc_marksheet" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('ssc_marksheet', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- HSC Certificate -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">📜</span>
                  <div class="doc-info">
                    <h5 class="doc-title">HSC Certificate <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested copy (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('hsc_certificate')">
                  <input
                      type="file"
                      :ref="'hsc_certificate'"
                      @change="handleFileUpload($event, 'hsc_certificate')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.hsc_certificate || documents.hsc_certificate.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.hsc_certificate" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('hsc_certificate', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- HSC Marksheet -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">📊</span>
                  <div class="doc-info">
                    <h5 class="doc-title">HSC Marksheet <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested transcript (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('hsc_marksheet')">
                  <input
                      type="file"
                      :ref="'hsc_marksheet'"
                      @change="handleFileUpload($event, 'hsc_marksheet')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.hsc_marksheet || documents.hsc_marksheet.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.hsc_marksheet" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('hsc_marksheet', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Birth Certificate -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">🎂</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Birth Certificate <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested copy (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('birth_certificate')">
                  <input
                      type="file"
                      :ref="'birth_certificate'"
                      @change="handleFileUpload($event, 'birth_certificate')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.birth_certificate || documents.birth_certificate.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.birth_certificate" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('birth_certificate', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- National ID -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">🆔</span>
                  <div class="doc-info">
                    <h5 class="doc-title">National ID <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested copy (PDF/Image, max 2MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('national_id')">
                  <input
                      type="file"
                      :ref="'national_id'"
                      @change="handleFileUpload($event, 'national_id')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.national_id || documents.national_id.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.national_id" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('national_id', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Father's Photo -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">👨</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Father's Photo <span class="required-badge">Required</span></h5>
                    <p class="doc-description">2 passport-size photos (JPG/PNG, max 2MB each)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('father_photo')">
                  <input
                      type="file"
                      :ref="'father_photo'"
                      @change="handleFileUpload($event, 'father_photo')"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      style="display: none"
                  />
                  <div v-if="!documents.father_photo || documents.father_photo.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.father_photo" :key="index" class="file-preview">
                      <img v-if="file.preview" :src="file.preview" alt="Photo" class="preview-thumbnail" />
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('father_photo', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mother's Photo -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">👩</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Mother's Photo <span class="required-badge">Required</span></h5>
                    <p class="doc-description">2 passport-size photos (JPG/PNG, max 2MB each)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('mother_photo')">
                  <input
                      type="file"
                      :ref="'mother_photo'"
                      @change="handleFileUpload($event, 'mother_photo')"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      style="display: none"
                  />
                  <div v-if="!documents.mother_photo || documents.mother_photo.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.mother_photo" :key="index" class="file-preview">
                      <img v-if="file.preview" :src="file.preview" alt="Photo" class="preview-thumbnail" />
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('mother_photo', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Parents' NID -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">🆔</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Parents' NID <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Attested copies (PDF/Image, max 2MB each)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('parent_nid')">
                  <input
                      type="file"
                      :ref="'parent_nid'"
                      @change="handleFileUpload($event, 'parent_nid')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      multiple
                      style="display: none"
                  />
                  <div v-if="!documents.parent_nid || documents.parent_nid.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.parent_nid" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('parent_nid', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Receipt -->
              <div class="document-upload-card">
                <div class="document-header">
                  <span class="doc-icon">💳</span>
                  <div class="doc-info">
                    <h5 class="doc-title">Payment Receipt <span class="required-badge">Required</span></h5>
                    <p class="doc-description">Original pay order (PDF/Image, max 5MB)</p>
                  </div>
                </div>
                <div class="upload-zone" @click="triggerUpload('payment_receipt')">
                  <input
                      type="file"
                      :ref="'payment_receipt'"
                      @change="handleFileUpload($event, 'payment_receipt')"
                      accept=".pdf,image/jpeg,image/jpg,image/png"
                      style="display: none"
                  />
                  <div v-if="!documents.payment_receipt || documents.payment_receipt.length === 0" class="upload-placeholder">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>Click to upload</span>
                  </div>
                  <div v-else class="uploaded-files">
                    <div v-for="(file, index) in documents.payment_receipt" :key="index" class="file-preview">
                      <span class="file-icon">📄</span>
                      <div class="file-info">
                        <span class="file-name">{{ file.name }}</span>
                        <span class="file-size">{{ formatFileSize(file.size) }}</span>
                      </div>
                      <button type="button" @click.stop="removeFile('payment_receipt', index)" class="remove-file-btn">×</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Upload Summary -->
            <div class="upload-summary">
              <div class="summary-item">
                <span class="summary-label">Required Documents:</span>
                <span class="summary-value">{{ requiredDocsUploaded }} / {{ totalRequiredDocs }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Files:</span>
                <span class="summary-value">{{ totalUploadedFiles }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total Size:</span>
                <span class="summary-value">{{ totalUploadSize }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Declarations -->
        <div class="form-card slide-up">
          <div class="card-header-modern">
            <div class="header-icon">✍️</div>
            <div class="header-content">
              <h3 class="header-title">Declarations</h3>
              <p class="header-subtitle">Please read and accept the declarations</p>
            </div>
          </div>
          <div class="card-content">

            <!-- Candidate Declaration -->
            <div class="declaration-box">
              <h5 class="declaration-title">Candidate's Declaration</h5>
              <p class="declaration-text">
                I do hereby declare that this application form has been filled in by me in own handwriting and that the information given herein are correct. I do hereby agree that, if I am admitted, I shall abide by the rules and regulations of this college and also abide by the orders given by the college authority with regard to my conducts, discipline and studies. I fully understand that the Principal of the college will have full liberty to expel me from college for any infringement of the above undertaking not withstanding the fact that all fees may have been paid.
              </p>
              <label class="checkbox-modern">
                <input type="checkbox" v-model="formData.candidate_declaration" required />
                <span class="checkmark"></span>
                <span class="checkbox-label">I agree to the above declaration</span>
              </label>
              <div class="signature-grid">
                <div class="signature-field">
                  <label>Signature & Date</label>
                  <input type="text" readonly :value="currentDate" class="signature-input" />
                </div>
                <div class="signature-field">
                  <label>Full Name (Capital Letters)</label>
                  <input type="text" readonly :value="formData.name" class="signature-input uppercase" />
                </div>
              </div>
            </div>

            <!-- Parent/Guardian Declaration -->
            <div class="declaration-box">
              <h5 class="declaration-title">Parent/Guardian's Declaration</h5>
              <p class="declaration-text">
                I do hereby declare that in the event of my daughter/wards (give full name) <strong>{{ formData.name || '________________' }}</strong> being successful in obtaining admission to the Medical College for Women & Hospital shall make all arrangements to the satisfaction of the college authority for the timely payment of all dues, tuition fees and such other fees as may be required to be paid during the period of her studies at this college.
              </p>
              <label class="checkbox-modern">
                <input type="checkbox" v-model="formData.parent_declaration" required />
                <span class="checkmark"></span>
                <span class="checkbox-label">I agree to the above declaration</span>
              </label>
              <div class="signature-grid">
                <div class="signature-field">
                  <label>Parent/Guardian's Name</label>
                  <input
                      type="text"
                      v-model="formData.parent_name"
                      class="signature-input"
                      placeholder="Full name"
                      required
                  />
                </div>
                <div class="signature-field">
                  <label>Date</label>
                  <input type="text" readonly :value="currentDate" class="signature-input" />
                </div>
                <div class="signature-field">
                  <label>Relationship</label>
                  <input
                      type="text"
                      v-model="formData.parent_relationship"
                      class="signature-input"
                      placeholder="Father/Mother/Guardian"
                      required
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions-modern">
          <button type="button" @click="saveDraft" class="btn-modern btn-outline" :disabled="loading">
            <span class="btn-icon">💾</span>
            <span>Save Draft</span>
          </button>
          <button type="submit" class="btn-modern btn-primary" :disabled="loading">
            <span class="btn-icon">✓</span>
            <span>{{ loading ? 'Submitting...' : 'Submit Form' }}</span>
          </button>
          <button type="button" @click="printForm" class="btn-modern btn-secondary" v-if="formData.id">
            <span class="btn-icon">🖨️</span>
            <span>Print Form</span>
          </button>
        </div>

      </form>
    </div>

    <!-- Success Modal -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showSuccessModal" @click="closeSuccessModal">
        <div class="success-modal" @click.stop>

          <!-- Animated Success Icon -->
          <div class="success-animation">
            <div class="success-circle">
              <div class="success-checkmark">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            <div class="success-confetti">
              <div class="confetti" v-for="i in 20" :key="i" :style="getConfettiStyle(i)"></div>
            </div>
          </div>

          <!-- Success Content -->
          <div class="success-content">
            <h2 class="success-title">🎉 Admission Form Submitted Successfully!</h2>
            <p class="success-subtitle">
              Your application has been received and is being processed
            </p>

            <!-- ID Cards -->
            <div class="id-cards-container">
              <div class="id-card student-id-card">
                <div class="id-card-icon">🎓</div>
                <div class="id-card-content">
                  <span class="id-card-label">Student ID</span>
                  <span class="id-card-value">{{ submittedData.student_id }}</span>
                  <button
                      type="button"
                      @click="copyToClipboard(submittedData.student_id, 'Student ID')"
                      class="copy-btn"
                      title="Copy to clipboard"
                  >
                    <span v-if="!copied.student_id">📋</span>
                    <span v-else class="copied-check">✓</span>
                  </button>
                </div>
              </div>

              <div class="id-card form-number-card">
                <div class="id-card-icon">📄</div>
                <div class="id-card-content">
                  <span class="id-card-label">Form Number</span>
                  <span class="id-card-value">{{ submittedData.form_number }}</span>
                  <button
                      type="button"
                      @click="copyToClipboard(submittedData.form_number, 'Form Number')"
                      class="copy-btn"
                      title="Copy to clipboard"
                  >
                    <span v-if="!copied.form_number">📋</span>
                    <span v-else class="copied-check">✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Important Notice -->
            <div class="notice-box">
              <div class="notice-icon">💡</div>
              <div class="notice-content">
                <strong>Important:</strong> Please save these IDs for future reference.
                You will need them to track your application status and for any future correspondence.
              </div>
            </div>

            <!-- Next Steps -->
            <div class="next-steps">
              <h4>📌 Next Steps</h4>
              <ol>
                <li>Print your application form and keep it safe</li>
                <li>Submit all required original documents to the college office</li>
                <li>Check your email regularly for updates</li>
                <li>Track your application status using your Student ID</li>
              </ol>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button type="button" @click="printFormFromModal" class="btn-modal btn-print">
                <span class="btn-icon">🖨️</span>
                <span>Print Form</span>
              </button>
              <button type="button" @click="downloadForm" class="btn-modal btn-download">
                <span class="btn-icon">📥</span>
                <span>Download PDF</span>
              </button>
              <button type="button" @click="goToDashboard" class="btn-modal btn-dashboard">
                <span class="btn-icon">🏠</span>
                <span>Go to Dashboard</span>
              </button>
            </div>

            <!-- Close Button -->
            <button type="button" @click="closeSuccessModal" class="modal-close-btn">
              <span>Continue Editing</span>
            </button>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'AdmissionFormBeautiful',

  data() {
    return {
      formData: {
        category: 'General',
        roll_no: '',
        written_score: null,
        merit_score: null,
        merit_position: null,
        college_code: '1004',
        serial_no: '',
        name: '',
        mobile: '+880',
        fathers_name: '',
        fathers_occupation: '',
        fathers_mobile: '+880',
        mothers_name: '',
        mothers_occupation: 'Housewife',
        mothers_mobile: '+880',
        date_of_birth: '',
        blood_group: '',
        marital_status: 'No',
        country_of_birth: 'Bangladesh',
        nationality: 'Bangladeshi',
        religion: 'Islam',
        national_id_no: '',
        passport_no: '',
        mailing_address: '',
        tel_res: '',
        permanent_address: '',
        applicant_email: '',
        parent_email: '',
        guardian_name: '',
        guardian_address: '',
        guardian_mobile: '+880',
        guardian_relationship: '',
        guardian_email: '',
        guardian_occupation: '',
        ssc_institute: '',
        ssc_country: 'Bangladesh',
        ssc_year: new Date().getFullYear() - 2,
        ssc_board: '',
        ssc_roll_no: '',
        ssc_gpa_without: null,
        ssc_gpa_with: null,
        hsc_institute: '',
        hsc_country: 'Bangladesh',
        hsc_year: new Date().getFullYear(),
        hsc_board: '',
        hsc_roll_no: '',
        hsc_gpa_without: null,
        hsc_gpa_with: null,
        sports_activities: '',
        referees: [
          { address: '', email: '', mobile: '+880' },
          { address: '', email: '', mobile: '+880' }
        ],
        pay_order_no: '',
        candidate_declaration: false,
        parent_declaration: false,
        parent_name: '',
        parent_relationship: 'Father',
        student_id: '',
        form_number: '',
        id: null
      },

      documents: {
        student_photo: [],
        ssc_certificate: [],
        ssc_marksheet: [],
        hsc_certificate: [],
        hsc_marksheet: [],
        birth_certificate: [],
        national_id: [],
        father_photo: [],
        mother_photo: [],
        parent_nid: [],
        payment_receipt: []
      },

      requiredDocTypes: [
        'student_photo',
        'ssc_certificate',
        'ssc_marksheet',
        'hsc_certificate',
        'hsc_marksheet',
        'birth_certificate',
        'national_id',
        'father_photo',
        'mother_photo',
        'parent_nid',
        'payment_receipt'
      ],

      maxFileSizes: {
        student_photo: 2 * 1024 * 1024,
        father_photo: 2 * 1024 * 1024,
        mother_photo: 2 * 1024 * 1024,
        parent_nid: 2 * 1024 * 1024,
        national_id: 2 * 1024 * 1024,
        default: 5 * 1024 * 1024
      },

      annexChecked: [
        false, false, false, false, false,
        false, false, false, false, false, false
      ],

      languages: ['Bangla', 'English', ''],
      categories: ['General', 'Freedom Fighter', 'Scholarship', 'Governing Body', 'Foreign'],
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      photoPreview: null,
      uploadedPhotos: [],
      loading: false,
      errors: {},

      showSuccessModal: false,
      submittedData: {
        student_id: '',
        form_number: ''
      },
      copied: {
        student_id: false,
        form_number: false
      }
    };
  },

  computed: {
    currentDate() {
      return new Date().toLocaleDateString('en-GB');
    },

    formProgress() {
      const requiredFields = [
        'name', 'mobile', 'fathers_name', 'mothers_name',
        'date_of_birth', 'mailing_address', 'permanent_address',
        'applicant_email', 'candidate_declaration', 'parent_declaration'
      ];

      const optionalFields = [
        'roll_no', 'merit_score', 'merit_position', 'college_code',
        'blood_group', 'country_of_birth', 'nationality', 'religion',
        'national_id_no', 'ssc_institute', 'hsc_institute',
        'fathers_occupation', 'mothers_occupation', 'guardian_name',
        'sports_activities', 'pay_order_no'
      ];

      let filledRequired = requiredFields.filter(field => {
        const value = this.formData[field];
        return value !== '' && value !== null && value !== false;
      }).length;

      let filledOptional = optionalFields.filter(field => {
        const value = this.formData[field];
        return value !== '' && value !== null;
      }).length;

      if (this.uploadedPhotos.length > 0) filledOptional += 1;
      if (this.formData.referees[0].address || this.formData.referees[0].email) filledOptional += 1;
      if (this.formData.referees[1].address || this.formData.referees[1].email) filledOptional += 1;

      const totalFields = requiredFields.length + optionalFields.length + 3;
      const totalFilled = filledRequired + filledOptional;

      return Math.round((totalFilled / totalFields) * 100);
    },

    requiredDocsUploaded() {
      return this.requiredDocTypes.filter(type =>
          this.documents[type] && this.documents[type].length > 0
      ).length;
    },

    totalRequiredDocs() {
      return this.requiredDocTypes.length;
    },

    totalUploadedFiles() {
      let total = 0;
      Object.values(this.documents).forEach(docArray => {
        if (docArray && docArray.length > 0) {
          total += docArray.length;
        }
      });
      return total;
    },

    totalUploadSize() {
      let total = 0;
      Object.values(this.documents).forEach(docArray => {
        if (docArray && docArray.length > 0) {
          docArray.forEach(file => {
            total += file.size || 0;
          });
        }
      });
      return this.formatFileSize(total);
    },

    allRequiredDocsUploaded() {
      return this.requiredDocsUploaded === this.totalRequiredDocs;
    }
  },


  methods: {
    toUpperCase(field) {
      this.formData[field] = this.formData[field].toUpperCase();
    },

    handlePhotoUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.uploadedPhotos = Array.from(files);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.photoPreview = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },

    triggerUpload(docType) {
      if (this.$refs[docType]) {
        this.$refs[docType].click();
      }
    },

    handleFileUpload(event, docType) {
      const files = Array.from(event.target.files);
      const maxSize = this.maxFileSizes[docType] || this.maxFileSizes.default;
      const self = this;

      files.forEach(file => {
        if (file.size > maxSize) {
          alert('File "' + file.name + '" is too large. Maximum size is ' + self.formatFileSize(maxSize));
          return;
        }

        const allowedTypes = self.getAllowedFileTypes(docType);
        if (!allowedTypes.includes(file.type)) {
          alert('File "' + file.name + '" has invalid type.');
          return;
        }

        const fileObj = {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null
        };

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function(e) {
            fileObj.preview = e.target.result;
            self.$forceUpdate();
          };
          reader.readAsDataURL(file);
        }

        if (!self.documents[docType]) {
          self.$set(self.documents, docType, []);
        }

        if (['student_photo', 'father_photo', 'mother_photo', 'parent_nid'].includes(docType)) {
          self.documents[docType].push(fileObj);
        } else {
          self.$set(self.documents, docType, [fileObj]);
        }
      });

      event.target.value = '';
    },

    removeFile(docType, index) {
      if (this.documents[docType] && this.documents[docType][index]) {
        this.documents[docType].splice(index, 1);
      }
    },

    getAllowedFileTypes(docType) {
      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const documentTypes = ['application/pdf'].concat(imageTypes);

      if (docType.includes('photo')) {
        return imageTypes;
      }
      return documentTypes;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    saveDraft() {
      const self = this;
      this.loading = true;

      const formDataToSend = this.prepareFormData();
      let apiCall;

      if (this.formData.id) {
        apiCall = this.$api.put('/admission-forms/' + this.formData.id, formDataToSend);
      } else {
        apiCall = this.$api.post('/admission-forms', formDataToSend);
      }

      return apiCall.then(function(response) {
        self.formData.id = response.data.data.id;
        self.formData.student_id = response.data.data.student_id;
        self.formData.form_number = response.data.data.form_number;
        alert('Draft saved successfully!');
        return response;
      }).catch(function(error) {
        console.error('Error saving draft:', error);
        self.handleError(error);
        throw error;
      }).finally(function() {
        self.loading = false;
      });
    },

    submitForm() {
      const self = this;

      if (!this.validateForm()) {
        alert('Please fill all required fields');
        return;
      }

      if (!this.allRequiredDocsUploaded) {
        alert('Please upload all required documents. You have uploaded ' + this.requiredDocsUploaded + ' out of ' + this.totalRequiredDocs + ' required documents.');
        return;
      }

      this.loading = true;

      this.saveDraft().then(function() {
        if (self.formData.id) {
          return self.$api.post('/admission-forms/' + self.formData.id + '/submit');
        }
      }).then(function(response) {
        if (response) {
          self.submittedData = {
            student_id: response.data.data.student_id,
            form_number: response.data.data.form_number
          };

          self.formData.student_id = response.data.data.student_id;
          self.formData.form_number = response.data.data.form_number;
          self.formData.status = 'submitted';

          self.showSuccessModal = true;
        }
      }).catch(function(error) {
        console.error('Error submitting form:', error);
        self.handleError(error);
      }).finally(function() {
        self.loading = false;
      });
    },

    validateForm() {
      return this.formData.name &&
          this.formData.mobile &&
          this.formData.fathers_name &&
          this.formData.mothers_name &&
          this.formData.date_of_birth &&
          this.formData.mailing_address &&
          this.formData.permanent_address &&
          this.formData.applicant_email &&
          this.formData.candidate_declaration &&
          this.formData.parent_declaration;
    },

    prepareFormData() {
      const data = new FormData();

      Object.keys(this.formData).forEach(key => {
        if (key === 'referees') {
          data.append(key, JSON.stringify(this.formData[key]));
        } else if (this.formData[key] !== null && this.formData[key] !== '') {
          data.append(key, this.formData[key]);
        }
      });

      data.append('languages_known', JSON.stringify(this.languages.filter(l => l)));

      this.uploadedPhotos.forEach((photo, index) => {
        data.append('photos[' + index + ']', photo);
      });

      Object.keys(this.documents).forEach(docType => {
        if (this.documents[docType] && this.documents[docType].length > 0) {
          this.documents[docType].forEach((fileObj, index) => {
            data.append('documents[' + docType + '][' + index + ']', fileObj.file);
          });
        }
      });

      return data;
    },

    handleError(error) {
      if (error.response && error.response.data.errors) {
        this.errors = error.response.data.errors;
        const errorMessages = Object.values(this.errors).flat().join('\n');
        alert('Validation errors:\n' + errorMessages);
      } else {
        alert('An error occurred. Please try again.');
      }
    },

    printForm() {
      window.print();
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
    },

    copyToClipboard(text, label) {
      const self = this;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          if (label === 'Student ID') {
            self.$set(self.copied, 'student_id', true);
            setTimeout(function() {
              self.$set(self.copied, 'student_id', false);
            }, 2000);
          } else {
            self.$set(self.copied, 'form_number', true);
            setTimeout(function() {
              self.$set(self.copied, 'form_number', false);
            }, 2000);
          }
          alert(label + ' copied to clipboard!');
        });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(label + ' copied!');
      }
    },

    printFormFromModal() {
      this.closeSuccessModal();
      const self = this;
      console.log(self)
      setTimeout(function() {
        window.print();
      }, 300);
    },

    downloadForm() {
      const self = this;
      this.$api.get('/admission-forms/' + this.formData.id + '/download', {
        responseType: 'blob'
      }).then(function(response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'admission_form_' + self.submittedData.student_id + '.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        alert('Form downloaded successfully!');
      }).catch(function(error) {
        console.error('Download error:', error);
        alert('Failed to download form');
      });
    },

    goToDashboard() {
      this.closeSuccessModal();
      this.$router.push('/dashboard');
    },

    getConfettiStyle(index) {
      const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#fa709a'];
      const randomColor = colors[index % colors.length];
      const randomLeft = Math.random() * 100;
      const randomDelay = Math.random() * 0.5;
      const randomDuration = 1 + Math.random() * 1;

      return {
        left: randomLeft + '%',
        backgroundColor: randomColor,
        animationDelay: randomDelay + 's',
        animationDuration: randomDuration + 's'
      };
    },

    loadFormData(id) {
      const self = this;
      this.$api.get('/admission-forms/' + id)
          .then(function(response) {
            self.formData = Object.assign({}, self.formData, response.data.data);
            if (self.formData.languages_known) {
              self.languages = self.formData.languages_known;
            }
          })
          .catch(function(error) {
            console.error('Error loading form:', error);
          });
    }
  },

  mounted() {
    const formId = this.$route.params.id;
    if (formId) {
      this.loadFormData(formId);
    }
  }
};
</script>

<style scoped>
@import './AdmissionFormStyles.css';

/* Document Upload Styles */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.document-upload-card {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.document-upload-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.document-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.doc-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
}

.doc-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.doc-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.required-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 16px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #667eea;
  background: #f3f4ff;
}

.upload-placeholder {
  text-align: center;
  color: #9ca3af;
}

.upload-icon {
  width: 32px;
  height: 32px;
  fill: #d1d5db;
  margin: 0 auto 8px;
}

.uploaded-files {
  width: 100%;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
}

.file-preview:last-child {
  margin-bottom: 0;
}

.preview-thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.file-icon {
  font-size: 32px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  display: block;
  font-size: 11px;
  color: #9ca3af;
}

.remove-file-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #fee2e2;
  color: #ef4444;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.remove-file-btn:hover {
  background: #ef4444;
  color: white;
}

.upload-summary {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  gap: 16px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.summary-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: white;
}

/* Annexes Styles */
.annexes-section {
  background: #fff;
  border: 2px solid #e5e7eb;
}

.annexes-list-simple {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.annex-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.annex-item:last-child {
  border-bottom: none;
}

.annex-item:hover {
  background: #f9fafb;
}

.annex-number {
  width: 40px;
  font-weight: 700;
  color: #667eea;
  font-size: 16px;
  flex-shrink: 0;
}

.annex-text {
  flex: 1;
  color: #1f2937;
  font-size: 15px;
  line-height: 1.6;
}

.annex-text strong {
  font-weight: 600;
}

.annex-checkbox {
  width: 32px;
  height: 32px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  background: white;
  transition: all 0.3s ease;
}

.annex-checkbox input[type="checkbox"] {
  display: none;
}

.check-icon {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.annex-item:has(input:checked) .annex-checkbox {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #059669;
}

/* Success Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.success-modal {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.success-animation {
  padding: 40px 0 20px;
  text-align: center;
  position: relative;
}

.success-checkmark {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.checkmark {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  stroke-width: 3;
  stroke: #10b981;
  stroke-miterlimit: 10;
  animation: checkmarkFill 0.4s ease-in-out 0.4s forwards;
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: checkmarkStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: checkmarkStroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes checkmarkStroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes checkmarkFill {
  100% {
    box-shadow: inset 0 0 0 50px #10b981;
  }
}

.success-confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  top: 50%;
  animation: confettiFall 2s ease-out forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}

.success-content {
  padding: 0 40px 40px;
  text-align: center;
}

.success-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 12px 0;
}

.success-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.id-cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.id-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.id-card-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.id-card-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.id-card-value {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: white;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.copied-check {
  color: #10b981;
  font-size: 18px;
  font-weight: bold;
}

.notice-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
  text-align: left;
  margin-bottom: 24px;
}

.notice-icon {
  font-size: 24px;
}

.notice-content {
  color: #78350f;
  font-size: 13px;
  line-height: 1.6;
}

.next-steps {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 20px;
  text-align: left;
  margin-bottom: 24px;
}

.next-steps h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 15px;
}

.next-steps ol {
  margin: 0;
  padding-left: 20px;
}

.next-steps li {
  margin-bottom: 8px;
  color: #4b5563;
  font-size: 13px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.btn-modal {
  flex: 1;
  min-width: 140px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-print {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.btn-download {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-dashboard {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }

  .id-cards-container {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-modal {
    width: 100%;
  }
}
</style>