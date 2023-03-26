import express from 'express';
import studentController from '../controller/student/studentController';

const router = express.Router();

const initStudentPage = (app) => {
    app.get('/student', studentController.studentPage);
    app.get('/booking', studentController.bookingPage);
    app.get('/view-student/detail-room/:id', studentController.viewDetailRoomForStudent);
    app.post('/booking-confirm', studentController.bookingConfirm);
    return app.use('/', router);
};

export default initStudentPage;
