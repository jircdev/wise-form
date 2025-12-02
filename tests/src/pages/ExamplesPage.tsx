import React from 'react';
import { WiseForm } from '@bgroup/wise-form/form';
import { FormModel } from '@bgroup/wise-form/models';
import '@bgroup/wise-form/form/styles.css';
import { userRegistrationForm } from '../forms/user-registration';
import { feedbackForm } from '../forms/feedback';
import './ExamplesPage.css';

export function ExamplesPage() {
	const [userFormModel, setUserFormModel] = React.useState<FormModel | null>(null);
	const [feedbackFormModel, setFeedbackFormModel] = React.useState<FormModel | null>(null);
	const [userReady, setUserReady] = React.useState(false);
	const [feedbackReady, setFeedbackReady] = React.useState(false);

	React.useEffect(() => {
		const userFormSettings = {
			...userRegistrationForm,
			callbacks: {
				onSubmit: ({ form, event }) => {
					event.preventDefault();
					console.log('User Registration Form Values:', form.values);
					alert(`User Registration Form submitted!\n\nValues: ${JSON.stringify(form.values, null, 2)}`);
				},
			},
		};

		const feedbackFormSettings = {
			...feedbackForm,
			callbacks: {
				onSubmit: ({ form, event }) => {
					event.preventDefault();
					console.log('Feedback Form Values:', form.values);
					alert(`Feedback Form submitted!\n\nValues: ${JSON.stringify(form.values, null, 2)}`);
				},
			},
		};

		const userModel = FormModel.create(userFormSettings);
		const feedbackModel = FormModel.create(feedbackFormSettings);

		setUserFormModel(userModel);
		setFeedbackFormModel(feedbackModel);

		// Listen for ready state
		const onUserChange = () => {
			setUserReady(userModel.ready);
		};

		const onFeedbackChange = () => {
			setFeedbackReady(feedbackModel.ready);
		};

		userModel.on('change', onUserChange);
		feedbackModel.on('change', onFeedbackChange);

		// Initial check
		setUserReady(userModel.ready);
		setFeedbackReady(feedbackModel.ready);

		return () => {
			userModel.off('change', onUserChange);
			feedbackModel.off('change', onFeedbackChange);
		};
	}, []);

	if (!userReady || !feedbackReady) {
		return <div className="loading">Loading forms...</div>;
	}

	return (
		<main className="examples-page">
			<div className="container">
				<h1>Wise Form Tests</h1>
				<p className="subtitle">Testing @bgroup/wise-form package with two different forms</p>

				<div className="forms-grid">
					<section className="form-section">
						<h2>User Registration Form</h2>
						<p className="form-description">A registration form with personal information fields</p>
						<WiseForm model={userFormModel}>
							<button type="submit" className="submit-button">
								Register
							</button>
						</WiseForm>
					</section>

					<section className="form-section">
						<h2>Feedback Form</h2>
						<p className="form-description">A feedback form with category, priority, and rating</p>
						<WiseForm model={feedbackFormModel}>
							<button type="submit" className="submit-button">
								Submit Feedback
							</button>
						</WiseForm>
					</section>
				</div>
			</div>
		</main>
	);
}




