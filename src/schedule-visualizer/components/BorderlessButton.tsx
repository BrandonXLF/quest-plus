import './BorderlessButton.css';

export default function BorderlessButton(
	props: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>
) {
	return (
		<button
			{...props}
			className={`borderless-btn ${props.className ?? ''}`}
			onClick={e => {
				e.preventDefault();
				props.onClick?.(e);
			}}
		/>
	);
}
