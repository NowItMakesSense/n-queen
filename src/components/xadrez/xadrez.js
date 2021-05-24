import {React, useState} from 'react';
import {FiSearch} from 'react-icons/fi';
import {HillClimbing} from '../xadrez/modelo.js';
import Queen from '../../images/queen.png';

export default (props) => {
	const createField = (obj, reset) => {
		let linhas = [];
		for (let x = 0; x < obj.length; x++) {
			let celulas = [];
			for (let y = 0; y < obj.length; y++) {
				let classCelula = obj[x][y] === 1 ? 'queen' : (y - x) % 2 === 0 ? 'whitecell' : 'blackcell';
				celulas.push(<td key={`cell${x}-${y}`} id={`cell${x}-${y}`} className={`${classCelula}`}></td>);
			}
			linhas.push(
				<tr key={x} id={`row${x}`}>
					{celulas}
				</tr>
			);
		}

		const resetStyle = {
			borderColor: reset ? '#44ff00' : '#000000',
			borderWidth: reset ? 3 : 1,
		};

		return (
			<table className='tbXadrez' style={resetStyle}>
				<tbody>{linhas}</tbody>
			</table>
		);
	};

	const createHistory = (obj) => {
		let divs = [];
		for (let x = 0; x < obj.length; x++) {
			let divContent = createField(obj[x].table, obj[x].reset);
			divs.push(
				<div className='divHist' id={`Histcell${x}`} key={x}>
					{divContent}
				</div>
			);
		}

		sethistXadrez(divs);
	};

	const isPossibleShowHist = () => {
		if (typeof hist === 'undefined') return;

		createHistory(hist);
		setvisabledHist(!visabledHist);
	};

	const resolve = (qtde) => {
		if (parseInt(qtde) <= props.MaxValue && parseInt(qtde) > 3) {
			let nQueen = new HillClimbing(parseInt(qtde));
			let nQueenReturn = nQueen.solve();

			if (nQueenReturn === null) {
				alert(`Can't find solution with max iteration number passed`);
				setxadrexHtml(createField(Array.from({length: parseInt(qtde)}, () => new Array(parseInt(qtde)))));
				sethist(undefined);
				setqtde(parseInt(qtde));
				return;
			}

			setqtde(parseInt(qtde));
			sethist(nQueen.returnHist());
			setxadrexHtml(createField(nQueenReturn));
		} else {
			alert('Value too high/low to find a solution');
			let num = parseInt(qtde) > props.MaxValue ? props.MaxValue : parseInt(qtde);
			setxadrexHtml(createField(Array.from({length: num}, () => new Array(num))));
			setqtde(0);
			return;
		}

		setvisabledHist(false);
	};

	const [numberCh, setnumberCh] = useState();
	const [histXadrez, sethistXadrez] = useState();
	const [hist, sethist] = useState();
	const [xadrexHtml, setxadrexHtml] = useState(createField(Array.from({length: 10}, () => new Array(10))));
	const [visabledHist, setvisabledHist] = useState(false);
	const [qtde, setqtde] = useState(0);

	return (
		<>
			<div className='main'>
				<div className='headerCab'>
					<div className='search-box'>
						<input
							type='text'
							placeholder='Enter a number...'
							value={numberCh}
							onChange={(e) => setnumberCh(e.target.value.replace(/[^0-9]/g, ''))}
							maxLength={4}
						/>
						<div className='search-btn' onClick={(_) => resolve(numberCh)}>
							<FiSearch />
						</div>
					</div>
				</div>
				<div className='tabuleiro'>{xadrexHtml}</div>
				<div className='info'>
					<h2 className='infoTitle'>Number of Queens: </h2>
					<div className='infoImg'>
						<div className='showQtd'>
							<img src={Queen} height={45} width={47} alt='queen' />
							<h3>{`X  ${qtde}`}</h3>
						</div>
					</div>

					<div className='infoButton'>
						<button className='buttonHist' onClick={(_) => isPossibleShowHist()}>
							Show History
						</button>
					</div>
				</div>
			</div>

			{visabledHist && (
				<div id='historicoXadrez' className='histXadrez'>
					{histXadrez}
				</div>
			)}
		</>
	);
};
