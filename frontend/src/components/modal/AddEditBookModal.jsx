import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {addBook, updateBook} from "../../queries/books";
import {StyledModal} from "./StyledModal";

const GENRES = [
    {value: 'NOVEL', label: 'Роман'},
    {value: 'POEMS', label: 'Стихи'},
    {value: 'FANTASY', label: 'Фентези'},
    {value: 'SCIENTIFIC', label: 'Научная литература'},
    {value: 'TALE', label: 'Сказка'},
    {value: 'BIOGRAPHY', label: 'Биография'},
    {value: 'OTHER', label: 'Другое'},
];

const AddEditBookModal = ({visible, onCancel, book, onSave}) => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [additionalFileList, setAdditionalFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (book) {
            const initialImage = book.imageLink ? {url: book.imageLink, uid: '-1', name: 'main_image'} : null;
            const initialAdditionalImages = book.additionalImagesLinks
                ? book.additionalImagesLinks.map((url, index) => ({
                    url: url,
                    uid: `old-${index}`, // Unique uids for existing images
                    name: `additional_image_${index}`,
                }))
                : [];

            form.setFieldsValue({
                ...book,
                image: initialImage ? [initialImage] : [],
                additionalImages: initialAdditionalImages,
            });
            setFile(initialImage);
            setAdditionalFileList(initialAdditionalImages); //  Set the state here!
        } else {
            form.resetFields(); // Clear form when adding new book
            setFile(null);
            setAdditionalFileList([]);
        }
    }, [book, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        setError(null);
        try {
            let data;
            if (!book) {
                data = await addBook(values, file, additionalFileList, setIsLoading, setError);
                if (data) {
                    onSave(data);
                }
            } else {
                data = await updateBook(book, values, file, additionalFileList, setIsLoading, setError);
                if (data) {
                    onSave(data);
                }
            }

            if (data) {
                onCancel();
            }
        } catch (error) {
            message.error(`Произошла ошибка: ${error.message}`);
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelModal = () => {
        if (!book) { // Сбрасываем только при добавлении книги
            form.resetFields();
            setFile(null);
            setAdditionalFileList([]);
        }
        onCancel(); // Вызываем onCancel после сброса
    };

    const handleAfterCloseModal = () => {
        if (!book) { // Сбрасываем только при добавлении книги
            form.resetFields();
            setFile(null);
            setAdditionalFileList([]);
        }
    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Вы можете загружать только файлы JPG или PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Размер файла должен быть меньше 2 МБ!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleImageChange = ({file}) => {
        if (file.status === 'removed') {
            setFile(null);
            form.setFieldsValue({image: []});
            return;
        }

        if (beforeUpload(file)) {
            setFile(file);
            form.setFieldsValue({image: [file]});
        } else {
            setFile(null);
            form.setFieldsValue({image: []});
        }
    };

    const handleAdditionalImagesChange = ({file, fileList}) => {
        if (file.status === 'removed') {
            setAdditionalFileList(fileList);
            form.setFieldsValue({additionalImages: fileList});
            return;
        }

        if (beforeUpload(file)) {
            setAdditionalFileList(fileList);
            form.setFieldsValue({additionalImages: fileList});
        } else {
            const filteredFileList = fileList.filter(item => item.uid !== file.uid);
            setAdditionalFileList(filteredFileList);
            form.setFieldsValue({additionalImages: filteredFileList});
        }
        console.log(additionalFileList);
    };

    return (
        <StyledModal
            title={book ? "Редактировать книгу" : "Добавить книгу"}
            visible={visible}
            onCancel={handleCancelModal}
            afterClose={handleAfterCloseModal}
            footer={[
                <Button key="back" onClick={onCancel}>Отмена</Button>,
                <Button key="submit" type="primary" form="add-edit-book-form" htmlType="submit">Сохранить</Button>,
            ]}
            width={700}
        >
            <Form
                form={form}
                name="add-edit-book-form"
                id="add-edit-book-form"
                onFinish={onFinish}
                initialValues={{...(book || {}), image: [], additionalImages: []}}
            >
                <Form.Item label="Название" name="title">
                    <Input/>
                </Form.Item>
                <Form.Item label="Автор" name="author">
                    <Input/>
                </Form.Item>
                <Form.Item label="Жанр" name="genre">
                    <Select placeholder="Выберите жанр">
                        {GENRES.map((genre) => (
                            <Select.Option key={genre.value} value={genre.value}>
                                {genre.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Количество страниц" name="pages">
                    <InputNumber min={1}/>
                </Form.Item>
                <Form.Item label="ISBN" name="isbn">
                    <Input/>
                </Form.Item>
                <Form.Item label="Год публикации" name="publicationYear">
                    <InputNumber min={1000} max={new Date().getFullYear()}/>
                </Form.Item>
                <Form.Item label="Изображение" name="image" valuePropName="fileList">
                    <Upload
                        name="image"
                        listType="picture"
                        beforeUpload={beforeUpload}
                        fileList={file ? [file] : []} // Используем одно изображение
                        onChange={handleImageChange}
                        maxCount={1} // Ограничение на одно изображение
                        customRequest={({onSuccess}) => {
                            onSuccess("ok");
                        }}
                    >
                        <Button icon={<UploadOutlined/>}>Загрузить</Button>
                    </Upload>
                </Form.Item>
                <Form.Item label="Количество" name="amount">
                    <InputNumber min={1}/>
                </Form.Item>
                <Form.Item label="Цена" name="price">
                    <InputNumber min={0} step={0.01}/>
                </Form.Item>
                <Form.Item label="Доп. изображения" name="additionalImages" valuePropName="fileList">
                    <Upload
                        name="additionalImages"
                        listType="picture"
                        multiple={true}
                        beforeUpload={beforeUpload}
                        fileList={additionalFileList}
                        onChange={handleAdditionalImagesChange}
                        customRequest={({onSuccess}) => onSuccess("ok")}
                    >
                        <Button icon={<UploadOutlined/>}>Загрузить</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </StyledModal>
    );
};

export default AddEditBookModal;