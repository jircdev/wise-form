import React from 'react';

interface JViewTitleProps {
	name?: string;
	entries?: any[];
	dataHead?: Array<{ label: string; id: number }>;
	keys?: string[];
	textEmpty?: string;
	className?: string;
	selectedItem?: any;
	onSelectItem?: (item: any) => void;
	onDelete?: (item: any) => void;
	onDuplicate?: (item: any) => void;
}

export const JViewTitle: React.FC<JViewTitleProps> = ({
	name,
	entries = [],
	dataHead = [],
	keys = [],
	textEmpty = 'No existe información para mostrar',
	className,
	selectedItem,
	onSelectItem,
	onDelete,
	onDuplicate,
}) => {
	return (
		<div className={`jview-title ${className || ''}`}>
			<table className="jview-table">
				<thead>
					<tr>
						{dataHead.map((head) => (
							<th key={head.id}>{head.label}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{entries.length === 0 ? (
						<tr>
							<td colSpan={dataHead.length} className="jview-empty">
								{textEmpty}
							</td>
						</tr>
					) : (
						entries.map((entry, index) => (
							<tr
								key={index}
								className={selectedItem === entry ? 'selected' : ''}
								onClick={() => onSelectItem && onSelectItem(entry)}
							>
								{keys.map((key) => (
									<td key={key}>{entry[key] || ''}</td>
								))}
								<td className="jview-actions">
									{onDuplicate && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onDuplicate(entry);
											}}
											className="jview-action-btn duplicate"
										>
											Duplicar
										</button>
									)}
									{onDelete && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onDelete(entry);
											}}
											className="jview-action-btn delete"
										>
											Eliminar
										</button>
									)}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};




