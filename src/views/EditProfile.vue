<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="p-4 w-100" style="max-width: 500px;">
      <h3 class="text-center mb-4">Edit Profile</h3>

      <form @submit.prevent="updateProfile" enctype="multipart/form-data">
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input v-model="fullName" type="text" class="form-control"required/>
        </div>
        <div class="mb-3">
          <label class="form-label">Phone Number</label>
          <input v-model="phone" type="tel"class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Address</label>
          <input v-model="address" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Pin Code</label>
          <input v-model="pinCode" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Upload Profile Picture</label>
          <input type="file" class="form-control" @change="handleFileUpload" accept="image/*" />
        </div>
        <button type="submit" class="btn btn-primary-custom w-100">Save Profile</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProfile",
  data() {
    return {
      fullName: "",
      phone: "",
      address: "",
      pinCode: "",
      imageFile: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.imageFile = event.target.files[0];
    },
    async updateProfile() {
      const formData = new FormData();
      formData.append("full_name", this.fullName);
      formData.append("phone", this.phone);
      formData.append("address", this.address);
      formData.append("pin_code", this.pinCode);
      if (this.imageFile) {
        formData.append("profile_image", this.imageFile);
      }

      try {
        const res = await axios.put("http://localhost:5000/user/profile", formData);
        alert(res.data.message || "Profile updated successfully");
        this.$router.push("/user/dashboard");
      } catch (err) {
        alert(err.response?.data.message || "Failed to update profile");
      }
    }
  }
};
</script>
