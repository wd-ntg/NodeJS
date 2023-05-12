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
    let [data] = await pool.execute('SELECT * from historyStudent where email = ?', [email]);

    let error = '';
    return res.render('student/history/history.ejs', { data: data, error: error, studentID: req.query.id });
};

const studentInfo = async (req, res) => {
    let { id } = req.body;

    let [user] = await pool.execute('select * from student where id = ?', [id]);

    return res.render('student/student.ejs', { data: user[0] });
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
};
