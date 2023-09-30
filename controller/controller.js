const { getDb } = require('../models/mongodb');
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt');


function home(req, res) {
    if (req.session.isauth) {
        res.redirect('/home');
    } else if (req.session.isad) {
        res.redirect('/admin');
    } else {
        res.render('login', { err: false });
    }
}




function sign(req, res) {
    if (req.session.isauth) {
        res.redirect('/home')
    } else {

        res.render('signup', { err: false });
    }
}





const admin = async (req, res) => {
    const serverdata = await getDb().collection('userdata').find({ role: "user" }).toArray();
    try {
        if (req.session.isad) {
            res.render('admin', { serverdata });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
}




const login = async (req, res) => {
    try {
        const user = await getDb().collection('userdata').findOne({
            email: req.body.email,
        });
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            if (user.access === "granted" || user.role === "admin") {
                req.session.user = user.email;
                if (user.role === "admin") {
                    req.session.isad = true;
                    res.redirect('/admin');
                } else {
                    req.session.isauth = true;
                    res.redirect('/home');
                }
            } else {
                res.render('login', { err: "Invalid username or password." });
            }
        } else {
            res.render('login', { err: "Invalid username or password." });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
}





const editid = async (req, res) => {
    const id = req.params.id
    const onedata = await getDb().collection('userdata').findOne({ _id: new ObjectId(id) });
    try {
        if (req.session.isad) {
            res.render('edit', { onedata });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log(error.message);
    }

}





const signup = async (req, res) => {
    let emailToFind = req.body.email;
    let emailExists = await getDb().collection('userdata').findOne({ email: { $exists: true, $eq: emailToFind } }) !== null;
    if (emailExists) {
        res.render('signup', { err: "User already exists" });
    } else {
        if (req.body.firstname.trim() === "" || req.body.secondname.trim() === "") {
            res.render('signup', { err: "First Name and Second Name cannot be empty or contain only spaces." });
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const data = {
                firstname: req.body.firstname,
                secondname: req.body.secondname,
                email: req.body.email,
                role: "user",
                access: "granted",
                password: hashedPassword,
            };
            if (req.body.password === req.body.confirmpassword) {
                try {
                    const result = await getDb().collection('userdata').insertOne(data);
                    console.log('Inserted document with ID:', result.insertedId);
                    req.session.isauth = true;
                    res.redirect('/');
                } catch (error) {
                    console.error('Error inserting document:', error);
                }
            } else {
                res.render('signup', { err: "Passwords do not match" });
            }
        }
    }
}




const add = async (req, res) => {
    let emailToFind = req.body.email;
    let emailExists = await getDb().collection('userdata').findOne({ email: { $exists: true, $eq: emailToFind } }) !== null;
    if (emailExists) {
        res.render('adduser', { err: "user already exists" })
    } else {
        if (req.body.firstname.trim() === "" || req.body.secondname.trim() === "") {
            res.render('adduser', { err: "First Name and Second Name cannot be empty or contain only spaces." });
        } else {
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const data = {
                firstname: req.body.firstname,
                secondname: req.body.secondname,
                email: req.body.email,
                role: "user",
                access: "granted",
                password: hashedPassword,
            };
            if (req.body.password === req.body.confirmpassword) {
                try {
                    const result = await getDb().collection('userdata').insertOne(data);
                    console.log('Inserted document with ID:', result.insertedId);
                    res.redirect('/')
                } catch (error) {
                    console.error('Error inserting document:', error);

                }
            } else {
                res.render('signup', { err: "Passwords do not match" });
            }
        }
    }
}




function adduser(req, res) {
    res.render('adduser', { err: false });
}



const deleteid = async (req, res) => {

    const id = req.params.id;
    await getDb().collection('userdata').deleteOne({ _id: new ObjectId(id) })
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        })
}




const updateid = async (req, res) => {
    const id = req.params.id;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    await getDb().collection('userdata').updateOne({ _id: new ObjectId(id) }, {
        $set: {
            firstname: req.body.firstname,
            secondname: req.body.secondname,
            email: req.body.email,
            role: "user",
            access: "granted",
            password: hashedPassword
        }
    })
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err);
        })

}


const grandid = async (req, res) => {
    const id = req.params.id;
    await getDb().collection('userdata').updateOne({ _id: new ObjectId(id) }, {
        $set: {
            access: "granted"
        }
    })
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err);
        })
}



const blockid = async (req, res) => {
    const id = req.params.id;
    await getDb().collection('userdata').updateOne({ _id: new ObjectId(id) }, {
        $set: {
            access: "blocked"
        }
    })
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err);
        })
}



const search = async (req, res) => {
    const searchQuery = req.query.query;
    const serverdata = await getDb().collection('userdata').find({
        firstname: {
            $regex: "^" + searchQuery, $options: "i"
        }
    }).toArray();

    try {
        if (req.session.isad) {
            res.render('admin', { serverdata });
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
}



function logout(req, res) {
    req.session.destroy();
    res.redirect('/');
}


function homepage(req, res) {
    if (req.session.isauth) {
        res.render('home');
    } else {
        res.redirect('/');
    }
}

module.exports = {
    home,
    sign,
    admin,
    login,
    editid,
    signup,
    add,
    adduser,
    deleteid,
    updateid,
    grandid,
    blockid,
    search,
    logout,
    homepage
}