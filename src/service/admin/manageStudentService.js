import pool from '../../config/connectDB';

let getAllStudent = async () => {
    // let data = [];
    // const [rows, fields] = await pool.execute('SELECT * FROM `student` ');

    let [gender] = await pool.execute(
        'SELECT *, student.id, allcode.keyName FROM student inner join allcode on allcode.code=student.gender where roleId = ? ',
        ['R2'],
    );
    //   console.log({data: rows})

    return gender;
};

const createNewStudent = async (req, res) => {
    let { name, email, password, className, mssv, gender } = req.body;
    // let error = '';

    // let [genderFields] = await pool.execute('select * from allcode where type = ?', ['GENDER']);
    // let [userEmail] = await pool.execute('select * from student where email = ?', [email]);
    // let [userMSSV] = await pool.execute('select * from student where mssv = ?', [mssv]);

    // if (userEmail[0]) {
    //     error = 'Địa chỉ email đã tồn tại, vui lòng tạo địa chỉ email mới';
    //     let data = { name, password, className, mssv, gender, email: '' };
    //     return res.render('admin/student/errorStudent.ejs', { data: data, gender: genderFields, error: error });
    // } else if (userMSSV[0]) {
    //     error = 'Mã số sinh viên đã tồn tại, vui lòng tạo mã số sinh viên mới';
    //     let data = { name, password, className, mssv: '', gender, email };
    //     return res.render('admin/student/errorStudent.ejs', { data: data, gender: genderFields, error: error });
    // } else {
    await pool.execute(
        'insert into student(roleId, name, email, password, className, mssv, gender) values (?, ?, ?, ?, ?, ?, ?)',
        ['R2', name, email, password, className, mssv, gender],
    );
    //     );
    // }

    let object = 'Sinh viên';
    let action = 'Tạo mới (Thêm)';

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

    await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
        object,
        name,
        mssv,
        action,
        dateTime,
    ]);

    return res.redirect('/manage-student');
};

const editStudent = async (req, res) => {
    let id = req.params.id;
    let [gender] = await pool.execute('select * from allcode where type = ?', ['GENDER']);
    let [student] = await pool.execute('select * from student where id = ?', [id]);
    //const [rows, fields] = await pool.execute('SELECT * FROM `student` ');

    return res.render('admin/student/editStudent.ejs', { data: student[0], gender: gender, error: '' });
};

const deleteStudent = async (req, res) => {
    let id = req.params.id;

    let object = 'Sinh viên';
    let action = 'Xóa';

    let [student] = await pool.execute('select * from student where id = ?', [id]);

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

    await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
        object,
        student[0].name,
        student[0].mssv,
        action,
        dateTime,
    ]);

    await pool.execute('delete from student where id = ?', [id]);

    return res.redirect('/manage-student');
};

const postEditStudent = async (req, res) => {
    let { name, email, password, className, mssv, gender, id } = req.body;

    // await pool.execute('update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?',
    // [firstName, lastName, email, address, id]);

    let object = 'Sinh viên';
    let action = 'Cập nhật';

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

    await pool.execute('insert into history(object, name, code, action, time) values (?, ?, ?, ?, ?)', [
        object,
        name,
        mssv,
        action,
        dateTime,
    ]);

    await pool.execute(
        'update student set roleId = ?, name =? , email = ?, password= ?, className =? , mssv= ?, gender= ? where id = ?',
        ['R2', name, email, password, className, mssv, gender, id],
    );
    return res.redirect('/manage-student');
};

export default {
    postEditStudent,
    deleteStudent,
    editStudent,
    createNewStudent,
    getAllStudent,
};
