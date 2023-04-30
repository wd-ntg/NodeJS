import studentService from '../../service/student/studentService';

const studentPage = (req, res) => {
    return res.render('student/student.ejs');
};

const bookingPage = async (req, res) => {
    let schedule = await studentService.getAllSchedule(req, res);
    let timeType = await studentService.getTimeType(req, res);
    //console.log(schedule);
    return res.render('student/booking/booking.ejs', { data: schedule, timeType: timeType, message: '' });
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
    console.log(schedule);
    return res.render('student/booking/booking.ejs', { data: schedule, timeType: timeType, message: message });
};

const contactStudent = async (req, res) => {
    return res.render('student/contact/contact.ejs');
};
const newsStudent = async (req, res) => {
    return res.render('student/news/news.ejs');
};

export default { studentPage, bookingPage, viewDetailRoomForStudent, bookingConfirm, contactStudent, newsStudent };
