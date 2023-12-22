<template>
  <Title>Appointments</Title>
  <div class="wrapper">
    <div class="form-container">
      <h1>New appointment</h1>
      <form @submit.prevent="makeAppointment">
        <div class="flex flex-wrap formbold--mx-3">
          <div class="w-full sm:w-half formbold-px-3">
            <div class="formbold-mb-5 w-full">
              <label for="date" class="form-label"> Date </label>
              <input id="datePicker" name="date" class="form-input" v-model="newAppointment.date" autocomplete="none" />
            </div>
          </div>
          <div class="w-full sm:w-half formbold-px-3">
            <div class="formbold-mb-5">
              <select class="form-label" v-model="newAppointment.time" style="margin-top: 35px;">
                <option value="">Select a time</option>
                <option value="9:00">9:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <button class="form-btn">Book Appointment</button>
        </div>
      </form>
    </div>
    <div class="upcoming">
      <h1>Upcoming Appointments</h1>

      <ul class="holder">
        <li class="card" v-for="appointment in appointments">
          <div class="card-body">
            <h3 class="card-title">Date: {{ new Date(appointment.dateTime).toLocaleDateString() }}</h3>
            <p class="card-text">
              <span class="time">Time: {{ new Date(appointment.dateTime).toLocaleTimeString() }}
              </span> <br>
              <div class="name">With: {{ appointment.with }}</div>
              <div class="status" v-if="appointment.status === 1">Status: Approved</div>
              <div class="status" v-else-if="appointment.status === 2">Status: Rejected</div>
              <div class="status" v-else>Status: Pending</div>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { userEnum } from "~/types";
import { userIsAdmin, userIsAuthenticated } from "~/helpers.client";
// @ts-ignore
import datepicker from "js-datepicker/src/datepicker";

const user = useUser()

const route = useRoute()
if (!userIsAuthenticated()) await navigateTo(`/login?redirect=${route.path}&user=${userEnum.STUDENT}`)

if(await userIsAdmin()) await navigateTo(`/admin/appointments`)

const appointments = ref([])

const newAppointment = reactive({
  date: '',
  time: ''
})

const fullyBookedDateTimes = [
  new Date(new Date().setDate(new Date().getDate() + 1)),
  new Date(new Date().setDate(new Date().getDate() + 2)),
  new Date(new Date().setDate(new Date().getDate() + 3)),
  new Date(new Date().setDate(new Date().getDate() + 4)),
]

appointments.value = await useFetch('/api/appointments', {
  method: 'GET'
}).then(res => {
  if (!res || res.data.value?.statusCode !== 200) { console.error(res); return [] }
  const appointments = res.data.value.body as {
    id: number,
    counselorName: string,
    appointmentDateTime: Date,
    status: 0 | 1 | 2
  }[]

  return appointments.map(appointment => {
    return {
      dateTime: appointment.appointmentDateTime,
      with: appointment.counselorName,
      status: appointment.status
    }
  })
}).catch(err => {
  console.error(err)
  return []
})

async function makeAppointment() {
  if (!newAppointment.date || !newAppointment.time || newAppointment.time === '') return alert("Please pick a date and Time before submitting")

  const dateTime = new Date(newAppointment.date)
  dateTime.setHours(parseInt(newAppointment.time.split(':')[0]))
  dateTime.setMinutes(parseInt(newAppointment.time.split(':')[1]))

  const response = await useFetch('/api/appointments', {
    method: 'POST',
    body: {
      dateTime
    }
  })

  if (!response || response.data.value?.statusCode !== 200) return console.error(response)

  const appointment = response.data.value.body

  appointments.value.push({
    dateTime: appointment.dateTime,
    with: appointment.counselor,
    status: false
  })

  newAppointment.date = ''
  newAppointment.time = ''

  alert('Appointment booked successfully')
}

onMounted(() => {
  const datePicker = new datepicker('#datePicker', {
    format: 'yyyy-mm-dd',
    minDate: new Date(),
    maxDate: new Date(new Date().setDate(new Date().getDate() + 60)),
    dateSelected: fullyBookedDateTimes.includes(new Date()) ? null : new Date(),
    disabledDates: fullyBookedDateTimes,
    noWeekends: true,
    onSelect: (instance: any, date: string) => {
      newAppointment.date = new Date(date).toISOString().split('T')[0]
    }
  })
})
</script>
<style scoped lang="scss">
@import "datepicker.min.css";

.formbold-mb-5 {
  margin-bottom: 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  padding-left: 5rem;
  margin-bottom: 2rem;
  margin-top: 0.5rem;
  background-image: url("/images/appointment-bg.jpg");
  background-size: contain;
  background-position-x: 100%;
  background-repeat: no-repeat;
}

.wrapper h1 {
  margin-bottom: 1em;
  color: black;
  font-size: large;
  font-weight: bold;
  width: fit-content;
  padding: 10px;
  border-radius: 5px;
  background-color: rgba(127, 143, 182, 0.5);
}

.form-container {
  margin: 0 auto;
  margin-left: 0;
  max-width: 550px;
  width: 100%;
  background: rgba(127, 143, 182, 0.5);
  padding: 20px;
  border-radius: 10px;
}


.upcoming {
  margin: 0 auto;
  margin-left: 0;
  min-width: 300px;
  background: rgba(127, 143, 182, 0.5);
  padding: 20px;
  border-radius: 10px;
}

.form-label {
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #07074d;
  margin-bottom: 12px;
}


select.form-label {
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
  background-color: var(--accent);
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

.upcoming .card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.upcoming .card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.upcoming .card-text {
  font-size: 16px;
  line-height: 1.5;
}

.holder {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>