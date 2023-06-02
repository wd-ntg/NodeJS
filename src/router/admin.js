import express from 'express';
//import { adminPage } from '../controller/adminController'
import deviceController from '../controller/deviceController';

import multer from 'multer';
import path from 'path';
import adminController from '../controller/admin/adminController';
import roomController from '../controller/admin/roomController';
import manageStudentController from '../controller/admin/manageStudentController';
import scheduleController from '../controller/admin/scheduleController';
import statisController from '../controller/admin/statisController';
import pool from '../config/connectDB';

import historyController from '../controller/admin/historyController';

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
            let [room] = await pool.execute('select * from room where room.id = ? ', [id]);
            if (room[0].roleid === 'TH') {
                return res.redirect(`/detail-roomPrac/${id}`);
            } else {
                return res.redirect(`/detail-roomLab/${id}`);
            }
        });
    });

    // Get Form Login

    app.get('/form-login', adminController.formLogin);

    // Dieu huong trang

    app.post('/', adminController.submitUser);

    // app.get('/update__page', adminController.updatePage);
    // app.post('/update__acc', adminController.updateAcc);

    app.get('/admin', adminController.adminPage);
    app.get('/roomPrac', adminController.roomPracPage);
    app.get('/roomLab', adminController.roomLabPage);
    app.get('/calendar', adminController.calendarPage);
    app.get('/history', adminController.historyPage);
    app.get('/schedule', adminController.schedulePage);
    app.get('/manage-student', adminController.manageStudentPage);
    app.get('/statis', adminController.statisPage);

    // Detail RoomPrac

    app.get('/detail-roomPrac/:id', adminController.detailroomPracPage);

    // Detail RoomLab

    app.get('/detail-roomLab/:id', adminController.detailroomLabPage);

    //CRUD student
    app.post('/create-new-student', manageStudentController.createNewStudent);
    app.get('/edit-student/:id', manageStudentController.editStudent);
    app.post('/post-edit-student', manageStudentController.postEditStudent);
    app.post('/delete-student/:id', manageStudentController.deleteStudent);

    //CRUD Phong TH
    app.post('/create-newroomPrac', roomController.createNewroomPrac);
    app.post('/delete-roomPrac/:id', roomController.deleteroomPrac);
    app.get('/edit-roomPrac/:id', roomController.editroomPrac);
    app.post('/post-edit-roomPrac', roomController.postEditRoomPrac);

    // CRUD Phong TN
    app.post('/create-newroomLab', roomController.createNewroomLab);
    app.post('/delete-roomLab/:id', roomController.deleteroomLab);
    app.get('/edit-roomLab/:id', roomController.editroomLab);
    app.post('/post-edit-roomLab', roomController.postEditRoomLab);

    //CRUD device
    app.post('/create-newTB', roomController.createNewDevice);
    // app.post('/create-newTB-Lab', roomController.createNewDeviceLab);
    app.post('/delete-device', roomController.deleteDevice);
    app.post('/edit-device', roomController.editDevice);
    app.post('/post-edit-device', roomController.postEditDevice);

    //CRUD schedule
    app.get('/views-add/schedule', scheduleController.viewAddSchedule);
    app.post('/views-add/create-newSchedule', scheduleController.createNewSchedule);
    app.post('/edit-schedule', scheduleController.editSchedule);
    app.post('/post-edit-schedule', scheduleController.postEditSchedule);
    app.post('/delete-schedule', scheduleController.deleteSchedule);

    // History

    app.get('/get-hitory-roomLab', historyController.historyRoomLab);
    app.get('/get-hitory-roomPrac', historyController.historyRoomPrac);

    // Search

    app.post('/search-roomPrac', roomController.searchRoomPrac);
    app.post('/search-roomLab', roomController.searchRoomLab);

    app.post('/search-student', manageStudentController.searchStudent);

    app.post('/search-schedule', scheduleController.searchSchedule);
    app.post('/search-history', historyController.searchHistory);

    // statis
    app.post('/start-statis', statisController.startStatis);
    app.post('/get-all-student-booking', statisController.getAllStudentBooking);
    app.post('/back-statis', statisController.backStatis);

    //sort statis
    app.post('/sort-schedule-statis', statisController.sortScheduleStatis);

    app.post('/search-student-statis', statisController.searchStudentStatis);

    return app.use('/', router);
};

export default initAdminPage;
