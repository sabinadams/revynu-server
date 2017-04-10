module.exports = class CalculationService {
	constructor(db){
		this.db = db;
	}

	getTransactionsByProject(cb, projectID) {
		//Grabs all transactions where projectID = projectID
	}

	getTransactionsByProjects(cb, projects) {
		//Grabs all transactions where projectID is in the array 'projects'
	}

	getAllTimeTotal(cb, transactions) {
		//Takes an array of transactions and calculates the total revenue
	}

	getTotals(cb, transactions) {
		//Gets all different kinds of totals
		//getAllTimeTotal()
		//getTotalPerDay()
		//getTotalPerWeek()
		//getTotalPerMonth()
		//getTotalPerYear()
		//getTotalsByCategory()
	}

	getAverages(cb, transactions) {
		//Gets all different kinds of averages
		//getAveragePerDay()
		//getAveragePerWeek()
		//getAveragePerMonth()
		//getAveragePerYear()
	}

	getTotalPerDay(cb, projectID) {
		//Gets all transactions and seperates them by day. 
		//Returns total for each day 
	}

	getTotalPerWeek(cb, projectID) {
		//Gets all transactions and seperates them by week. 
		//Returns total for each week
	}

	getTotalPerMonth(cb, projectID) {
		//Gets all transactions and seperates them by month. 
		//Returns total for each month
	}

	getTotalPerYear(cb, projectID) {
		//Gets all transactions and seperates them by year. 
		//Returns total for each year
	}

	getTotalsByCategory(cb, projectID) {
		//Gets all transactions and seperates them by category. 
		//Returns total for each category
	}

	getAveragePerDay(cb, projectID) {
		//Gets all transactions and seperates them by day. 
		//Returns average for each day 
	}

	getAveragePerWeek(cb, projectID) {
		//Gets all transactions and seperates them by week. 
		//Returns average for each week
	}

	getAveragePerMonth(cb, projectID) {
		//Gets all transactions and seperates them by month. 
		//Returns average for each month
	}

	getAveragePerYear(cb, projectID) {
		//Gets all transactions and seperates them by year. 
		//Returns average for each year
	}

	getDetailsSingle(cb, projectID) {
		//getTransactionsByProject()
		//getTotals()
		//getAverages()
	}

	getDetailsMulti(cb, projects) {
		//for project in projects
			//getTransactionsByProject()
		//getAverages()
		//getTotals()
	}
}