<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div class="mb-4">
        <router-link to="/user/dashboard" class="text-decoration-none text-primary fw-semibold">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to My Dashboard
        </router-link>
      </div>

      <div v-if="booking">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="card p-4 h-100">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 class="fw-bold mb-1">{{ booking.location }}</h3>
                  <p class="text-muted mb-0"><i class="bi bi-geo-alt-fill me-1"></i>{{ booking.address }}</p>
                </div>
                <span :class="`badge fs-6 ${getStatusClass(booking.status)}`">{{ booking.status }}</span>
              </div>
              <hr>

              <div class="row">
                <div class="col-sm-6 mb-3">
                  <strong class="text-muted d-block">Vehicle Number</strong>
                  <span>{{ booking.vehicleNumber }}</span>
                </div>
                <div class="col-sm-6 mb-3">
                  <strong class="text-muted d-block">Booking ID</strong>
                  <span>#{{ booking.id }}</span>
                </div>
                <div class="col-sm-6 mb-3">
                  <strong class="text-muted d-block">Start Date & Time</strong>
                  <span>{{ booking.startDate }} at {{ booking.startTime }}</span>
                </div>
                <div class="col-sm-6 mb-3">
                  <strong class="text-muted d-block">End Date & Time</strong>
                  <span>{{ booking.endDate }} at {{ booking.endTime }}</span>
                </div>
                <div class="col-sm-6 mb-3" v-if="booking.checkInTime">
                  <strong class="text-muted d-block">Check-in Date & Time</strong>
                  <span>{{ formatDate(booking.checkInTime) }} at {{ formatTime(booking.checkInTime) }}</span>
                </div>
                <div class="col-sm-6 mb-3" v-if="booking.checkOutTime">
                  <strong class="text-muted d-block">Check-out Date & Time</strong>
                  <span>{{ formatDate(booking.checkOutTime) }} at {{ formatTime(booking.checkOutTime) }}</span>
                </div>
              </div>

              </div>
          </div>
          <div class="col-lg-4">
            <div class="card p-4">
              <h5 class="fw-semibold mb-3">Manage Booking</h5>
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" @click="handleAction('change')"
                  :disabled="booking.status !== 'Active'">
                  <i class="bi bi-pencil-square me-2"></i>Change Booking
                </button>
                <button class="btn btn-outline-danger" @click="handleAction('cancel')"
                  :disabled="booking.status !== 'Active'">
                  <i class="bi bi-x-circle me-2"></i>Cancel Booking
                </button>
                <button class="btn btn-primary" @click="handleAction('checkin')"
                  :disabled="booking.status !== 'Active'">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Check-in Vehicle
                </button>
                <button class="btn btn-success" @click="handleAction('releaseAndCheckout')"
                  :disabled="booking.status !== 'occupied'">
                  <i class="bi bi-box-arrow-right me-2"></i>Release & Pay
                </button>
              </div>
              <p v-if="booking.status === 'Completed'" class="text-muted small mt-3 text-center">This booking is
                completed.</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p class="text-muted">Booking not found or an error occurred.</p>
      </div>
    </div>

    <div v-if="showCostModal" class="modal fade show d-block" tabindex="-1" aria-labelledby="costModalLabel" aria-hidden="true" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="costModalLabel">Payment Summary</h5>
            <button type="button" class="btn-close" @click="closeModalAndRedirect" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <p class="fs-4">Your total payable amount is:</p>
            <h4 class="fw-bold text-success display-5">₹{{ finalCost.toFixed(2) }}</h4>
            <p class="text-muted mt-3">Thank you for using our parking service!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeModalAndRedirect">OK</button>
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
  name: 'BookingDetailsPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      booking: null,
      showCostModal: false, // Controls modal visibility
      finalCost: 0, // Stores the final cost fetched from the API
    };
  },
  computed: {
    // We keep these computed properties as they might still be useful internally
    // or if you later decide to display them in a different context (e.g., in a "receipt" view)
    calculatedDuration() {
      if (!this.booking) return 'N/A';

      let start = new Date(this.booking.startDate + ' ' + this.booking.startTime);
      let end = new Date(this.booking.endDate + ' ' + this.booking.endTime);

      if (this.booking.checkInTime) {
        start = new Date(this.booking.checkInTime);
      }

      if (this.booking.status === 'occupied' && !this.booking.checkOutTime) {
        end = new Date();
      } else if (this.booking.checkOutTime) {
        end = new Date(this.booking.checkOutTime);
      }

      const diffMs = end - start;

      if (this.booking.bookingType === 'hourly') {
        const diffHours = Math.max(0, diffMs / (1000 * 60 * 60));
        return `${diffHours.toFixed(1)} Hours`;
      } else if (this.booking.bookingType === 'daily') {
        const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
        return `${Math.ceil(diffDays)} Days`;
      }
      return 'N/A';
    },

    calculatedTotalCost() {
      if (!this.booking || this.booking.status === 'canceled') return 0;

      let start = new Date(this.booking.startDate + ' ' + this.booking.startTime);
      let end = new Date(this.booking.endDate + ' ' + this.booking.endTime);

      if (this.booking.checkInTime) {
        start = new Date(this.booking.checkInTime);
      }

      if (this.booking.status === 'occupied' && !this.booking.checkOutTime) {
        end = new Date();
      } else if (this.booking.checkOutTime) {
        end = new Date(this.booking.checkOutTime);
      }

      const diffMs = end - start;
      const rate = this.booking.rateApplied;

      if (diffMs < 0) return 0;

      if (this.booking.bookingType === 'hourly') {
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours * rate;
      } else if (this.booking.bookingType === 'daily') {
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.ceil(diffDays) * rate;
      }
      return 0;
    }
  },
  async created() {
    const bookingId = parseInt(this.$route.params.id);
    if (bookingId) {
      await this.fetchBookingDetails(bookingId);
    }
  },
  methods: {
    async fetchBookingDetails(id) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('Authentication token not found. Redirecting to login.');
          alert('Authentication error. Please log in again.');
          this.$router.push('/login'); 
          return;
        }

        const response = await axios.get(`http://127.0.0.1:5000/user/booking-details/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const apiBooking = response.data[0]; 

        this.booking = {
          id: apiBooking.id,
          location: apiBooking.lot_info.lot_name,
          address: apiBooking.lot_info.address,
          vehicleNumber: apiBooking.vehicle_number,
          startDate: this.formatDate(apiBooking.start_time),
          startTime: this.formatTime(apiBooking.start_time),
          endDate: this.formatDate(apiBooking.end_time),
          endTime: this.formatTime(apiBooking.end_time),
          rateApplied: apiBooking.lot_info.price_per_hour,
          totalCost: apiBooking.total_cost,
          status: apiBooking.status,
          bookingType: apiBooking.booking_type,
          checkInTime: apiBooking.check_in_time || null,
          checkOutTime: apiBooking.check_out_time || null,
        };
      } catch (error) {
        console.error('Error fetching booking details:', error);
        this.booking = null; 
        if (error.response) {
          if (error.response.status === 401) {
            alert('Session expired or unauthorized. Please log in again.');
            this.$router.push('/login');
          } else {
            alert(`Failed to load booking details: ${error.response.data.message || error.message}. Please try again.`);
          }
        } else {
          alert('A network error occurred while fetching booking details. Please check your connection.');
        }
      }
    },

    formatDate(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-CA'); 
      } catch (e) {
        console.error("Error formatting date:", e);
        return 'Error';
      }
    },

    formatTime(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      try {
        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return 'Invalid Time';
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch (e) {
        console.error("Error formatting time:", e);
        return 'Error';
      }
    },

    closeModalAndRedirect() {
      this.showCostModal = false; // Hide the modal
      this.$router.push('/user/dashboard'); // Redirect to user dashboard
    },

    async handleAction(actionType) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Authentication token not found. Redirecting to login.');
        alert('Authentication error. Please log in again.');
        this.$router.push('/login');
        return;
      }
      const bookingId = this.booking.id;

      try {
        switch (actionType) {
          case 'change':
            if (this.booking.status !== 'Active') {
              alert("You can only change bookings that are 'Active'.");
            } else {
              alert(`'Change Booking' action initiated for Booking ID #${bookingId}.`);
            }
            break;

          case 'cancel':
            if (this.booking.status !== 'Active') {
              alert("You can only cancel 'Active' bookings.");
            } else {
              if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
                const response = await axios.patch(`http://127.0.0.1:5000/cancel_booking/${bookingId}`, {}, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                  alert("Booking cancelled successfully!");
                  this.booking.status = 'canceled';
                  if (response.data.booking && typeof response.data.booking.total_cost !== 'undefined') {
                     this.booking.totalCost = response.data.booking.total_cost;
                  }
                } else {
                  alert(`Failed to cancel booking. Server responded with status: ${response.status}.`);
                }
              }
            }
            break;

          case 'checkin':
            if (this.booking.status !== 'Active') {
              alert("You can only check in vehicles for 'Active' bookings.");
            } else {
              if (confirm("Are you sure you want to check-in this vehicle?")) {
                const response = await axios.post(`http://127.0.0.1:5000/user/check_in/${bookingId}`, {}, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                  alert("Vehicle checked in successfully! Status updated to 'occupied'.");
                  this.booking.status = 'occupied'; 
                  this.booking.checkInTime = response.data.booking.check_in_time;
                } else {
                  alert(`Failed to check-in vehicle. Server responded with status: ${response.status}.`);
                }
              }
            }
            break;

          case 'releaseAndCheckout':
            if (this.booking.status !== 'occupied') { 
              alert("You can only release and check out vehicles that are currently 'occupied'.");
              return;
            }

            if (confirm("Are you sure you want to check-out this vehicle and finalize payment?")) {
              try {
                console.log(`[Frontend Log] Attempting to call check_out API for booking ID: ${bookingId}`);
                const checkoutResponse = await axios.post(`http://127.0.0.1:5000/user/check_out/${bookingId}`, {}, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });

                if (checkoutResponse.status === 200) {
                  console.log('[Frontend Log] Check-out successful. Response:', checkoutResponse.data);
                  alert("Vehicle checked out successfully!");
                  
                  if (checkoutResponse.data.booking) {
                      this.booking.status = checkoutResponse.data.booking.status; 
                      this.booking.checkOutTime = checkoutResponse.data.booking.check_out_time;
                  }
                  
                  console.log(`[Frontend Log] Attempting to fetch final cost from _cost API for booking ID: ${bookingId}`);
                  const costResponse = await axios.get(`http://127.0.0.1:5000/user/_cost/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });

                  // Ensure the response data has the 'total_cost' key and it's not undefined
                  if (costResponse.status === 200 && typeof costResponse.data.total_cost !== 'undefined') {
                    console.log('[Frontend Log] Final cost fetched successfully. Response:', costResponse.data);
                    this.finalCost = costResponse.data.total_cost;
                    // Update the totalCost property on the main booking object for consistency
                    this.booking.totalCost = this.finalCost; 
                    this.showCostModal = true; // Show the modal
                  } else {
                    console.error('[Frontend Log] Failed to fetch final cost from _cost API. Response:', costResponse);
                    alert("Vehicle checked out, but we couldn't retrieve the final cost. Please check your dashboard or contact support.");
                  }

                } else {
                  console.error('[Frontend Log] Check-out failed. Response:', checkoutResponse);
                  alert(`Failed to check-out vehicle. Server responded with status: ${checkoutResponse.status}. Please check backend logs.`);
                }
              } catch (error) {
                console.error('[Frontend Log] Error during "Release & Pay" process:', error);
                if (error.response) {
                  if (error.response.status === 401) {
                    alert('Your session has expired or you are unauthorized. Please log in again.');
                    this.$router.push('/login');
                  } else if (error.response.data && error.response.data.message) {
                    alert(`Action failed: ${error.response.data.message}`);
                  } else {
                    alert(`A server error occurred (Status: ${error.response.status}). Please try again.`);
                  }
                } else {
                  alert('A network error occurred. Please check your internet connection and try again.');
                }
              }
            }
            break;
        }
      } catch (error) {
        console.error('[Frontend Log] An unexpected error occurred in handleAction:', error);
        // alert('An unexpected error occurred. Please try refreshing the page.');
      }
    },

    getStatusClass(status) {
      if (status === 'Active') return 'bg-info text-dark';
      if (status === 'occupied') return 'bg-success';
      if (status === 'Vacated') return 'bg-warning text-dark'; 
      if (status === 'Completed') return 'bg-secondary';
      if (status === 'canceled') return 'bg-danger';
      return 'bg-dark'; 
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
}

.list-group-item {
  background-color: transparent;
  padding-left: 0;
  padding-right: 0;
}

/* Modal Specific Styles - Crucial for visual display */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0,0,0,0.5); /* Semi-transparent backdrop */
  z-index: 1050; /* Ensures modal is on top */
  display: flex; /* For centering */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  pointer-events: none; /* Allows clicks to pass through to backdrop unless content explicitly sets pointer-events: auto */
  max-width: 500px; /* Standard modal width */
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); /* Adds subtle shadow */
  pointer-events: auto; /* Makes modal content clickable */
  outline: 0; 
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
}
</style>