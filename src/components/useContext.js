import React, { Component, useContext } from 'react'

const TestContext = React.createContext();

function Display() {
	const value = useContext(TestContext);
	return <div>{value}, I am learning react hooks.</div>;
}

class UseContextComponent extends Component {
	render() {
		return (
			<div>
				<h5 style={{color:'cadetblue'}}> UseContext example </h5>
				<TestContext.Provider value={"Hello"}>
					<Display />
				</TestContext.Provider>
			</div>
		)
	}
}

export default UseContextComponent