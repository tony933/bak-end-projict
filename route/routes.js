var express = require('express'),
    router = express.Router(),
    promiseQuery = require("../database/librydb"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    jwt_decode = require('jwt-decode'),
    schedule = require('node-schedule'),
    tookendekod = "",
    categoryid = "",
    cors = require('cors'),
    bookid = "",
    authorid = "",
    { registerValidation, loginValidation } = require('../validation/validation');
var path = require('path');
var corsOptions = {
    origin: 'http://127.0.0.1:5501',
    optionsSuccessStatus: 200 // For legacy browser support
}
router.use(cors(corsOptions));

var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 1);

schedule.scheduleJob(rule, async function () {
    const result = await promiseQuery('delete from resrvation where date < now() - interval 2 DAY;');

});

//=========
//Registr Route 
//=========
router.post('/ragister', cors(), async (req, res) => {
    // Check user validation
    const error = await registerValidation(req.body);
    if (error) return res.status(400).json({ validateError: error });
    const { userName, email, password } = req.body;

    //Hash password
    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(password, salt);
    var today = new Date();
    //check Email Existence
    const result = await promiseQuery('SELECT user_email FROM user WHERE user_email = ?', [email]);
    if (result.length > 0) return res.status(400).json({ validateError: "Email is already exists" });

    var sql = "INSERT INTO user (user_name,user_email, user_password ,user_register_date , admin ) VALUES ?";
    //Make an array of values:
    var values = [
        [userName, email, hash, today, true],
    ];
    //Execute the SQL statement, with the value array:


    const register = await promiseQuery(sql, [values]);
    if (register) return res.status(200).json({ regist: "successful" });
})
//=========
//Login Route
//=========
router.post('/login', cors(), async function (req, res) {
    // Check  validation
    const error = await loginValidation(req.body);
    if (error) return res.status(400).json({ validateError: error });
    const { email, password } = req.body;
    // Check emaill
    const results = await promiseQuery('SELECT * FROM user WHERE user_email = ? limit 1', [email]);
    if (results.length == 0) return res.status(400).json({ emailError: 'Email is wrong' });
    // Check paswword
    const compuer_password = await bcrypt.compareSync(password, results[0].user_password);
    if (!compuer_password) return res.status(400).json({ passwordError: 'Invalid password' });
    // Generate a token for the user 
    const id = results[0].user_id;
    const token = jwt.sign({ id }, process.env.jwt_SECRET, {
        expiresIn: process.env.jwt_EXPIRES_IN
    });
    console.log('jwt', token)
    console.log(results[0].admin)

    res.status(200).json({ jwt: token , role:results[0].admin});
});
//=========
//jwt_decode function
//=========
//   function jwtdecod (){
//     if (!tookendekod) return res.status(400).json({  Error: 'no jwt' });;
//     var decoded = jwt_decode(tookendekod);
// return decoded.id;
//   }

//=========
//category Route
//=========
router.post('/category', cors(), async (req, res) => {
    const { categoryName, name_book, year_book, user_id, numper_book, dec_book, book_image, authorName } = req.body;
    console.log(year_book)
    // var id_decode = jwtdecod();
    //check category Existence
    const result = await promiseQuery('SELECT * FROM category WHERE category_name = ?', [categoryName]);

    if (result.length > 0) {
        categoryid = result[0].category_id;
        console.log(categoryid);
    } else {
        var sql = "INSERT INTO category (category_name,user_id ) VALUES ?";
        //Make an array of values:
        var values = [
            [categoryName, user_id],
        ];
        //Execute the SQL statement, with the value array:
        const register = await promiseQuery(sql, [values]);
        categoryid = register.insertId;
    }
    //=========
    //book Route
    //=========
    var sqlbook = "INSERT INTO book (book_name,user_id,book_year,book_nopages,book_description,book_image ) VALUES ?";
    //Make an array of values:
    var values = [
        [name_book, user_id, year_book, numper_book, dec_book, book_image],
    ];
    //Execute the SQL statement, with the value array:
    const registerbook = await promiseQuery(sqlbook, [values]);
    bookid = registerbook.insertId;
    console.log(bookid)
    //=========
    //author Route
    //=========
    // check author Existence
    const resultauthor = await promiseQuery('SELECT * FROM author WHERE author_name = ?', [authorName]);
    if (resultauthor.length > 0) {
        authorid = resultauthor[0].author_id;
        console.log(authorid);
    } else {
        var sqlauthor = "INSERT INTO author (author_name,user_id ) VALUES ?";
        //Make an array of values:
        var values = [
            [authorName, user_id],
        ];
        //Execute the SQL statement, with the value array:
        const registerauthor = await promiseQuery(sqlauthor, [values]);
        authorid = registerauthor.insertId;
        console.log(authorid)
    }

    var sqlauthorbook = "INSERT INTO author_book (author_id,book_id ) VALUES ?";
    //Make an array of values:
    var values = [
        [authorid, bookid],
    ];
    //Execute the SQL statement, with the value array:
    const registerauthorbook = await promiseQuery(sqlauthorbook, [values]);
    var sqlcatogorybook = "INSERT INTO catogory_book (category_id,book_id ) VALUES ?";
    //Make an array of values:
    var values = [
        [categoryid, bookid],
    ];
    //Execute the SQL statement, with the value array:
    const registecatogrybook = await promiseQuery(sqlcatogorybook, [values]);
    if (registecatogrybook) return res.status(200).json({ ok: "successful" });
})
router.post('/resva', async (req, res) => {
    // var id_decode = jwtdecod();
    var bookid = req.body.bookid;
    var user_id = req.body.user_id
    var today = new Date();
    const result1 = await promiseQuery('  SET FOREIGN_KEY_CHECKS = 0;');

    const result = await promiseQuery('SELECT book_id FROM resrvation WHERE book_id = ?', [bookid]);
    if (result.length > 0) return res.status(400).json({ validateError: "book is already resrvation" });
    var sql = "INSERT INTO resrvation (book_id,user_id,date ) VALUES ?";
    //Make an array of values:
    var values = [
        [bookid, user_id, today],
    ];
    //Execute the SQL statement, with the value array:
    const register = await promiseQuery(sql, [values]);
    if (register) return res.status(200).json({ ok: "successful" });
})

router.post('/delevery', async (req, res) => {
    var user_id = req.body.user_id
    var bookid = req.body.bookid;
    var today = new Date();
    var street = req.body.street;
    const result1 = await promiseQuery('  SET FOREIGN_KEY_CHECKS = 0;');

    const result = await promiseQuery('SELECT book_id FROM delevery WHERE book_id = ?', [bookid]);
    if (result.length > 0) return res.status(400).json({ validateError: "book is already resrvation" });
    var sql = "INSERT INTO delevery (book_id,user_id,user_stahen,register_date	 ) VALUES ?";
    //Make an array of values:
    var values = [
        [bookid, user_id, street, today],
    ];
    //Execute the SQL statement, with the value array:
    const register = await promiseQuery(sql, [values]);
    if (register) return res.status(200).json({ ok: "successful" });
})
router.get('/getdelvery', async (req, res) => {

    const result1 = await promiseQuery('select book.book_name, user.user_name, delevery.user_stahen  from delevery  inner  join book on (book.book_id = delevery.book_id) inner join user on (user.user_id = delevery.user_id)  ');

    res.json({ resrvation: result1 });
});
router.get('/getbook', async (req, res) => {
    const result = await promiseQuery('select author.author_name,book.book_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image from author_book inner join author on (author.author_id =author_book.author_id ) inner join book on (book.book_id = author_book.book_id)');

    const result1 = await promiseQuery('select book.book_name, user.user_name from resrvation  inner  join book on (book.book_id = resrvation.book_id) inner join user on (user.user_id = resrvation.user_id)');

    res.json({ booik: result, resrvation: result1 });
});
// router.get('/get1', async (req, res) => {
//     const result = await promiseQuery('delete from resrvation where date < now() - interval 2 DAY;');
//     res.json({booik:result });
// });
// router.get('/get1', async (req, res) => {
//     const result = await promiseQuery('select book.book_name, user.user_name from resrvation  inner  join book on (book.book_id = resrvation.book_id) inner join user on (user.user_id = resrvation.user_id)');
//     res.json(result);
// });
router.get('/search/:iteam', async (req, res) => {
    var search = req.params.iteam;
    console.log(search)
    var bookName = await promiseQuery(`select author.author_name,book.book_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image from author_book inner join author on (author.author_id =author_book.author_id ) inner join book on (book.book_id = author_book.book_id) WHERE book_name LIKE ?`, '%' + search + '%');
    authorName = await promiseQuery(`select author.author_name,book.book_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image from author_book inner join author on (author.author_id =author_book.author_id ) inner join book on (book.book_id = author_book.book_id) WHERE author_name LIKE ?`, '%' + search + '%');
    yearBook = await promiseQuery(`select author.author_name,book.book_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image from author_book inner join author on (author.author_id =author_book.author_id ) inner join book on (book.book_id = author_book.book_id) WHERE book_year LIKE ?`, '%' + search + '%');
    res.json({ Book: bookName, Author: authorName, Year: yearBook });

});
router.get('/catog', async (req, res) => {
    const result = await promiseQuery('SELECT * FROM category');
    res.json(result);
});
var categor = "";
router.get('/catogall/:id', async (req, res) => {
    categoryid = req.params.id;
    console.log(categoryid)
    categor = categoryid
    console.log(categor)

    const result = await promiseQuery('select book.book_id,category.category_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image,category.category_name from book  join catogory_book on (book.book_id = catogory_book.book_id)  join category on (category.category_id =catogory_book.category_id  ) WHERE category.category_id = ?', [categoryid]);
    res.json(result);
});
router.get('/bookdetale/:id', async (req, res) => {
    bookid = req.params.id;
    console.log(bookid)


    const result = await promiseQuery(`select author.author_name,book.book_id ,book.book_name ,book.book_year,book.book_nopages ,book.book_description,book.book_image from author_book inner join author on (author.author_id =author_book.author_id ) inner join book on (book.book_id = author_book.book_id) WHERE book.book_id = ?`, [bookid]);
    res.json(result);
});

router.get('/s2', (req, res) => {

    res.sendFile(path.resolve('./test1.html'));


})
module.exports = router