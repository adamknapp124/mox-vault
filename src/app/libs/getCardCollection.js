export default async function getCardCollection() {
	try {
		const response = await fetch('http://localhost:3500/my-collection');
		const data = await response.json();
		const collection = data.cards;
		return collection;
	} catch (error) {
		console.error('Error: ', error);
		throw error;
	}
}
