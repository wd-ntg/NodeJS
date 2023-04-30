import { hash } from 'bcrypt';
import pool from '../../config/connectDB';
import bcrypt from 'bcryptjs';

let handleStudentLogin = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let studentData = {};
            let isExist = await checkStudentEmail(email);
            if (isExist) {
                let student = await pool.student.findOne({
                    attributes: ['email', 'roleid', 'password'],
                    where: { email: email },
                });

                if (student) {
                    let check = await bcrypt.compareSync(password, student.password);
                    if (check) {
                        studentData.errCode = 0;
                        studentData.errMessage = 'Ok';
                        delete student.password;
                        studentData.student = student;
                    } else {
                        studentData.errCode = 3;
                        studentData.errMessage = 'wrong password';
                    }
                } else {
                    studentData.errCode = 2;
                    studentData.errMessage = `Student's not found. PLS TRY OTHER EMAIL`;
                }
            } else {
                studentData.errCode = 1;
                studentData.errMessage = `Your's Email isn't exist in your system. PLS TRY OTHER EMAIL`;
            }
            resolve(studentData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkStudentEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let student = await pool.student.findOne({
                where: { email: email },
            });
            if (student) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {}
    });
};

module.exports = {
    handleStudentLogin: handleStudentLogin,
};
