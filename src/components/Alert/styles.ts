import styled from 'styled-components';

export const AlertContainer = styled.div<{ type: 'warning' | 'success' | 'danger' | null }>`
  position: absolute;
  right: 10px;
  width: max-content;
  padding: 16px;
  z-index: 2;
  border-radius: 4px;
  margin: 20px 0;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: ${({ type }) => {
    switch (type) {
      case 'warning':
        return '#ff9800';
      case 'success':
        return '#4caf50';
      case 'danger':
        return '#f44336';
      default:
        return '#000';
    }
  }};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;