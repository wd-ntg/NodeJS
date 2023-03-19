import express from 'express'
import studentController from '../controller/studentController'

const router = express.Router()

const initStudentPage = (app) => {
    app.get('/student', studentController.studentPage)
    return app.use('/', router)
}

export default initStudentPage