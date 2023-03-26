import pool from "../config/connectDB";

export const getAllRoomTH = async() => {
    let data = []
    const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');
    return rows
}

export const createNewRoomTHService = async(req, res) => {
    let {tenphong, maphong, mota, chuyenkhoa, soluongsinhvien} = req.body;
   console.log('check data', req.body)
    
    await pool.execute('insert into phongthuchanh(roleid,tenphong, maphong, mota, chuyenkhoa, soluongsinhvien) values (?, ?, ?, ?, ?, ?)',
        ['TH',tenphong, maphong, mota, chuyenkhoa, soluongsinhvien]);

    return res.redirect('/roomTH')
}

export const deleteRoomTHService = async (req, res) => {
    let id = req.params.id
    console.log('id', id)
 
    await pool.execute('delete from phongthuchanh where id = ?', [id])
    
    return res.redirect('/roomTH')
}

export const editRoomTHService = async(req, res) => {
    let id = req.params.id
    
    let [roomTH] = await pool.execute('select * from phongthuchanh where id = ?', [id])
    const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');
   
    return res.render('admin/roomTH.ejs', {data: rows, roomTH: roomTH[0]})
}

export const postEditRoomService = async(req, res) => {
    let {tenphong, maphong, mota, chuyenkhoa, soluongsinhvien, id} = req.body;
   
    
    await pool.execute('update phongthuchanh set roleId = ?,tenphong=?, maphong=? , mota = ?, chuyenkhoa= ?, soluongsinhvien=? where id = ?',
        ['TH',tenphong, maphong, mota, chuyenkhoa, soluongsinhvien, id]);

    return res.redirect('/roomTH')
}

export const detailRoomTHService = async(req, res) => {
    let id = req.params.id
    
    let [roomTH] = await pool.execute('select * from phongthuchanh where id = ?', [id])
    //const [rows, fields] = await pool.execute('SELECT * FROM `phongthuchanh` ');
   //roomTH: roomTH[0]
    return res.render('admin/detailRoomTH.ejs', {data: roomTH[0]})
}