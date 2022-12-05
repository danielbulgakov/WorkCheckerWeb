var connection = require("./db");
var fs = require('fs')
var path = require('path');


function sendListOfGrades (req, res) {
    connection.query("SELECT work_id, cast(avg(mark) as decimal(5,2)) FROM grades WHERE user_id=$1 GROUP BY (work_id)",[ req.session.user_id], function(err, output){
        if (err){
            console.log(err);
            res.send('Ошибка получения данных');

        }
        else {
            var array = [];
            for(var i = 0; i < output.rows.length; i++) {
                array.push([output.rows[i].work_id, output.rows[i].avg]);
            }
            var spath = path.join(__dirname , "../../docs" , req.session.user_id);
            if (!fs.existsSync(spath)){ res.render(
                'profile_grades', { arrayf : array});
                return;
            };
            var files = fs.readdirSync(spath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                return files;

            });
            files.forEach(function (file) {
                if (array.findIndex(([first, second]) => (first === file )) == -1){
                    array.push([file, '0']);

                }
            });


            res.render('profile_grades', { arrayf : array});

        }
    });
}

function sendGradePool(req, res) {
    connection.query("SELECT work_id, user_id, count(mark) cnt FROM grades WHERE user_id!=$1 " +
        "GROUP BY (user_id, work_id) ORDER BY cnt asc",[ req.session.user_id], function(err, output){
        if (err){
            console.log(err);
            res.send('Ошибка получения данных');
        }
        else {
            var arrayMarked = [], arrayNotMarked = [], arrayUsers = [], pool = [];
            for(var i = 0; i < output.rows.length; i++) {
                arrayMarked.push([output.rows[i].user_id, output.rows[i].work_id, output.rows[i].cnt]);
            }
            var spath = path.join(__dirname , "../../docs" );
            var files = fs.readdirSync(spath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                return files;

            });
            files.forEach(function (usr) {
                if (usr === req.session.user_id) return;
                var docs = fs.readdirSync(path.join(spath, usr), function (err, files) {
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    return files;
                });
                docs.forEach(function (doc) {
                    if (arrayMarked.findIndex(([first, second, third]) => (second === doc )) == -1){
                        arrayNotMarked.push([usr, doc]);
                    }
                })
            })
            var mar, nmar;
            nmar = arrayNotMarked.length > 3 ? 3 : arrayNotMarked.length;
            mar = arrayMarked.length > 3 - nmar ? 3 - nmar : arrayMarked.length;
            for(let i=0; i<nmar ;i++) {pool.push([arrayNotMarked[i][0], arrayNotMarked[i][1]])}
            for(let i=0; i<mar ; i++) {pool.push([arrayMarked[i][0], arrayMarked[i][1]])}


            res.render('profile_to_grade_list', { arrayf : pool});
        }
    });
}

function addGrade(work_id, usr_id, mark, comment, res) {
    connection.query("INSERT INTO grades (work_id, user_id, mark, comment) " +
        "VALUES( $1 , $2, $3, $4);", [work_id, usr_id, mark, comment], function(err){
        if (err){
            res.send("Ошибка с БД : " + err);
        }
        else {
            res.redirect('/profile');
        }
    });
}
function sendMarks(work_id, usr_id, req,  res) {
    console.log(req.session.user_id, usr_id);
    connection.query("SELECT mark, comment FROM grades WHERE user_id=$1 AND work_id=$2", [req.session.user_id, usr_id], function(err, output){
        if (err){
            res.send("Ошибка с БД : " + err);
        }
        else {
            var array = [];
            console.log(output.rows);
            for(var i = 0; i < output.rows.length; i++) {
                array.push([output.rows[i].mark, output.rows[i].comment]);
            }
            res.render('my_work_grade', { arrayf : array});
        }
    });
}



module.exports = { sendListOfGrades, sendGradePool, addGrade, sendMarks}
