import pool from '../../config/connectDB';
import adminroomPracService from '../../service/admin/adminRoomPracService';
import adminRoomLabService from '../../service/admin/adminRoomLabService';

// Room Prac

const createNewroomPrac = async (req, res) => {
    let { name, code, roleid, description, specialty, maxStudent, img } = req.body;

    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';
    if (room[0]) {
        error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
        let data = { name, code: '', roleid: 'TH', description, specialty, maxStudent, img };
        return res.render('admin/room/errorRoomPrac.ejs', { data: data, error: error });
    } else {
        adminroomPracService.createNewroomPracService(req, res);
        return room;
    }
};

const deleteroomPrac = async (req, res) => {
    let error = await adminroomPracService.deleteroomPracService(req, res);
    let data = await adminroomPracService.getAllroomPrac();

    return res.render('admin/room/roomPrac.ejs', { data: data, error: error });
};

const editroomPrac = async (req, res) => {
    adminroomPracService.editroomPracService(req, res);
};

const postEditRoomPrac = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;
    let [currentRoom] = await pool.execute('select * from room where id = ?', [id]);
    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';

    if (room[0]) {
        if (currentRoom[0].code !== code) {
            error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
            let data = { roleid: 'TH', name, code: '', description, specialty, max_student: maxStudent, id };
            return res.render('admin/room/editRoomPrac.ejs', { data: data[0], error: error });
        }
    }
    adminroomPracService.postEditRoomService(req, res);
};

// Room Lab

const createNewroomLab = async (req, res) => {
    let { name, code, description, specialty, maxStudent } = req.body;

    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';
    if (room[0]) {
        error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
        let data = { roleid: 'TN', name, code: '', description, specialty, maxStudent };
        return res.render('admin/room/errorRoomLab.ejs', { data: data, error: error });
    } else {
        adminRoomLabService.createNewroomLabService(req, res);
    }
};

const deleteroomLab = async (req, res) => {
    adminRoomLabService.deleteroomLabService(req, res);
};

const editroomLab = async (req, res) => {
    adminRoomLabService.editroomLabService(req, res);
};

const postEditRoomLab = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;
    let [currentRoom] = await pool.execute('select * from room where id = ?', [id]);
    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';

    if (room[0]) {
        if (currentRoom[0].code !== code) {
            error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
            let data = { name, code: '', description, specialty, max_student: maxStudent, id };
            return res.render('admin/room/editRoomLab.ejs', { data: data, error: error });
        }
    }
    adminRoomLabService.postEditRoomService(req, res);
};

// Device

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
    postEditRoomPrac,
    createNewroomLab,
    deleteroomLab,
    editroomLab,
    postEditRoomLab,
    createNewDevice,
    deleteDevice,
    editDevice,
    postEditDevice,
};
