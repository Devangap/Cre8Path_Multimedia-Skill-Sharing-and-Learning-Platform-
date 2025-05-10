import React from 'react';

// Notification component
const Notification = ({ name, activity, time }) => {
  return (
    <div className="flex p-4 mt-4 bg-gray-100 rounded-lg mb-4 items-center">
      <div className="text-3xl mr-4">
       
      </div>
      
      <div className="flex-grow">
        <p className="m-0 text-lg"><strong>{name}</strong> {activity}</p>
        <small className="text-gray-500 text-xs">{time}</small>
      </div>
      
    </div>
  );
};

// Sample notifications data
const notifications = [
  { name: 'Thinal', activity: 'shared a new Learning Plan.', time: '1 day ago' },
  { name: 'Devanga', activity: 'created a new Learning Plan.', time: '4 hours ago' },
  { name: 'Thinal', activity: 'commented on a Post.', time: '4 hours ago' },
  { name: 'Hinesha', activity: 'Reacted on a Post.', time: '3 hours ago' },
  { name: 'Thinal', activity: 'shared a Learning Progress.', time: '3 hours ago' },
  { name: 'Thinal', activity: 'Reacted on a Post.', time: '4 hours ago' },
  { name: 'Suchindu', activity: 'shared a new Post.', time: '3 hours ago' },
  { name: 'Suchindu', activity: 'commented on a Post.', time: '3 hours ago' }
];

// Main component rendering the notifications list
const NotificationsList = () => {
  return (
    <div className="max-w-xl mx-auto  p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.map((notif, index) => (
        <Notification 
          key={index} 
          name={notif.name} 
          activity={notif.activity} 
          time={notif.time} 
        />
      ))}
    </div>
  );
};

export default NotificationsList;
