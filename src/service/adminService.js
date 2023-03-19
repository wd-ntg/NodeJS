import pool from '../config/connectDB'

export let getAllStudent = async () => {
    let data = []
    const [rows, fields] = await pool.execute('SELECT * FROM `sinhvien` ');
    //   console.log({data: rows})
    return rows
}

//CRUD student
export const createNewStudent = async (req, res) => {
    let { name, email, password, lop, mssv, gender } = req.body;
   
    
    await pool.execute('insert into sinhvien(roleId, name, email, password, lop, mssv, gender) values (?, ?, ?, ?, ?, ?, ?)',
        ['R2', name, email, password, lop, mssv, gender]);

    return res.redirect('/manage-student')

}

export const editStudent = async(req, res) => {
    let id = req.params.id
    
    let [student] = await pool.execute('select * from sinhvien where id = ?', [id])
    const [rows, fields] = await pool.execute('SELECT * FROM `sinhvien` ');
   
    
    return res.render('admin/manageStudent.ejs', {data: rows, student: student[0]})
    
}

export const deleteStudent = async(req, res) => {
    
    let id = req.params.id
 
    await pool.execute('delete from sinhvien where id = ?', [id])
    
    return res.redirect('/manage-student')
   
}

export const postEditStudent = async (req, res) => {
    let { name, email, password, id } = req.body;
   
    
    await pool.execute('update sinhvien set roleId = ?, name =? , email = ?, password= ?, lop =? , mssv= ?, gender= ? where id = ?',
        ['R2', name, email, password, 'abc', 'abc', 'man', id]);

    // await pool.execute('update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?',
    // [firstName, lastName, email, address, id]);

    return res.redirect('/manage-student')

}