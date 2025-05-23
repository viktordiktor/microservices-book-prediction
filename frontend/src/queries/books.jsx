import {message} from 'antd';

export const fetchBooks = async (pageNumber, pageSize) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/books?pageSize=${pageSize}&pageNumber=${pageNumber}`); // Updated URL
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getBookById = async(bookId) => {
    const response = await fetch(`http://localhost:8010/proxy/api/v1/books/${bookId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const addBook = async (values, file, additionalFileList, setIsLoading, setError) => {
    setIsLoading(true);
    setError(null);
    try {
        const formData = new FormData();
        const createBookRequest = {
            title: values.title,
            author: values.author,
            genre: values.genre,
            pages: values.pages,
            isbn: values.isbn,
            publicationYear: values.publicationYear,
            amount: values.amount,
            price: values.price,
        };

        formData.append('createBookRequest', new Blob([JSON.stringify(createBookRequest)], { type: 'application/json' }));

        if (file) {
            formData.append('image', file.originFileObj);
        }

        additionalFileList.forEach(file => {
            if (file.originFileObj) {
                formData.append('additionalImages', file.originFileObj);
            }
        });

        const response = await fetch('http://localhost:8010/proxy/api/v1/books', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Книга успешно добавлена!');
        return data; // Возвращаем данные добавленной книги
    } catch (error) {
        message.error(`Произошла ошибка при добавлении книги: ${error.message}`);
        console.error("Error adding book:", error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};

export const updateBook = async (book, values, file, additionalFileList, setIsLoading, setError) => {
    setIsLoading(true);
    setError(null);
    try {
        const formData = new FormData();
        const existingImageLinks = [];
        const filesToUpload = [];

        additionalFileList.forEach(file => {
            if (file.url) {
                existingImageLinks.push(file.url);
            } else if (file.originFileObj) {
                filesToUpload.push(file.originFileObj);
            }
        });

        const editBookRequest = {
            title: values.title,
            author: values.author,
            genre: values.genre,
            pages: values.pages,
            isbn: values.isbn,
            publicationYear: values.publicationYear,
            amount: values.amount,
            price: values.price,
            imageLink: file.url,
            additionalImagesLinks: existingImageLinks
        };

        formData.append('editBookRequest', new Blob([JSON.stringify(editBookRequest)], { type: 'application/json' }));

        if (file) {
            formData.append('image', file.originFileObj);
        }

        filesToUpload.forEach(file => {
            formData.append('additionalImages', file);
        });

        const response = await fetch(`http://localhost:8010/proxy/api/v1/books/${book.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Network response was not ok';
            throw new Error(errorMessage);
        }

        const data = await response.json();
        message.success('Книга успешно обновлена!');
        return data; // Возвращаем данные обновленной книги
    } catch (error) {
        message.error(`Произошла ошибка при обновлении книги: ${error.message}`);
        console.error("Error updating book:", error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};

// Запрос для получения прогнозируемых данных с пагинацией и сортировкой
export const getOrderForecasts = async (
    pageNumber = 0,
    pageSize = 10,
    sortField = 'id',
    sortType = 'asc'
) => {
    const url = new URL(`http://localhost:8010/proxy/api/v1/books/forecast/all`);
    url.searchParams.append('pageNumber', pageNumber);
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('sortField', sortField);
    url.searchParams.append('sortType', sortType);

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// Запрос для экспорта прогнозируемых данных в Excel
export const exportForecastsToExcel = async () => {
    const response = await fetch(
        `http://localhost:8010/proxy/api/v1/books/forecast/excel-export`
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Обрабатываем ответ как blob (бинарные данные)
    const blob = await response.blob();

    // Создаем ссылку для скачивания
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'generated_forecasts.xlsx');
    document.body.appendChild(link);
    link.click();

    // Очищаем
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
};