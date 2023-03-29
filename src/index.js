import express from 'express';
import configViewEngine from './config/viewEngine';
import initAdminPage from './router/admin';
import initStudentPage from './router/student';

const app = express();
const port = 2080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);
initAdminPage(app);
initStudentPage(app);

app.get('/', (req, res) => {
    res.render('admin/login.ejs');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
