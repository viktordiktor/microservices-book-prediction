import {message} from 'antd';

// api/sells.js

/**
 * Скачивание шаблона Excel
 * @returns {Promise<Blob>} Возвращает Blob с файлом шаблона
 */
export const downloadExcelTemplate = async () => {
    const response = await fetch('http://localhost:8010/proxy/api/v1/sells/template', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
};

export const deleteSell = async (sellId) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells/${sellId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Для 204 No Content не пытаемся парсить тело ответа
    if (response.status !== 204) {
        return await response.json();
    }
    return null; // или просто return;
};

/**
 * Загрузка файла Excel для импорта
 * @param {File} file - Файл Excel для импорта
 * @returns {Promise<Object>} Ответ сервера
 */
export const uploadExcelFile = async (file) => {
    const formData = new FormData();
    formData.append('uploadExcelFile', file);

    const response = await fetch('http://localhost:8010/proxy/api/v1/sells/file', {
        method: 'POST',
        body: formData,
        // Не нужно явно указывать Content-Type для FormData - браузер сам установит с boundary
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const fetchSells = async (pageNumber, pageSize, sortField, sortType) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells?pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${sortField}&sortType=${sortType}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getSellByBookIdAndDates = async (bookId, startDate, endDate) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells/book/days/${bookId}?fromDate=${startDate}&toDate=${endDate}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const getSellByAuthorAndDates = async (authorName, startDate, endDate) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells/author/${authorName}?fromDate=${startDate}&toDate=${endDate}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


export const getSellByGenreAndDates = async (genreName, startDate, endDate) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells/genre/${genreName}?fromDate=${startDate}&toDate=${endDate}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const addSell = async (values) => {
    try {
        const response = await fetch('http://localhost:8010/proxy/api/v1/sells', {
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
        console.error("Error adding sell:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

export const updateSell = async (values) => {
    try {
        const response = await fetch(`http://localhost:8010/proxy/api/v1/sells/${values.id}`, {
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
        console.error("Error updating sell:", error);
        throw error; // Re-throw the error
    }
};