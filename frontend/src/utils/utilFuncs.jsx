export function getDates() {
    const today = new Date(); // Текущая дата

    // endDate - текущая дата в формате 'YYYY-MM-DD'
    const endDate = today.toISOString().slice(0, 10);

    // Вычисляем startDate - месяц назад от текущей даты
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const startDateString = startDate.toISOString().slice(0, 10);


    return { startDate: startDateString, endDate };
}