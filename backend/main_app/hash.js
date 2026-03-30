
const bcrypt=require('bcrypt');

async function hashing(password){
  
    try{
    const salt= await bcrypt.genSalt(10)
    const hashpass= await bcrypt.hash(password,salt)
    return hashpass;
    }
    catch(err){
        // console.log(err)
    }
}

async function checkpass(password,dbpass){
    try{
    const checkpass= await bcrypt.compare(password,dbpass)
    // console.log("checkpass",checkpass)
    return checkpass;
    }
    catch(err){
        // console.log(err)

    }

}

module.exports={
    hashing,checkpass
}