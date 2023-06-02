import pool from '../../config/connectDB';
import studentService from '../../service/student/studentService';

const studentPage = async (req, res) => {
    let [user] = await pool.execute('select * from student where email = ?', [email]);

    return res.render('student/student.ejs', { data: user[0] });
};

const bookingPage = async (req, res) => {
    let schedule = await studentService.getAllSchedule(req, res);
    let timeType = await studentService.getTimeType(req, res);

    return res.render('student/booking/booking.ejs', {
        data: schedule,
        timeType: timeType,
        message: '',
        studentID: req.query.id,
    });
};

const viewDetailRoomForStudent = async (req, res) => {
    let data = await studentService.getDetailroomPrac(req, res);
    let device = await studentService.getAllDevice(req, res);

    return res.render('student/detailRoomForStudent.ejs', { data: data[0], device: device });
};

const bookingConfirm = async (req, res) => {
    let message = await studentService.bookingConfirm(req, res);

    let schedule = await studentService.getAllSchedule(req, res);
    let timeType = await studentService.getTimeType(req, res);

    return res.render('student/booking/booking.ejs', {
        data: schedule,
        timeType: timeType,
        message: message.message,
        studentID: message.studentID,
    });
};

const contactStudent = async (req, res) => {
    return res.render('student/contact/contact.ejs', { studentID: req.query.id });
};
const newsStudent = async (req, res) => {
    return res.render('student/news/news.ejs', { studentID: req.query.id });
};

const historyStudent = async (req, res) => {
    let email = req.query.email;
    // console.log(req.query);
    // console.log(req.query.id);
    // let [data] = await pool.execute(
    //     `SELECT *, historyStudent.*, allcode.keyName
    //     FROM historyStudent
    //     JOIN allcode ON historyStudent.schedule = allcode.code
    //     WHERE email = ?
    //     `,
    //     [email],
    // );

    let [query] = await pool.execute(
        `SELECT *, IF(allcode.code = historyStudent.schedule, allcode.keyName, historyStudent.schedule) AS modifiedSchedule
        FROM historyStudent
        JOIN allcode ON allcode.code = historyStudent.schedule
        WHERE email = ?
        `,
        [email],
    );
    let error = '';
    return res.render('student/history/history.ejs', {
        // data: data,
        error: error,
        studentID: req.query.id,
        sortType: 'none',
        searchType: 'name',
        data: query,
        roomPrac: false,
        error: '',
        email: email,
    });
};

const studentInfo = async (req, res) => {
    let { id } = req.body;

    let [user] = await pool.execute('select * from student where id = ?', [id]);

    return res.render('student/student.ejs', { data: user[0] });
};

// const searchStudentHistory = async (req, res) => {
//     const keyword = req.body.keyword;

//     // let email = req.body.email[0];
//     // console.log('email: ', email);
//     let email = req.body.email;

//     console.log('email: ', email);
//     // let [data] = await pool.execute('SELECT * from historyStudent where email = ?', [email]);

//     const [query] = await pool.execute(
//         `SELECT * FROM historyStudent WHERE email LIKE '%${email}%' AND object LIKE '%${keyword}%'`,
//     );

//     //let [room] = await pool.execute('select * from room where code = ?', [code]);

//     //console.log('keywơrd: ', query);
//     return res.render('student/history/history.ejs', {
//         data: query[0],
//         roomPrac: false,
//         error: '',
//         studentID: req.query.id,
//     });

// };

// const searchStudentHistory = async (req, res) => {
//     const sortType = req.body.sortType;
//     const searchType = req.body.searchType;
//     const keyword = req.body.keyword;
//     const code = req.body.code;

//     let email = req.body.email;

//     console.log(email);

//     //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

//     let query;

//     if (sortType !== 'none') {
//         if (sortType === 'timestudy') {
//             // const [time, date] = keyword.split(' ');
//             // const [day, month, year] = date.split('/');
//             // const searchDate = `${day}-${month}-${year}`;

//             // [query] = await pool.execute(
//             //     `SELECT history.*
//             //     FROM history
//             //     WHERE DATE(history.time) = ? ORDER BY history.time DESC
//             //   `,
//             //     [searchDate],
//             // );
//             // [query] = await pool.execute(`SELECT history.*
//             // FROM history
//             // ORDER BY STR_TO_DATE(SUBSTRING_INDEX(history.time, ' ', -1), '%d/%m/%Y') ASC
//             // `);

//             [query] = await pool.execute(`SELECT historystudent.*
//             FROM historystudent
//             ORDER BY STR_TO_DATE(historystudent.timestudy, '%d/%m/%Y') DESC
//             `);
//         } else {
//             // Xử lý tìm kiếm và sắp xếp theo các trường khác
//             [query] = await pool.execute(
//                 `SELECT historystudent.*
//                     FROM historystudent
//                     WHERE historystudent.${searchType} LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
//                     `,
//                 [email],
//             );
//         }
//     } else {
//         if (searchType === 'timestudy') {
//             [query] = await pool.execute(`
//     SELECT historystudent.*
//     FROM historystudent
//     WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(historystudent.timestudy, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%'
// `);
//         } else if (searchType === 'timelogin') {
//             [query] = await pool.execute(`
//     SELECT historystudent.*
//     FROM historystudent
//     WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(historystudent.timestudy, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%'
// `);
//         } else {
//             [query] = await pool.execute(
//                 `SELECT historystudent.*
//                     FROM historystudent
//                     WHERE historystudent.${searchType} LIKE '%${keyword}%'
//                     `,
//             );
//         }
//     }
//     return res.render('student/history/history.ejs', {
//         sortType: 'none',
//         searchType: 'name',
//         data: query,
//         roomPrac: false,
//         error: '',
//         studentID: req.body.id,
//     });
// };
const searchStudentHistory = async (req, res) => {
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;
    // console.log(req.body);
    let email = req.body.email;

    //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

    let query;

    if (sortType !== 'none') {
        if (sortType === 'timestudy') {
            [query] = await pool.execute(
                `SELECT *
            FROM historystudent
            JOIN allcode ON allcode.code = historystudent.schedule WHERE historystudent.email = ? AND historystudent.${searchType} LIKE '%${keyword}%' 
            ORDER BY STR_TO_DATE(historystudent.timestudy, '%d/%m/%Y') DESC 
            `,
                [email],
            );
        } else if (sortType === 'timelogin') {
            [query] = await pool.execute(
                `SELECT *
                FROM historystudent
                JOIN allcode ON allcode.code = historystudent.schedule
                WHERE historystudent.email = ? 
                  AND historystudent.${searchType} LIKE '%${keyword}%' 
                ORDER BY STR_TO_DATE(historystudent.timelogin, '%H:%i:%s %d/%m/%Y') DESC;                
            `,
                [email],
            );
        } else if (searchType === 'timelogin') {
            [query] = await pool.execute(
                `
            SELECT *
            FROM historystudent
            JOIN allcode ON allcode.code = historystudent.schedule
    WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(historystudent.timelogin, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
`,
                [email],
            );
        } else if (searchType === 'schedule') {
            [query] = await pool.execute(
                `SELECT *
                FROM historyStudent
                JOIN allcode ON allcode.code = historyStudent.schedule
                    WHERE historystudent.${searchType} LIKE '%${keyword}%' OR allcode.keyName LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
                    `,
                [email],
            );
        } else if (sortType === 'schedule' && searchType === 'schedule') {
            if (keyword === '') {
                [query] = await pool.execute(
                    `SELECT *
                    FROM historyStudent
                    JOIN allcode ON allcode.code = historyStudent.schedule
                        WHERE historystudent.${searchType} LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
                        `,
                    [email],
                );
            } else {
                [query] = await pool.execute(
                    `SELECT *
                    FROM historyStudent
                    JOIN allcode ON allcode.code = historyStudent.schedule
                        WHERE historystudent.${searchType} LIKE '%${keyword}%' OR allcode.keyName LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
                        `,
                    [email],
                );
            }
        } else {
            // Xử lý tìm kiếm và sắp xếp theo các trường khác
            [query] = await pool.execute(
                `SELECT *
                FROM historyStudent
                JOIN allcode ON allcode.code = historyStudent.schedule
                    WHERE historystudent.${searchType} LIKE '%${keyword}%' AND historystudent.email = ? ORDER BY historystudent.${sortType}
                    `,
                [email],
            );
            console.log(searchType);
        }
    } else {
        if (searchType === 'timestudy') {
            [query] = await pool.execute(
                `
            SELECT *, IF(allcode.code = historyStudent.schedule, allcode.keyName, historyStudent.schedule) AS modifiedSchedule
            FROM historyStudent
            JOIN allcode ON allcode.code = historyStudent.schedule
    WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(historystudent.timestudy, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%' AND historystudent.email = ?
`,
                [email],
            );
        } else if (searchType === 'timelogin') {
            [query] = await pool.execute(
                `
            SELECT *
            FROM historyStudent
            JOIN allcode ON allcode.code = historyStudent.schedule
    WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(historystudent.timelogin, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%' AND historystudent.email = ?
`,
                [email],
            );
            console.log(searchType);
        } else if (searchType === 'schedule') {
            [query] = await pool.execute(
                `SELECT *, IF(allcode.code = historyStudent.schedule, allcode.keyName, historyStudent.schedule) AS modifiedSchedule
                FROM historyStudent
                JOIN allcode ON allcode.code = historyStudent.schedule
                    WHERE allcode.keyName LIKE '%${keyword}%' AND historystudent.email = ?
                    `,
                [email],
            );
        } else {
            [query] = await pool.execute(
                `SELECT *, IF(allcode.code = historyStudent.schedule, allcode.keyName, historyStudent.schedule) AS modifiedSchedule
                FROM historyStudent
                JOIN allcode ON allcode.code = historyStudent.schedule
                    WHERE historystudent.${searchType} LIKE '%${keyword}%' AND historystudent.email = ?
                    `,
                [email],
            );
        }
    }
    return res.render('student/history/history.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: query,
        roomPrac: false,
        error: '',
        studentID: req.body.id,
        email: email,
    });
};
export default {
    studentPage,
    bookingPage,
    viewDetailRoomForStudent,
    bookingConfirm,
    contactStudent,
    newsStudent,
    historyStudent,
    studentInfo,
    searchStudentHistory,
};
