import pool from '../../config/connectDB';
import historyService from '../../service/admin/historyService';

const historyRoomLab = async (req, res) => {};

const historyRoomPrac = async (req, res) => {};

const searchHistory = async (req, res) => {
    const keyword = req.body.keyword;

    const code = req.body.code;

    const [query] = await pool.execute(
        `SELECT * FROM history WHERE name LIKE '%${keyword}%' OR code LIKE '%${keyword}%'`,
    );

    //let [room] = await pool.execute('select * from room where code = ?', [code]);

    //console.log('keywơrd: ', query);
    return res.render('admin/history.ejs', { data: query, roomPrac: false, error: '' });
};

export default {
    historyRoomLab,
    historyRoomPrac,
    searchHistory,
};
