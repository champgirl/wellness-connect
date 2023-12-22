<script setup lang="ts">


const chats = ref([])

const response = await useFetch('/api/chat/flagged').then(res => {
  if (!res || res.data.value?.statusCode !== 200) {
    console.error(res);
    return []
  }
  const chats = res.data.value.body
  return chats
}).catch(err => {
  console.error(err)
  return []
})

chats.value = response
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h1>Flagged</h1>
        <p>These are the flagged chats</p>
        <table class="table">
          <thead>
          <tr>
            <th>Student Name</th>
            <th>Reg Number</th>
            <th>Contact</th>
            <th>Created At</th>
            <th>Is Reviewed</th>
            <th>Is Flagged</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="chat in chats" :key="chat.id">
            <td>{{ chat.studentName }}</td>
            <td>{{ chat.reg_no }}</td>
            <td>{{ chat.contact }}</td>
            <td>{{ chat.createdAt }}</td>
            <td>{{ chat.isReviewed }}</td>
            <td>{{ chat.isFlagged }}</td>
            <td>
              <NuxtLink class="btn btn-warn" :to="`/flagged/${chat.id}`">Review</NuxtLink>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
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
    padding: 0.5rem 1rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border: none;
    outline: none;
    margin: 0.5rem;
    color: #fff;
    background-color: #7f8fb6;
    border-color: #7f8fb6;

    &:hover {
      background-color: #5e6a8d;
      border-color: #5e6a8d;
    }
  }

  .btn-warn {
    background-color: #f6ad55;
    border-color: #f6ad55;

    &:hover {
      background-color: #dd6b20;
      border-color: #dd6b20;
    }
  }
}
</style>
