import axios from 'axios';

class Api {
  constructor(task) {
    this.task = task;
  }

  listTasks() {
    return axios.get('/tasks.json')
      .then(function(response) {
        return response.data;
      })
  }

  createTask() {
    var localTask = this.task;

    return axios.post('/tasks.json', localTask)
      .then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.log(error);
      })
  }

  updateTask() {
    var task = this.task;
    var localTask = { name: task.name,
                      description: task.description,
                      completed: task.completed,
                      order: task.order }

    return axios.put(`/tasks/${task.id}.json`, localTask)
      .then(function(response) {
        return response.data;
      }).catch(function(error) {
        console.log(error);
        alert(`Request failed for task id: ${task.id}`);
      })
  }

  deleteTask() {
    var taskId = this.task.id;

    return axios.delete(`/tasks/${taskId}.json`)
      .then(function(response) {
        return 'success';
      }).catch(function(error) {
        console.log(error);
      })
  }
}

export default Api;