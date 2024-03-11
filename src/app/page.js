'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

import blank from '../../public/images/magic_blank.jpeg';

export default function Home() {
	const [setNames, setSetNames] = useState([]);
	const [selectedSet, setSelectedSet] = useState('');
	const [cards, setCards] = useState([]);

	async function getCardsBySet(event) {
		const setCode = event.target.value;
		setSelectedSet(setCode);

		const response = await fetch(
			`https://api.scryfall.com/cards/search?q=set:${setCode}`
		);
		const setObject = await response.json();
		const cards = setObject.data;
		setCards([]);
		setCards(cards);
		console.log('cards: ', cards);
	}

	useEffect(() => {
		async function getCardSets() {
			const response = await fetch('https://api.scryfall.com/sets');
			const setData = await response.json();
			const sets = setData.data;
			setSetNames(sets);
		}

		getCardSets();
	}, []);

	return (
		<main className={styles.main}>
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
						<div key={card.name} className={styles.cards}>
							<div>
								<Image
									key={card.id}
									src={card.image_uris ? card.image_uris.normal : blank}
									alt={card.name}
									width={200}
									height={275}
								/>
							</div>
							<div>{card.name}</div>
							<div>${card.prices.usd}</div>
						</div>
					))}
			</div>
		</main>
	);
}
