import express from 'express'
//import { adminPage } from '../controller/adminController'
import adminController from '../controller/adminController'
import { createNewStudent, editStudent, deleteStudent, postEditStudent } from '../service/adminService'

const router = express.Router()

const initAdminPage = (app) => {
    app.get('/admin', adminController.adminPage)
    app.get('/roomTH', adminController.roomTHPage)
    app.get('/roomTN', adminController.roomTNPage)
    app.get('/calendar', adminController.calendarPage)
    app.get('/history', adminController.historyPage)
    app.get('/manage-student', adminController.manageStudentPage)
   

    //CRUD student
    app.post('/create-new-student', createNewStudent)
    app.get('/edit-student/:id', editStudent)
    app.post('/post-edit-student', postEditStudent)
    app.post('/delete-student/:id', deleteStudent)

    //CRUD Phong TH

    //app.get('/get-allroomTH', adminController.getAllRoomTH)
    app.post('/create-newroomTH', adminController.createNewRoomTH)
    app.post('/delete-roomTH/:id', adminController.deleteRoomTH)
    app.get('/edit-roomTH/:id', adminController.editRoomTH)
    app.post('/post-edit-roomTH', adminController.postEditRoom)
    

    return app.use('/', router)
}

export default initAdminPage