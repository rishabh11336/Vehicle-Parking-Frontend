<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div class="mb-4">
        <router-link to="/admin/dashboard" class="text-decoration-none text-primary fw-semibold">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to Admin Dashboard
        </router-link>
      </div>

      <div class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card p-4">
            <h3 class="fw-bold mb-4 text-center">{{ isEditMode ? 'Update Parking Lot Details' : 'Add a New Parking Lot' }}</h3>

            <div v-if="isLoading" class="alert alert-info text-center">Loading lot details...</div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            <form @submit.prevent="handleSubmit" v-if="!isLoading">
              <div class="mb-3">
                <label for="lotName" class="form-label fw-semibold">Lot Name</label>
                <input type="text" class="form-control" id="lotName" v-model="lotForm.lot_name" placeholder="e.g., Airport T1 Parking" required>
              </div>
              <div class="mb-3">
                <label for="lotAddress" class="form-label fw-semibold">Address</label>
                <textarea class="form-control" id="lotAddress" v-model="lotForm.address" rows="3" placeholder="Enter full address" required></textarea>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="lotPincode" class="form-label fw-semibold">Pin Code</label>
                  <input type="text" class="form-control" id="lotPincode" v-model="lotForm.pincode" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="lotPrice" class="form-label fw-semibold">Price per Hour (₹)</label>
                  <input type="number" class="form-control" id="lotPrice" v-model.number="lotForm.price_per_hour" min="0" required>
                </div>
              </div>
              <div class="mb-3">
                <label for="lotSpots" class="form-label fw-semibold">Total Number of Spots</label>
                <input type="number" class="form-control" id="lotSpots" v-model.number="lotForm.total_spots" min="1" placeholder="e.g., 100" required>
                <small v-if="isEditMode" class="form-text text-muted">
                  Note: You can only increase spots. To decrease, ensure all extra spots are available.
                </small>
              </div>
              <div class="mb-4">
                <label for="lotImageUrl" class="form-label fw-semibold">Lot Image URL</label>
                <input type="url" class="form-control" id="lotImageUrl" v-model="lotForm.image_url" placeholder="e.g., https://example.com/parking_lot.jpg">
                <small class="form-text text-muted">
                  Enter a direct URL to the parking lot image.
                </small>
              </div>
              <hr>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                   <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                   {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Parking Lot') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';

// IMPORTANT: Replace with your actual backend API base URL
const API_BASE_URL = 'http://127.0.0.1:5000';

export default {
  name: 'ManageLotPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      lotForm: {
        id: null,
        lot_name: '',
        address: '',
        pincode: '',
        price_per_hour: null,
        total_spots: null,
        image_url: '', // This will hold the URL for the input field and payload
      },
      isEditMode: false,
      isLoading: false,
      isSubmitting: false,
      errorMessage: '',
    };
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('authToken');
      // This header is for sending JSON data.
      // Your backend must be configured to accept JSON.
      return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {};
    },
    async fetchLotData(lotId) {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // This assumes you have an endpoint to get a single lot's details.
        const response = await axios.get(`${API_BASE_URL}/admin/parking_lots/${lotId}`, {
          headers: this.getAuthHeaders()
        });
        const lotData = response.data;
        // This auto-fills the form with data from the database.
        this.lotForm.id = lotData.id;
        this.lotForm.lot_name = lotData.lot_name;
        this.lotForm.address = lotData.address;
        this.lotForm.pincode = lotData.pincode;
        this.lotForm.price_per_hour = lotData.price_per_hour;
        this.lotForm.total_spots = lotData.total_spots;
        // *** THE KEY CHANGE IS HERE ***
        // We are mapping the 'image_name' from the API response to 'image_url' in our form.
        // If 'image_name' from your API is truly a URL, this will display it.
        // If it's just a name, then your backend needs to send a full URL for proper display.
        this.lotForm.image_url = lotData.image_name || ''; 
      } catch (error) {
        console.error("Failed to fetch lot data:", error);
        this.errorMessage = "Could not load lot details. Please go back and try again.";
      } finally {
        this.isLoading = false;
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;
      this.errorMessage = '';

      // Create a plain JavaScript object to send as JSON.
      // When sending data, we still send 'image_url' as this is what our form collects.
      // Your backend should be configured to receive 'image_url' or map it from 'image_name'.
      const payload = {
        lot_name: this.lotForm.lot_name,
        address: this.lotForm.address,
        pincode: this.lotForm.pincode,
        price_per_hour: this.lotForm.price_per_hour,
        total_spots: this.lotForm.total_spots,
        image_url: this.lotForm.image_url, // Send the URL from the form
      };
      
      try {
        if (this.isEditMode) {
          // --- UPDATE LOT ---
          await axios.put(`${API_BASE_URL}/admin/update_lots/${this.lotForm.id}`, payload, {
            headers: this.getAuthHeaders()
          });
          alert(`Parking lot "${this.lotForm.lot_name}" has been updated!`);
        } else {
          // --- CREATE LOT ---
          await axios.post(`${API_BASE_URL}/admin/create_lots`, payload, {
            headers: this.getAuthHeaders()
          });
          alert(`New parking lot "${this.lotForm.lot_name}" has been created!`);
        }
        this.$router.push('/admin/dashboard');
      } catch (error) {
        console.error("Form submission failed:", error);
        // Better error handling: check for specific status codes or error messages from backend
        this.errorMessage = (error.response && error.response.data && error.response.data.msg) 
                            ? error.response.data.msg 
                            : "An error occurred. Please check the details and try again.";
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  created() {
    // This is the logic that decides if the page is for adding or editing.
    // It checks if an 'id' parameter is present in the route.
    const lotId = this.$route.params.id;
    if (lotId) {
      this.isEditMode = true;
      this.fetchLotData(lotId); // Auto-fills the form on edit.
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>