function normalizeName(name: string) {
	return name
		.toLowerCase()
		.replace(/ /g, '_')
		.replace(/[^a-z_]/g, '');
}

export default function getInstructorUWFlow(name: string) {
	if (name === 'Staff' || name === 'To be Announced') return;

	const shortForm = name[1] === '.';

	return (
		(shortForm ? '/explore?q=' : '/professor/') +
		encodeURIComponent(shortForm ? name : normalizeName(name))
	);
}
