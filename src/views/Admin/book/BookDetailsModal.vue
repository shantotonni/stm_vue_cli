<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- Close Button -->
        <button @click="$emit('close')" class="modal-close">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-content">
          <!-- Left: Book Image -->
          <div class="book-showcase">
            <div class="book-image-container">
              <img :src="fullImageUrl(book.cover_image_url)" :alt="book.title" class="book-cover" />

              <button
                  @click="toggleFavorite"
                  :class="['favorite-btn-large', { active: book.is_favorited }]"
              >
                <i :class="book.is_favorited ? 'fas fa-heart' : 'far fa-heart'"></i>
                <span>{{ book.is_favorited ? 'Remove from Favorites' : 'Add to Favorites' }}</span>
              </button>
            </div>

            <!-- Stats -->
            <div class="book-stats">
              <div class="stat-box">
                <i class="fas fa-download"></i>
                <div>
                  <strong>{{ book.download_count }}</strong>
                  <span>Downloads</span>
                </div>
              </div>
              <div class="stat-box">
                <i class="fas fa-eye"></i>
                <div>
                  <strong>{{ book.view_count }}</strong>
                  <span>Views</span>
                </div>
              </div>
              <div class="stat-box">
                <i class="fas fa-star"></i>
                <div>
                  <strong>{{ book.rating }}</strong>
                  <span>Rating</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Book Details -->
          <div class="book-info">
            <!-- Header -->
            <div class="book-header">
              <div>
                <span v-if="book.category" class="category-tag">
                  {{ book.category.name }}
                </span>
                <h2 class="book-title">{{ book.title }}</h2>
                <p class="book-author">
                  <i class="fas fa-user-edit"></i>
                  {{ book.author }}
                </p>
              </div>

              <!-- Rating Display -->
              <div class="rating-display">
                <div class="stars">
                  <i
                      v-for="star in 5"
                      :key="star"
                      :class="[
                      'fas fa-star',
                      star <= Math.round(book.rating) ? 'active' : 'inactive'
                    ]"
                  ></i>
                </div>
                <span class="rating-text">{{ book.rating }} / 5.0</span>
              </div>
            </div>

            <!-- Description -->
            <div class="book-section">
              <h3 class="section-title">
                <i class="fas fa-align-left"></i>
                Description
              </h3>
              <p class="book-description">
                {{ book.description || 'No description available' }}
              </p>
            </div>

            <!-- Details Grid -->
            <div class="book-section">
              <h3 class="section-title">
                <i class="fas fa-info-circle"></i>
                Detailed Information
              </h3>
              <div class="details-grid">
                <div v-if="book.publisher" class="detail-row">
                  <span class="label">Publisher:</span>
                  <span class="value">{{ book.publisher }}</span>
                </div>
                <div v-if="book.isbn" class="detail-row">
                  <span class="label">ISBN:</span>
                  <span class="value">{{ book.isbn }}</span>
                </div>
                <div v-if="book.edition" class="detail-row">
                  <span class="label">Edition:</span>
                  <span class="value">{{ book.edition }}</span>
                </div>
                <div v-if="book.publication_year" class="detail-row">
                  <span class="label">Publication Year:</span>
                  <span class="value">{{ book.publication_year }}</span>
                </div>
                <div v-if="book.language" class="detail-row">
                  <span class="label">Language:</span>
                  <span class="value">{{ book.language }}</span>
                </div>
                <div v-if="book.pages" class="detail-row">
                  <span class="label">Number of Pages:</span>
                  <span class="value">{{ book.pages }}</span>
                </div>
                <div v-if="book.department" class="detail-row">
                  <span class="label">Department:</span>
                  <span class="value">{{ book.department.name }}</span>
                </div>
                <div v-if="book.subject" class="detail-row">
                  <span class="label">Subject:</span>
                  <span class="value">{{ book.subject.name }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">File Type:</span>
                  <span class="value">{{ book.file_type ? book.file_type.toUpperCase() : 'N/A' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">File Size:</span>
                  <span class="value">{{ book.formatted_file_size }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="readBook" class="btn btn-primary">
                <i class="fas fa-book-reader"></i>
                Read Now
              </button>
              <button @click="downloadBook" class="btn btn-secondary">
                <i class="fas fa-download"></i>
                Download
              </button>
            </div>

            <!-- Rating Section -->
            <div class="book-section rating-section">
              <h3 class="section-title">
                <i class="fas fa-star"></i>
                Rate This Book
              </h3>

              <div class="rating-input">
                <div class="star-rating">
                  <button
                      v-for="star in 5"
                      :key="star"
                      @click="selectRating(star)"
                      @mouseenter="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                      class="star-btn"
                  >
                    <i
                        :class="[
                        'fas fa-star',
                        star <= (hoverRating || userRating) ? 'active' : 'inactive'
                      ]"
                    ></i>
                  </button>
                </div>
                <span class="rating-value">{{ userRating }} / 5</span>
              </div>

              <textarea
                  v-model="userReview"
                  placeholder="Write your review (optional)..."
                  class="review-textarea"
                  rows="4"
              ></textarea>

              <button @click="submitRating" :disabled="!userRating" class="btn btn-submit">
                <i class="fas fa-paper-plane"></i>
                Submit Rating
              </button>
            </div>

            <!-- Reviews -->
            <div v-if="book.ratings && book.ratings.length" class="book-section reviews-section">
              <h3 class="section-title">
                <i class="fas fa-comments"></i>
                Reviews ({{ book.ratings.length }})
              </h3>

              <div class="reviews-list">
                <div v-for="rating in book.ratings.slice(0, 5)" :key="rating.id" class="review-card">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                      </div>
                      <div>
                        <strong class="reviewer-name">{{ rating.user.name }}</strong>
                        <div class="review-stars">
                          <i
                              v-for="star in 5"
                              :key="star"
                              :class="[
                              'fas fa-star',
                              star <= rating.rating ? 'active' : 'inactive'
                            ]"
                          ></i>
                        </div>
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(rating.created_at) }}</span>
                  </div>
                  <p v-if="rating.review" class="review-text">{{ rating.review }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import api from "@/plugins/api";
export default {
  name: 'BookDetailsModal',

  props: {
    book: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      userRating: 0,
      hoverRating: 0,
      userReview: '',
    };
  },

  methods: {
    toggleFavorite() {
      this.$emit('toggle-favorite', this.book.id);
    },
    fullImageUrl(path) {
      const baseURL = api.defaults.baseURL.replace('/api/', '');
      return path ? `${baseURL}${path}` : `${baseURL}/images/default-book.jpg`;
    },
    readBook() {
      // Open book reader or PDF viewer
      window.open(this.book.file_url, '_blank');
    },

    downloadBook() {
      this.$emit('download', this.book.id);
    },

    selectRating(rating) {
      this.userRating = rating;
    },

    submitRating() {
      if (!this.userRating) {
        alert('Please select a rating');
        return;
      }

      this.$emit('rate', this.book.id, this.userRating, this.userReview);

      // Reset
      this.userRating = 0;
      this.userReview = '';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 25px;
  box-shadow: 0 25px 100px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-close:hover {
  background: #f5f5f5;
  transform: rotate(90deg);
}

.modal-content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  padding: 40px;
}

/* Book Showcase */
.book-showcase {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.book-image-container {
  position: relative;
  margin-bottom: 25px;
}

.book-cover {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s;
}

.book-cover:hover {
  transform: scale(1.05);
}

.favorite-btn-large {
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.favorite-btn-large:hover {
  border-color: #667eea;
  color: #667eea;
}

.favorite-btn-large.active {
  background: linear-gradient(135deg, #FF6B6B, #EE5A6F);
  border-color: #FF6B6B;
  color: white;
}

.favorite-btn-large i {
  font-size: 1.2rem;
}

.book-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-box {
  background: linear-gradient(135deg, #667eea15, #764ba215);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
}

.stat-box i {
  font-size: 1.8rem;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-box strong {
  display: block;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 5px;
}

.stat-box span {
  font-size: 0.85rem;
  color: #666;
}

/* Book Info */
.book-info {
  overflow-y: auto;
  max-height: calc(90vh - 80px);
  padding-right: 10px;
}

.book-header {
  margin-bottom: 30px;
}

.category-tag {
  display: inline-block;
  padding: 6px 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.3;
}

.book-author {
  font-size: 1.2rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.rating-display {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stars {
  display: flex;
  gap: 5px;
}

.stars i {
  font-size: 1.5rem;
}

.stars i.active {
  color: #FFD700;
}

.stars i.inactive {
  color: #ddd;
}

.rating-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

/* Sections */
.book-section {
  margin-bottom: 35px;
  padding-bottom: 35px;
  border-bottom: 2px solid #f0f0f0;
}

.book-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #667eea;
}

.book-description {
  color: #555;
  line-height: 1.8;
  font-size: 1.05rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-row .label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 600;
}

.detail-row .value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 35px;
}

.btn {
  padding: 18px;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.btn i {
  font-size: 1.2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-submit {
  background: linear-gradient(135deg, #52c234, #4caf50);
  color: white;
}

.btn-submit:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.4);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Rating Input */
.rating-section {
  background: linear-gradient(135deg, #667eea10, #764ba210);
  padding: 25px;
  border-radius: 20px;
  border: none;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.star-rating {
  display: flex;
  gap: 8px;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn i {
  font-size: 2rem;
}

.star-btn i.active {
  color: #FFD700;
}

.star-btn i.inactive {
  color: #ddd;
}

.rating-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

.review-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 15px;
  transition: border-color 0.3s;
}

.review-textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.reviewer-info {
  display: flex;
  gap: 15px;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
}

.reviewer-name {
  display: block;
  font-size: 1.05rem;
  color: #333;
  margin-bottom: 5px;
}

.review-stars {
  display: flex;
  gap: 3px;
}

.review-stars i {
  font-size: 0.9rem;
}

.review-stars i.active {
  color: #FFD700;
}

.review-stars i.inactive {
  color: #ddd;
}

.review-date {
  font-size: 0.85rem;
  color: #999;
}

.review-text {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 968px) {
  .modal-content {
    grid-template-columns: 1fr;
  }

  .book-showcase {
    position: static;
  }

  .book-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-content {
    padding: 30px 20px;
  }

  .book-title {
    font-size: 2rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>