import styled from "styled-components";
import {Modal} from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
    overflow: hidden;
    max-height: 80vh;
  }
  .ant-modal-header {
    width: 97%;
    background-color: #f0f0f0;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .ant-modal-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }
  .ant-modal-body {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column; 
  }
  .ant-form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .ant-form-item {
    margin-bottom: 15px; 
    width: 100%; 
  }
  .ant-form-item-label {
    flex-shrink: 0; 
    width: 180px;
    text-align: right; 
    margin-right: 10px; 
  }
  .ant-form-item-control-input {
    flex-grow: 1; 
  }
  .ant-upload-list-item-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;