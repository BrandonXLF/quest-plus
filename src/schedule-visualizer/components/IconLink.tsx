import './IconLink.css';

export default function IconLink(
	attrs: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		icon: React.ReactNode;
	}
) {
	const linkAttrs = { ...attrs, icon: undefined };

	return (
		<a {...linkAttrs} className="icon-link">
			{attrs.icon}
			{attrs.children}
		</a>
	);
}
