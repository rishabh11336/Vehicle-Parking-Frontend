<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3">Fetching your dashboard data...</p>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

      <div v-else class="row gy-4">
        <div class="col-lg-5 col-md-12">
          <div class="card p-4 h-100 shadow-sm">
            <h4 class="fw-bold mb-4 text-center text-md-start">My Profile</h4>

            <div class="text-center mb-4">
              <img v-if="user.image" :src="user.image" alt="Profile Image"
                class="profile-image rounded-circle mb-2 border border-3 border-light" />
              <div v-else
                class="profile-avatar-placeholder rounded-circle mb-2 mx-auto d-flex align-items-center justify-content-center border border-3 border-light">
                <span class="avatar-text">{{ user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U' }}</span>
              </div>

              <div v-if="editing" class="mt-3">
                <label for="imageUpload" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-camera me-1"></i>Change Photo
                </label>
                <input type="file" id="imageUpload" class="d-none" @change="handleImageUpload" accept="image/*" />
              </div>
            </div>

            <div>
              <div v-if="editing" class="px-2">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Full Name</label>
                  <input type="text" class="form-control" v-model="editForm.full_name" placeholder="Enter full name" />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Email</label>
                  <input type="email" class="form-control" v-model="editForm.email" disabled />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Phone</label>
                  <input type="tel" class="form-control" v-model="editForm.phone"
                    placeholder="e.g., +91 1234567890" />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Address</label>
                  <textarea class="form-control" v-model="editForm.address" rows="2"
                    placeholder="Enter your address"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-muted">Pin Code</label>
                  <input type="text" class="form-control" v-model="editForm.pincode" placeholder="Enter pincode" />
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button class="btn btn-secondary btn-sm" @click="toggleEdit">Cancel</button>
                  <button class="btn btn-primary btn-sm" @click="saveProfile">Save Changes</button>
                </div>
              </div>

              <div v-else>
                <ul class="list-group list-group-flush border-top border-bottom">
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap py-2">
                    <strong class="text-muted">Name:</strong>
                    <span class="user-data-value text-end">{{ user.full_name || 'N/A' }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap py-2">
                    <strong class="text-muted">Email:</strong>
                    <span class="user-data-value text-end">{{ user.email || 'N/A' }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap py-2">
                    <strong class="text-muted">Phone:</strong>
                    <span class="user-data-value text-end">{{ user.phone || 'Not provided' }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap py-2">
                    <strong class="text-muted">Address:</strong>
                    <span class="text-end user-data-value flex-grow-1 ms-3">{{ user.address || 'Not provided' }}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap py-2">
                    <strong class="text-muted">Pin Code:</strong>
                    <span class="user-data-value text-end">{{ user.pincode || 'Not provided' }}</span>
                  </li>
                </ul>
                <div class="text-center mt-4">
                  <button class="btn btn-primary w-100" @click="toggleEdit">Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-7 col-md-12">
          <div class="card p-4 mb-4 shadow-sm">
            <h5 class="fw-bold mb-3">Current Bookings</h5>
            <div v-if="currentBookings.length > 0">
              <ul class="list-group list-group-flush border-top border-bottom">
                <li v-for="booking in currentBookings" :key="booking.id" class="list-group-item px-0 py-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <p class="mb-1 fw-semibold">
                        <i class="bi bi-pin-map-fill me-1 text-primary"></i>
                        {{ booking.lot_info ? booking.lot_info.lot_name : 'N/A' }}
                      </p>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>
                        {{ formatBookingDateTime(booking.start_time) }}
                      </small>
                    </div>
                    <div class="text-end">
                      <router-link :to="`/user/booking-details/${booking.id}`" class="btn btn-primary btn-sm">
                        View Details
                      </router-link>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else class="text-center text-muted py-3">
              <p><i class="bi bi-info-circle me-2"></i>You have no active bookings.</p>
              <router-link to="/user/parking" class="btn btn-outline-primary btn-sm">Find Parking</router-link>
            </div>
          </div>

          <div class="card p-4 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0">Booking History</h5>
              <button class="btn btn-outline-secondary btn-sm" :disabled="bookingHistory.length === 0">
                <i class="bi bi-download me-1"></i>Download Full History
              </button>
            </div>
            <ul class="list-group list-group-flush border-top border-bottom">
              <li v-for="booking in bookingHistory" :key="booking.id"
                class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <div>
                  <strong class="d-block">{{ booking.lot_info ? booking.lot_info.lot_name : 'N/A' }}</strong>
                  <small class="text-muted">
                    <i class="bi bi-calendar me-1"></i>
                    {{ formatBookingDateTime(booking.start_time) }}
                  </small>
                </div>
                <div>
                  <span v-if="booking.status === 'canceled'"
                    class="badge bg-danger rounded-pill px-3 py-2 fs-7">Cancelled</span>
                  <span v-else-if="booking.status === 'completed'"
                    class="badge bg-success rounded-pill px-3 py-2 fs-7">₹{{ booking.total_cost ?
                      booking.total_cost.toFixed(2) : '0.00' }}</span>
                  <span v-else class="badge bg-info rounded-pill px-3 py-2 fs-7 text-white">{{ booking.status }}</span>
                </div>
              </li>
            </ul>
            <div v-if="bookingHistory.length === 0" class="text-center text-muted py-3">
              <p><i class="bi bi-info-circle me-2"></i>Your booking history is empty.</p>
            </div>
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

export default {
  name: 'UserDashboard',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      editing: false,
      isLoading: false,
      errorMessage: '',
      user: {
        id: null,
        full_name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        image: ''
      },
      editForm: {
        full_name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        image: ''
      },
      currentBookings: [],
      bookingHistory: []
    };
  },
  async created() {
    await this.fetchDashboardData();
  },
  methods: {
    async fetchDashboardData() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        // Fetch user profile
        const profileResponse = await axios.get('http://127.0.0.1:5000/user_profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        this.user = { ...profileResponse.data };
        if (this.user.pin_code && !this.user.pincode) {
          this.user.pincode = this.user.pin_code;
          delete this.user.pin_code;
        }
        if (!this.user.image) {
          this.user.image = '';
        }

        // Fetch all user bookings
        const bookingsResponse = await axios.get('http://127.0.0.1:5000/user_bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allBookings = bookingsResponse.data;

        // Filter bookings:
        // Current bookings are 'Active', 'Parked', or 'Occupied'
        this.currentBookings = allBookings.filter(b => b.status === 'Active' || b.status === 'Parked' || b.status === 'occupied');
        // Booking history includes everything else (completed, canceled, etc.)
        this.bookingHistory = allBookings.filter(b => b.status !== 'Active' && b.status !== 'Parked' && b.status !== 'occupied');

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        this.errorMessage = "Failed to load dashboard data. Please check your internet connection or try again later.";
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      } finally {
        this.isLoading = false;
      }
    },
    toggleEdit() {
      this.editing = !this.editing;
      if (this.editing) {
        // Create a deep copy of the user object for editing
        this.editForm = JSON.parse(JSON.stringify(this.user));
      }
    },
    async saveProfile() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('authToken');

        const dataToUpdate = {
          full_name: this.editForm.full_name,
          phone: this.editForm.phone,
          address: this.editForm.address,
          pincode: this.editForm.pincode // Ensure pincode is sent correctly
        };

        // If you're handling image upload separately, you might send it as FormData
        // For now, assuming image is handled on the client or not part of this PATCH
        // If you plan to upload image with this request, you'd need FormData and a different backend endpoint
        // For now, only text fields are being updated here.

        await axios.patch('http://127.0.0.1:5000/edit_user_profile', dataToUpdate, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // After successful save, re-fetch dashboard data to update the UI
        await this.fetchDashboardData();
        this.editing = false; // Exit edit mode
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error saving profile:", error.response ? error.response.data : error.message);
        this.errorMessage = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to save profile changes. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // You would typically upload this file to your backend
        // and get a URL back to update `user.image` or `editForm.image`.
        // For demonstration, here's how to display a preview:
        const reader = new FileReader();
        reader.onload = (e) => {
          // This will show a preview in the edit form, but doesn't upload to backend.
          this.editForm.image = e.target.result;
          // You'll need to implement an actual upload logic here (e.g., another API call)
          // For example: this.uploadProfileImage(file);
        };
        reader.readAsDataURL(file);
      }
    },
    // You'd need a separate method like this to upload the image to the backend
    /*
    async uploadProfileImage(file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('profile_image', file);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://127.0.0.1:5000/upload_profile_image', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        this.user.image = response.data.image_url; // Update user image with new URL
        alert("Profile image updated successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        this.errorMessage = "Failed to upload image.";
      } finally {
        this.isLoading = false;
      }
    },
    */
    viewBookingDetails(bookingId) {
      this.$router.push(`/user/booking-details/${bookingId}`);
    },
    formatBookingDateTime(isoString) {
      if (!isoString) return 'N/A';
      const date = new Date(isoString);
      // Ensure date is valid after parsing
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) +
        ' at ' +
        date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    }
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.profile-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid var(--bs-primary);
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), .25);
}

.profile-avatar-placeholder {
  width: 120px;
  height: 120px;
  background-color: var(--bs-primary);
  color: white;
  font-size: 4rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--bs-primary);
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), .25);
}

.list-group-item {
  background-color: transparent;
  padding-left: 0;
  padding-right: 0;
  border-color: #eee;
}

.user-data-value {
  font-weight: 500;
  color: #343a40;
}

.price-badge {
  min-width: 80px;
}

/* Responsive adjustments for text alignment in profile card header */
@media (min-width: 768px) {
  .text-md-start {
    text-align: left !important;
  }
}
</style>