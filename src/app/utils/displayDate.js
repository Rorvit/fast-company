const displayDate = (createdAt) => {
    console.log("CREATED_AT,", createdAt);
    const timeDiff = Date.now() - Number(createdAt);
    const dateOfCreate = new Date(Number(createdAt));
    console.log("dateOfCreate", dateOfCreate);
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    const timeConfig = [
        { start: -Infinity, end: 60, message: "1 минуту назад" },
        { start: 61, end: 300, message: "5 минут назад" },
        { start: 301, end: 600, message: "10 минут назад" },
        { start: 601, end: 1800, message: "30 минут назад" },
        {
            start: 1800,
            end: 86400,
            message: `${dateOfCreate.getHours()}:${dateOfCreate.getMinutes()}`
        },
        {
            start: 86400,
            end: 315360,
            message: `${dateOfCreate.getDate()} ${
                months[dateOfCreate.getMonth()]
            }`
        },
        {
            start: 315360,
            end: Infinity,
            message: `${dateOfCreate.getDate()} ${
                months[dateOfCreate.getMonth()]
            } ${dateOfCreate.getFullYear()}`
        }
    ];
    console.log(
        timeConfig.filter(
            (config) =>
                timeDiff / 1000 > config.start && timeDiff / 1000 <= config.end
        )[0].message
    );
    return timeConfig.filter(
        (config) =>
            timeDiff / 1000 > config.start && timeDiff / 1000 <= config.end
    )[0].message;
};
export default displayDate;
