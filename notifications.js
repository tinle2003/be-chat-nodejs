const Admin = require('./apps/middlewares/firebase')
const sendNotification = (messages)=>{
    Admin.messaging().send(messages).then((data)=>console.log(data)).catch(err=>{
        console.log(err)
    })
}

const messages = {
    notification:{
        title:"",
        body:"asdasdasd",
    },
    token:"e5QummA3FwQ:APA91bHRMSJeSH1sUPE2iJ6_gz3S8dZVs5UQtJwKW5aRmsJCdRxX1ZMfWgF3DNaY4Tk-WJMKPMZA-9nJJK1J4VSLW6ihMpQYrWyxYZ7J4DM0eyu3WsMCTVCps8QO_oL0ivxffGaTTuua"
}

sendNotification(messages)