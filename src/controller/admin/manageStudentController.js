import pool from '../../config/connectDB';
import manageStudentService from '../../service/admin/manageStudentService';

const createNewStudent = async (req, res) => {
    let { name, email, password, className, mssv, gender } = req.body;
    let error = '';

    let [genderFields] = await pool.execute('select * from allcode where type = ?', ['GENDER']);
    let [userEmail] = await pool.execute('select * from student where email = ?', [email]);
    let [userMSSV] = await pool.execute('select * from student where mssv = ?', [mssv]);

    if (userEmail[0]) {
        error = 'Địa chỉ email đã tồn tại, vui lòng tạo địa chỉ email mới';
        let data = { name, password, className, mssv, gender, email: '' };
        return res.render('admin/student/errorStudent.ejs', { data: data, gender: genderFields, error: error });
    } else if (userMSSV[0]) {
        error = 'Mã số sinh viên đã tồn tại, vui lòng tạo mã số sinh viên mới';
        let data = { name, password, className, mssv: '', gender, email };
        return res.render('admin/student/errorStudent.ejs', { data: data, gender: genderFields, error: error });
    } else {
        manageStudentService.createNewStudent(req, res);
    }
};

const editStudent = async (req, res) => {
    manageStudentService.editStudent(req, res);
};

const postEditStudent = async (req, res) => {
    let { name, email, password, className, mssv, gender, id } = req.body;
    let [genderFields] = await pool.execute('select * from allcode where type = ?', ['GENDER']);
    let error = '';

    let [student] = await pool.execute('select * from student where  id = ?', [id]);

    let [userEmail] = await pool.execute('select * from student where email = ?', [email]);
    if (userEmail[0]) {
        if (student[0].email !== email) {
            error = 'Địa chỉ email đã tồn tại, vui lòng tạo địa chỉ email mới';
            let data = { name, password, className, mssv, gender, email: '', id };
            return res.render('admin/student/editStudent.ejs', { data: data, gender: genderFields, error: error });
        }
    }

    let [userMSSV] = await pool.execute('select * from student where mssv = ?', [mssv]);

    if (userMSSV[0]) {
        if (student[0].mssv !== mssv) {
            error = 'Mã số sinh viên đã tồn tại, vui lòng tạo mã số sinh viên mới';
            let data = { name, password, className, mssv: '', gender, email };
            return res.render('admin/student/errorStudent.ejs', { data: data, gender: genderFields, error: error });
        }
    }

    manageStudentService.postEditStudent(req, res);
};

const deleteStudent = async (req, res) => {
    manageStudentService.deleteStudent(req, res);
};

const searchStudent = async (req, res) => {
    //console.log(req.body);
    const sortType = req.body.sortType;
    const searchType = req.body.searchType;
    const keyword = req.body.keyword;
    const code = req.body.code;
    let query;
    if (searchType === 'gender') {
        [query] = await pool.execute(
            `SELECT student.*, allcode.keyName
            FROM student
            INNER JOIN allcode ON allcode.code = student.gender
            WHERE allcode.keyName LIKE '%${keyword}%' AND student.roleid = ?
            `,
            [code],
        );
    } else {
        [query] = await pool.execute(
            `SELECT student.*, allcode.keyName
            FROM student
            INNER JOIN allcode ON allcode.code = student.gender
            WHERE student.${searchType} LIKE '%${keyword}%' AND student.roleid = ?
            `,
            [code],
        );
    }

    let newArray = [];
    let resultSort = [];

    if (sortType !== 'none') {
        for (let i = 0; i < query.length; i++) {
            newArray.push(query[i][sortType]);
        }
        newArray.sort();
        //console.log(newArray);
        for (let i = 0; i < newArray.length; i++) {
            for (let j = 0; j < query.length; j++) {
                if (newArray[i] === query[j][sortType]) {
                    resultSort.push(query[j]);
                    query.splice(j, 1);
                    j == 0;
                    break;
                }
            }
        }
    } else {
        resultSort = query;
    }

    //let [room] = await pool.execute('select * from room where code = ?', [code]);

    //console.log('keywơrd: ', query);
    return res.render('admin/student/manageStudent.ejs', {
        sortType: sortType,
        searchType: searchType,
        data: resultSort,
        roomPrac: false,
        error: '',
    });
};

export default {
    createNewStudent,
    editStudent,
    postEditStudent,
    deleteStudent,
    searchStudent,
};
