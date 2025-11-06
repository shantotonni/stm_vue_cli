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
    <div v-if="formData.student_id" class="success-hero">
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
            <span>Submit Form</span>
          </button>
          <button type="button" @click="printForm" class="btn-modern btn-secondary" v-if="formData.id">
            <span class="btn-icon">🖨️</span>
            <span>Print Form</span>
          </button>
        </div>

      </form>
    </div>
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
        college_code: '',
        serial_no: '',
        name: '',
        mobile: '',
        fathers_name: '',
        fathers_occupation: '',
        fathers_mobile: '',
        mothers_name: '',
        mothers_occupation: '',
        mothers_mobile: '',
        date_of_birth: '',
        blood_group: '',
        marital_status: 'No',
        country_of_birth: 'Bangladesh',
        nationality: 'Bangladeshi',
        religion: '',
        national_id_no: '',
        passport_no: '',
        mailing_address: '',
        tel_res: '',
        permanent_address: '',
        applicant_email: '',
        parent_email: '',
        guardian_name: '',
        guardian_address: '',
        guardian_mobile: '',
        guardian_relationship: '',
        guardian_email: '',
        guardian_occupation: '',
        ssc_institute: '',
        ssc_country: '',
        ssc_year: null,
        ssc_board: '',
        ssc_roll_no: '',
        ssc_gpa_without: null,
        ssc_gpa_with: null,
        hsc_institute: '',
        hsc_country: '',
        hsc_year: null,
        hsc_board: '',
        hsc_roll_no: '',
        hsc_gpa_without: null,
        hsc_gpa_with: null,
        sports_activities: '',
        referees: [
          { address: '', email: '', mobile: '' },
          { address: '', email: '', mobile: '' }
        ],
        pay_order_no: '',
        candidate_declaration: false,
        parent_declaration: false,
        parent_name: '',
        parent_relationship: '',
        student_id: '',
        form_number: ''
      },
      languages: ['', '', ''],
      categories: ['General', 'Freedom Fighter', 'Scholarship', 'Governing Body', 'Foreign'],
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      photoPreview: null,
      uploadedPhotos: [],
      collegeLogo: false,
      loading: false,
      errors: {}
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

    async saveDraft() {
      this.loading = true;
      try {
        const formDataToSend = this.prepareFormData();
        let response;
        if (this.formData.id) {
          response = await this.$api.put(`/admission-forms/${this.formData.id}`, formDataToSend);
        } else {
          response = await this.$api.post('/admission-forms', formDataToSend);
        }
        this.formData.id = response.data.data.id;
        this.formData.student_id = response.data.data.student_id;
        this.formData.form_number = response.data.data.form_number;
        alert('Draft saved successfully!');
      } catch (error) {
        console.error('Error saving draft:', error);
        this.handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      if (!this.validateForm()) {
        alert('Please fill all required fields');
        return;
      }
      this.loading = true;
      try {
        await this.saveDraft();
        if (this.formData.id) {
          const response = await this.$api.post(`/admission-forms/${this.formData.id}/submit`);
          alert(`Form submitted successfully!\nYour Student ID: ${response.data.data.student_id}\nForm Number: ${response.data.data.form_number}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        this.handleError(error);
      } finally {
        this.loading = false;
      }
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
        data.append(`photos[${index}]`, photo);
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

    loadFormData(id) {
      this.$api.get(`/admission-forms/${id}`)
          .then(response => {
            this.formData = { ...this.formData, ...response.data.data };
            if (this.formData.languages_known) {
              this.languages = this.formData.languages_known;
            }
          })
          .catch(error => {
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
</style>