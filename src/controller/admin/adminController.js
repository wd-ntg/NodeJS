import pool from '../../config/connectDB';
import adminService from '../../service/admin/manageStudentService';
import adminroomPracService from '../../service/admin/adminRoomPracService';

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

const manageStudentPage = async (req, res) => {
    let data = await adminService.getAllStudent();
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
};
