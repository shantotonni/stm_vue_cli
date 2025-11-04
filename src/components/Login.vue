<template>
  <div>
    <div class="background">
      <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <div class="particles" id="particles"></div>
    </div>
    <div class="login-container">
      <div class="login-card">
        <div style="text-align: center;">
          <span class="logo-icon"><img src="../assets/logo.png" alt="" width="180px"></span>
          <h1>Login Portal</h1>
          <p>Enter your credentials to continue</p>
        </div>
        <div v-if="errorMessage" class="alert alert-danger py-2" style="color: red;text-align: center;display: block">
          {{ errorMessage }}
        </div>
        <form id="loginForm" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="loginId">Login ID</label>
            <div class="input-wrapper">
              <input type="text" id="loginId" v-model="loginId" class="form-input" placeholder="Enter your loginId" required autocomplete="loginId" :disabled="isLoading">
              <span class="input-icon">🆔</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <input type="password" id="password" v-model="password" class="form-input" placeholder="Enter your password" required :disabled="isLoading">
              <span class="input-icon">🔐</span>
            </div>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span class="loading" :class="{ active: isLoading }"></span>
            <span class="btn-text">{{ isLoading ? 'Logging in...' : 'Login' }}</span>
          </button>

          <!--          <div class="forgot-password">-->
          <!--            <a href="#" id="forgotPassword">Forgot your password?</a>-->
          <!--          </div>-->
        </form>

        <div class="footer">
          © 2025 Login Portal. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentLogin",
  data() {
    return {
      loginId: "",
      password: "",
      errorMessage: "",
      isLoading: false,
    };
  },
  mounted() {
    this.createParticles()
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.isLoading = true;

      try {
        const res = await this.$store.dispatch("login", {
          loginId: this.loginId,
          password: this.password,
        });

        if (res && res.token) {
          await this.$store.dispatch("loadUser");
          const is_change_password = localStorage.getItem("is_change_password");
          if (is_change_password === "N") {
            this.$router.push({ name: "OneTimePasswordChange" });
          } else {
            this.$router.push({ name: "Dashboard" });
          }
        } else {
          this.errorMessage = res.response.data.message || "Login failed!";
          this.isLoading = false;
        }
      } catch (err) {
        if (err.response) {
          this.errorMessage = err.response.data.message || "Something went wrong!";
        } else {
          this.errorMessage = "Server not responding!";
        }
        this.isLoading = false;
      }
    },
    createParticles() {
      const particlesContainer = document.getElementById('particles');
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)!important;
  position: relative;
}

/* Animated Background */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape:nth-child(1) {
  top: 20%;
  left: 10%;
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  border-radius: 50%;
  animation-delay: 0s;
}

.shape:nth-child(2) {
  top: 60%;
  left: 80%;
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #74b9ff, #0984e3)!important;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation-delay: 2s;
}

.shape:nth-child(3) {
  top: 80%;
  left: 20%;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #fd79a8, #e84393);
  transform: rotate(45deg);
  animation-delay: 4s;
}

.shape:nth-child(4) {
  top: 30%;
  left: 70%;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #fdcb6e, #e17055);
  border-radius: 50% 10% 50% 10%;
  animation-delay: 1s;
}

.shape:nth-child(5) {
  top: 10%;
  left: 60%;
  width: 70px;
  height: 70px;
  background: linear-gradient(45deg, #a29bfe, #6c5ce7);
  border-radius: 50%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: particle-float 8s linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

/* Login Container */
.login-container {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.8s ease-out;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.logo p {
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:focus + .input-icon {
  color: #667eea;
}

.form-input:disabled {
  background: rgba(229, 231, 235, 0.5);
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-btn:hover:not(:disabled)::before {
  left: 100%;
}

.footer {
  text-align: center;
  margin-top: 24px;
  color: #9ca3af;
  font-size: 14px;
}

.forgot-password {
  text-align: center;
  margin-top: 16px;
}

.forgot-password a {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
  color: #764ba2;
}

/* Loading Animation */
.loading {
  display: none;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading.active {
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 10px;
  }

  .logo h1 {
    font-size: 24px;
  }

  .form-input {
    font-size: 16px;
  }
}
</style>