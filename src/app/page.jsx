'use client';

import Header from './components/Header';

import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

import blank from '../../public/images/magic_blank.jpeg';

export default function Home() {
	const [setNames, setSetNames] = useState([]);
	const [selectedSet, setSelectedSet] = useState('');
	const [cards, setCards] = useState([]);
	const [collectionValue, setCollectionValue] = useState();

	async function migrate() {
		try {
			const response = await fetch('http://localhost:3500/migrate-data', {
				method: 'post',
			});
			console.log(response);
		} catch (error) {
			console.error('Error: ', error);
		}
	}

	async function sendIt(card) {
		try {
			await fetch('http://localhost:3500/sendIt', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					card_id: card.id,
					quantity: 1,
					name: card.name,
					image: card.image_uris.small,
					cmc: card.cmc,
					artist: card.artist,
					oracle_text: card.oracle_text,
					set_name: card.set_name,
					rarity: card.rarity,
					type: card.type_line,
					price: card.prices.usd,
				}),
			})
				.then((response) => response.json())
				.then((data) => console.log(data));
		} catch (error) {
			console.log('Error sending that shit up');
		}
	}

	async function getCardsBySet(event) {
		const setCode = event.target.value;
		setSelectedSet(setCode);
		let currentPage = 1;
		let allCards = [];

		let setObject;

		do {
			const response = await fetch(
				`https://api.scryfall.com/cards/search?q=set:${setCode}&page=${currentPage}&page_size=175`
			);
			setObject = await response.json();
			if (!setObject.data) {
				break; // Exit the loop if no data is returned
			}
			const cards = setObject.data;
			allCards = allCards.concat(cards);
			currentPage++;
		} while (setObject.has_more);

		setCards(allCards);
		console.log('cards: ', allCards);
	}

	useEffect(() => {
		async function getCardSets() {
			try {
				const response = await fetch('https://api.scryfall.com/sets');
				const setData = await response.json();
				const sets = setData.data;
				setSetNames(sets);
			} catch (err) {
				console.log(err);
			}
		}

		async function getCollectionTotal() {
			try {
				const response = await fetch('http://localhost:3500/collection/total');
				const collectionData = await response.json();
				setCollectionValue(collectionData.totalValue);
			} catch (err) {
				console.log(err);
			}
		}

		getCardSets();
		getCollectionTotal();
	}, [setCollectionValue]);

	return (
		<main className={styles.main}>
			<Header />
			<div>Total:</div>
			<div>{collectionValue}</div>
			{/* <button onClick={migrate}>Migrate</button> */}
			<div className={styles.select}>
				<label htmlFor='sets' className={styles.label}>
					Choose a set:
				</label>
				<select
					name='sets'
					id='sets'
					value={selectedSet}
					onChange={getCardsBySet}
					className={styles.selectBox}>
					{setNames.map((set) => (
						<option key={set.code} value={set.code}>
							{set.name}
						</option>
					))}
				</select>
			</div>
			<div className={styles.flex}>
				{cards &&
					cards.map((card) => (
						<div key={card.id} className={styles.cards}>
							<div className={styles.cardContainer}>
								<Image
									key={card.id}
									src={card.image_uris ? card.image_uris.normal : blank}
									alt={card.name}
									width={200}
									height={275}
								/>
								<div className={styles.buttonContainer}>
									<div
										className={styles.button}
										onClick={() => sendIt(card)}>
										<div>+</div>
									</div>
									<div className={styles.button}>
										<div>-</div>
									</div>
								</div>
							</div>
							<div>{card.name}</div>
							{card.prices.usd !== null ? (
								<div>${card.prices.usd}</div>
							) : (
								<div>No price available</div>
							)}
						</div>
					))}
			</div>
		</main>
	);
}
