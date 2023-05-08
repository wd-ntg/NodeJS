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

const getStudent = async (req, res) => {
    let id = req.params.id;

    let [student, fields] = await pool.execute('select * from student where id = ?', [id]);

    return student;
};

const bookingConfirm = async (req, res) => {
    let { scheduleID, studentID } = req.body;

    let [student, fieldStudent] = await pool.execute('select * from student where id = ?', [studentID]); // Phai truyen vao day cái studentID của học sinh
    // Khả thi nhất là truyền dữ liệu từ form đăng nhập

    let [schedule, fields] = await pool.execute('select * from schedule where id = ?', [scheduleID]);

    let { roomCode, time, timeType, current_student, max_student } = schedule[0];

    let [similar] = await pool.execute('select * from booking where mssv = ? and time = ? and timeType = ?', [
        // studentID,
        student[0].mssv,
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
            // studentID,
            student[0].mssv,
            time,
            roomCode,
            timeType,
        ]);

        let [room] = await pool.execute('select * from room where code = ?', [roomCode]);

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

        await pool.execute(
            'insert into historyStudent(studentcode, email, object, name, schedule, timelogin) values (?, ?, ?, ?, ?, ?)',
            [student[0].mssv, student[0].email, room[0].name, roomCode, timeType, dateTime],
        );

        await pool.execute('update schedule set current_student = ? where roomCode = ? and time = ? and timeType = ?', [
            current_student + 1,
            roomCode,
            time,
            timeType,
        ]);
        message = 'Đăng ký phòng học thành công';
    }

    return { message, studentID };
};

export default {
    getAllSchedule,
    getTimeType,
    getDetailroomPrac,
    getAllDevice,
    bookingConfirm,
    getStudent,
};
