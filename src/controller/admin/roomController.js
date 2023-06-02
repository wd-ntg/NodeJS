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

    return res.render('admin/room/roomPrac.ejs', { sortType: 'none', searchType: 'name', data: data, error: error });
};

const editroomPrac = async (req, res) => {
    adminroomPracService.editroomPracService(req, res);
};

const postEditRoomPrac = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;
    let [currentRoom] = await pool.execute('select * from room where id = ?', [id]);
    let [room] = await pool.execute('select * from room where code = ?', [code]);
    let error = '';

    let [schedule] = await pool.execute(`select * from schedule where roomCode =?`, [currentRoom[0].code]);

    if (room.length > 0) {
        if (currentRoom[0].code !== code) {
            error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
            let data = { roleid: 'TH', name, code: '', description, specialty, max_student: maxStudent, id };
            return res.render('admin/room/editRoomPrac.ejs', { data: data, error: error });
        } else {
            for (let i = 0; i < schedule.length; i++) {
                if (schedule[i].max_student > +maxStudent) {
                    error =
                        'Hiện tại đã có lịch học có số lượng sinh viên tối đa của phòng lớn hơn so với sức chứa của phòng, vui lòng kiểm tra lại!';
                    let data = { roleid: 'TH', name, code, description, specialty, max_student: '', id };
                    return res.render('admin/room/editRoomPrac.ejs', { data: data, error: error });
                }
            }
            adminroomPracService.postEditRoomService(req, res);
        }
    } else {
        for (let i = 0; i < schedule.length; i++) {
            if (schedule[i].max_student > +maxStudent) {
                error =
                    'Hiện tại đã có lịch học có số lượng sinh viên tối đa của phòng lớn hơn so với sức chứa của phòng, vui lòng kiểm tra lại!';
                let data = { roleid: 'TH', name, code, description, specialty, max_student: '', id };
                return res.render('admin/room/editRoomPrac.ejs', { data: data[0], error: error });
            }
        }
        adminroomPracService.postEditRoomService(req, res);
    }
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

const searchRoomPrac = async (req, res) => {
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;
    //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

    let query;

    if (sortType !== 'none') {
        [query] = await pool.execute(
            `SELECT room.*, allcode.keyName
                FROM room
                INNER JOIN allcode ON allcode.code = room.roleid
                WHERE room.${searchType} LIKE '%${keyword}%' AND room.roleid = ? ORDER BY room.${sortType}
                `,
            [code],
        );
    } else {
        [query] = await pool.execute(
            `SELECT room.*, allcode.keyName
                FROM room
                INNER JOIN allcode ON allcode.code = room.roleid
                WHERE room.${searchType} LIKE '%${keyword}%' AND room.roleid = ? 
                `,
            [code],
        );
    }

    return res.render('admin/room/roomPrac.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: query,
        roomPrac: false,
        error: '',
    });
};
const searchRoomLab = async (req, res) => {
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;
    //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

    let query;

    if (sortType !== 'none') {
        [query] = await pool.execute(
            `SELECT room.*, allcode.keyName
                FROM room
                INNER JOIN allcode ON allcode.code = room.roleid
                WHERE room.${searchType} LIKE '%${keyword}%' AND room.roleid = ? ORDER BY room.${sortType}
                `,
            [code],
        );
    } else {
        [query] = await pool.execute(
            `SELECT room.*, allcode.keyName
                FROM room
                INNER JOIN allcode ON allcode.code = room.roleid
                WHERE room.${searchType} LIKE '%${keyword}%' AND room.roleid = ? 
                `,
            [code],
        );
    }

    return res.render('admin/room/roomLab.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: query,
        roomPrac: false,
        error: '',
    });
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
    searchRoomPrac,
    searchRoomLab,
};
