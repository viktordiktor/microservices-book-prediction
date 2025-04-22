import {message} from "antd";

export const fetchOrders = async (pageNumber, pageSize, sortField, sortType) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/orders?pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${sortField}&sortType=${sortType}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const addOrder = async (values) => {
    try {
        const response = await fetch('http://localhost:8010/proxy/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values), // Send the entire values object
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Продажа успешно добавлена!');
        return data;
    } catch (error) {
        message.error(`Произошла ошибка при добавлении продажи: ${error.message}`);
        console.error("Error adding order:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

export const updateOrder = async (values) => {
    try {
        const response = await fetch(`http://localhost:8010/proxy/api/v1/orders/${values.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Продажа успешно обновлена!');
        return data;
    } catch (error) {
        message.error(`Произошла ошибка при обновлении продажи: ${error.message}`);
        console.error("Error updating order:", error);
        throw error; // Re-throw the error
    }
};

/**
 * Скачивание шаблона Excel
 * @returns {Promise<Blob>} Возвращает Blob с файлом шаблона
 */
export const downloadExcelTemplate = async () => {
    const response = await fetch('http://localhost:8010/proxy/api/v1/orders/template', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
};

/**
 * Загрузка файла Excel для импорта
 * @param {File} file - Файл Excel для импорта
 * @returns {Promise<Object>} Ответ сервера
 */
export const uploadExcelFile = async (file) => {
    const formData = new FormData();
    formData.append('uploadExcelFile', file);

    const response = await fetch('http://localhost:8010/proxy/api/v1/orders/file', {
        method: 'POST',
        body: formData,
        // Не нужно явно указывать Content-Type для FormData - браузер сам установит с boundary
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const processOrder = async (orderId) => {

    const response = await fetch(`http://localhost:8010/proxy/api/v1/orders/process/${orderId}`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};