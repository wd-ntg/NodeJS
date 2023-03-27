import pool from '../../config/connectDB';
import scheduleService from '../../service/admin/scheduleService';

const viewAddSchedule = async (req, res) => {
    let room = await scheduleService.getAllRoom(req, res);
    let timeType = await scheduleService.getTimeType(req, res);
    return res.render('admin/schedule/addSchedule.ejs', { room: room, timeType: timeType });
};

const createNewSchedule = async (req, res) => {
    scheduleService.createNewSchedule(req, res);
};

const deleteSchedule = (req, res) => {
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

export default {
    viewAddSchedule,
    createNewSchedule,
    deleteSchedule,
    editSchedule,
    postEditSchedule,
};
