import React from 'react';
import { WiseForm } from '@bgroup/wise-form/form';
import { FormModel } from '@bgroup/wise-form/models';
import '@bgroup/wise-form/form/styles.css';
import { afaIngresoForm } from '../forms/afa-ingreso-adapted';
import { createAfaCallbacks } from '../callbacks/afa-callbacks';
import {
	ButtonGroup,
	Currency,
	Percentage,
	TrafficLight,
	InputText,
	InputDate,
	InputReferenceNumber,
	WiseCheckbox,
	JViewTitle,
	Button,
	Hr,
} from '../components/custom-types';
import { DivWrapper, SectionWrapper, TooltipWrapper, CollapsibleWrapper } from '../components/wrappers/WrapperComponents';
import '../components/custom-types/styles.css';
import '../components/wrappers/styles.css';
import './AfaFormPage.css';

export function AfaFormPage() {
	const [formModel, setFormModel] = React.useState<FormModel | null>(null);
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		const model = FormModel.create(afaIngresoForm);
		
		// Crear callbacks con el modelo
		const callbacks = createAfaCallbacks(model);
		
		// Agregar callback onSubmit
		callbacks.onSubmit = ({ form, event }) => {
			event.preventDefault();
			console.log('AFA Form Values:', form.values);
			alert(`Formulario AFA enviado!\n\nValores: ${JSON.stringify(form.values, null, 2)}`);
		};
		
		model.callbacks = callbacks as any;

		setFormModel(model);

		// Listen for ready state
		const onChange = () => {
			setReady(model.ready);
		};

		model.on('change', onChange);
		setReady(model.ready);

		return () => {
			model.off('change', onChange);
		};
	}, []);

	if (!ready || !formModel) {
		return <div className="loading">Cargando formulario AFA...</div>;
	}

	// Tipos personalizados para el formulario
	const customTypes = {
		buttonGroup: ButtonGroup,
		currency: Currency,
		percentage: Percentage,
		traficLight: TrafficLight,
		inputText: InputText,
		inputDate: InputDate,
		inputReferenceNumber: InputReferenceNumber,
		wiseCheckbox: WiseCheckbox,
		jViewTitle: JViewTitle,
		button: Button,
		hr: Hr,
		// Wrappers
		div: DivWrapper,
		section: SectionWrapper,
		tooltip: TooltipWrapper,
		collapsible: CollapsibleWrapper,
	};

	return (
		<main className="afa-form-page">
			<div className="container">
				<h1>Formulario AFA - Análisis de Factibilidad</h1>
				<p className="subtitle">Formulario complejo con múltiples componentes personalizados</p>
				<WiseForm model={formModel} types={customTypes}>
					<div className="form-actions">
						<button type="submit" className="submit-button">
							Guardar
						</button>
						<button type="button" className="cancel-button" onClick={() => formModel.reset()}>
							Limpiar
						</button>
					</div>
				</WiseForm>
			</div>
		</main>
	);
}

