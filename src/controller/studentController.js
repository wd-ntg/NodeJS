

const studentPage = (req, res) => {
    return res.render('student/student.ejs')
}

const studentController = {
    studentPage: studentPage
}

export default studentController