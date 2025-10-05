<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div class="row g-5">

        <div class="col-lg-7">
          <h2 class="fw-bold mb-4">Complete Your Booking</h2>

          <div class="card p-4">
            <div class="btn-group w-100 mb-4" role="group">
              <input type="radio" class="btn-check" name="bookingType" id="hourly" value="hourly" v-model="bookingDetails.type" autocomplete="off" checked>
              <label class="btn btn-outline-primary" for="hourly">Hourly</label>

              <input type="radio" class="btn-check" name="bookingType" id="monthly" value="monthly" v-model="bookingDetails.type" autocomplete="off">
              <label class="btn btn-outline-primary" for="monthly">Monthly</label>

              <input type="radio" class="btn-check" name="bookingType" id="permanent" value="permanent" v-model="bookingDetails.type" autocomplete="off">
              <label class="btn btn-outline-primary" for="permanent">Permanent</label>
            </div>

            <form @submit.prevent="handleBooking">
              <div class="mb-4">
                <h5 class="fw-semibold">Parking Lot</h5>
                <p v-if="isLoading" class="text-muted mb-0">Loading details...</p>
                <p v-else class="text-muted mb-0">{{ selectedLot.name }} - {{ selectedLot.address }}</p>
              </div>

              <div v-if="bookingDetails.type === 'hourly'">
                <div class="row">
                  <div class="col-md-4 mb-3"><label for="bookingDate" class="form-label fw-semibold">Date</label><input type="date" class="form-control" id="bookingDate" v-model="bookingDetails.date" :min="getTodayString()" required></div>
                  <div class="col-md-4 mb-3"><label for="startTime" class="form-label fw-semibold">Start Time</label><input type="time" class="form-control" id="startTime" v-model="bookingDetails.startTime" required></div>
                  <div class="col-md-4 mb-3"><label for="endTime" class="form-label fw-semibold">End Time</label><input type="time" class="form-control" id="endTime" v-model="bookingDetails.endTime" required></div>
                </div>
              </div>

              <div v-if="bookingDetails.type === 'monthly'">
                <div class="row">
                  <div class="col-md-6 mb-3"><label for="startDate" class="form-label fw-semibold">Start Date</label><input type="date" class="form-control" id="startDate" v-model="bookingDetails.date" :min="getTodayString()" required></div>
                  <div class="col-md-6 mb-3"><label for="endDate" class="form-label fw-semibold">End Date</label><input type="date" class="form-control" id="endDate" v-model="bookingDetails.endDate" :min="bookingDetails.date" required></div>
                  <div class="col-md-6 mb-3"><label for="dailyStartTime" class="form-label fw-semibold">Start Time (Daily)</label><input type="time" class="form-control" id="dailyStartTime" v-model="bookingDetails.startTime" required></div>
                  <div class="col-md-6 mb-3"><label for="dailyEndTime" class="form-label fw-semibold">End Time (Daily)</label><input type="time" class="form-control" id="dailyEndTime" v-model="bookingDetails.endTime" required></div>
                </div>
              </div>

              <div v-if="bookingDetails.type === 'permanent'">
                <div class="row">
                  <div class="col-md-6 mb-3"><label for="permStartDate" class="form-label fw-semibold">Start Date</label><input type="date" class="form-control" id="permStartDate" v-model="bookingDetails.date" :min="getTodayString()" required></div>
                  <div class="col-md-6 mb-3"><label for="permEndDate" class="form-label fw-semibold">End Date</label><input type="date" class="form-control" id="permEndDate" v-model="bookingDetails.endDate" :min="bookingDetails.date" required></div>
                </div>
              </div>

              <div class="mb-4">
                <label for="vehicleNumber" class="form-label fw-semibold">Vehicle Number</label>
                <input type="text" class="form-control" id="vehicleNumber" placeholder="e.g., MH 12 AB 1234" v-model="bookingDetails.vehicleNumber" required>
              </div>

              <div v-if="errorMessage" class="alert alert-danger small p-2">
                {{ errorMessage }}
              </div>

              <hr>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="!isBookingValid || isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                    <span v-else>Book Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-5">
          <h4 class="fw-bold mb-4">Summary</h4>
          <div class="card mb-4">
             <img :src="selectedLot.imageUrl" class="img-fluid rounded" :alt="selectedLot.name">
          </div>
          <div class="card p-3">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between"><span>Rate Applied</span><strong>{{ appliedRateText }}</strong></li>
              <li class="list-group-item d-flex justify-content-between"><span>Parking Duration</span><strong>{{ parkingDurationText }}</strong></li>
              <li class="list-group-item d-flex justify-content-between bg-light"><span class="fw-bold">Total Cost</span><strong class="text-primary fs-5">₹{{ totalCost }}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="bookingSuccessModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered text-center">
            <div class="modal-content">
                <div class="modal-body p-4 position-relative">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
                    <h3 class="fw-bold">Booking Successful!</h3>
                    <p class="text-muted">Your parking spot has been confirmed. You can view the details in your dashboard.</p>
                    <button type="button" class="btn btn-primary mt-2" @click="goToDashboard">Go to Dashboard</button>
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
import { Modal } from 'bootstrap';

export default {
  name: 'BookingPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    const today = new Date();
    const getTodayString = () => today.toISOString().slice(0, 10);

    return {
      selectedLot: {},
      bookingDetails: {
        type: 'hourly',
        date: getTodayString(), // This will serve as start_date for all types
        endDate: getTodayString(),
        startTime: '10:00',
        endTime: '12:00',
        vehicleNumber: ''
      },
      isLoading: false,
      errorMessage: '',
      successModal: null,
    };
  },
  created() {
    const lotId = this.$route.params.id;
    if (lotId) {
      this.fetchLotDetails(lotId);
    } else {
        this.errorMessage = "No parking lot selected.";
    }
  },
  mounted() {
    const modalEl = document.getElementById('bookingSuccessModal');
    if (modalEl) {
        this.successModal = new Modal(modalEl);
    }
  },
  computed: {
    bookingCalculation() {
        const type = this.bookingDetails.type;
        const { startTime, endTime, date, endDate } = this.bookingDetails; // 'date' is now always start_date

        let startD, endD, startT, endT;

        // Date parsing for start_date and end_date (if applicable)
        try {
            startD = new Date(date);
            endD = new Date(endDate);
        } catch (e) {
            return { totalDays: 0, hoursPerDay: 0, appliedRate: 0, totalCost: 0, rateType: 'Invalid Date' };
        }

        // Time parsing for start_time and end_time (if applicable)
        try {
            startT = new Date(`1970-01-01T${startTime}`);
            endT = new Date(`1970-01-01T${endTime}`);
        } catch (e) {
            // For permanent, times are not strictly required for calculation, but handle if parsing fails
            if (type !== 'permanent') {
                return { totalDays: 0, hoursPerDay: 0, appliedRate: 0, totalCost: 0, rateType: 'Invalid Time' };
            }
        }

        let totalDays = 0;
        let hoursPerDay = 0;
        let appliedRate = 0;
        let rateType = 'Standard';

        if (type === 'permanent') {
            if (endD < startD) return { totalDays: 0, hoursPerDay: 0, appliedRate: 0, totalCost: 0, rateType: 'Invalid Dates' };
            totalDays = ((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
            hoursPerDay = 24; // 24 hours per day for permanent
            // Assuming permanent rate could be a fixed monthly/daily rate or discounted hourly
            appliedRate = (totalDays >= 2) ? (this.selectedLot.price_per_hour || 80) * 0.8 : (this.selectedLot.price_per_hour || 80);
            rateType = (totalDays >= 2) ? 'Permanent (20% Off)' : 'Standard';
        } else { // Hourly or Monthly
            if (type === 'monthly' && endD < startD) return { totalDays: 0, hoursPerDay: 0, appliedRate: 0, totalCost: 0, rateType: 'Invalid Dates' };

            hoursPerDay = (endT.getTime() - startT.getTime()) / (1000 * 60 * 60);
            if (hoursPerDay <= 0) hoursPerDay += 24; // Handle overnight bookings (e.g., 22:00 to 02:00)
            if (hoursPerDay <= 0) return { totalDays: 0, hoursPerDay: 0, appliedRate: 0, totalCost: 0, rateType: 'Invalid Time Range' };


            appliedRate = this.selectedLot.price_per_hour || 80;

            if (type === 'hourly') {
                totalDays = 1;
                rateType = 'Standard';
            } else if (type === 'monthly') {
                totalDays = ((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
                // Applying a discount for monthly bookings over 2 days
                appliedRate = (totalDays >= 2) ? (this.selectedLot.price_per_hour || 80) * 0.8 : (this.selectedLot.price_per_hour || 80);
                rateType = (totalDays >= 2) ? 'Monthly (20% Off)' : 'Standard';
            }
        }

        const totalCost = totalDays * hoursPerDay * appliedRate;

        return { totalDays: Math.round(totalDays), hoursPerDay: parseFloat(hoursPerDay.toFixed(1)), appliedRate, totalCost, rateType };
    },
    appliedRateText() {
        const { appliedRate, rateType } = this.bookingCalculation;
        if (!appliedRate) return 'N/A';
        return `₹${appliedRate.toFixed(2)}/hr (${rateType})`;
    },
    parkingDurationText() {
        const { totalDays, hoursPerDay, rateType } = this.bookingCalculation;
        if (totalDays <= 0 && rateType.includes('Invalid')) return 'N/A'; // Use <= 0 to catch invalid durations

        if (this.bookingDetails.type === 'permanent') {
            return `${totalDays} Day${totalDays !== 1 ? 's' : ''} (24/7)`;
        } else if (this.bookingDetails.type === 'hourly') {
            return `${hoursPerDay.toFixed(1)} Hour${hoursPerDay !== 1 ? 's' : ''}`;
        } else if (this.bookingDetails.type === 'monthly') {
            return `${totalDays} Day${totalDays !== 1 ? 's' : ''} (${hoursPerDay.toFixed(1)} hrs/day)`;
        }
        return 'N/A';
    },
    totalCost() {
      const { totalCost } = this.bookingCalculation;
      return totalCost ? totalCost.toFixed(2) : '0.00';
    },
    isBookingValid() {
        const { totalDays, hoursPerDay, rateType } = this.bookingCalculation;
        let durationValid = false;

        if (rateType.includes('Invalid')) return false; // Invalidate if dates/times are invalid

        if (this.bookingDetails.type === 'permanent') {
            durationValid = totalDays > 0;
        } else {
            durationValid = totalDays > 0 && hoursPerDay > 0;
        }

        return durationValid && this.bookingDetails.vehicleNumber.trim() !== '';
    }
  },
  methods: {
    getTodayString() {
      const today = new Date();
      return today.toISOString().slice(0, 10);
    },
    async fetchLotDetails(lotId) {
        this.isLoading = true;
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:5000/parking_lots', {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const lot = response.data.find(l => l.id === parseInt(lotId));
            if (lot) {
                // Ensure price_per_hour is available, defaulting if not
                lot.price_per_hour = lot.price_per_hour || lot.price || 80;
                this.selectedLot = lot;
                // Using a more robust placeholder for image
                this.selectedLot.imageUrl = `https://via.placeholder.com/600x400/A7C7E7/FFFFFF?text=${lot.name.replace(/\s/g, '+')}`;
            } else {
                this.errorMessage = "Parking lot not found.";
            }
        } catch (error) {
            console.error("Failed to fetch lot details:", error);
            this.errorMessage = "Could not load parking lot details. Please check your network or server.";
        } finally {
            this.isLoading = false;
        }
    },
    async handleBooking() {
      this.isLoading = true;
      this.errorMessage = "";

      if (!this.selectedLot || !this.selectedLot.id) {
          this.errorMessage = "Could not find parking lot details. Please go back and select a lot again.";
          this.isLoading = false;
          return;
      }

      // Client-side validation before sending (though backend should also validate)
      if (!this.isBookingValid) {
        this.errorMessage = "Please ensure all booking details (dates, times, vehicle number) are valid.";
        this.isLoading = false;
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
          this.errorMessage = "You must be logged in to make a booking.";
          this.isLoading = false;
          return;
      }

      try {
        // Initialize payload with all possible keys, defaulting to empty strings
        const payload = {
          vehicle_number: this.bookingDetails.vehicleNumber,
          booking_type: this.bookingDetails.type,
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
        };

        // Populate common and type-specific values
        payload.start_date = this.bookingDetails.date; // Always use bookingDetails.date as start_date

        if (this.bookingDetails.type === 'hourly') {
          payload.start_time = this.bookingDetails.startTime;
          payload.end_time = this.bookingDetails.endTime;
          // end_date remains empty for hourly
        } else if (this.bookingDetails.type === 'monthly') {
          payload.end_date = this.bookingDetails.endDate;
          payload.start_time = this.bookingDetails.startTime;
          payload.end_time = this.bookingDetails.endTime;
        } else if (this.bookingDetails.type === 'permanent') {
          payload.end_date = this.bookingDetails.endDate;
          // start_time and end_time remain empty for permanent bookings (24/7)
        }

        const apiUrl = `http://127.0.0.1:5000/book_slot/${this.selectedLot.id}`;
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 201 || response.status === 200) {
          console.log("Booking successful:", response.data);
          if (this.successModal) {
            this.successModal.show();
          }
        }
      } catch (err) {
        if (err.response && err.response.data) {
            this.errorMessage = err.response.data.msg || "Booking failed. Please try again.";
        } else {
            this.errorMessage = "An unknown error occurred. Make sure your backend server is running and accessible.";
        }
        console.error("Booking failed:", err);
      } finally {
        this.isLoading = false;
      }
    },
    goToDashboard() {
        if (this.successModal) {
            this.successModal.hide();
        }
        this.$router.push('/user/dashboard');
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
</style>