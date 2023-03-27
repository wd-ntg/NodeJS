import pool from '../../config/connectDB';
import manageStudentService from '../../service/admin/manageStudentService';
import adminroomPracService from '../../service/admin/adminRoomPracService';
import scheduleService from '../../service/admin/scheduleService';

const adminPage = (req, res) => {
    return res.render('admin/admin.ejs');
};

const roomPracPage = async (req, res) => {
    let data = await adminroomPracService.getAllroomPrac();

    return res.render('admin/room/roomPrac.ejs', { data: data, roomPrac: false });
};

const roomTNPage = (req, res) => {
    return res.render('admin/room/roomPrac.ejs');
};

const calendarPage = (req, res) => {
    return res.render('admin/calendar.ejs');
};

const historyPage = (req, res) => {
    return res.render('admin/history.ejs');
};

const schedulePage = async (req, res) => {
    let schedule = await scheduleService.getAllSchedule(req, res);
    //console.log(schedule);
    return res.render('admin/schedule/schedule.ejs', { data: schedule, error: '' });
};

const manageStudentPage = async (req, res) => {
    let data = await manageStudentService.getAllStudent();
    //console.log('check data', data);

    return res.render('admin/student/manageStudent.ejs', { data: data });
};

const detailroomPracPage = async (req, res) => {
    let data = await adminroomPracService.getDetailroomPrac(req, res);
    let device = await adminroomPracService.getAllDevice(req, res);

    return res.render('admin/room/detailRoomPrac.ejs', { data: data[0], device: device });
};

export default {
    adminPage,
    roomPracPage,
    roomTNPage,
    calendarPage,
    historyPage,
    manageStudentPage,
    detailroomPracPage,
    schedulePage,
};
