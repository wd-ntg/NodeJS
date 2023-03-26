<<<<<<< HEAD
import express from 'express'
//import { adminPage } from '../controller/adminController'
import adminController from '../controller/adminController'
import { createNewStudent, editStudent, deleteStudent, postEditStudent } from '../service/adminService'
import deviceController from '../controller/deviceController'
=======
import express from 'express';
import multer from 'multer';
import path from 'path';
import adminController from '../controller/admin/adminController';
import roomController from '../controller/admin/roomController';
import manageStudentController from '../controller/admin/manageStudentController';
import scheduleController from '../controller/admin/scheduleController';
import pool from '../config/connectDB';
>>>>>>> 1420cef62bfa318df40d9d214a8fe67798c87f90

const router = express.Router();

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/img/');
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

let upload = multer({ storage: storage, fileFilter: imageFilter });

const initAdminPage = (app) => {
<<<<<<< HEAD
    app.get('/admin', adminController.adminPage)
    app.get('/roomTH', adminController.roomTHPage)
    app.get('/roomTN', adminController.roomTNPage)
    app.get('/calendar', adminController.calendarPage)
    app.get('/history', adminController.historyPage)
    app.get('/manage-student', adminController.manageStudentPage)
    app.get('/detailRoomTH/:id', adminController.detailRoomTH)
    
   
=======
    app.post('/profile-room', upload.single('room-img'), async (req, res) => {
        let id = req.body.roomId;

        let upload = multer({ storage: storage, fileFilter: imageFilter }).single('room-img');

        upload(req, res, async function (err) {
            if (req.fileValidationError) {
                return res.send(req.fileValidationError);
            } else if (!req.file) {
                return res.send('Please select an image to upload');
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            }

            await pool.execute('update room set img = ? where id = ?', [req.file.filename, id]);
            // res.send(
            //     `You have uploaded this image: <hr/><img src="/img/${req.file.filename}" width="500"><hr /><a href="./">Upload another image</a>`,
            // );
            return res.redirect(`/detail-roomPrac/${id}`);
        });
    });

    app.get('/admin', adminController.adminPage);
    app.get('/roomPrac', adminController.roomPracPage);
    app.get('/roomTN', adminController.roomTNPage);
    app.get('/calendar', adminController.calendarPage);
    app.get('/history', adminController.historyPage);
    app.get('/schedule', adminController.schedulePage);
    app.get('/manage-student', adminController.manageStudentPage);
    app.get('/detail-roomPrac/:id', adminController.detailroomPracPage);
>>>>>>> 1420cef62bfa318df40d9d214a8fe67798c87f90

    //CRUD student
    app.post('/create-new-student', manageStudentController.createNewStudent);
    app.get('/edit-student/:id', manageStudentController.editStudent);
    app.post('/post-edit-student', manageStudentController.postEditStudent);
    app.post('/delete-student/:id', manageStudentController.deleteStudent);

    //CRUD Phong TH
<<<<<<< HEAD
    app.post('/create-newDevice/:id', deviceController.createNewDevice)
=======
    app.post('/create-newroomPrac', roomController.createNewroomPrac);
    app.post('/delete-roomPrac/:id', roomController.deleteroomPrac);
    app.get('/edit-roomPrac/:id', roomController.editroomPrac);
    app.post('/post-edit-roomPrac', roomController.postEditRoom);
>>>>>>> 1420cef62bfa318df40d9d214a8fe67798c87f90

    //CRUD device
    app.post('/create-newTB', roomController.createNewDevice);
    app.post('/delete-device', roomController.deleteDevice);
    app.post('/edit-device', roomController.editDevice);
    app.post('/post-edit-device', roomController.postEditDevice);

    //CRUD schedule
    app.get('/views-add/schedule', scheduleController.viewAddSchedule);
    app.post('/views-add/create-newSchedule', scheduleController.createNewSchedule);
    app.post('/edit-schedule', scheduleController.editSchedule);
    app.post('/post-edit-schedule', scheduleController.postEditSchedule);
    app.post('/delete-schedule', scheduleController.deleteSchedule);

    return app.use('/', router);
};

<<<<<<< HEAD
    //Detail room TH
    

    return app.use('/', router)
}

export default initAdminPage
=======
export default initAdminPage;
>>>>>>> 1420cef62bfa318df40d9d214a8fe67798c87f90
