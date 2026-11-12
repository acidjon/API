const bcrypt = require("bcrypt");

function home(req, res) {
    if (req.session.loggedin) {

        req.getConnection((err, conn) => {
            if (err) return res.send(err);
            conn.query("SELECT * FROM tasks WHERE task_user = ?", [req.session.name], (err, tasksData) => {
                tasksData.forEach(task => {
                    const fecha= new Date(task.date_task);
                    const yy= fecha.getFullYear();
                    const mm= String(fecha.getMonth() + 1).padStart(2, '0');
                    const dd= String(fecha.getDate()).padStart(2, '0');
                    const hh= String(fecha.getHours()).padStart(2, '0');
                    const mins= String(fecha.getMinutes()).padStart(2, '0');
                    task.date_task= `${yy}-${mm}-${dd} ${hh}:${mins}`;
                    switch (task.status.toLowerCase()) {
                        case "pendiente":
                            task.colorBg = "bg-blue-100 border-blue-300";
                            task.colorText = "text-blue-800";
                            break;
                        case "listo":
                            task.colorBg = "bg-green-100 border-green-300";
                            task.colorText = "text-green-800";
                            break;
                        default:
                            task.colorBg = "bg-gray-100 border-gray-300";
                            task.colorText = "text-gray-800";
                    }
                });
                if (err) return res.send(err);
                res.render("home", {
                    name: req.session.name,
                    orders: tasksData
                });
            });
        });

    } else {
        res.redirect("/login");
    }
}

function renderLogin(req, res) {
    if (req.session.loggedin) {
        res.render("home");
    } else {
        res.render("login");
    }
}

function renderRegister(req, res) {
    if (req.session.loggedin) {
        res.render("home");
    } else {
        res.render("register");
    }
}

function addUser(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM users WHERE email= ?", [data.email], (err, userData) => {
            if (userData.length > 0) {
                return res.render("register", { error: "El correo ya está registrado." });
            } else {
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    req.getConnection((err, conn) => {
                        conn.query("INSERT INTO users SET ?", [data], (err, rows) => {
                            req.session.loggedin = true;
                            req.session.name = data.name;
                            res.redirect("/home");
                        })
                    })
                })
            }
        })
    })
}

function auth(req, res) {
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM users WHERE email= ?", [data.email], (err, userData) => {
            if (userData.length > 0) {
                bcrypt.compare(data.password, userData[0].password, (err, isMatch) => {
                    if (!isMatch) {
                        res.render("login", { error: "Constraseña incorrecta." });
                    } else {
                        req.session.loggedin = true;
                        req.session.name = userData[0].name;
                        res.redirect("/home");
                    }
                })
            } else {
                res.render("login", { error: "El correo no existe." });
            }
        })
    })
}

function addTask(req, res) {
    const data = req.body;
    delete data.id;
    data.date_task = new Date();
    data.task_user = req.session.name;

    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query("INSERT INTO tasks SET ?", [data], (err, rows) => {
            if (err) return res.send(err);
            res.redirect("/home");
        });
    });
}

function logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
}

function deleteTask(req, res) {
    const id = req.params.id;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        conn.query("DELETE FROM tasks WHERE id = ?", [id], (err, rows) => {
            if (err) return res.status(500).send(err);
            res.redirect("/home");
        });
    });
}

function updateTask(req, res) {
    const id = req.params.id;
    const { status } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send(err);

        conn.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id], (err, rows) => {
            if (err) return res.status(500).send(err);

            res.redirect("/home");
        });
    });
}

module.exports = {
    home,
    renderRegister,
    addUser,
    renderLogin,
    auth,
    addTask,
    deleteTask,
    updateTask,
    logout
}