import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #4a90e2, #9013fe);
  background-size: cover;
  background-repeat: no-repeat;
  overflow-y: auto; /* Разрешаем скролл */
  scrollbar-width: none; /* Для Firefox */
  &::-webkit-scrollbar {
    display: none; /* Для Chrome/Safari */
  }
`;