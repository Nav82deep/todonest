// src/components/SecondaryTasks.js
import React from 'react';

const SecondaryTasks = ({ tasks, setTasks }) => {
  const handleTaskComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isCompleted = !updatedTasks[index].isCompleted;
    updatedTasks[index].steps.forEach(step => (step.isCompleted = updatedTasks[index].isCompleted));
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
    <div className="secondary-tasks">
      <h3>Secondary Tasks</h3>
      <ul>
        {tasks.map((task, taskIndex) => (
          <li key={taskIndex} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleTaskComplete(taskIndex)}
              />
              <span className="task-name">{task.name}</span>
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

export default SecondaryTasks;