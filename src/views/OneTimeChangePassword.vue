<template>
  <div class="container">
    <div class="header">
      <div class="header-icon">🔒</div>
      <h1>Change Password</h1>
      <p>Update your password to keep your account secure</p>
    </div>

    <div class="form-container">
      <div class="security-notice">
        <div class="notice-icon">!</div>
        <p>Do not share your password with anyone for security purposes</p>
      </div>

      <div class="success-message" id="successMessage">
        <div class="success-icon">✓</div>
        <p>Password updated successfully! Your account is now secure.</p>
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ValidationProvider name="Old Password" rules="required|min:6" v-slot="{ errors }">
            <div class="form-group">
              <label class="form-label" for="Current Password">Old Password</label>
              <input type="password" id="Current Password" name="old_password" class="form-input" v-model="oldPassword" placeholder="Enter your current password" required>
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </div>
          </ValidationProvider>
          <ValidationProvider name="New Password" vid="newPassword" rules="required|min:6" v-slot="{ errors }">
            <div class="form-group">
              <label class="form-label" for="newPassword">New Password</label>
              <input type="password" id="newPassword" name="new_password" v-model="newPassword" class="form-input" placeholder="Enter your new password" required>

    <!--          <div class="password-requirements">-->
    <!--            <div class="requirements-title">Password Requirements:</div>-->
    <!--            <ul class="requirements-list">-->
    <!--              <li>At least 8 characters long</li>-->
    <!--              <li>Include uppercase and lowercase letters</li>-->
    <!--              <li>Include at least one number</li>-->
    <!--              <li>Include at least one special character</li>-->
    <!--            </ul>-->
    <!--          </div>-->

              <div class="invalid-feedback">{{ errors[0] }}</div>
            </div>
          </ValidationProvider>

          <ValidationProvider name="Confirm Password" rules="required|confirmed:newPassword" v-slot="{ errors }">
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" name="confirm_password" v-model="confirmPassword" class="form-input" placeholder="Re-enter your new password" required>
              <div class="invalid-feedback">{{ errors[0] }}</div>
            </div>
          </ValidationProvider>

        <button type="submit" class="submit-btn">
          Update Password
        </button>
      </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  },
  mounted() {
    document.title = 'Change Password | Medical Survey';
  },
  methods: {
    async onSubmit() {
      try {
        const res = await this.$api.post("/change-password", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          newPassword_confirmation: this.confirmPassword,
        });
        if (res.data.status === 'success'){
          this.$toasted.success(res.data.message);
          localStorage.setItem("is_change_password", "Y");
          this.$router.push('/dashboard')
          window.location.reload();
        }else {
          this.$toasted.error(res.data.message);
        }
      } catch (err) {
        this.$toasted.error(err.response.data.message);
      }
    },
}
}
</script>

<style scoped>
.invalid-feedback{
  color: red;
}
.container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  margin: 0 auto;
}

.header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 24px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.header p {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-container {
  padding: 2rem;
}

.security-notice {
  background: #fef5e7;
  border: 1px solid #fed7aa;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.notice-icon {
  background: #f59e0b;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.security-notice p {
  color: #92400e;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #374151;
  background: #f9fafb;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover {
  border-color: #d1d5db;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Helper text */
.help-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Password requirements */
.password-requirements {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.75rem;
}

.requirements-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.requirements-list {
  list-style: none;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.5;
}

.requirements-list li {
  margin-bottom: 0.25rem;
  position: relative;
  padding-left: 1rem;
}

.requirements-list li:before {
  content: "•";
  color: #9ca3af;
  position: absolute;
  left: 0;
}

/* Responsive Design */
@media (max-width: 480px) {
  .container {
    /*margin: 10px;*/
    border-radius: 12px;
  }

  .header, .form-container {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .form-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Focus states for accessibility */
.form-input:focus,
.submit-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Loading state (purely visual) */
.submit-btn.loading {
  opacity: 0.8;
  cursor: wait;
}

/* Success state styling */
.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #22c55e;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: none;
}

.success-message.show {
  display: flex;
  align-items: flex-start;
}

.success-icon {
  background: #22c55e;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.success-message p {
  color: #166534;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

/* Error states */
.form-input.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  display: none;
}

.error-message.show {
  display: block;
}

/* Form validation styles (for manual addition) */
.form-input.valid {
  border-color: #22c55e;
  background: #f0fdf4;
}

/* Additional spacing and visual improvements */
.form-group:last-child {
  margin-bottom: 0;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1.5rem 0;
}

/* Better button states */
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn:disabled:hover {
  transform: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
