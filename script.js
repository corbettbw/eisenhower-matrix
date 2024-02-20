let todoChart;
let tasks = [];
let completedTasks = [];

document.addEventListener('DOMContentLoaded', function() {
      // Load tasks from localStorage on page load
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  todoChart = new Chart(document.getElementById('todoChart'), {
    type: 'scatter',
    data: {
      datasets: []
    },
    options: {
      aspectRatio: 1, // Makes the chart square
      scales: {
        x: {
          title: {
            display: true,
            text: 'Due Date'
          },
          min: 0,
          max: 10,
          ticks: { display: false },
          grid: getGridOptions()
        },
        y: {
          title: {
            display: true,
            text: 'Importance'
          },
          min: 0,
          max: 10,
          ticks: { display: false },
          grid: getGridOptions()
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return tasks[context.dataIndex].description;
            }
          }
        }
      }
    }
  });

  drawQuadrantLines();
  updateChart();
  updateTaskList();
});

function getGridOptions() {
  return {
    color: (context) => context.tick.value === 5 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
    lineWidth: (context) => context.tick.value === 5 ? 2 : 1
  };
}

function drawQuadrantLines() {
  const ctx = todoChart.ctx;
  const xAxis = todoChart.scales['x'];
  const yAxis = todoChart.scales['y'];
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(xAxis.left, yAxis.getPixelForValue(5));
  ctx.lineTo(xAxis.right, yAxis.getPixelForValue(5));
  ctx.moveTo(xAxis.getPixelForValue(5), yAxis.top);
  ctx.lineTo(xAxis.getPixelForValue(5), yAxis.bottom);
  ctx.stroke();
  ctx.restore();
}

function addItem() {
  const taskName = getValue('taskName');
  const taskDescription = getValue('taskDescription');
  const dueDate = parseInt(getValue('dueDate'));
  const importance = parseInt(getValue('importance'));
  
  if (isNaN(dueDate) || isNaN(importance) || dueDate < 0 || dueDate > 10 || importance < 0 || importance > 10) {
      alert('Please enter valid due date (1-10) and importance (1-10) values.');
      return;
    }
    
    const newItem = {
        name: taskName,
        description: taskDescription,
        x: dueDate,
        y: importance
    };
    
    tasks.push(newItem);
    updateChart();
    updateTaskList();
    saveTasks(); // Save tasks to localStorage after adding a new task
    clearForm()
}

function updateChart() {
  todoChart.data.datasets = [{
    label: 'Tasks',
    data: tasks.map(task => ({ x: task.x, y: task.y })),
    pointBackgroundColor: 'blue',
    pointBorderColor: 'blue',
    pointRadius: 8,
    pointHoverRadius: 10,
    pointHoverBackgroundColor: 'orange',
    pointHoverBorderColor: 'orange'
  }];
  todoChart.update();
}

function updateTaskList() {
  const taskList = document.getElementById('taskList');
  prioritizeTasks(tasks);
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>${task.name}</span><button onclick="completeTask(${index})">Complete</button>`;
    taskList.appendChild(listItem);
  });

  completedTasks.forEach((task) => {
    listItem = document.createElement('li');
    listItem.innerHTML = `<span><s>${task[0].name}</s></span>`;
    taskList.appendChild(listItem);
  })

}

function completeTask(index) {
  completedTasks.push(tasks.splice(index, 1));
  updateChart();
  updateTaskList();
  saveTasks(); // Save tasks to localStorage after completing a task
}

function clearForm() {
  ['taskName', 'taskDescription', 'dueDate', 'importance'].forEach(id => setValue(id, ''));
}

function getValue(id) {
  return document.getElementById(id).value;
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function saveTasks() {
    // Save tasks array to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function prioritizeTasks(tasks) {
    tasks.sort((a,b) => {
        return a.x - b.x;
    })
}