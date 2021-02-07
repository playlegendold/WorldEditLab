export const sendNotification = (message, status, duration) => {
  let icon = '';
  switch (status) {
    case 'success':
      icon = 'fa-check';
      break;
    case 'error':
      icon = 'fa-times';
      break;
    case 'warning':
      icon = 'fa-exclamation';
      break;
    case 'info':
    default:
      icon = 'fa-info';
  }

  const notification = document.createElement('div');
  notification.className = `notification ${status ? status : 'info'}`;

  const notificationIconBox = document.createElement('div');
  notificationIconBox.className = 'notification-icon';
  const notificationIcon = document.createElement('i');
  notificationIcon.className = `fas ${icon}`;
  notificationIconBox.append(notificationIcon);
  notification.append(notificationIconBox);

  const notificationContent = document.createElement('div');
  notificationContent.className = 'notification-content';
  notificationContent.innerText = message;
  notification.append(notificationContent);

  document.querySelector('.notification-box').append(notification);
  setTimeout(() => {
    notification.remove();
  }, duration ? duration : 6000);
};

export const sendSuccessNotification = (message) => {
  sendNotification(message, 'success', 2000);
}

export const sendErrorNotification = (message) => {
  sendNotification(message, 'error', 4000);
}
