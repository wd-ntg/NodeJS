import express from 'express';
import studentController from '../controller/student/studentController';

const router = express.Router();

const initStudentPage = (app) => {
    app.get('/student', studentController.studentPage);
    app.get('/booking', studentController.bookingPage);
    app.get('/view-student/detail-room/:id', studentController.viewDetailRoomForStudent);
    app.get('/contact', studentController.contactStudent);
    app.get('/news', studentController.newsStudent);
    app.post('/booking-confirm', studentController.bookingConfirm);

    app.get('/history-student', studentController.historyStudent);

    app.post('/student-info', studentController.studentInfo);

    return app.use('/', router);
};

export default initStudentPage;
