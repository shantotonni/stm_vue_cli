<template>
  <div class="container">
    <form @submit.prevent="submitForm">
      <div class="survey-card">
        <div class="survey-header">
          <div class="survey-icon">📝</div>
          <h1 class="survey-title">Teaching Survey</h1>
        </div>

        <div class="survey-instructions">
          <p>• Circle the number that best represents your experience with this teacher for each item</p>
          <p>• Please consider each item carefully and respond honestly</p>
        </div>

        <div class="form-section">
          <h3 class="section-title">Select Your Phase</h3>
          <div class="phase-group">
            <div class="phase-option">
              <input type="radio" class="phase-input" name="phase" id="phase1" v-model="selectedPhase" value="First Phase">
              <label class="phase-label" for="phase1">1st Phase</label>
            </div>
            <div class="phase-option">
              <input type="radio" class="phase-input" name="phase" id="phase2" v-model="selectedPhase" value="Second Phase">
              <label class="phase-label" for="phase2">2nd Phase</label>
            </div>
            <div class="phase-option">
              <input type="radio" class="phase-input" name="phase" id="phase3" v-model="selectedPhase" value="Third Phase">
              <label class="phase-label" for="phase3">3rd Phase</label>
            </div>
            <div class="phase-option">
              <input type="radio" class="phase-input" name="phase" id="phase4" v-model="selectedPhase" value="Fourth Phase">
              <label class="phase-label" for="phase4">4th Phase</label>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Select Teacher</h3>
          <select class="teacher-select" v-model="teacher_id" required>
            <option value="" disabled>Select a Teacher</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.user_id">
              {{ teacher.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="questions-card">
        <!-- Question 1 -->
        <div class="question-item" v-for="(q, index) in statements" :key="q.id">
          <label class="question-label">
            {{ index + 1 }}. {{ q.statement }}
          </label>
          <div class="options-grid" v-if="q.type === 'rating'">
            <label class="option-box" v-for="opt in options" :key="opt.value" :class="{ 'selected': answers[q.id] === opt.value }">
              <input type="radio" :name="'question_' + q.id" :value="opt.value" v-model="answers[q.id]" class="option-input">
              {{ opt.label }}
            </label>
          </div>

          <div class="options-grid" v-else-if="q.type === 'boolean'">
            <label class="option-box" v-for="opt in optionsBoolean" :key="opt.value" :class="{ 'selected': answers[q.id] === opt.value }">
              <input type="radio" :name="'question_' + q.id" :value="opt.value" v-model="answers[q.id]" class="option-input">
              {{ opt.label }}
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn">
          Submit Survey
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "SurveyForm",
  data() {
    return {
      statements: [],
      teachers: [],
      options: [
        { value: 1, label: "Never" },
        { value: 2, label: "Once in a While" },
        { value: 3, label: "SomeTime" },
        { value: 4, label: "Most of the time" },
        { value: 5, label: "Almost Always" },
      ],
      optionsBoolean: [
        { value: 'Y', label: "Yes" },
        { value: 'N', label: "No" }
      ],
      answers: {},
      teacher_id: '',
      selectedPhase: '',
    }
  },
  mounted() {
    document.title = 'Teachers Evaluation Form | Survey';
    this.getAllStatement();
    this.getAllTeacher();
  },
  methods: {
    async submitForm() {
      try {
        const res = await this.$api.post("/survey-submit", {
          answers: this.answers,
          teacher_id: this.teacher_id,
          selectedPhase: this.selectedPhase,
        });
        if (res.data.status === 'success'){
          this.$toasted.success(res.data.message);
          this.$router.push('/dashboard')
        }else {
          this.$toasted.error(res.data.message);
        }
      } catch (err) {
        console.error("Error submitting survey:", err.response?.data || err);
      }
    },
    async getAllStatement() {
      try {
        const res = await this.$api.get("/get-all-statement");
        this.statements = res.data.statements;
        this.statements.forEach(q => {
          this.$set(this.answers, q.id, 0);
        });

      } catch (err) {
        console.error("Error fetching survey questions:", err);
        this.loading = false;
      }
    },
    async getAllTeacher() {
      try {
        const res = await this.$api.get("/get-all-teacher");
        this.teachers = res.data.teachers;
      } catch (err) {
        console.error("Error fetching survey questions:", err);
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  /*max-width: 800px;*/
  /*margin: 0 auto;*/
}

.survey-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.survey-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
  pointer-events: none;
}

.survey-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.survey-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 28px;
  color: white;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

.survey-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
  border-radius: inherit;
}

.survey-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.survey-instructions {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-left: 4px solid var(--info);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.survey-instructions::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  pointer-events: none;
}

.survey-instructions p {
  color: #1e40af;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  position: relative;
}

.survey-instructions p:last-child {
  margin-bottom: 0;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
  position: relative;
}

/* Phase Selection */
.phase-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.phase-option {
  position: relative;
  flex: 1;
  min-width: 60px;
}

.phase-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.phase-label {
  display: block;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-xl);
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-700);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.phase-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

.phase-label:hover {
  border-color: var(--primary-light);
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.phase-input:checked + .phase-label {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-color: var(--primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Teacher Select */
.teacher-select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-xl);
  font-size: 1rem;
  color: var(--gray-700);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: var(--transition);
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 3rem;
}

.teacher-select:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.teacher-select option {
  padding: 0.75rem;
  background: white;
  color: var(--gray-700);
}

/* Questions Card */
.questions-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.questions-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
  pointer-events: none;
}

.question-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.question-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: rgba(255, 255, 255, 0.4);
}

.question-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1.5rem;
  line-height: 1.4;
  position: relative;
}

.options-grid {
  display: grid;
  gap: 0.75rem;
}

.option-box {
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  color: var(--gray-700);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.option-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

.option-box:hover {
  border-color: var(--primary-light);
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.option-box.selected {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-color: var(--primary);
  color: white;
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.option-box.selected::before {
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
}

.option-input {
  display: none;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-2xl);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin-top: 2rem;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
  background: linear-gradient(135deg, var(--primary-dark), var(--secondary-dark));
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  body {
    padding: 1rem 0.5rem;
  }

  .survey-card, .questions-card {
    padding: 1.5rem;
  }

  .survey-title {
    font-size: 1.75rem;
  }

  .phase-group {
    gap: 0.5rem;
  }

  .phase-label {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
  }

  .question-item {
    padding: 1.5rem;
  }

  .question-label {
    font-size: 1rem;
  }

  .option-box {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .survey-card, .questions-card {
    padding: 1rem;
    border-radius: var(--radius-xl);
  }

  .phase-group {
    flex-direction: column;
  }

  .phase-option {
    min-width: auto;
  }
}

/* Animation for form submission */
@keyframes submitSuccess {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.submit-btn.success {
  animation: submitSuccess 0.3s ease-out;
  background: linear-gradient(135deg, var(--success), #059669);
}
</style>