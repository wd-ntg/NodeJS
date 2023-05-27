import pool from '../../config/connectDB';
import manageStudentService from '../../service/admin/manageStudentService';
import adminroomPracService from '../../service/admin/adminRoomPracService';
import adminRoomLabService from '../../service/admin/adminRoomLabService';
import scheduleService from '../../service/admin/scheduleService';
import statisService from '../../service/admin/statisService';
import e, { request } from 'express';

const startStatis = async (req, res) => {
    //console.log(req.body);
    let { date, room, time } = req.body;
    let rooms = await scheduleService.getAllRoom(req, res);
    let { schedule, errRoomEmpty, resultStatis, roomMaxCount, maxCount, roomDescription } =
        await statisService.getDataStatis(req, res);

    //console.log(roomDescription);

    return res.render('admin/statis.ejs', {
        rooms,
        data: schedule,
        errRoomEmpty,
        resultStatis,
        roomMaxCount,
        maxCount,
        query: [],
        date,
        room,
        time,
        sortType: 'none',
        roomDescription,
    });
};

const getAllStudentBooking = async (req, res) => {
    //let { schedule, errRoomEmpty, resultStatis, roomMaxCount, maxCount } = await statisService.getDataStatis(req, res);
    let { roomCode, time, timeType } = req.body;

    let data = await statisService.getAllStudentBooking(req, res);
    let [room] = await pool.execute(`select * from room where code = ?`, [roomCode]);
    let text;
    if (data.length > 0) {
        text = `Hiện tại phòng ${roomCode} ${room[0].name} có tất cả ${data.length} sinh viên đăng ký`;
    } else {
        text = `Hiện tại phòng ${roomCode} ${room[0].name} chưa có sinh viên đăng ký trong thời gian này`;
    }

    //console.log('data', data);
    return res.render('admin/statis/listStudentStatis.ejs', {
        data,
        text,
        roomCode,
        time,
        error: '',
        timeType,
        sortType: 'none',
        searchType: 'name',
    });
};

const backStatis = async (req, res) => {
    return res.redirect('/statis');
};

const sortScheduleStatis = async (req, res) => {
    // console.log(req.body);
    const sortType = req.body.sortType;
    let { time, room, date, roomDescription } = req.body;

    let rooms = await scheduleService.getAllRoom(req, res);
    let { schedule, errRoomEmpty, resultStatis, roomMaxCount, maxCount } = await statisService.getDataStatis(req, res);

    //console.log(schedule[0]);

    if (sortType === 'roomCode') {
        schedule.sort((a, b) => {
            let nameA = a.roomCode.toLowerCase();
            let nameB = b.roomCode.toLowerCase();

            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (sortType === 'time') {
        const sortedData = schedule
            .map((item) => {
                const parts = item.time.split('/');
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);

                return {
                    id: item.id,
                    roomCode: item.roomCode,
                    max_student: item.max_student,
                    current_student: item.current_student,
                    timeType: item.timeType,
                    time: date,
                    keyName: item.keyName,
                };
            })
            .sort((a, b) => a.time - b.time);

        const formattedData = sortedData.map((item) => {
            const day = item.time.getDate();
            const month = item.time.getMonth() + 1; // Tăng 1 vì tháng trong đối tượng Date bắt đầu từ 0
            const year = item.time.getFullYear();
            let formattedTime;
            if (day <= 9) {
                formattedTime = `0${day}/${month < 10 ? '0' + month : month}/${year}`;
            } else {
                formattedTime = `${day}/${month < 10 ? '0' + month : month}/${year}`;
            }
            return {
                id: item.id,
                roomCode: item.roomCode,
                max_student: item.max_student,
                current_student: item.current_student,
                timeType: item.timeType,
                time: formattedTime,
                keyName: item.keyName,
            };
        });
        return res.render('admin/statis.ejs', {
            rooms,
            data: formattedData,
            errRoomEmpty,
            resultStatis,
            roomMaxCount,
            maxCount,
            query: [],
            date,
            room,
            time,
            sortType,
            roomDescription,
        });
    } else if (sortType === 'countStudent') {
        schedule.sort((a, b) => a.current_student - b.current_student);
    }

    return res.render('admin/statis.ejs', {
        rooms,
        data: schedule,
        errRoomEmpty,
        resultStatis,
        roomMaxCount,
        maxCount,
        query: [],
        date,
        room,
        time,
        sortType,
        roomDescription,
    });
};

const searchStudentStatis = async (req, res) => {
    let { searchType, sortType, roomCode, time, timeType, keyword, text } = req.body;
    //console.log('data', req.body);

    let query;

    if (sortType !== 'none') {
        if (searchType === 'gender') {
            [query] = await pool.execute(
                `SELECT student.*, allcode.keyName
                FROM student
                INNER JOIN allcode ON allcode.code = student.gender
                JOIN booking on booking.mssv = student.mssv
                WHERE allcode.keyName LIKE '%${keyword}%' AND student.roleId = ? AND booking.roomCode = ? and booking.time = ? and booking.timeType = ?  ORDER BY student.${sortType}
                `,
                ['R2', roomCode, time, timeType],
            );
        } else {
            [query] = await pool.execute(
                `SELECT student.*, allcode.keyName
                FROM student
                INNER JOIN allcode ON allcode.code = student.gender
                JOIN booking on booking.mssv = student.mssv
                WHERE student.${searchType} LIKE '%${keyword}%' AND student.roleId = ? AND booking.roomCode = ? and booking.time = ? and booking.timeType = ?  ORDER BY student.${sortType}
                `,
                ['R2', roomCode, time, timeType],
            );
        }
    } else {
        if (searchType === 'gender') {
            [query] = await pool.execute(
                `SELECT student.*, allcode.keyName
                FROM student
                INNER JOIN allcode ON allcode.code = student.gender
                JOIN booking on booking.mssv = student.mssv
                WHERE allcode.keyName LIKE '%${keyword}%' AND student.roleId = ? AND booking.roomCode = ? and booking.time = ? and booking.timeType = ? 
                `,
                ['R2', roomCode, time, timeType],
            );
        } else {
            [query] = await pool.execute(
                `SELECT student.*, allcode.keyName
                FROM student
                INNER JOIN allcode ON allcode.code = student.gender
                JOIN booking on booking.mssv = student.mssv
                WHERE student.${searchType} LIKE '%${keyword}%' AND student.roleId = ? AND booking.roomCode = ? and booking.time = ? and booking.timeType = ?  
                `,
                ['R2', roomCode, time, timeType],
            );
        }
    }

    let error = '';
    if (query.length === 0) {
        error = 'Không có thông tin sinh viên cần tìm, vui lòng kiểm tra lại';
    }
    //console.log(error);
    return res.render('admin/statis/listStudentStatis.ejs', {
        data: query,
        text: text,
        roomCode,
        time,
        timeType,
        error,
        searchType,
        sortType,
    });
};

export default {
    startStatis,
    getAllStudentBooking,
    backStatis,
    sortScheduleStatis,
    searchStudentStatis,
};
