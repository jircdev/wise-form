import React from 'react';
import { WrappedForm } from '@bgroup/wise-form/form';

interface IProps {
	data: {
		name: string;
		title: string;
		className: string;
	};
	model;
}

export /*bundle*/ const Section = ({ model, ...props }: IProps) => {
	return (
		<section className={`${props.data.className} section`}>
			{props.data.title && (
				<header>
					<h3>{props.data.title}</h3>
				</header>
			)}
			<div className='content'>
				<WrappedForm data={model} settings={props.data} />
			</div>
		</section>
	);
};
