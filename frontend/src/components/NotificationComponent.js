import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

const NotificationComponent = ({ togglePanel }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notifications/1');
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        client.subscribe('/topic/notifications/1', (message) => {
          const newNotification = JSON.parse(message.body);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            newNotification
          ]);
        });
      },
      onStompError: (frame) => {
        console.error('Error occurred: ', frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const timeAgo = (timestamp) => {
    const currentTime = new Date();
    const notificationTime = new Date(timestamp);
    const difference = currentTime - notificationTime;
    const hours = Math.floor(difference / (1000 * 60 * 60));
    return hours === 0 ? 'Just now' : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <div
      className="fixed top-0 right-0 w-1/4 h-full bg-white shadow-lg z-50 p-5 overflow-y-auto"
    >
      <button
        onClick={togglePanel}
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800"
      >
        X
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
          <ul className="space-y-4">
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification) => (
                <li key={notification.id} className="flex flex-col border-2  p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <p className="text-base text-gray-800">{notification.message}</p>
                  <small className="text-sm text-gray-500">{timeAgo(notification.createdAt)}</small>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No notifications available</li>
            )}
      </ul>
    </div>
  );
};

export default NotificationComponent;
