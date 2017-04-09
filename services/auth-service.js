const crypto = require('crypto');

module.exports = class AuthService {
	constructor(db){
		this.db = db;
	}

	_createUUID() {
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( c ) => {
			let r = ( d + Math.random() * 16 ) % 16 | 0;
			d = Math.floor( d / 16 );
			return( c == 'x' ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
		});
	}

	_createHash(data){
		return crypto.createHash('md5').update(data).digest('hex');
	}

	getMinutesBetweenDates(startDate, endDate) {
	    var diff = endDate.getTime() - startDate.getTime();
	    return (diff / 60000);
	}

	verifyToken(token, cb) {
		this.db.collection('users').find( { device_token: token.toString() } ).toArray((err, data) => {
			// Here we could set the user's token to something else and then return the new user to the client
			// so they'd be getting a new token each request. This would make it literally impossible to crack.
			cb(data.length ? true : false);
		});
	}

	register(data, cb){
		if(data.username.length > 0 
			&& data.email.length > 0 
			&& data.password.length > 0 
			&& (data.password_confirm.length > 0 
				&& data.password_confirm == data.password)
		){
			this.db.collection('users').find( { email: data.email } ).toArray((err, res) => {
				if(res.length < 1){
					this.db.collection('users').find( { username: data.username } ).toArray((err, res2) => {
						if(res2.length < 1){
							let password_hash = this._createHash(data.password);
							let token = this._createUUID();
							let user = { username: data.username, password: password_hash, email: data.email, token: token};
							this.db.collection('users').insert(user, (err, final_res) => {
								if(err) throw err;
								else cb({ status: 200, user: user });
							});
						} else {
							cb({ status: 401, error: 'The username provided is already in use.' });
						}
					});
				} else {
					cb({ status: 401, error: 'The email provided is already in use.' });
				}
			});
		} else {
			cb({ status: 401, error: 'Either not all fields were filled out or the password did not match the password confirm' });
			
		}
	}

	login(data, cb) {
		let password_hash = crypto.createHash('md5').update(data.password).digest('hex');
		this.db.collection('users').find( { password: password_hash, username: data.username } ).toArray((err, retrieve_data) => {
			if(retrieve_data.length == 1){
				let token = this._createUUID();
				this.db.collection('users').update({password: password_hash, username: retrieve_data[0].username}, {$set : {token: token}}, (err, update_data) => {
					cb({
						username: retrieve_data[0].username,
						email: retrieve_data[0].email,
						remember_me: retrieve_data[0].remember_me,
						token: token
					});
				});
			} else {
				cb(false);
			}
		});
	}


	forgotPasswordEmail(email, cb) {
			this.db.collection('users').find( { email: email } ).toArray((err, data) => {
				if(data.length == 1){
					let code = Math.random().toString(36).substr(2, 5);
					this.db.collection('users').update({email: email, token: data[0].token}, {$set: {changePassToken: code, changeTimestamp: new Date().getTime()}}, (err, update_res) => {
						fs.readFile('util/forgotPassEmail.html', function (err, html) {
							let file = html.toString().replace(/#code#/, code);
						    if (err) {
						        throw err; 
						    } 
						    // create reusable transporter object using the default SMTP transport
						    let transporter = nodemailer.createTransport({
						        service: 'gmail',
						        auth: { user: 'sabintheworld@gmail.com', pass: '798140S@b1n@d@mz' }
						    });

						    // setup email data with unicode symbols
						    let mailOptions = {
						        from: 'Revynu', // sender address
						        to: email, // list of receivers
						        subject: 'Reset Password Verification Code', // Subject line
						        html: file// html body
						    };

						    // send mail with defined transport object
						    transporter.sendMail(mailOptions, (error, info) => {
						        if (error) {
						        	console.log(error);
						            cb({ status: 401, message: "There was a problem sending the email." });
						        }
						        cb({ status: 200, message: `An email containing the verification code was sent to ${email}. This code is valid for 15 minutes.` });
						    });   

						});
						
					});
				} else {
					cb({ status: 401, message: 'There was no user with that email.' });
				}
			});
		}

		forgotPasswordChangePass(data, cb){
			this.db.collection('users').find( {changePassToken: data.code} ).toArray((err, res) => {
				if(res.length == 1){
					let user = res[0];
					if(user.newPass != user.newPassConfirm){
						cb({ status: 401, message: 'The password did not match the confirm password' });
					}
					let currTime = new Date().getTime();
					if(this.getMinutesBetweenDates(new Date(user.changeTimestamp), new Date(currTime) ) <= 15){
						let password_hash = crypto.createHash('md5').update(data.newPass).digest('hex');
						this.db.collection('users').update({token: user.token, password: user.password}, {$set: {password: password_hash, changePassToken: Math.random().toString(36)}}, (err, change_res) => {
							if(err) throw err;
							cb({
								status:200,
								message: "Password changed",
								timetaken: this.getMinutesBetweenDates(new Date(user.changeTimestamp), new Date(currTime))
							});
						});
					} else {
						cb({
							status:401,
							message: "Time limit passed",
							timetaken: this.getMinutesBetweenDates(new Date(user.changeTimestamp), new Date(currTime))
						});
					}
				} else {
					cb({ status: 401, message: "Invalid code." });
				}
			});
		}

}