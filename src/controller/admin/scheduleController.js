import pool from '../../config/connectDB';
import scheduleService from '../../service/admin/scheduleService';

const viewAddSchedule = async (req, res) => {
    let room = await scheduleService.getAllRoom(req, res);
    let timeType = await scheduleService.getTimeType(req, res);
    return res.render('admin/schedule/addSchedule.ejs', { room: room, timeType: timeType, error: '' });
};

const createNewSchedule = async (req, res) => {
    let room = await scheduleService.getAllRoom(req, res);
    let timeType = await scheduleService.getTimeType(req, res);
    let error = await scheduleService.createNewSchedule(req, res);
    if (error) {
        return res.render('admin/schedule/addSchedule.ejs', { room: room, timeType: timeType, error: error });
    } else {
        return res.redirect('/schedule');
    }
};

const deleteSchedule = async (req, res) => {
    //let respon = await scheduleService.editSchedule(req, res);
    //kiem tra neu la ngay trong qua khu thi duoc xoa
    let respon = await scheduleService.checkDayDelete(req, res);

    if (respon.errCode === 1 && respon.errMessage) {
        let schedule = await scheduleService.getAllSchedule(req, res);

        return res.render('admin/schedule/schedule.ejs', { data: schedule, error: respon.errMessage });
    }
    scheduleService.deleteSchedule(req, res);
};

const editSchedule = async (req, res) => {
    let room = await scheduleService.getAllRoom(req, res);
    let timeType = await scheduleService.getTimeType(req, res);
    let respon = await scheduleService.editSchedule(req, res);

    if (respon.errCode === 1 && respon.errMessage) {
        let schedule = await scheduleService.getAllSchedule(req, res);

        return res.render('admin/schedule/schedule.ejs', { data: schedule, error: respon.errMessage });
    }

    return res.render('admin/schedule/editSchedule.ejs', { room: room, timeType: timeType, data: respon.data });
};

const postEditSchedule = (req, res) => {
    scheduleService.postEditSchedule(req, res);
};

const searchSchedule = async (req, res) => {
    const keyword = req.body.keyword;

    const [schedule, fields] = await pool.execute(
        `SELECT schedule.id, schedule.max_student, schedule.current_student, schedule.time, schedule.roomCode, 
        schedule.timeType, allcode.keyName, room.name 
        FROM schedule 
        JOIN allcode ON schedule.timeType=allcode.code 
        JOIN room ON schedule.roomCode=room.code 
        WHERE room.name LIKE ?`,
        [`%${keyword}%`],
    );

    //console.log('keywơrd: ', query);
    return res.render('admin/schedule/schedule.ejs', { data: schedule, roomPrac: false, error: '' });
};

export default {
    viewAddSchedule,
    createNewSchedule,
    deleteSchedule,
    editSchedule,
    postEditSchedule,
    searchSchedule,
};
