class HillClimbing {
	constructor(qtde) {
		this.qtde = qtde;
		this.hist = [];
	}

	random() {
		return parseInt(Math.random() * Math.floor(+new Date() / 1000)) % this.qtde;
	}

	randomArray() {
		return Array.from({length: this.qtde}, () => this.random());
	}

	getHeuristicCost(table) {
		let cost = 0;
		for (let i = 0; i < table.length; i++)
			for (let j = i + 1; j < table.length; j++)
				if (table[i] === table[j] || Math.abs(table[i] - table[j]) === j - i) cost += 1;

		return cost;
	}

	saveHistory(obj) {
		this.hist.push(obj);
	}

	returnHist() {
		return this.hist.map((e) => {
			return {table: this.convertTable2D(e.table), reset: e.reset};
		});
	}

	convertTable2D(obj) {
		let result = [...obj];
		let arr = Array.from({length: result.length}, () => new Array(result.length).fill(0));
		for (let i = 0; i < result.length; i++) arr[result[i]][i] = 1;
		return arr;
	}

	HillClimbing(maxNumOfIterations = this.qtde * 10000) {
		let table = this.randomArray();
		let cost = this.getHeuristicCost(table);

		this.saveHistory({table: [...table], reset: false});
		for (let x = 0; x < maxNumOfIterations && cost > 0; x++) {
			let tempCost = cost;

			for (let col = 0; col < this.qtde; col++) {
				for (let row = 0; row < this.qtde; row++) {
					if (table[col] === row) continue;

					let tempTable = [...table];
					tempTable[col] = row;

					let nextCost = this.getHeuristicCost(tempTable);
					if (cost > nextCost) {
						table[col] = row;
						cost = nextCost;
						this.saveHistory({table: [...table], reset: false});
						break;
					}
				}
			}

			if (tempCost <= cost) {
				table = this.randomArray();
				cost = this.getHeuristicCost(table);
				this.saveHistory({table: [...table], reset: true});
			}
		}

		return cost === 0 ? table : null;
	}

	solve() {
		return this.convertTable2D(this.HillClimbing());
	}
}

export {HillClimbing};
