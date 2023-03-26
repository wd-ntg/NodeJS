import pool from '../config/connectDB'

export const createNewDeviceService = async(req, res) => {
    //let id = req.params.id

    let { maphong, soluong, tenphong, tenthietbi, mota } = req.body;
    

    //let [roomTH] = await pool.execute('select * from phongthuchanh where id = ?', [id])
   
    //return res.render('admin/detailRoomTH.ejs', {data: roomTH[0]})
    
    await pool.execute('insert into thietbi(maphong, soluong, tenphong, tenthietbi, mota) values (?, ?, ?, ?, ?)',
        [maphong, soluong, tenphong, tenthietbi, mota]);

    return res.redirect(`/roomTH`)
}