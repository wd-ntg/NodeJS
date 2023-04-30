import { getAllStudent } from '../service/adminService';
import { getAllRoomTH } from '../service/adminTHService';
import { createNewRoomTHService } from '../service/adminTHService';
import { deleteRoomTHService } from '../service/adminTHService';
import { editRoomTHService } from '../service/adminTHService';
import { postEditRoomService, detailRoomTHService } from '../service/adminTHService';

const adminPage = (req, res) => {
    return res.render('admin/admin.ejs');
};

const roomTHPage = async (req, res) => {
    let data = await getAllRoomTH();
    return res.render('admin/roomTH.ejs', { data: data, roomTH: false });
};

const roomTNPage = (req, res) => {
    return res.render('admin/roomTN.ejs');
};

const calendarPage = (req, res) => {
    return res.render('admin/calendar.ejs');
};

const historyPage = (req, res) => {
    return res.render('admin/history.ejs');
};

const manageStudentPage = async (req, res) => {
    let data = await getAllStudent();
    return res.render('admin/manageStudent.ejs', { data: data, student: false });
};

const detailRoomTH = async (req, res) => {
    detailRoomTHService(req, res);
};

const createNewRoomTH = async (req, res) => {
    //console.log('check data', req.body)
    createNewRoomTHService(req, res);
};

const deleteRoomTH = async (req, res) => {
    deleteRoomTHService(req, res);
};

const editRoomTH = async (req, res) => {
    editRoomTHService(req, res);
};

const postEditRoom = async (req, res) => {
    postEditRoomService(req, res);
};

const adminController = {
    adminPage: adminPage,
    roomTHPage: roomTHPage,
    roomTNPage: roomTNPage,
    calendarPage: calendarPage,
    historyPage: historyPage,
    manageStudentPage: manageStudentPage,
    createNewRoomTH: createNewRoomTH,
    deleteRoomTH: deleteRoomTH,
    editRoomTH: editRoomTH,
    postEditRoom: postEditRoom,
    detailRoomTH: detailRoomTH,
};

export default adminController;
