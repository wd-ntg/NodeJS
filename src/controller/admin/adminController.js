import pool from '../../config/connectDB';
import manageStudentService from '../../service/admin/manageStudentService';
import adminroomPracService from '../../service/admin/adminRoomPracService';
import adminRoomLabService from '../../service/admin/adminRoomLabService';
import scheduleService from '../../service/admin/scheduleService';
import e, { request } from 'express';

const loginPage = (req, res) => {
    return res.render('admin/login.ejs');
};

const submitUser = async (req, res) => {
    let { email, password, roleId } = req.body;

    let [user] = await pool.execute('select * from student where email = ?', [email]);

    if (!user[0]) {
        3;
        return res.render('login.ejs', { err: 'Địa chỉ email không tồn tại. Vui lòng nhập lại!', errpass: '' });
    } else {
        if (user[0].password !== password) {
            return res.render('login.ejs', { err: '', errpass: 'Mật khẩu không chính xác. Vui lòng nhập lại!' });
        } else {
            if (user[0].roleId === 'R1') {
                // return res.render('admin/history.ejs');
                return res.render('admin/admin.ejs', { data: user[0], err: '', errpass: '' });
            } else {
                return res.render('student/student.ejs', { data: user[0], err: '', errpass: '' });
            }
        }
    }
};
const updateAcc = async (req, res) => {
    let { email, password, password_new, password_confirm } = req.body;

    let [user] = await pool.execute('select * from student where email = ?', [email]);

    if (!user[0]) {
        3;
        return res.render('changepass.ejs', {
            err: 'Địa chỉ email không tồn tại. Vui lòng nhập lại!',
            errpass: '',
            errconfirm: '',
        });
    } else {
        if (user[0].password !== password) {
            return res.render('changepass.ejs', {
                err: '',
                errpass: 'Mật khẩu không chính xác. Vui lòng nhập lại!',
                errconfirm: '',
            });
        } else {
            if (password_new !== password_confirm) {
                // return res.render('admin/history.ejs');
                return res.render('changepass.ejs', {
                    data: user[0],
                    err: '',
                    errpass: '',
                    errconfirm: 'Mật khẩu xác nhận không chính xác. Vui lòng nhập lại!',
                });
            } else {
                await pool.execute('update student set  password=? where email = ?', [password_new, email]);
                return res.render('login.ejs', { data: user[0], err: '', errpass: '', errconfirm: '' });
            }
        }
    }
};

const updatePage = async (req, res) => {
    res.render('changepass.ejs', { err: '', errpass: '', errconfirm: '' });
};

const roomPracPage = async (req, res) => {
    let data = await adminroomPracService.getAllroomPrac();

    return res.render('admin/room/roomPrac.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: data,
        roomPrac: false,
        error: '',
    });
};

const roomLabPage = async (req, res) => {
    let data = await adminRoomLabService.getAllroomLab();
    return res.render('admin/room/roomLab.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: data,
        roomPrac: false,
        error: '',
    });
};

const calendarPage = (req, res) => {
    return res.render('admin/calendar.ejs');
};

const historyPage = async (req, res) => {
    let [data, fields] = await pool.execute('SELECT * from history');

    let error = '';

    return res.render('admin/history.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: data,
        roomPrac: false,
        error: '',
    });
};

const schedulePage = async (req, res) => {
    let schedule = await scheduleService.getAllSchedule(req, res);
    //console.log(schedule);
    return res.render('admin/schedule/schedule.ejs', { data: schedule, error: '' });
};

const manageStudentPage = async (req, res) => {
    let data = await manageStudentService.getAllStudent();
    //console.log('check data', data);

    return res.render('admin/student/manageStudent.ejs', { sortType: 'none', searchType: 'name', data: data });
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
    return res.render('login.ejs', { err: '', errpass: '', errconfirm: '' });
};

const adminPage = async (req, res) => {
    return res.render('admin/admin.ejs');
};

const statisPage = async (req, res) => {
    let rooms = await scheduleService.getAllRoom(req, res);
    return res.render('admin/statis.ejs', {
        rooms,
        data: [],
        errRoomEmpty: '',
        resultStatis: [],
        roomMaxCount: '',
        maxCount: 0,
        query: [],
        room: '',
        time: '',
        date: '',
        roomDescription: '',
    });
};

export default {
    loginPage,
    roomPracPage,
    roomLabPage,
    calendarPage,
    statisPage,
    historyPage,
    manageStudentPage,
    detailroomPracPage,
    detailroomLabPage,
    schedulePage,
    formLogin,
    submitUser,
    adminPage,
    updateAcc,
    updatePage,
};
