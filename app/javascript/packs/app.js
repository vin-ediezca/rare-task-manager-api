import Vue from 'vue';
import draggable from 'vuedraggable';
import Api from './api';

document.addEventListener("DOMContentLoaded", () => {
  var app = new Vue({
    el: '#app',
    components: {
      draggable
      // 'task': {
      //   props: ['task'],
      //   template: 
      //   `
      //     <div class="ui segment task"
      //       v-bind:class="task.completed ? 'done' : 'todo' ">
      //       <div class="ui grid">
      //         <div class="left floated twelve wide column">
      //           <div class="ui checkbox">
      //             <input type="checkbox" name="task" v-on:click="this.$parent.toggleDone($event, task.id)" :checked="task.completed" >
      //             <label>{{ task.name }} <span class="description">{{ task.description }}</span></label>
      //           </div>
      //         </div>
      //         <div class="right floated three wide column">
      //           <i class="icon pencil blue" alt="Edit" v-on:click="$parent.editTask($event, task.id)"></i>
      //           <i class="icon trash red" alt="Delete" v-on:click="$parent.deleteTask($event, task.id)"></i>
      //         </div>
      //       </div>
      //     </div>
      //   `
      // }
    },
    data: {
      tasks: [],
      todoTasksList: [],
      completedTasksList: [],
      task: {},
      message: '',
      action: 'create'
    },
    computed: {
      // completedTasks: function() {
      //   return this.tasks.filter(item => item.completed == true);
      // },

      // todoTasks: function() {
      //   return this.tasks.filter(item => item.completed == false);
      // }
    },
    methods: {
      listTasks: function() {
        const tasksApi = new Api();
        tasksApi.listTasks().then(function(response) {
          app.tasks = response;
        })
      },

      completedTasks: function() {
        const completedApi = new Api();
        completedApi.listTasks().then(function(response) {
          app.completedTasksList = response.filter(item => item.completed == true);
        })
      },

      todoTasks: function() {
        const todoApi = new Api();
        todoApi.listTasks().then(function(response) {
          app.todoTasksList = response.filter(item => item.completed == false);
        })
      },

      clear: function() {
        event.stopImmediatePropagation();

        this.task = {};
        this.action = 'create';
        this.message = '';
      },

      toggleDone: function(event, id) {
        event.stopImmediatePropagation();

        let task = this.tasks.find(item => item.id == id);
        
        if (task) {
          task.completed = !task.completed;
          this.task = task;

          const updateApi = new Api(this.task);
          updateApi.updateTask().then(function(response) {
            // app.listTasks();
            app.completedTasks();
            app.todoTasks();
            app.clear();
            let status = response.completed ? 'completed' : 'in progress';
            app.message = `Task ${response.id} is ${status}.`;
          })
        }
      },

      createTask: function(event) {
        event.stopImmediatePropagation();
        let completed = this.completedTasksList;
        let todo = this.todoTasksList;
        let tasks = [];

        if (!this.task.completed) {
          this.task.completed = false;

          for(var i = 0; i<todo.length; i++) {
            todo[i].order = i+1;
          };

          tasks = todo;
        } else {
          this.task.completed = true;

          for(var i = 0; i<completed.length; i++) {
            completed[i].order = i+1;
          };

          tasks = completed;
        };
        
        const createApi = new Api(this.task);
        createApi.createTask().then(function(response) {
          app.saveOrder(tasks);
          app.clear();
          app.message = `Task ${response.id} created.`;
        });
      },

      editTask: function(event, id) {
        event.stopImmediatePropagation();

        this.action = 'edit';

        let task = this.tasks.find(item => item.id == id);

        if (task) {
          this.task = { id: id,
                        name: task.name,
                        description: task.description,
                        completed: task.completed };
        }
      },

      updateTask: function(event) {
        event.stopImmediatePropagation();

        const updateApi = new Api(this.task);
        updateApi.updateTask().then(function(response) {
          // app.listTasks();
          app.completedTasks();
          app.todoTasks();
          app.clear();
          app.message = `Task ${response.id} updated.`;
        })
      },

      deleteTask: function(event, id) {
        event.stopImmediatePropagation();

        if (confirm("Are you sure?")) {
          // let taskIndex = this.tasks.findIndex(item => item.id == id);
          let task = this.tasks.find(item => item.id == id);

          // if (taskIndex > -1) {
          if (task) {
            const deleteApi = new Api(task);
            deleteApi.deleteTask(task).then(function(response) {
              // app.$delete(app.tasks, taskIndex);
              app.listTasks();
              app.completedTasks();
              app.todoTasks();
              app.message = `Task ${id} deleted.`;
            });
          }
        }
      },

      onUpdate: function() {
        let completed = this.completedTasksList;
        let todo = this.todoTasksList;

        for(var i = 0; i<completed.length; i++) {
          completed[i].order = i;
        };

        for(var i = 0; i<todo.length; i++) {
          todo[i].order = i;
        };

        this.saveOrder(completed);
        this.saveOrder(todo);
      },

      saveOrder: function(tasks) {
        var instance = [];
        for(var i = 0; i<tasks.length; i++) {
          instance[i] = new Api(tasks[i]);
          instance[i].updateTask();
        };

        this.listTasks();
        this.completedTasks();
        this.todoTasks();
      }

      // checkMove: function(e) {
      //   window.console.log("Future index: " + e.draggedContext.futureIndex);
      // }
    },

    beforeMount() { 
      this.listTasks();
      this.completedTasks();
      this.todoTasks();
    }
  })
});