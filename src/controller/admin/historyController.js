import pool from '../../config/connectDB';
import historyService from '../../service/admin/historyService';

const historyRoomLab = async (req, res) => {};

const historyRoomPrac = async (req, res) => {};

// const searchHistory = async (req, res) => {
//     const keyword = req.body.keyword;

//     const code = req.body.code;

//     const [query] = await pool.execute(
//         `SELECT * FROM history WHERE name LIKE '%${keyword}%' OR code LIKE '%${keyword}%'`,
//     );

//     //let [room] = await pool.execute('select * from room where code = ?', [code]);

//     //console.log('keywơrd: ', query);
//     return res.render('admin/history.ejs', { data: query, roomPrac: false, error: '' });
// };

const searchHistory = async (req, res) => {
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;

    //const [query] = await pool.execute(`SELECT * FROM room WHERE name LIKE '%${keyword}%' and roleid=?`, [code]);

    let query;

    if (sortType !== 'none') {
        if (sortType === 'time') {
            // const [time, date] = keyword.split(' ');
            // const [day, month, year] = date.split('/');
            // const searchDate = `${day}-${month}-${year}`;

            // [query] = await pool.execute(
            //     `SELECT history.*
            //     FROM history
            //     WHERE DATE(history.time) = ? ORDER BY history.time DESC
            //   `,
            //     [searchDate],
            // );
            // [query] = await pool.execute(`SELECT history.*
            // FROM history
            // ORDER BY STR_TO_DATE(SUBSTRING_INDEX(history.time, ' ', -1), '%d/%m/%Y') ASC
            // `);

            [query] = await pool.execute(`SELECT history.*
            FROM history
            ORDER BY STR_TO_DATE(history.time, '%H:%i:%s %d/%m/%Y') DESC
            `);
        } else {
            // Xử lý tìm kiếm và sắp xếp theo các trường khác
            [query] = await pool.execute(
                `SELECT history.*
                    FROM history
                    WHERE history.${searchType} LIKE '%${keyword}%' ORDER BY history.${sortType}
                    `,
            );
        }
    } else {
        if (searchType === 'time') {
            [query] = await pool.execute(`
    SELECT history.*
    FROM history
    WHERE DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(history.time, ' ', -1), '%d/%m/%Y'), '%d/%m/%Y') LIKE '%${keyword}%'
`);
        } else {
            [query] = await pool.execute(
                `SELECT history.*
                    FROM history
                    WHERE history.${searchType} LIKE '%${keyword}%'
                    `,
            );
        }
    }

    return res.render('admin/history.ejs', {
        sortType: 'none',
        searchType: 'name',
        data: query,
        roomPrac: false,
        error: '',
    });
};

export default {
    historyRoomLab,
    historyRoomPrac,
    searchHistory,
};
