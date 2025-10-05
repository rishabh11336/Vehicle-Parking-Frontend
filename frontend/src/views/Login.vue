<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-sm" style="max-width: 400px;">
      <h3 class="text-center fw-bold mb-4">Login</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" v-model="form.email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" v-model="form.password" class="form-control" required />
        </div>

        <!-- This will show an error message if the login fails -->
        <div v-if="errorMessage" class="alert alert-danger small p-2">
            {{ errorMessage }}
        </div>

        <div class="d-grid">
            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
                <!-- This shows a spinner while the request is being sent -->
                <span v-if="isLoading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span v-else>Login</span>
            </button>
        </div>
      </form>
      <p class="text-center mt-3 mb-0">
        Don't have an account? <router-link to="/signup">Signup here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
// Make sure you have axios installed: npm install axios
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      // Use an object to hold form data, which is a cleaner approach
      form: {
          email: '',
          password: ''
      },
      // These properties help manage the UI state during the API call
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    // --- Viva Explanation Point 1: Async/Await for API Calls ---
    // We make the method 'async' so we can use 'await' inside it.
    // This makes the code easier to read than using .then() chains.
    async handleLogin() {
      // Reset state before making a new request
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // --- Viva Explanation Point 2: Making the POST Request ---
        // We use axios.post to send the user's email and password
        // to the backend login endpoint.
        const response = await axios.post('http://127.0.0.1:5000/login', this.form);

        // --- Viva Explanation Point 3: Handling a Successful Response ---
        // If the login is successful (status code 200), the backend sends
        // back a token and user data.
        const token = response.data.access_token;
        const user = response.data.user;

        // We store the token in localStorage so the user stays logged in
        // even if they refresh the page.
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', user.roles); // Store user role

        console.log("Login successful, token stored.");

        // --- Viva Explanation Point 4: Role-Based Redirection ---
        // We check the user's role and redirect them to the appropriate dashboard.
        if (user.roles === 'admin') {
          this.$router.push('/admin/dashboard');
        } else {
          this.$router.push('/user/dashboard'); // or '/dashboard'
        }

      } catch (error) {
        // --- Viva Explanation Point 5: Handling Errors ---
        // If the backend returns an error (like 401 for wrong password),
        // the 'catch' block will run.
        if (error.response && error.response.data) {
          // We display the error message sent from the backend.
          this.errorMessage = error.response.data.error || 'Invalid credentials. Please try again.';
        } else {
          // This handles network errors or other unexpected issues.
          this.errorMessage = 'An error occurred. Please check your connection.';
        }
        console.error("Login failed:", error);
      } finally {
        // This 'finally' block runs whether the request succeeded or failed.
        // We use it to hide the loading spinner.
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
}
.vh-100 {
    height: calc(100vh - 72px); /* Adjust height to account for navbar */
}
</style>
