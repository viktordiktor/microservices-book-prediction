import styled from "styled-components";

export const AddButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #28a745; /* Green */
  color: white;
  transition: background-color 0.3s ease;
  font-family: 'Consolas', sans-serif;
  margin-left: auto; /* Push to the right */
  align-self: flex-end; /* Align to the right edge */

  &:hover {
    background-color: #218838;
  }
`;