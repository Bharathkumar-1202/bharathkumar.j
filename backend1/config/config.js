require('dotenv').config()//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development'
CONFIG.port = process.env.PORT || '3100'
CONFIG.db_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/network_database'
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'network'
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000'
CONFIG.adminCode= process.env.adminCode || 'admin@123'
CONFIG.userType=['User','Principal','Hod','Staff']
CONFIG.employeeId=['MCA123','MSCCS123','MSCIT123','BCA123','BSCCS123','BSCIT123']



CONFIG.department=['MCA','MSC CS','MSC IT',"BCA",'BSC CS','BSC IT','Network']
CONFIG.issueType=['No internet','Slow Internet','System maintenance','Software Installation']
CONFIG.send_email = process.env.SEND_EMAIL || 'true'

CONFIG.mg_key = '1f14630ef0ef0565fa67e1de2a3cf3a0-4de08e90-056779d1'
CONFIG.mg_domain = 'sandbox87b6cf21bbfb4d58aed492e4e480c3fa.mailgun.org'



module.exports = CONFIG