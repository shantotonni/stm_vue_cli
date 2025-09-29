<!-- Profile.vue -->
<template>
  <div>
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="container">
        <div class="header-content">
          <!-- Avatar Section -->
          <div class="avatar-section">
            <div class="avatar-container">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
                   alt="Dr. Sarah Ahmed" class="avatar-img">
              <div class="avatar-edit">
                <i class="fas fa-camera"></i>
              </div>
            </div>
          </div>

          <!-- User Info -->
          <div class="user-info">
            <h1 class="user-name">Dr. Sarah Ahmed</h1>

            <div class="user-badges">
              <div class="badge teacher">
                <i class="fas fa-user-md"></i>
                Teacher
              </div>
              <div class="badge" style="background: linear-gradient(45deg, #ff6b6b, #feca57); color: white;">
                <i class="fas fa-star"></i>
                Verified
              </div>
            </div>

            <p class="user-title">Assistant Professor • Department of Cardiology</p>

            <div class="user-details">
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span>sarah.ahmed@medical.edu</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>+880 1712-345678</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Dhaka Medical College, Bangladesh</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>Joined January 2020</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-primary" onclick="toggleEdit()">
              <i class="fas fa-edit"></i>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Tabs -->
    <div class="container">
      <div class="profile-tabs">
        <div class="tabs-wrapper">
          <button class="tab-btn active" onclick="showTab('overview')">
            <i class="fas fa-user"></i>
            Overview
          </button>
          <button class="tab-btn" onclick="showTab('academic')">
            <i class="fas fa-graduation-cap"></i>
            Teaching
          </button>
          <button class="tab-btn" onclick="showTab('activity')">
            <i class="fas fa-clock"></i>
            Activity
          </button>
          <button class="tab-btn" onclick="showTab('settings')">
            <i class="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>

      <!-- Overview Tab Content -->
      <div id="overview" class="tab-content active">
        <div class="content-grid">
          <!-- Main Content -->
          <div class="main-content">
            <!-- Personal Information Card -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-user"></i>
                <h3>Personal Information</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Full Name</label>
                  <div class="form-text">Dr. Sarah Ahmed</div>
                </div>

                <div class="form-group">
                  <label>Email Address</label>
                  <div class="form-text">sarah.ahmed@medical.edu</div>
                </div>

                <div class="form-group">
                  <label>Phone Number</label>
                  <div class="form-text">+880 1712-345678</div>
                </div>

                <div class="form-group">
                  <label>Date of Birth</label>
                  <div class="form-text">August 15, 1985</div>
                </div>

                <div class="form-group full-width">
                  <label>Address</label>
                  <div class="form-text">House 123, Road 15, Dhanmondi, Dhaka-1205, Bangladesh</div>
                </div>
              </div>
            </div>

            <!-- Professional Information Card -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-stethoscope"></i>
                <h3>Professional Information</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Employee ID</label>
                  <div class="form-text mono">TCH-2020-001</div>
                </div>

                <div class="form-group">
                  <label>Designation</label>
                  <div class="form-text">Assistant Professor</div>
                </div>

                <div class="form-group">
                  <label>Department</label>
                  <div class="form-text">Cardiology</div>
                </div>

                <div class="form-group">
                  <label>Joining Date</label>
                  <div class="form-text">January 15, 2020</div>
                </div>

                <div class="form-group full-width">
                  <label>Specialization</label>
                  <div class="form-text">Interventional Cardiology, Echocardiography, Cardiac Rehabilitation</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="sidebar">
            <!-- Stats Cards -->
            <div class="stats-grid">
              <div class="stat-card blue">
                <div class="stat-content">
                  <div class="stat-info">
                    <h4>Active Courses</h4>
                    <p class="value">12</p>
                  </div>
                  <i class="fas fa-book-open stat-icon"></i>
                </div>
              </div>

              <div class="stat-card green">
                <div class="stat-content">
                  <div class="stat-info">
                    <h4>Students Taught</h4>
                    <p class="value">245</p>
                  </div>
                  <i class="fas fa-users stat-icon"></i>
                </div>
              </div>

              <div class="stat-card purple">
                <div class="stat-content">
                  <div class="stat-info">
                    <h4>Experience</h4>
                    <p class="value">4+ Years</p>
                  </div>
                  <i class="fas fa-award stat-icon"></i>
                </div>
              </div>

              <div class="stat-card orange">
                <div class="stat-content">
                  <div class="stat-info">
                    <h4>Rating</h4>
                    <p class="value">4.9/5</p>
                  </div>
                  <i class="fas fa-star stat-icon"></i>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <div class="card-header">
                <i class="fas fa-clock"></i>
                <h3>Recent Activity</h3>
              </div>

              <div class="activity-feed">
                <div class="activity-item">
                  <div class="activity-icon course">
                    <i class="fas fa-book-open"></i>
                  </div>
                  <div class="activity-content">
                    <h4>Course Updated</h4>
                    <p>Added new lecture slides for "Advanced Cardiology"</p>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </div>

                <div class="activity-item">
                  <div class="activity-icon achievement">
                    <i class="fas fa-award"></i>
                  </div>
                  <div class="activity-content">
                    <h4>Achievement Unlocked</h4>
                    <p>Received "Excellent Teaching" badge</p>
                    <div class="activity-time">1 day ago</div>
                  </div>
                </div>

                <div class="activity-item">
                  <div class="activity-icon profile">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="activity-content">
                    <h4>Student Consultation</h4>
                    <p>Conducted office hours with 8 students</p>
                    <div class="activity-time">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Teaching Tab Content -->
      <div id="academic" class="tab-content">
        <div class="card">
          <div class="card-header">
            <i class="fas fa-chalkboard-teacher"></i>
            <h3>Teaching Dashboard</h3>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Current Courses</label>
              <div class="form-text">
                • Cardiology 301 - Advanced Procedures<br>
                • Cardiology 201 - Fundamentals<br>
                • Clinical Cardiology 401
              </div>
            </div>

            <div class="form-group">
              <label>Research Projects</label>
              <div class="form-text">
                • Heart Disease Prevention Study<br>
                • Cardiac Rehabilitation Methods
              </div>
            </div>

            <div class="form-group">
              <label>Publications</label>
              <div class="form-text">
                • "Modern Cardiology Techniques" (2023)<br>
                • "Patient Care in ICU" (2022)
              </div>
            </div>

            <div class="form-group">
              <label>Student Rating</label>
              <div class="form-text highlight">4.9/5.0 ⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Tab Content -->
      <div id="activity" class="tab-content">
        <div class="card">
          <div class="card-header">
            <i class="fas fa-history"></i>
            <h3>Activity Timeline</h3>
          </div>

          <div class="activity-feed">
            <div class="activity-item">
              <div class="activity-icon course">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="activity-content">
                <h4>Course Material Updated</h4>
                <p>Added new lecture slides for "Advanced Cardiology Procedures" with latest research findings and case studies.</p>
                <div class="activity-time">2 hours ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon achievement">
                <i class="fas fa-trophy"></i>
              </div>
              <div class="activity-content">
                <h4>Achievement Unlocked</h4>
                <p>Earned "Excellent Teaching" badge from student feedback and evaluation scores.</p>
                <div class="activity-time">1 day ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon profile">
                <i class="fas fa-users"></i>
              </div>
              <div class="activity-content">
                <h4>Student Consultation</h4>
                <p>Conducted office hours session with 8 students discussing complex cardiovascular cases.</p>
                <div class="activity-time">3 days ago</div>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon course">
                <i class="fas fa-microscope"></i>
              </div>
              <div class="activity-content">
                <h4>Research Published</h4>
                <p>Published paper on "Innovative Cardiac Rehabilitation Techniques" in Medical Journal.</p>
                <div class="activity-time">1 week ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab Content -->
      <div id="settings" class="tab-content">
        <div class="content-grid">
          <div class="main-content">
            <div class="card">
              <div class="card-header">
                <i class="fas fa-cog"></i>
                <h3>Account Settings</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Email Notifications</label>
                  <div class="form-text">✅ Enabled - Receive updates about courses and activities</div>
                </div>

                <div class="form-group">
                  <label>SMS Notifications</label>
                  <div class="form-text">❌ Disabled - No SMS notifications</div>
                </div>

                <div class="form-group">
                  <label>Public Profile</label>
                  <div class="form-text">✅ Visible - Your profile is visible to students and colleagues</div>
                </div>

                <div class="form-group">
                  <label>Two-Factor Authentication</label>
                  <div class="form-text">🔒 Enabled - Extra security for your account</div>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="card">
              <div class="card-header">
                <i class="fas fa-shield-alt"></i>
                <h3>Security Actions</h3>
              </div>

              <div style="display: flex; flex-direction: column; gap: 15px;">
                <button class="btn btn-primary">
                  <i class="fas fa-key"></i>
                  Change Password
                </button>

                <button class="btn btn-success">
                  <i class="fas fa-mobile-alt"></i>
                  Setup 2FA
                </button>

                <button class="btn" style="background: #e74c3c; color: white;">
                  <i class="fas fa-trash"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfilePage',
  data() {
    return {
      activeTab: 'overview',
      isEditing: false,
      loading: false,
      editForm: {},

      tabs: [
        { id: 'overview', label: 'Overview', icon: 'fas fa-user' },
        { id: 'academic', label: 'Academic', icon: 'fas fa-graduation-cap' },
        { id: 'activity', label: 'Activity', icon: 'fas fa-clock' },
        { id: 'settings', label: 'Settings', icon: 'fas fa-cog' }
      ],
    }
  },
  computed: {
    ...mapGetters(["currentUser","userMenus"]),
    menus() {
      return this.$store.getters.userMenus
    },
    user() {
      return this.$store.getters.currentUser;
    },
  },
  methods: {
    async saveProfile() {
      this.loading = true
      try {
        const response = await this.$api.put(`/users/${this.user.id}`, this.editForm)
        this.$store.commit('auth/SET_USER', response.data.user)
        this.isEditing = false
        this.$toast.success('Profile updated successfully!')
      } catch (error) {
        this.$toast.error('Failed to update profile')
        console.error('Profile update error:', error)
      } finally {
        this.loading = false
      }
    },
    showTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
          content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
          btn.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(tabName).classList.add('active');

        // Add active class to clicked tab button
        event.target.classList.add('active');
      },
    toggleEdit() {
        const btn = event.target;
        if (btn.innerHTML.includes('Edit')) {
          btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-success');

          // Add cancel button
          const cancelBtn = document.createElement('button');
          cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
          cancelBtn.className = 'btn btn-secondary';
          btn.parentNode.appendChild(cancelBtn);

          // Enable form editing (you can add more logic here)
          console.log('Edit mode enabled');
        } else {
          btn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
          btn.classList.remove('btn-success');
          btn.classList.add('btn-primary');

          // Remove cancel button
          const cancelBtn = btn.parentNode.querySelector('.btn-secondary');
          if (cancelBtn) {
            cancelBtn.remove();
          }

          console.log('Changes saved');
        }
      },
    cancelEdit() {
        const editBtn = document.querySelector('.btn-success');
        if (editBtn) {
          editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
          editBtn.classList.remove('btn-success');
          editBtn.classList.add('btn-primary');
        }

        event.target.remove();
        console.log('Edit cancelled');
      },
    loadJS(){
      // Add smooth scrolling and animations
      document.addEventListener('DOMContentLoaded', function() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
          card.style.animationDelay = `${index * 0.1}s`;
        });

        // Add hover effects to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
          card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotateY(5deg)';
          });

          card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg)';
          });
        });
      });
    }
  },

  mounted() {
    this.loadJS()
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Section */
.profile-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 20px 20px;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

/* Avatar */
.avatar-section {
  position: relative;
}

.avatar-container {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 24px;
  border-radius: 50%;
}

.avatar-container:hover .avatar-edit {
  opacity: 1;
}

/* User Info */
.user-info {
  flex: 1;
  min-width: 300px;
}

.user-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge.teacher {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.badge.student {
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  color: white;
}

.user-title {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
  font-weight: 500;
}

.user-details {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 15px;
}

.detail-item i {
  color: #667eea;
  width: 18px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-success {
  background: linear-gradient(45deg, #56ab2f, #a8e6cf);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

/* Tabs */
.profile-tabs {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tabs-wrapper {
  display: flex;
  gap: 5px;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 15px 25px;
  border: none;
  background: transparent;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.tab-btn.active {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Content Area */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.card-header i {
  font-size: 1.3rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-control {
  padding: 15px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-text {
  padding: 15px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.05);
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.form-text.mono {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #667eea;
}

.form-text.highlight {
  background: linear-gradient(45deg, #43e97b, #38f9d7);
  color: white;
  font-weight: 700;
}

/* Stats Cards */
.stats-grid {
  display: grid;
  gap: 20px;
}

.stat-card {
  padding: 25px;
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: scale(1.05);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: transform 0.6s ease;
}

.stat-card:hover::before {
  transform: scale(0.8);
}

.stat-card.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.green {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.stat-card.purple {
  background: linear-gradient(135deg, #8360c3 0%, #2ebf91 100%);
}

.stat-card.orange {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #333;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.stat-info h4 {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-info .value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

/* Activity Feed */
.activity-feed {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: start;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-icon.course {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.activity-icon.achievement {
  background: linear-gradient(45deg, #56ab2f, #a8e6cf);
}

.activity-icon.profile {
  background: linear-gradient(45deg, #8360c3, #2ebf91);
}

.activity-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.activity-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

/* Responsive Design */
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .user-name {
    font-size: 2rem;
  }

  .tabs-wrapper {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 15px;
  }
}

/* Hide/Show content based on active tab */
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.6s ease forwards;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }

/* Glassmorphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>