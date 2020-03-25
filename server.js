const http = require('http');

const app = require('./app')


// when we create a server we need to pass a listen to req ( app :function executed whenever we get a req)
const server = http.createServer(app);


// Acces node js env vars and that's would be set on the server i deploy on -- hosting providers give UDID
const PORT = process.env.PORT || 3000;





server.listen(PORT,()=>{
    console.log(`App is running on the server : ${PORT}`);
    
})