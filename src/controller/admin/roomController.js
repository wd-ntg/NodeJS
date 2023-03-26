import pool from '../../config/connectDB';
import adminroomPracService from '../../service/admin/adminRoomPracService';

const createNewroomPrac = async (req, res) => {
    let { name, code, description, specialty, maxStudent } = req.body;

    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';
    if (room[0]) {
        error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
        let data = { name, code: '', description, specialty, maxStudent };
        return res.render('admin/room/errorRoom.ejs', { data: data, error: error });
    } else {
        adminroomPracService.createNewroomPracService(req, res);
    }
};

const deleteroomPrac = async (req, res) => {
    adminroomPracService.deleteroomPracService(req, res);
};

const editroomPrac = async (req, res) => {
    adminroomPracService.editroomPracService(req, res);
};

const postEditRoom = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;
    let [currentRoom] = await pool.execute('select * from room where id = ?', [id]);
    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';

    if (room[0]) {
        if (currentRoom[0].code !== code) {
            error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
            let data = { name, code: '', description, specialty, max_student: maxStudent, id };
            return res.render('admin/room/editRoom.ejs', { data: data, error: error });
        }
    }
    adminroomPracService.postEditRoomService(req, res);
};

const createNewDevice = async (req, res) => {
    adminroomPracService.createNewDeviceService(req, res);
};

const deleteDevice = async (req, res) => {
    adminroomPracService.deleteDeviceService(req, res);
};

const editDevice = async (req, res) => {
    adminroomPracService.editDeviceService(req, res);
};

const postEditDevice = async (req, res) => {
    adminroomPracService.postEditDeviceService(req, res);
};

export default {
    createNewroomPrac,
    deleteroomPrac,
    editroomPrac,
    postEditRoom,
    createNewDevice,
    deleteDevice,
    editDevice,
    postEditDevice,
};
