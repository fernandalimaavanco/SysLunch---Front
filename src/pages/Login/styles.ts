import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme['gray-900']};
`;

export const Form = styled.form`
  background-color: ${({ theme }) => theme['gray-800']};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative;

  > img {
    position: absolute;
    top: -5%;
    right: 50%;
    z-index: 2;
    transform: translate(50%, 5%);
  }
`;

export const Title = styled.h1`
  text-align: center;
  color: ${({ theme }) => theme['gray-200']};
  margin-bottom: 1.5rem;
`;

export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme['gray-300']};
  background-color: ${({ theme }) => theme['gray-100']};
  color: ${({ theme }) => theme['gray-900']};
  
  &:focus {
    border-color: ${({ theme }) => theme['green-500']};
    outline: none;
  }

`;

export const EyeIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme['gray-900']};
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme['yellow-500']};
  color: ${({ theme }) => theme['yellow-900']};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme['yellow-600']};
  }
`;