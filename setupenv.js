const dotenv = require("dotenv");

const setupDotEnv = () =>{
    try {
        const result = dotenv.config();
        if(result.error) throw result.error  //if error occure during configuration process
        console.log("environment variable setup completed");
    } catch (e) {
        console.log(e);
    }
}

module.exports = setupDotEnv;