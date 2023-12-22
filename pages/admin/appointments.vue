<template>
    <Title>Admin</Title>
    <div class="container">
        <table class="table">
            <thead>
            <tr>
                <th scope="col">Appointment ID</th>
                <th scope="col">Student Name</th>
                <th scope="col">Counselor Name</th>
                <th scope="col">Appointment Date</th>
                <th scope="col">Appointment Time</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="appointment in appointments" :key="appointment.id">
                <th scope="row">{{ appointment.id }}</th>
                <td>{{ appointment.studentName }}</td>
                <td>{{ appointment.counselorName }}</td>
                <td>{{ appointment.appointmentDate }}</td>
                <td>{{ appointment.appointmentTime }}</td>
                <td v-if="appointment.status === 0">Pending</td>
                <td v-else-if="appointment.status === 1">Approved</td>
                <td v-else-if="appointment.status === 2">Rejected</td>
                <td>
                    <button class="btn btn-success" @click="approveAppointment(appointment.id)">Approve</button>
                    <button class="btn btn-danger" @click="rejectAppointment(appointment.id)">Reject</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped lang="scss">
    .container {
        margin-top: 50px;

        // fancy table
        .table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            max-width: 100%;
            margin-bottom: 1rem;
            background-color: transparent;
            border: 1px solid #dee2e6;

            th,
            td {
                padding: 0.75rem;
                vertical-align: top;
                border-top: 1px solid #dee2e6;
            }

            thead th {
                vertical-align: bottom;
                border-bottom: 2px solid #dee2e6;
            }

            tbody + tbody {
                border-top: 2px solid #dee2e6;
            }

            .table {
                background-color: #fff;

                th,
                td {
                    border-bottom: 1px solid #dee2e6;
                }
            }

            tr {
                background-color: #fff;
                border-top: 1px solid #dee2e6;

                &:nth-child(even) {
                    background-color: rgba(127, 143, 182, 0.1);
                }

                &:hover {
                    background-color: rgba(127, 143, 182, 0.4);
                }
            }
        }

        // buttons
        .btn {
            display: inline-block;
            font-weight: 400;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            background-color: transparent;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
            border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

            &:hover {
                color: #212529;
                text-decoration: none;
            }

            &.btn-success {
                color: #fff;
                background-color: #28a745;
                border-color: #28a745;

                &:hover {
                    color: #fff;
                    background-color: #218838;
                    border-color: #1e7e34;
                }
            }

            &.btn-danger {
                color: #fff;
                background-color: #dc3545;
                border-color: #dc3545;

                &:hover {
                    color: #fff;
                    background-color: #c82333;
                    border-color: #bd2130;
                }
            }
        }
    }
</style>
<script setup lang="ts">
const appointments = ref([])

const approveAppointment = async (id: string) => {
    const response = await useFetch('/api/approveAppointment', {
        method: 'POST',
        body: {
            id: id
        }
    })
        .then(
            (res) => res.data.value ?? null
        )
        .catch((err) => {
            console.error(err)
            return null
        })
    if (!response) return
    if (response.statusCode !== 200) {
        console.error(response)
        return
    }
    console.log(response)
    window.location.reload()
}

const rejectAppointment = async (id: string) => {
    const response = await useFetch('/api/rejectAppointment', {
        method: 'POST',
        body: {
            id: id
        }
    })
        .then(
            (res) => res.data.value ?? null
        )
        .catch((err) => {
            console.error(err)
            return null
        })
    if (!response) return
    if (response.statusCode !== 200) {
        console.error(response)
        return
    }
    console.log(response)
    window.location.reload()
}

appointments.value = await useFetch('/api/adminAppointments').then(res => {
    if (!res || res.data.value?.statusCode !== 200) { console.error(res.data.value); return [] }
    const appointments = res.data.value.body as {
        id: string,
        counselorName: string,
        studentName: string,
        appointmentDateTime: String,
        status: 0 | 1 | 2
    }[]
    console.log(appointments)
    return appointments.map(appointment => {
        return {
            id: appointment.id,
            counselorName: appointment.counselorName,
            studentName: appointment.studentName,
            appointmentDate: new Date(appointment.appointmentDateTime).toLocaleDateString(),
            appointmentTime: new Date(appointment.appointmentDateTime).toLocaleTimeString(),
            status: appointment.status
        }
    })
}).catch(err => {
    console.error(err)
    return []
})
</script>