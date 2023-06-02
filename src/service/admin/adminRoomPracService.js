import pool from '../../config/connectDB';

const getAllroomPrac = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `room` WHERE roleId = ?', ['TH']);
    return rows;
};

const createNewroomPracService = async (req, res) => {
    let { name, code, roleid, description, specialty, maxStudent, img } = req.body;
    //console.log('check data', req.body);
    // let [room] = await pool.execute('select * from room where code = ?', [code]);
    // let error = '';
    // if (room[0]) {
    //     error = 'Mã phòng đã tồn tại, vui lòng tạo mã phòng mới';
    //     let data = { name, code: '', description, specialty, maxStudent };
    //     return res.render('admin/room/errorRoom.ejs', { data: data, error: error });
    // } else {
    await pool.execute(
        'insert into room(roleid,name, code, description, 	specialty, 	max_student, img) values (?, ?, ?, ?, ?, ?, ?)',
        ['TH', name, code, description, specialty, maxStudent, 'no-img.jpg'],
    );
    //}

    let object = 'Phòng thực hành';
    let action = 'Tạo mới (Thêm)';

    const currentDate = new Date(Date.now());

    // Lấy giá trị của ngày, tháng, năm, giờ, phút, giây
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Định dạng lại chuỗi ngày tháng năm
    const formattedDate = `${date < 10 ? '0' + date : date}/${month < 10 ? '0' + month : month}/${year}`;

    // Định dạng lại chuỗi giờ phút giây
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
    }`;

    // Kết hợp chuỗi ngày tháng năm và giờ phút giây
    const dateTime = `${formattedTime}  ${formattedDate}`;

    await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
        object,
        name,
        code,
        action,
        dateTime,
    ]);

    return res.redirect('/roomPrac');
};

const deleteroomPracService = async (req, res) => {
    let id = req.params.id;

    let [room] = await pool.execute('select * from room where id = ?', [id]);

    //console.log(room);

    let [schedule] = await pool.execute('select * from schedule where roomCode = ?', [room[0].code]);
    let error = '';
    if (schedule.length > 0) {
        error = 'Hiện tại phòng đang có lịch học, không thể xóa phòng trong khoảng thời gian này!';
    } else {
        let [room] = await pool.execute('select * from room where id = ?', [id]);

        let object = 'Phòng thực hành';
        let action = 'Xóa';

        const currentDate = new Date(Date.now());

        // Lấy giá trị của ngày, tháng, năm, giờ, phút, giây
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();

        // Định dạng lại chuỗi ngày tháng năm
        const formattedDate = `${date < 10 ? '0' + date : date}/${month < 10 ? '0' + month : month}/${year}`;

        // Định dạng lại chuỗi giờ phút giây
        const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
            seconds < 10 ? '0' + seconds : seconds
        }`;

        // Kết hợp chuỗi ngày tháng năm và giờ phút giây
        const dateTime = `${formattedTime}  ${formattedDate}`;

        await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
            object,
            room[0].name,
            room[0].code,
            action,
            dateTime,
        ]);

        await pool.execute('delete from room where id = ?', [id]);
    }

    return error;
};

const editroomPracService = async (req, res) => {
    let id = req.params.id;

    let [roomPrac] = await pool.execute('select * from room where id = ?', [id]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');

    return res.render('admin/room/editRoomPrac.ejs', { data: roomPrac[0], error: '' });
};

const postEditRoomService = async (req, res) => {
    let { name, code, description, specialty, maxStudent, id } = req.body;

    await pool.execute(
        'update room set roleId = ?,name=?, code=? , description = ?, specialty= ?, max_student=? where id = ?',
        ['TH', name, code, description, specialty, maxStudent, id],
    );

    let object = 'Phòng thực hành';
    let action = 'Cập nhật';

    const currentDate = new Date(Date.now());

    // Lấy giá trị của ngày, tháng, năm, giờ, phút, giây
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Định dạng lại chuỗi ngày tháng năm
    const formattedDate = `${date < 10 ? '0' + date : date}/${month < 10 ? '0' + month : month}/${year}`;

    // Định dạng lại chuỗi giờ phút giây
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${
        seconds < 10 ? '0' + seconds : seconds
    }`;

    // Kết hợp chuỗi ngày tháng năm và giờ phút giây
    const dateTime = `${formattedTime}  ${formattedDate}`;

    await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
        object,
        name,
        code,
        action,
        dateTime,
    ]);

    return res.redirect('/roomPrac');
};

const getDetailroomPrac = async (req, res) => {
    let id = req.params.id;

    let [roomPrac] = await pool.execute('select * from room where id = ?', [id]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');

    return roomPrac;
};

const getAllDevice = async (req, res) => {
    let id = req.params.id;
    let [roomPrac] = await pool.execute('select code from room where id = ?', [id]);

    let roomCode = roomPrac[0] && roomPrac[0].code;

    let [device] = await pool.execute('select * from device where code = ?', [roomCode]);

    return device;
};

const createNewDeviceService = async (req, res) => {
    let { deviceName, description, quantity, id } = req.body;

    let [room, fields] = await pool.execute('select * from room where id = ?', [id]);

    let [device] = await pool.execute('select * from device where deviceName = ? and code = ?', [
        deviceName,
        room[0].code,
    ]);

    if (device.length > 0) {
        await pool.execute('update device set quantity = ?, description = ? where deviceName = ? and code = ? ', [
            +device[0].quantity + +quantity,
            description,
            deviceName,
            room[0].code,
        ]);
    } else {
        await pool.execute(
            'insert into device(code, quantity, roomName, deviceName, description) values (?, ?, ?, ?, ?)',
            [room[0].code, quantity, room[0].name, deviceName, description],
        );
    }

    if (room[0].roleid === 'TH') {
        return res.redirect(`/detail-roomPrac/${id}`);
    } else {
        return res.redirect(`/detail-roomLab/${id}`);
    }
};

const deleteDeviceService = async (req, res) => {
    let { roomId, deviceId } = req.body;

    let [room] = await pool.execute('select * from room where room.id = ?', [roomId]);
    if (room.roleid === 'TH') {
        await pool.execute('delete from device where id = ?', [deviceId]);
        return res.redirect(`/detail-roomPrac/${roomId}`);
    } else {
        await pool.execute('delete from device where id = ?', [deviceId]);
        return res.redirect(`/detail-roomLab/${roomId}`);
    }
};

const editDeviceService = async (req, res) => {
    //let id = req.params.id
    let { roomId, deviceId } = req.body;
    let [device] = await pool.execute('select * from device where id = ?', [deviceId]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `student` ');
    let [room] = await pool.execute('select * from room where room.id = ?', [roomId]);
    if (room.roleid === 'TH') {
        return res.render('admin/device/editDevice.ejs', { data: device[0], roomId: roomId });
    } else {
        return res.render('admin/device/editDeviceLab.ejs', { data: device[0], roomId: roomId });
    }
};

const postEditDeviceService = async (req, res) => {
    let { quantity, description, deviceName, deviceId, roomId } = req.body;

    let [room, fields] = await pool.execute('select * from room where id = ?', [roomId]);
    if (room.roleid === 'TH') {
        await pool.execute(
            'update device set code = ?, quantity = ?, roomName = ?, deviceName = ? , description = ? where id = ?',
            [room[0].code, quantity, room[0].name, deviceName, description, deviceId],
        );

        return res.redirect(`/detail-roomPrac/${roomId}`);
    } else {
        await pool.execute(
            'update device set code = ?, quantity = ?, roomName = ?, deviceName = ? , description = ? where id = ?',
            [room[0].code, quantity, room[0].name, deviceName, description, deviceId],
        );

        return res.redirect(`/detail-roomLab/${roomId}`);
    }
};

export default {
    postEditDeviceService,
    editDeviceService,
    deleteDeviceService,
    createNewDeviceService,
    getAllDevice,
    getDetailroomPrac,
    postEditRoomService,
    editroomPracService,
    deleteroomPracService,
    createNewroomPracService,
    getAllroomPrac,
};
