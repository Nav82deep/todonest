import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import PrimaryTasks from './PrimaryTasks';
import SecondaryTasks from './SecondaryTasks';
import Tasks from './Tasks';

const Home = ({ user }) => {
  const [primaryTasks, setPrimaryTasks] = useState([]);
  const [secondaryTasks, setSecondaryTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [steps, setSteps] = useState([]);
  const [taskType, setTaskType] = useState('primary');
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    loadTasks();
    const lastResetTime = localStorage.getItem('lastResetTime');
    const now = new Date().getTime();

    if (!lastResetTime || now - lastResetTime > 24 * 60 * 60 * 1000) {
      resetPrimaryTasks();
      localStorage.setItem('lastResetTime', now);
    }

    const interval = setInterval(() => {
      resetPrimaryTasks();
      localStorage.setItem('lastResetTime', new Date().getTime());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateTotalPercentage();
  }, [primaryTasks]);

  const calculateTotalPercentage = () => {
    const totalTasks = primaryTasks.length;
    const completedTasks = primaryTasks.filter(task => task.isCompleted).length;
    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setTotalPercentage(percentage);
  };

  const handleAddTask = () => {
    if (taskName.trim() === '') return;

    const newTask = {
      name: taskName,
      steps: steps.filter(step => step.name.trim() !== ''),
      isCompleted: false,
    };

    if (taskType === 'primary') {
      setPrimaryTasks([...primaryTasks, newTask]);
    } else {
      setSecondaryTasks([...secondaryTasks, newTask]);
    }

    setTaskName('');
    setSteps([]);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = { name: value, isCompleted: false };
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    if (steps.length === 0) {
      setSteps([{ name: '', isCompleted: false }, { name: '', isCompleted: false }]);
    } else {
      setSteps([...steps, { name: '', isCompleted: false }]);
    }
  };

  const saveTasks = async () => {
    try {
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        primaryTasks,
        secondaryTasks,
      });
      alert('Tasks saved successfully!');
    } catch (error) {
      console.error('Error saving tasks: ', error);
    }
  };

  const loadTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setPrimaryTasks(data.primaryTasks);
        setSecondaryTasks(data.secondaryTasks);
      });
    } catch (error) {
      console.error('Error loading tasks: ', error);
    }
  };

  const resetPrimaryTasks = () => {
    const resetTasks = primaryTasks.map(task => ({
      ...task,
      isCompleted: false,
      steps: task.steps.map(step => ({ ...step, isCompleted: false }))
    }));
    setPrimaryTasks(resetTasks);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="home-container">
      <header>
        <h1>समय का ख्याल (⚠️ Save Before Logout)</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>
      <div className="progress-container">
        <div className="progress-circle" style={{ background: `conic-gradient(#4CAF50 ${totalPercentage * 3.6}deg, #f0f0f0 0deg)` }}>
          <span className="progress-percentage">{totalPercentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className="task-form">
        <input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <div className="task-type-selector">
          <label>
            <input
              type="radio"
              value="primary"
              checked={taskType === 'primary'}
              onChange={() => setTaskType('primary')}
            />
            Primary Task
          </label>
          <label>
            <input
              type="radio"
              value="secondary"
              checked={taskType === 'secondary'}
              onChange={() => setTaskType('secondary')}
            />
            Secondary Task
          </label>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step.name}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          ))}
          <button onClick={handleAddStep}>+ Add Step</button>
        </div>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="tasks-container">
        <PrimaryTasks tasks={primaryTasks} setTasks={setPrimaryTasks} />
        <SecondaryTasks tasks={secondaryTasks} setTasks={setSecondaryTasks} />
      </div>
      <Tasks tasks={[...primaryTasks, ...secondaryTasks]} setTasks={(updatedTasks) => {
        const primaryCount = primaryTasks.length;
        setPrimaryTasks(updatedTasks.slice(0, primaryCount));
        setSecondaryTasks(updatedTasks.slice(primaryCount));
      }} />
      <div className="save-load-buttons">
        <button onClick={saveTasks}>Save Tasks</button>
        <button onClick={loadTasks}>Load Tasks</button>
      </div>
    </div>
  );
};

export default Home;
