export default async function getCardSets() {
	const response = await fetch('https://api.scryfall.com/sets');
	const setData = await response.json();
	const sets = setData.data;
	return sets;
}
