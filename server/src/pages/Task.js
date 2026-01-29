import { useEffect, useState } from 'react';
import socket from '../../socket';

useEffect(() => {
  socket.on('taskUpdated', (task) => {
    setTasks(prev =>
      prev.map(t => t._id === task._id ? task : t)
    );
  });

  return () => socket.off('taskUpdated');
}, []);
