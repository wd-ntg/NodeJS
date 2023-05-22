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

const searchRoomPrac = async (req, res) => {
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;
    //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

    let query;
    if (searchType === 'roleid') {
        [query] = await pool.execute(
            `SELECT room.*, allcode.keyName
            FROM room
            INNER JOIN allcode ON allcode.code = room.roleid
            WHERE allcode.keyName LIKE '%${keyword}%' AND room.roleid = ?
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

    let newArray = [];
    let resultSort = [];

    if (sortType !== 'none') {
        for (let i = 0; i < query.length; i++) {
            newArray.push(query[i][sortType]);
        }
        newArray.sort();
        //console.log(newArray);
        for (let i = 0; i < newArray.length; i++) {
            for (let j = 0; j < query.length; j++) {
                if (newArray[i] === query[j][sortType]) {
                    resultSort.push(query[j]);
                    break;
                }
            }
        }
    } else {
        resultSort = query;
    }

    return res.render('admin/room/roomPrac.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: resultSort,
        roomPrac: false,
        error: '',
    });
};
const searchRoomLab = async (req, res) => {
    const keyword = req.body.keyword;
    const code = req.body.code;
    const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);
    //let [room] = await pool.execute('select * from room where code = ?', [code]);

    //console.log('keywơrd: ', query);
    return res.render('admin/room/roomLab.ejs', { data: query, roomLab: false, error: '' });
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
