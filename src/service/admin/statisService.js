import pool from '../../config/connectDB';

const getDataStatis = async (req, res) => {
    let roomCode = req.body.room;
    let dateCode = req.body.date;
    let timeCode = req.body.time;

    let schedule = [];
    let errRoomEmpty;
    let statis;
    let resultStatis = [];
    let roomMaxCount = '';
    let roomDescription = '';
    let maxCount;
    console.log(roomCode);
    if (roomCode === 'all' || roomCode === 'Tất cả các phòng') {
        if (dateCode === 'all') {
            [schedule] = await pool.execute(
                `select schedule.*, allcode.keyName from schedule inner join allcode on allcode.code = schedule.timeType`,
            );

            // ` SELECT student.*, allcode.keyName
            // FROM student
            // INNER JOIN allcode ON allcode.code = student.gender
            // WHERE allcode.keyName LIKE '%${keyword}%' AND student.roleid = ?
            // `
        } else if (dateCode === 'day') {
            [schedule] = await pool.execute(
                'select schedule.*, allcode.keyName from schedule inner join allcode on allcode.code = schedule.timeType where time = ?',
                [timeCode],
            );
        } else if (dateCode === 'month' || dateCode === 'year') {
            [schedule] = await pool.execute(
                `select schedule.*, allcode.keyName from schedule inner join allcode on allcode.code = schedule.timeType
                
                WHERE schedule.time LIKE '%${timeCode}%' 
                `,
            );
        }

        if (schedule.length === 0) {
            errRoomEmpty =
                'Hiện tại vẫn chưa có bất kỳ lịch học nào trong khoảng thời gian này, bạn có thể thêm mới lịch học trong thanh điều hướng';
        } else {
            // lấy ra những phòng có số lịch học cao nhất
            let [allroom] = await pool.execute(`select * from room`);
            [statis] = await pool.execute(`SELECT schedule.roomCode, room.name, COUNT(*) AS count
            FROM schedule
            JOIN room ON schedule.roomCode = room.code
            WHERE schedule.time LIKE '%${timeCode}%'
            GROUP BY schedule.roomCode, room.name
            ORDER BY count DESC;
                     
        `);

            maxCount = statis[0].count;

            for (let i = 0; i < allroom.length; i++) {
                let check = false;
                for (let j = 0; j < statis.length; j++) {
                    if (allroom[i].code === statis[j].roomCode) {
                        check = true;
                        resultStatis.push(
                            `${statis[j].roomCode} ${statis[j].name} có "${statis[j].count}" lịch học trong khoảng thời gian này`,
                        );
                        if (maxCount == statis[j].count) {
                            roomMaxCount += `${statis[j].roomCode} ${statis[j].name}; `;
                        }
                        break;
                    }
                }

                if (!check) {
                    resultStatis.push(
                        `${allroom[i].code} ${allroom[i].name} "chưa có" lịch học trong khoảng thời gian này`,
                    );
                }
            }
        }
    } else {
        if (dateCode === 'all') {
            [schedule] = await pool.execute(
                `SELECT *
                FROM schedule
                INNER JOIN allcode ON schedule.timeType = allcode.code
                WHERE schedule.roomCode = ?
                `,
                [roomCode],
            );
        } else if (dateCode === 'day') {
            [schedule] = await pool.execute(
                `SELECT *
                FROM schedule
                INNER JOIN allcode ON schedule.timeType = allcode.code where roomCode = ? and time = ?`,
                [roomCode, timeCode],
            );
        } else if (dateCode === 'month' || dateCode === 'year') {
            [schedule] = await pool.execute(
                `SELECT *
                FROM schedule
                INNER JOIN allcode ON schedule.timeType = allcode.code
                
                WHERE schedule.time LIKE '%${timeCode}%' AND roomCode = ?
                `,
                [roomCode],
            );
        }

        let [nameRoom] = await pool.execute(`SELECT * FROM room WHERE code = ? `, [roomCode]);
        if (schedule.length === 0) {
            errRoomEmpty = `Hiện tại phòng ${roomCode} ${
                nameRoom[0] && nameRoom[0].name
            } chưa có lịch học trong thời gian này`;
        } else {
            roomDescription = `Phòng ${roomCode} ${nameRoom[0] && nameRoom[0].name} đang có tất cả ${
                schedule.length
            } lịch học trong khoảng thời gian được chọn`;
        }
    }

    //console.log(roomDescription);

    return { schedule, errRoomEmpty, resultStatis, roomMaxCount, maxCount, roomDescription };
};

const getAllStudentBooking = async (req, res) => {
    let { time, roomCode, timeType } = req.body;

    let [query] = await pool.execute(
        `SELECT student.*, allcode.keyName
        FROM booking
        JOIN student ON booking.mssv = student.mssv
        JOIN allcode ON allcode.code = student.gender
        WHERE booking.time = ? AND booking.roomCode = ? and booking.timeType = ?;
        `,
        [time, roomCode, timeType],
    );

    return query;
};

export default {
    getDataStatis,
    getAllStudentBooking,
};
