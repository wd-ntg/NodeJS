import { errorMonitor } from 'mysql2/typings/mysql/lib/Connection';
import pool from '../../config/connectDB';
import loginService from '../../service/login/loginService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let roleid = req.body.roleid;

    if (!email || !password || roleid != 'R2') {
        error = 'Địa chỉ email đã tồn tại, vui lòng tạo địa chỉ email mới';
        return res.render('login.ejs', { error: error });
    }

    let studentData = await loginService.handleStudentLogin(email, password);

    return res.render('admin.ejs', { studentData: studentData, error: error });
};

module.exports = {
    handleLogin: handleLogin,
};
