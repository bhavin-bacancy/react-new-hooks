import React, { Component } from 'react';
import UseStateComponent from './components/useState';
import UseEffectComponent from './components/useEffect';
import UseContextComponent from './components/useContext';
import UseRefComponent from './components/useRef';

const styles = {
	cardWrapper :{
		backgroundColor: 'floralwhite',
    border: '1px solid lightgrey',
    padding: '15px',
		borderRadius: '10px',
		marginRight: '15px',
		height:'fit-content',
	},
}
class App extends Component {
	render() {
		return (
			<div>
				<h3 style={{ color: 'darkred', textAlign:"center", padding: '15px 0px 30px 0' }}> React Hooks example </h3>
				<div className="container">
					<div className="row">
						<div style={styles.cardWrapper} className="col-sm">
							<UseStateComponent />
						</div>
						<div style={styles.cardWrapper} className="col-sm">
							<UseEffectComponent />
						</div>
						<div style={styles.cardWrapper} className="col-sm">
							<UseContextComponent />
						</div>
						<div style={styles.cardWrapper} className="col-sm">
							<UseRefComponent />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default App;

