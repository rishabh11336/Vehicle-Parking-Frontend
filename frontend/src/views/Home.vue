<template>
  <div>
    <Navbar />

    <!-- HERO IMAGE SECTION -->
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/car-1.jpg" class="d-block w-100 hero-img" alt="Slide 1" />
        </div>
        <div class="carousel-item">
          <img src="../assets/car-2.jpg" class="d-block w-100 hero-img" alt="Slide 2" />
        </div>
        <div class="carousel-item">
          <img src="../assets/car-3.jpg" class="d-block w-100 hero-img" alt="Slide 3" />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- HOW IT WORKS SECTION -->
    <section class="py-5 bg-light text-center">
      <div class="container">
        <h3 class="mb-5 fw-bold">How It Works</h3>
        <div class="row g-4 justify-content-center">
          <div class="col-md-4">
            <img src="../assets/look.avif" class="step-icon mb-3" alt="Search" />
            <h5>Look</h5>
            <p>Find nearby parking lots</p>
          </div>
          <div class="col-md-4">
            <img src="../assets/book.avif" class="step-icon mb-3" alt="Reserve" />
            <h5>Book</h5>
            <p>Book in advance easily</p>
          </div>
          <div class="col-md-4">
            <img src="../assets/park.avif" class="step-icon mb-3" alt="Park" />
            <h5>Park</h5>
            <p>Arrive and park your car</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT SECTION -->
    <div class="container my-5 px-3 px-md-5">
      <!-- CONTENT 1 -->
      <div class="row featurette align-items-center mb-5">
        <div class="col-md-7">
          <h2 class="content-heading">Parking by the Hour. <span class="text-primary">Perfect for short trips.</span> </h2>
          <p class="lead">
            Perfect for when you are out for just a few hours. Whether you are shopping or have a meeting, you can easily book a spot and only pay for the time you use.
          </p>
        </div>
        <div class="col-md-5">
          <img src="../assets/park-1.jpg" class="img-fluid feature-img" alt="Feature 1" />
        </div>
      </div>
      <hr class="featurette-divider" /> 
      <!-- CONTENT 2 -->
      <div class="row featurette align-items-center mb-5">
        <div class="col-md-7 order-md-2">
          <h2 class="content-heading"> Your Daily Spot, Reserved. <span class="text-primary">Ideal for commuters.</span> </h2>
          <p class="lead">
            For daily commuters or regular visitors, our monthly plan is a lifesaver. Book a spot for your specific time slot every day and enjoy discounted rates. No more daily parking stress!
          </p>
        </div>
        <div class="col-md-5 order-md-1">
          <img src="../assets/park-2.jpg" class="img-fluid feature-img" alt="Feature 2" />
        </div>
      </div>
      <hr class="featurette-divider" />
      <!-- Content 3 -->
      <div class="row featurette align-items-center mb-5">
        <div class="col-md-7">
          <h2 class="content-heading"> Long-Term, 24/7 Security. <span class="text-primary">When you're away.</span> </h2>
          <p class="lead">
            Traveling out of state or just need a secure place to keep your car for a while? Our permanent parking option provides 24/7 access and peace of mind for your long-term needs.
          </p>
        </div>
        <div class="col-md-5">
          <img src="../assets/park-3.jpg" class="img-fluid feature-img" alt="Feature 3" />
        </div>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '../components/Footer.vue';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'Home',
  components: {
    Navbar,
    Footer
  }
};
</script>

<style scoped>
.hero-img {
  height: 400px;
  object-fit: cover;
  width: 100%;
}

.step-icon {
  width: 120px;
  height: auto;
  transition: transform 0.2s ease;
}
.step-icon:hover {
  transform: scale(1.05);
}

/* CONTENT SECTION CSS  */
.content-heading {
  font-size: 1.8rem;
  font-weight: 600;
  word-break: break-word;
  overflow-wrap: break-word;
}

.lead {
  font-size: 1rem;
  word-break: break-word;
}

.feature-img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
  border-radius: 0.25rem;
}
</style>
