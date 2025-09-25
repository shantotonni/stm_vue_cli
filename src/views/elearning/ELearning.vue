<template>
  <!-- Content Area -->
  <main class="content-area">
    <div class="coming-soon-wrapper">
      <div class="coming-soon-content">
        <!-- Title -->
        <h1 class="title">Coming Soon</h1>
        <!-- Subtitle -->
        <p class="subtitle">We're working hard to bring something amazing your way!</p>

        <!-- Countdown Timer -->
        <div class="countdown-timer">
          <div class="timer-box">
            <span>{{ days }}</span>
            <p>Days</p>
          </div>
          <div class="timer-box">
            <span>{{ hours }}</span>
            <p>Hours</p>
          </div>
          <div class="timer-box">
            <span>{{ minutes }}</span>
            <p>Minutes</p>
          </div>
          <div class="timer-box">
            <span>{{ seconds }}</span>
            <p>Seconds</p>
          </div>
        </div>
        <!-- Social Media Links -->
        <div class="social-links">
          <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-twitter"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "ELearningModule",
  data() {
    return {
      targetDate: new Date("2025-12-31T00:00:00"), // Example target date
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  },
  computed : {
    user() {
      return this.$store.getters.currentUser;
    },
  },
  mounted() {
    document.title = 'E-Learning | Survey';
    setInterval(this.updateCountdown, 1000);
  },
  methods: {
    updateCountdown() {
      const now = new Date();
      const difference = this.targetDate - now;

      if (difference > 0) {
        this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
      }
    },
  },

}
</script>

<style scoped>
.coming-soon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;*/
  text-align: center;
  color: #fff;
}

.coming-soon-content {
  padding: 2rem;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 30px;
}

.countdown-timer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.timer-box {
  background-color: #fff;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 80px;
  text-align: center;
}

.timer-box span {
  font-size: 2rem;
  font-weight: bold;
}

.cta-container {
  margin-bottom: 20px;
}

.cta-btn {
  padding: 10px 30px;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 600;
  font-size: 1.2rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cta-btn:hover {
  background-color: #2563eb;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  font-size: 1.5rem;
  color: #fff;
  transition: color 0.3s;
}

.social-icon:hover {
  color: #feb47b;
}

/* Responsiveness */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .timer-box span {
    font-size: 1.5rem;
  }
  .cta-btn {
    font-size: 1rem;
  }
}
</style>
