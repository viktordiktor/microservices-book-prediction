import {message} from "antd";

export const addForecast = async (values) => {
    try {
        const response = await fetch('http://localhost:8010/proxy/api/v1/forecast', {
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
        message.success('Прогноз успешно сформирован!');
        return data;
    } catch (error) {
        message.error(`Произошла ошибка при добавлении продажи: ${error.message}`);
        console.error("Error adding sell:", error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

export const getForecastById = async(forecastId) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/forecast/${forecastId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchForecasts = async (pageNumber, pageSize) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/forecast?pageSize=${pageSize}&pageNumber=${pageNumber}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};