import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Notification as NotificationType } from '../../types';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ 
  tipo: NotificationType['tipo']; 
  isExiting: boolean 
}>`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  min-width: 300px;
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  
  animation: ${props => props.isExiting 
    ? css`${slideOut} 0.3s ease-in-out forwards`
    : css`${slideIn} 0.3s ease-in-out`
  };

  ${props => {
    switch (props.tipo) {
      case 'success':
        return `
          background: rgba(40, 167, 69, 0.9);
          border-color: rgba(40, 167, 69, 0.5);
        `;
      case 'error':
        return `
          background: rgba(220, 53, 69, 0.9);
          border-color: rgba(220, 53, 69, 0.5);
        `;
      case 'warning':
        return `
          background: rgba(255, 193, 7, 0.9);
          border-color: rgba(255, 193, 7, 0.5);
          color: #212529;
        `;
      case 'info':
        return `
          background: rgba(23, 162, 184, 0.9);
          border-color: rgba(23, 162, 184, 0.5);
        `;
    }
  }}

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
    min-width: auto;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const NotificationTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 12px 12px;
  animation: progress ${props => props.duration}ms linear;

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const duration = notification.duration || 5000;

  useEffect(() => {
    if (notification.autoHide !== false) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, notification.autoHide]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Durata dell'animazione di uscita
  };

  const getIcon = () => {
    switch (notification.tipo) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <NotificationContainer tipo={notification.tipo} isExiting={isExiting}>
      <NotificationHeader>
        <NotificationTitle>
          {getIcon()} {notification.titolo}
        </NotificationTitle>
        <CloseButton onClick={handleClose}>
          ×
        </CloseButton>
      </NotificationHeader>
      <NotificationMessage>
        {notification.messaggio}
      </NotificationMessage>
      {notification.autoHide !== false && (
        <ProgressBar duration={duration} />
      )}
    </NotificationContainer>
  );
};

// Container per gestire multiple notifiche
const NotificationsContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
  pointer-events: none;

  & > * {
    pointer-events: auto;
    margin-bottom: 10px;
  }
`;

interface NotificationManagerProps {
  notifications: NotificationType[];
  onClose: (id: string) => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  notifications, 
  onClose 
}) => {
  return (
    <NotificationsContainer>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </NotificationsContainer>
  );
};

export default Notification;