import pool from '../../config/connectDB';

let getAllSchedule = async () => {
    // them:  where schedule.max_student!=schedule.current_student de chi lay nhung phong chua du sinh vien
    const [schedule, fieldsPrac] = await pool.execute(
        'SELECT *, schedule.id, room.id as roomID, room.name, schedule.max_student, allcode.keyName from schedule join room on schedule.roomCode=room.code join allcode on schedule.timeType=allcode.code ',
    );
    //'SELECT *, student.id, allcode.keyName FROM student inner room allcode on allcode.code=student.gender ',
    return schedule;
};

let getTimeType = async () => {
    let result = [];

    const [timeType, fields] = await pool.execute('select * from allcode where type = ?', ['TIMETYPE']);

    return timeType;
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

const bookingConfirm = async (req, res) => {
    let id = req.body.id;
    let [schedule, fields] = await pool.execute('select * from schedule where id = ?', [id]);
    let { roomCode, time, timeType, current_student, max_student } = schedule[0];

    let [similar] = await pool.execute('select * from booking where mssv = ? and time = ? and timeType = ?', [
        'N21',
        time,
        timeType,
    ]);

    let message;
    if (max_student === current_student) {
        message = 'Phòng học đã đủ sinh viên, vui lòng chọn phòng khác';
    } else if (similar[0]) {
        message = 'Bạn đã đăng ký phòng học này';
    } else {
        await pool.execute('insert into booking(mssv, time, roomCode, timeType) values (?, ?, ?, ?)', [
            'N21',
            time,
            roomCode,
            timeType,
        ]);

        await pool.execute('update schedule set current_student = ? where roomCode = ? and time = ? and timeType = ?', [
            current_student + 1,
            roomCode,
            time,
            timeType,
        ]);
        message = 'Đăng ký phòng học thành công';
    }

    return message;
};

export default {
    getAllSchedule,
    getTimeType,
    getDetailroomPrac,
    getAllDevice,
    bookingConfirm,
};
