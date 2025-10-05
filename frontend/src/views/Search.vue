<template>
  <div>
    <Navbar />
    <section class="hero-search-banner d-flex align-items-center justify-content-center text-center">
      <div class="container">
        <h1 class="text-white fw-bolder">Find Parking Made Easy</h1>
        <p class="text-white-50 mb-4">Enter your destination to find the best parking spots near you.</p>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="input-group input-group-lg shadow">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Type a location, landmark, or address..."
                v-model="searchQuery"
                @keyup.enter="fetchParkingLots"
              >
              <button class="btn btn-primary fw-semibold px-4" type="button" @click="fetchParkingLots">Find Parking</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <div class="container my-5">
      <section class="filters-bar card p-3 mb-4">
        <div class="row align-items-center gy-3">
          <div class="col-md-6">
            <small class="text-muted">{{ filteredLots.length }} parking lots found</small>
          </div>
          <div class="col-md-6 d-flex justify-content-md-end">
            <div class="d-flex align-items-center">
              <label for="sortBy" class="form-label me-2 mb-0 fw-semibold text-muted flex-shrink-0"><small>Sort By:</small></label>
              <select class="form-select form-select-sm" id="sortBy" v-model="sortBy">
                <option value="default">Best Match</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="availability">Most Availability</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section class="search-results-list">
        <div v-if="filteredLots.length === 0 && !isLoading && initialLoadComplete" class="text-center py-5">
            <p class="text-muted fs-5">No results found. Try a different search.</p>
        </div>
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else class="row gy-4">
          <div v-for="lot in filteredLots" :key="lot.id" class="col-lg-4 col-md-6">
            <div class="card h-100 search-result-card">
              <img :src="lot.imageUrl" class="card-img-top" :alt="lot.name">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">{{ lot.name }}</h5>
                <p class="card-text text-muted small flex-grow-1"><i class="bi bi-geo-alt-fill me-1"></i>{{ lot.address }}</p>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="fw-bold fs-5 text-primary">₹{{ lot.pricePerHour }}/hr</span>
                  <span 
                    :class="lot.spotsAvailable > 0 ? 'text-success' : 'text-danger'"
                    class="fw-semibold"
                  >
                    {{ lot.spotsAvailable > 0 ? `${lot.spotsAvailable} spots` : 'Full' }}
                  </span>
                </div>
                <button 
                  class="btn btn-primary w-100 mt-auto" 
                  :disabled="lot.spotsAvailable === 0"
                  @click="goToBookingDetails(lot.id)"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import axios from 'axios'; // Import axios

export default {
  name: 'SearchPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      searchQuery: '',
      sortBy: 'default', 
      isLoading: false,  
      initialLoadComplete: false, 
      parkingLots: [], 
      // authToken is now dynamically set in created()
    };
  },
  computed: {
    filteredLots() {
      let lots = [...this.parkingLots];
      
      if (this.searchQuery) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        lots = lots.filter(lot => 
          lot.name.toLowerCase().includes(lowerCaseQuery) ||
          lot.address.toLowerCase().includes(lowerCaseQuery) ||
          (lot.pincode && lot.pincode.toLowerCase().includes(lowerCaseQuery))
        );
      }

      switch(this.sortBy) {
        case 'price_asc':
          lots.sort((a, b) => a.pricePerHour - b.pricePerHour);
          break;
        case 'price_desc':
          lots.sort((a, b) => b.pricePerHour - a.pricePerHour);
          break;
        case 'availability':
          lots.sort((a, b) => b.spotsAvailable - a.spotsAvailable);
          break;
      }

      return lots;
    }
  },
  methods: {
    async fetchParkingLots() {
      this.isLoading = true;
      // Retrieve the token from localStorage here
      const authToken = localStorage.getItem('authToken'); // Assuming your token is stored under the key 'userToken'

      if (!authToken) {
        console.error("Authentication token not found in localStorage.");
        this.isLoading = false;
        this.initialLoadComplete = true;
        // Optionally redirect to login page or show a message
        return; 
      }

      try {
        const response = await axios.get('http://127.0.0.1:5000/parking_lots', {
          headers: {
            'Authorization': `Bearer ${authToken}` // Use the retrieved token
          }
        });
        this.parkingLots = response.data.map(lot => ({
          id: lot.id,
          name: lot.name,
          address: lot.address,
          pricePerHour: lot.price,
          spotsAvailable: lot.available_spots,
          imageUrl: lot.image_url,
          totalSpots: lot.total_spots,
          pincode: lot.pincode
        }));
        this.initialLoadComplete = true;
      } catch (error) {
        console.error("Error fetching parking lots:", error);
        this.parkingLots = []; 
        this.initialLoadComplete = true;
        // Handle specific error codes, e.g., 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Please log in again.");
            // Example: Redirect to login page
            // this.$router.push({ name: 'login' }); 
        }
      } finally {
        this.isLoading = false;
      }
    },
    goToBookingDetails(lotId) {
      this.$router.push({ name: 'parkingbooking', params: { id: lotId } });
    }
  },
  created() {
    this.fetchParkingLots(); 
  }
};
</script>

<style scoped>
/* Your existing styles */
.hero-search-banner {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://placehold.co/1920x500/A7C7E7/FFFFFF?text=Map+View');
  background-size: cover;
  background-position: center;
  min-height: 50vh;
  padding: 4rem 0;
}

.filters-bar {
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.search-result-card {
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.search-result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

</style>