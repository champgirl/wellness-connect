<template>
  <Title>Home</Title>
  <div class="landing-page">
    <div class="background-image">
      <img src="/images/home-bg.webp" alt="home image">
    </div>
    <div class="content">
      <h1 class="title">Wellness Connect</h1>
      <h2 class="subtitle">Your Path to Mental Well-being</h2>
      <p class="description">
        Discover a community dedicated to mental health awareness and support. Engage with the latest news and events,
        connect with our interactive chatbot, and schedule confidential appointments with experienced university
        counselors. Join us in fostering a culture of well-being and understanding. Your wellness journey begins here.
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>

<style scoped>

.landing-page {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  scale: 1.15;
  position: absolute;
  top: 0;
  left: 25%;
  z-index: -1;
}

.content {
  z-index: 1;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(50px);
  max-width: 500px;
  margin-top: -50px;
  padding: 1rem;
  border-radius: 20px;
  
  @media screen and (min-width: 1024px) {
    position: absolute;
    left: 10%;
  }
}

.title {
  font-size: 3rem;
  margin-bottom: 0.9em;
  font-family: 'Rubik', sans-serif;
  text-align: left;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5em;
  font-family: 'Rubik', sans-serif;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  font-family: 'Rubik', sans-serif;
  color: #0a0a0a;
}

</style>