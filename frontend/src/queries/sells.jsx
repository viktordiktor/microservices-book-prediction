import {message} from 'antd';

export const fetchSells = async (pageNumber, pageSize) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/sells?pageSize=${pageSize}&pageNumber=${pageNumber}`);
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