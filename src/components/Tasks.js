import React, { useState } from 'react';

const Tasks = ({ tasks, setTasks , saveTasks}) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: '', steps: [] });

  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditedTask(tasks[index]);
  };

  const handleSaveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editedTask;
    setTasks(updatedTasks);
    saveTasks();
    setEditIndex(null);
  };

  const handleDeleteTask = (index) => {
    const confirmation = window.confirm('Are you sure you want to delete this task?');
    if (confirmation) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    }
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, name: e.target.value });
  };

  const handleTaskComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    if (updatedTasks[index].isCompleted) {
      updatedTasks[index].steps.forEach(step => (step.isCompleted = true));
    } else {
      updatedTasks[index].steps.forEach(step => (step.isCompleted = false));
    }
    setTasks(updatedTasks);
  };

  const handleStepComplete = (taskIndex, stepIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].steps[stepIndex].isCompleted = !updatedTasks[taskIndex].steps[stepIndex].isCompleted;
    const allStepsCompleted = updatedTasks[taskIndex].steps.every(step => step.isCompleted);
    updatedTasks[taskIndex].isCompleted = allStepsCompleted;
    setTasks(updatedTasks);
  };

  return (
    <div className="tasks-list">
      <h2>All Tasks</h2>
      <ul>
        {tasks.map((task, taskIndex) => (
          <li key={taskIndex} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleTaskComplete(taskIndex)}
              />
              {editIndex === taskIndex ? (
                <div className="edit-task">
                  <input
                    type="text"
                    value={editedTask.name}
                    onChange={handleChange}
                    placeholder="Edit task name"
                  />
                  <button onClick={() => handleSaveTask(taskIndex)}>Save</button>
                  <button onClick={() => setEditIndex(null)}>Cancel</button>
                </div>
              ) : (
                <span className="task-name">{task.name}</span>
              )}
              <div className="task-actions">
                <button onClick={() => handleEditTask(taskIndex)}>Edit</button>
                <button onClick={() => handleDeleteTask(taskIndex)}>Delete</button>
              </div>
            </div>
            <ul className="steps-list">
              {task.steps.map((step, stepIndex) => (
                <li key={stepIndex} className={`step-item ${step.isCompleted ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={step.isCompleted}
                    onChange={() => handleStepComplete(taskIndex, stepIndex)}
                  />
                  <span className="step-name">{step.name}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;