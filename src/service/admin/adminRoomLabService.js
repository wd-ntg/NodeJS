import pool from '../../config/connectDB';

const getAllroomLab = async () => {
    let data = [];
    const [rows, fields] = await pool.execute('SELECT * FROM `room_lab` ');
    return rows;
};

const createNewroomLabService = async (req, res) => {
    let { name, code, description, specialty, maxStudent } = req.body;
    //console.log('check data', req.body);
    // let [room] = await pool.execute('select * from room where code = ?', [code]);
    // let error = '';
    // if (room[0]) {
    //     error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
    //     let data = { name, code: '', description, specialty, maxStudent };
    //     return res.render('admin/room/errorRoom.ejs', { data: data, error: error });
    // } else {
    await pool.execute(
        'insert into room_lab(roleid,name, code, description, 	specialty, 	max_student, img) values (?, ?, ?, ?, ?, ?, ?)',
        ['TN', name, code, description, specialty, maxStudent, 'no-img.jpg'],
    );
    //}

    return res.redirect('/roomLab');
};

const deleteroomLabService = async (req, res) => {
    let id = req.params.id;
    await pool.execute('delete from room_lab where id = ?', [id]);

    return res.redirect('/roomLab');
};

const editroomLabService = async (req, res) => {
    let id = req.params.id;

    let [roomLab] = await pool.execute('select * from room_lab where id = ?', [id]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');

    return res.render('admin/room/editRoomLab.ejs', { data: roomLab[0], error: '' });
};

const postEditRoomService = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;

    await pool.execute(
        'update room_lab set roleId = ?,name=?, code=? , description = ?, specialty= ?, max_student=? where id = ?',
        ['TH', name, code, description, specialty, maxStudent, id],
    );

    return res.redirect('/roomLab');
};

const getDetailroomLab = async (req, res) => {
    let id = req.params.id;

    let [roomLab] = await pool.execute('select * from room_lab where id = ?', [id]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');

    return roomLab;
};

const getAllDevice = async (req, res) => {
    let id = req.params.id;
    let [roomLab] = await pool.execute('select code from room_lab where id = ?', [id]);

    let roomCode = roomLab[0] && roomLab[0].code;

    let [device] = await pool.execute('select * from device where code = ?', [roomCode]);

    return device;
};

const createNewDeviceService = async (req, res) => {
    let { deviceName, description, quantity, id } = req.body;

    let [room, fields] = await pool.execute('select * from room_lab where id = ?', [id]);

    await pool.execute('insert into device(code, quantity, roomName, deviceName, description) values (?, ?, ?, ?, ?)', [
        room[0].code,
        quantity,
        room[0].name,
        deviceName,
        description,
    ]);

    return res.redirect(`/detail-roomLab/${id}`);
};

const deleteDeviceService = async (req, res) => {
    let { roomId, deviceId } = req.body;

    await pool.execute('delete from device where id = ?', [deviceId]);

    return res.redirect(`/detail-roomLab/${roomId}`);
};

const editDeviceService = async (req, res) => {
    //let id = req.params.id
    let { roomId, deviceId } = req.body;
    let [device] = await pool.execute('select * from device where id = ?', [deviceId]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `student` ');

    return res.render('admin/device/editDevice.ejs', { data: device[0], roomId: roomId });
};

const postEditDeviceService = async (req, res) => {
    let { quantity, description, deviceName, deviceId, roomId } = req.body;

    let [room, fields] = await pool.execute('select * from room_lab where id = ?', [roomId]);

    await pool.execute(
        'update device set code = ?, quantity = ?, roomName = ?, deviceName = ? , description = ? where id = ?',
        [room[0].code, quantity, room[0].name, deviceName, description, deviceId],
    );

    return res.redirect(`/detail-roomLab/${roomId}`);
};

export default {
    postEditDeviceService,
    editDeviceService,
    deleteDeviceService,
    createNewDeviceService,
    getAllDevice,
    getDetailroomLab,
    editroomLabService,
    postEditRoomService,
    deleteroomLabService,
    createNewroomLabService,
    getAllroomLab,
};
