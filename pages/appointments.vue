<template>
  <Title>Appointments</Title>
    <div class="form-wrapper">
      <h2>Fill the form below to book an appointment for physical counselling</h2>
        <div class="form-container">
      <form action="" method="POST">
        <div class="formbold-mb-5">
          <label for="name" class="form-label"> Full Name </label>
          <input type="text" name="name" id="name" placeholder="Full Name" class="form-input"/>
        </div>
        <div class="formbold-mb-5">
          <label for="phone" class="form-label"> Phone Number </label>
          <input type="text" name="phone" id="phone" placeholder="Enter your phone number" class="form-input"/>
        </div>
        <div class="formbold-mb-5">
          <label for="RegNumber" class="form-label"> Registration Number </label>
          <input type="text" name="Regnumber" id="regnumber" placeholder="Enter your Registration number" class="form-input"/>
        </div>
        <div class="formbold-mb-5">
          <label for="email" class="form-label"> Email Address </label>
          <input type="email" name="email" id="email" placeholder="Enter your email" class="form-input"/>
        </div>
        <div class="flex flex-wrap formbold--mx-3">
          <div class="w-full sm:w-half formbold-px-3">
            <div class="formbold-mb-5 w-full">
              <label for="date" class="form-label"> Date </label>
              <input type="date" name="date" id="date" class="form-input"/>
            </div>
          </div>
          <div class="w-full sm:w-half formbold-px-3">
            <div class="formbold-mb-5">
              <label for="time" class="form-label"> Time </label>
              <input type="time" name="time" id="time" class="form-input"
              />
            </div>
          </div>
        </div>

        <div>
          <button class="form-btn">Book Appointment</button>
        </div>
      </form>
    </div>
  </div>

</template>
<script setup lang="ts">

</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Inter", Arial, Helvetica, sans-serif;

}
.formbold-mb-5 {
  margin-bottom: 20px;
}


.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background-color: lavender;


}

.form-container {
  margin: 0 auto;
  max-width: 550px;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 20px;
}
.form-label {
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #07074d;
  margin-bottom: 12px;
}


.form-input {
  width: 100%;
  padding: 12px 24px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  font-weight: 500;
  font-size: 16px;
  color: #6b7280;
  outline: none;
  resize: none;
}
.form-input:focus {
  border-color: #6a64f1;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.form-btn {
  text-align: center;
  font-size: 16px;
  border-radius: 6px;
  padding: 14px 32px;
  border: none;
  font-weight: 600;
  background-color: #6a64f1;
  color: white;
  width: 100%;
  cursor: pointer;
}
.form-btn:hover {
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
}

.formbold--mx-3 {
  margin-left: -12px;
  margin-right: -12px;
}
.formbold-px-3 {
  padding-left: 12px;
  padding-right: 12px;
}
.flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.w-full {
  width: 100%;
}
@media (min-width: 540px) {
  .sm\:w-half {
    width: 50%;
  }
}
</style>