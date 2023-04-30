import pool from '../../config/connectDB';
import manageStudentService from '../../service/admin/manageStudentService';
import adminroomPracService from '../../service/admin/adminRoomPracService';
import adminRoomLabService from '../../service/admin/adminRoomLabService';
import scheduleService from '../../service/admin/scheduleService';
import { request } from 'express';

const loginPage = (req, res) => {
    return res.render('admin/login.ejs');
};

const submitUser = async (req, res) => {
    let { email, password } = req.body;

    let [user] = await pool.execute('select * from student where email = ?', [email]);

    if (!user[0]) {
        return res.send('Dia chi email khong ton tai');
    } else {
        if (user[0].password !== password) {
            return res.send('Mat khau khong chinh xac, vui long nhap lai');
        } else {
            if (user[0].roleId === 'R1') {
                return res.render('admin/history.ejs');
            } else {
                res.render('student/student.ejs', { data: user[0] });
            }
        }
    }
};

const roomPracPage = async (req, res) => {
    let data = await adminroomPracService.getAllroomPrac();

    return res.render('admin/room/roomPrac.ejs', { data: data, roomPrac: false, error: '' });
};

<<<<<<< HEAD
const roomLabPage = async (req, res) => {
    let data = await adminRoomLabService.getAllroomLab();
    return res.render('admin/room/roomLab.ejs', { data: data, roomLab: false });
=======
const roomLabPage = (req, res) => {
    return res.render('admin/room/roomLab.ejs');
>>>>>>> 3d3576591fab2a3d09bfcf2ef8300d1c248c22e7
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

const detailroomLabPage = async (req, res) => {
    let data = await adminRoomLabService.getDetailroomLab(req, res);
    let device = await adminRoomLabService.getAllDevice(req, res);

    return res.render('admin/room/detailRoomLab.ejs', { data: data[0], device: device });
};

const formLogin = async (req, res) => {
    return res.render('login.ejs');
};

export default {
    loginPage,
    roomPracPage,
    roomLabPage,
    calendarPage,
    historyPage,
    manageStudentPage,
    detailroomPracPage,
    detailroomLabPage,
    schedulePage,
<<<<<<< HEAD
    formLogin,
=======
    submitUser,
>>>>>>> 3d3576591fab2a3d09bfcf2ef8300d1c248c22e7
};
