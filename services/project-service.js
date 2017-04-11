var AuthService = require('./auth-service');
module.exports = class ProjectService {
	constructor(db){
		this.db = db;
		this._authService = new AuthService(db);
	}

	createProject(cb, data) {
		let user = data.user;
		let project = data.project;

		project = {
			'name': project.name,
			'userID': user.ID,
			'description': project.description,
			'type': project.type,
			'uuid': this._authService._createUUID()
		}

		this._authService.verifyUser(user.ID, user.token, (res) => {
			if(res){
				this.db.collection('projects').insert(project, (err, res) => {
					if(err) throw err;
					else cb({ status: 200, project: project });
				});
			} else {
				cb({ status: 401, message: 'Not Authorized'});
			}
		})
		
	}

	deleteProject(cb, data) {
		this._authService.verifyUser(user.ID, user.token, (res) => {
			if(res){
				this.db.collection('projects').remove({uuid: data.uuid, userID: data.userID}, (err, res) => {
					if(err) throw err;
					else cb({ status: 200, message: 'Deleted the project' });
				});
			} else {
				cb({ status: 401, message: 'Not Authorized'});
			}
		})
	}

	// Maybe this should be split into individual stuffs
		//editProjectName()
		//editProjectImage()
		//editProjectDescription()
		//editProjectStartDate()

	editProject(cb) {

	}

	addTransaction(cb) {
		//Adds a transaction to a project you own
	}

	removeTransaction(cb) {
		//Removes a transactions associated to a project you own
	}

	editTransaction(cb) {
		//Changes a transactions associated to a project you own
	}

	addMilestone(cb) {

	}

	editMilestone(cb) {

	}

	deleteMilestone(cb) {

	}

	checkMilestone(cb) {

	}

	completeMilestone(cb) {

	}

	getProject(cb) {

	}
}