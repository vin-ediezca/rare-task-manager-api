import axios from 'axios';

export function listTasks() {
  return axios.get('/tasks.json').then(function(response) {
    return response.data;
  })
}

export function createTask(task) {
  var localTask = task;

  return axios.post('/tasks.json', localTask).then(function(response) {
    return response.data;
  }).catch(function(error) {
    console.log(error);
  })
}

export function updateTask(task) {
  var taskId = task.id;
  var localTask = { name: task.name,
                    description: task.description,
                    completed: task.completed,
                    order: task.order }

  return axios.put(`/tasks/${taskId}.json`, localTask).then(function(response) {
    return response.data;
  }).catch(function(error) {
    console.log(error);
    alert(`Request failed for task id: ${taskId}`);
  })
}

export function deleteTask(task_id) {
  return axios.delete(`/tasks/${task_id}.json`).then(function(response) {
    return 'success';
  }).catch(function(error) {
    console.log(error);
  })
}

export function changeOrder(task_id) {
  return axios.put(`/tasks/${task_id}.json`).then(function(response) {
    return 'success';
  }).catch(function(error) {
    console.log(error);
  })
}