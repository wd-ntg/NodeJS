import pool from '../../config/connectDB';

const getAllRoom = async () => {
    const [room, fieldsPrac] = await pool.execute('SELECT * FROM `room` ');
    //console.log('check data', result);
    return room;
};

const getTimeType = async () => {
    let result = [];

    const [timeType, fields] = await pool.execute('select * from allcode where type = ?', ['TIMETYPE']);

    return timeType;
};

const getAllSchedule = async () => {
    // let [gender] = await pool.execute(
    //     'SELECT *, student.id, allcode.keyName FROM student inner join allcode on allcode.code=student.gender ',
    // );
    const [schedule, fields] = await pool.execute(
        `select schedule.id, schedule.max_student, 
        schedule.current_student, schedule.time, schedule.roomCode, schedule.timeType , 
        allcode.keyName, room.name from schedule join allcode on schedule.timeType=allcode.code join 
        room on schedule.roomCode=room.code `,
    );
    //const [name] = await pool.execute('select room.name from room inner join schedule on room.code=schedule.roomCode ');

    return schedule;
};

const createNewSchedule = async (req, res) => {
    const { roomCode, timeType, max_student, time } = req.body;
    let error = '';
    let [room] = await pool.execute('select * from room where code = ?', [roomCode]);

    if (room[0].max_student < max_student) {
        error = `Số lượng sinh viên của phòng ${room[0].name} không được phép quá ${room[0].max_student}, vui lòng chọn lại`;
    } else {
        await pool.execute(
            'insert into schedule(roomCode, max_student, current_student, time, timeType) values (?, ?, ?, ?, ?)',
            [roomCode, +max_student, 0, time, timeType],
        );
    }

    return error;
};

const checkDayDelete = async (req, res) => {
    let id = req.body.id;
    let error = '';
    const [data, fieldsPrac] = await pool.execute('select * from schedule where id = ?', [id]);

    let [day, month, year] = data[0].time.split('/');
    let currentDate = new Date();
    let isValid = true;
    if (+year < currentDate.getFullYear()) {
        isValid = false;
    } else if (+year == currentDate.getFullYear() && +month < currentDate.getMonth() + 1) {
        isValid = false;
    } else if (
        +year == currentDate.getFullYear() &&
        +month == currentDate.getMonth() + 1 &&
        +day < currentDate.getDate()
    ) {
        isValid = false;
    }

    if (isValid) {
        if (data[0].current_student > 0) {
            return {
                errCode: 1,
                errMessage: 'Đã có sinh viên đăng ký học, vui lòng liên hệ giáo viên giảng dạy để xem xét',
            };
        }
    }

    return {
        errCode: 0,
        data: data[0],
    };
};

const deleteSchedule = async (req, res) => {
    let id = req.body.id;

    await pool.execute('delete from schedule where id = ?', [id]);

    return res.redirect('/schedule');
};

const editSchedule = async (req, res) => {
    let id = req.body.id;

    const [data, fieldsPrac] = await pool.execute('select * from schedule where id = ?', [id]);

    if (data[0].current_student > 0) {
        return {
            errCode: 1,
            errMessage: 'Đã có sinh viên đăng ký học, vui lòng liên hệ giáo viên giảng dạy để xem xét',
        };
    }

    return {
        errCode: 0,
        data: data[0],
    };
};

const postEditSchedule = async (req, res) => {
    const { roomCode, timeType, max_student, time, id } = req.body;

    let [rows] = await pool.execute('select current_student from schedule where id = ?', [id]);

    await pool.execute(
        'update schedule set roomCode = ?, max_student = ?, current_student =? , time= ?, timeType = ? where id = ?',
        [roomCode, +max_student, rows[0].current_student, time, timeType, id],
    );

    return res.redirect('/schedule');
};

export default {
    getAllRoom,
    getTimeType,
    getAllSchedule,
    createNewSchedule,
    deleteSchedule,
    editSchedule,
    postEditSchedule,
    checkDayDelete,
};
