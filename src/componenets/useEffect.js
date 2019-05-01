import React, { Component, useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';

const UseEffect = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true)
		fetch("https://api.github.com/users")
			.then(response => response.json())
			.then(data => {
				setUsers(data);
				setLoading(false)// set users in state
			});
	}, []); // empty array because we only run once

	return <div>
		<h5 style={{ color: 'cadetblue' }}> UseEffect example </h5>
		{loading ? <div style={{display:'flex', justifyContent:'center'}}> <FadeLoader loading={loading} />	</div> : null}
		<div>
			{users.map(user => (
				<div key={user.id}>
					<table>
						<tbody>
							<tr>
								<td>{user.login}</td>
							</tr>
						</tbody>
					</table>
				</div>
			))}
		</div>
	</div>
}

class UseEffectComponent extends Component {
	render() {
		return (
			<UseEffect />
		)
	}
}

export default UseEffectComponent;

