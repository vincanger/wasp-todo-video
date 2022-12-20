import './Main.css';
import React from 'react';
import waspLogo from './waspLogo.png';
import { useQuery } from '@wasp/queries'; // Wasp uses a thin wrapper around react-query
import getTasks from '@wasp/queries/getTasks';
import logout from '@wasp/auth/logout.js';
import useAuth from '@wasp/auth/useAuth.js';
import createTask from '@wasp/actions/createTask';
import updateTask from '@wasp/actions/updateTask';

const MainPage = () => {
  const { data: user } = useAuth();
  const { data: tasks, isLoading, error } = useQuery(getTasks);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <main>
      <img src={waspLogo} alt='wasp logo' />
      <h1>
        {user.username}
        {`'s tasks ✅`}
      </h1>
      <NewTaskForm />
      {tasks.length ? (
        <div className='tasklist'>
          {tasks.map((tsk, idx) => (
            <Todo task={tsk} number={idx} key={idx} />
          ))}
        </div>
      ) : (
        <p>No tasks yet.</p>
      )}
      <button onClick={logout}> Logout </button>
    </main>
  );
};

const Todo = ({ task, number }) => {
  const handleIsDoneChange = async (event) => {
    try {
      await updateTask({ id: task.id, isDone: event.target.checked })
    } catch (error) {
      window.alert('Error: ' + error?.message);
    }
  };

  return (
    <div>
      <span>
        {number + 1}
        {''}
      </span>
      <input 
        type='checkbox'
        id={task.id.toString()} 
        checked={task.isDone} 
        onChange={handleIsDoneChange} 
        />
      <span>{task.description}</span>{' '}
    </div>
  );
};

const NewTaskForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const description = event.currentTarget.description.value;
      event.currentTarget.reset();
      await createTask({ description });
    } catch (error) {
      window.alert('Error: ' + error?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='description' type='text' defaultValue='' />
      <input type='submit' value='Create task' />
    </form>
  );
};

export default MainPage;
