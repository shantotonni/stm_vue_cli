<template>
  <div :class="['book-card', viewMode]" @click="$emit('view-details', book)">
    <div class="book-image-wrapper">
      <img :src="fullImageUrl(book.cover_image_url)" :alt="book.title" class="book-image" />

      <!-- Badge -->
      <span v-if="book.is_featured" class="featured-badge">
        <i class="fas fa-star"></i>
        Featured
      </span>

      <!-- Favorite Button -->
      <button
          @click.stop="toggleFavorite"
          :class="['favorite-btn', { active: book.is_favorited }]"
      >
        <i :class="book.is_favorited ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>

      <!-- Quick Actions Overlay -->
      <div class="quick-actions">
        <button @click.stop="$emit('view-details', book)" class="action-btn">
          <i class="fas fa-eye"></i>
          <span>Details</span>
        </button>
        <button @click.stop="downloadBook" class="action-btn">
          <i class="fas fa-download"></i>
          <span>Download</span>
        </button>
      </div>
    </div>

    <div class="book-content">
      <!-- Category Badge -->
      <span v-if="book.category" class="category-badge" :style="{ backgroundColor: book.category.color }">
        {{ book.category.name }}
      </span>

      <!-- Title -->
      <h3 class="book-title">{{ book.title }}</h3>

      <!-- Author -->
      <p class="book-author">
        <i class="fas fa-user-edit"></i>
        {{ book.author }}
      </p>

      <!-- Meta Info -->
      <div class="book-meta">
        <span v-if="book.rating > 0" class="meta-item">
          <i class="fas fa-star"></i>
          {{ book.rating }}
        </span>
        <span class="meta-item">
          <i class="fas fa-download"></i>
          {{ book.download_count }}
        </span>
        <span class="meta-item">
          <i class="fas fa-eye"></i>
          {{ book.view_count }}
        </span>
      </div>

      <!-- Additional Info (List View) -->
      <div v-if="viewMode === 'list'" class="book-description">
        <p>{{ truncateDescription(book.description) }}</p>

        <div class="book-details-meta">
          <span v-if="book.publisher" class="detail-item">
            <strong>Publisher:</strong> {{ book.publisher }}
          </span>
          <span v-if="book.publication_year" class="detail-item">
            <strong>Publication Year:</strong> {{ book.publication_year }}
          </span>
          <span v-if="book.pages" class="detail-item">
            <strong>Pages:</strong> {{ book.pages }}
          </span>
          <span v-if="book.language" class="detail-item">
            <strong>Language:</strong> {{ book.language }}
          </span>
          <span class="detail-item">
            <strong>File Size:</strong> {{ book.formatted_file_size }}
          </span>
        </div>
      </div>

      <!-- Action Buttons (List View) -->
      <div v-if="viewMode === 'list'" class="list-actions">
        <button @click.stop="$emit('view-details', book)" class="btn btn-primary">
          <i class="fas fa-eye"></i>
          View Details
        </button>
        <button @click.stop="downloadBook" class="btn btn-secondary">
          <i class="fas fa-download"></i>
          Download
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/api";

export default {
  name: 'BookCard',

  props: {
    book: {
      type: Object,
      required: true,
    },
    viewMode: {
      type: String,
      default: 'grid', // grid or list
    },
  },

  methods: {
    toggleFavorite() {
      this.$emit('toggle-favorite', this.book.id);
    },

    downloadBook() {
      console.log(this.book.id)
      this.$emit('download', this.book.id);
    },

    truncateDescription(text) {
      if (!text) return 'No description';
      return text.length > 200 ? text.substring(0, 200) + '...' : text;
    },
    fullImageUrl(path) {
      const baseURL = api.defaults.baseURL.replace('/api/', '');
      return path ? `${baseURL}${path}` : `${baseURL}/images/default-book.jpg`;
    },
  },
};
</script>

<style scoped>
/* Grid View */
.book-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

/* Image Wrapper */
.book-image-wrapper {
  position: relative;
  padding-top: 140%; /* 5:7 aspect ratio */
  overflow: hidden;
  background: linear-gradient(135deg, #667eea20, #764ba220);
}

.book-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.book-card:hover .book-image {
  transform: scale(1.1);
}

/* Featured Badge */
.featured-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.4);
  z-index: 2;
}

/* Favorite Button */
.favorite-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
}

.favorite-btn.active {
  color: #e74c3c;
  animation: heartbeat 0.6s;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
}

/* Quick Actions Overlay */
.quick-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 20px 15px 15px;
  transform: translateY(100%);
  transition: transform 0.3s;
  display: flex;
  gap: 10px;
  z-index: 1;
}

.book-card:hover .quick-actions {
  transform: translateY(0);
}

.action-btn {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #333;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 1rem;
}

/* Content */
.book-content {
  padding: 20px;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: #667eea;
  margin-bottom: 10px;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-author i {
  color: #999;
  font-size: 0.85rem;
}

.book-meta {
  display: flex;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #666;
}

.meta-item i {
  color: #999;
  font-size: 0.9rem;
}

.meta-item:first-child {
  color: #FFD700;
  font-weight: 600;
}

.meta-item:first-child i {
  color: #FFD700;
}

/* List View Styles */
.book-card.list {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 25px;
  padding: 20px;
}

.book-card.list:hover {
  transform: translateX(5px);
}

.book-card.list .book-image-wrapper {
  padding-top: 140%;
  border-radius: 15px;
  overflow: hidden;
}

.book-card.list .quick-actions {
  display: none;
}

.book-card.list .book-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-description {
  margin: 15px 0;
  color: #555;
  line-height: 1.6;
}

.book-details-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  font-size: 0.85rem;
  color: #666;
}

.detail-item strong {
  color: #333;
  margin-right: 5px;
}

.list-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
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

/* Responsive */
@media (max-width: 768px) {
  .book-card.list {
    grid-template-columns: 150px 1fr;
    gap: 15px;
  }

  .list-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .book-card.list {
    grid-template-columns: 1fr;
  }

  .book-card.list .book-image-wrapper {
    padding-top: 60%;
  }
}
</style>