const fastify = require('fastify');
const app = fastify({logger: true});
const crypto = require('crypto');
const PORT = '3306';
const logins = [];

/*
app.register(require('@fastify/mysql'), {
    connectionString: 'mysql://root@localhost/mysql'
});
  
app.get('/user/:id', (req, reply) => {
    app.mysql.query(
        'SELECT id, username, hash, salt FROM users WHERE id=?', [req.params.id],
        function onResult (err, result) {
            reply.send(err || result)
        }
    )
});
*/

app.get('/all/', (request, response)=>{
    response.send(logins);
});


app.get('/user/:userId', (request, response)=>{
    var userId = request.params.userId;
    logins.forEach((login)=>{
        if(login.id === userId){
            response.send(login);
        }
    });
});


app.post('/user/', (request, response)=>{
    var {email, password} = request.body;
    var login = {
        email,
        password,
        id: crypto.randomUUID(),
    };

    logins.push(login);
    
    response.send({message: "User added with sucess"});
});

app.delete('/user/:userId', (request, response)=>{
    var userId = request.params.userId;
    logins.forEach((login, index)=>{
        if(login.id === userId){
            logins.splice(index, 1);
            response.send({message: "User deleted with sucess"});
        }
    });

    response.send({message: "User cant be finded"});
});

app.put('/user/:userId', (request, response)=>{
    var userId = request.params.userId;
    var {email, password} = request.body;

    logins.forEach((login, index)=>{
        if(login.id === userId){
            logins[index] = {
                email,
                password,
                userId,
            }
            response.send({message: "User modified"});
        }
    });
    
    response.send({message: "User cant be finded"});
});


app.listen({port: PORT}, (err, adress)=>{
    if(err) throw err
    console.log('server is running on '+adress);
});
