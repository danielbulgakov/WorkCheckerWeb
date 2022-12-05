var express = require('express');
var router = express.Router();
var path = require('path');
var Users = require("../private/controllers/users_control.js");
var Grades = require("../private/controllers/grades_control.js");
var Work = require("../private/controllers/work_control.js");
var UpControl = require('../private/controllers/file_upload.js');
const {work, FreeCache} = require("../private/controllers/work_control");
const {sendMarks} = require("../private/controllers/grades_control");

router.get('/', function(req, res, next) {
    res.render('welcome', { title: 'Систему оценки работ!' });
});

router.get('/signin', function(req, res, next) {
    res.render('signin', { label_mode: 'hidden' , mes: '' });
});

router.post('/signin', function(req, res, next) {
    Users.findUser(req, res, next);
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { label_mode: 'hidden' , mes: '' });
});

router.post('/signup', function(req, res, next) {
    Users.findAndAddUser(req, res, next);
});

// profile roouter
router.get('/profile', Users.checkAccess, function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/profile.html'));
});

router.get('/profile/logout', Users.checkAccess, function(req, res, next) {
    if (req.session) {
        req.session.destroy(function() {});
    }
    FreeCache();
    res.redirect('/')
});

router.get('/profile/upload', Users.checkAccess, function(req, res, next) {
    res.render('profile_upload', { label_err_mode: 'hidden', mes_err: '',
                                            label_info_mode: 'hidden', mes_info: ''});
});

router.post('/profile/upload',  function(req, res, next) {
    UpControl.upload(req,res,function(err) {
        console.log("HERE1");
        if(err) {
            res.render('profile_upload', { label_err_mode: '', mes_err: err,
                                                    label_info_mode: 'hidden', mes_info: ''});
        }
        else {
            res.render('profile_upload', { label_err_mode: 'hidden', mes_err: err,
                                                    label_info_mode: '', mes_info: 'Успешно отправлено'});
        }
    })
});

router.get('/profile/mygrades', Users.checkAccess, function(req, res, next) {
    Grades.sendListOfGrades(req, res);
});

router.get('/profile/grade', Users.checkAccess, function(req, res, next) {
    Grades.sendGradePool(req, res);
});

router.post('/profile/grade', Users.checkAccess, function(req, res, next) {
    // console.log(JSON.parse(req.body.button));
    Work.work = JSON.parse(req.body.button).work;
    Work.id = JSON.parse(req.body.button).login;
    res.redirect('/profile/grade/work');

});

router.get('/profile/grade/work', Users.checkAccess, function(req, res, next) {
    // var pathh = Work.ConvertToPDF(Work.id, Work.work);
    var p = path.join('work', "getfile" );
    res.render('work_grade', {href : p } );
});

router.post('/profile/grade/work', Users.checkAccess, function(req, res, next) {
    console.log(req.body);
    Grades.addGrade(Work.work, Work.id, req.body.radio_list, req.body.comment, res);
});

router.get('/profile/grade/work/*', Users.checkAccess, function(req, res, next) {
    console.log("sended");
    Work.ConvertToPDF(Work.id, Work.work, res);

});

router.post('/profile/mygrades/view', Users.checkAccess, function(req, res, next) {
    var works = JSON.parse(req.body.button).work;
    var logins = JSON.parse(req.body.button).login;
    Grades.sendMarks(works, logins, req, res);

});



module.exports = router;
